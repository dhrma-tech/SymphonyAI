import { db } from "@/lib/db";
import {
  BlueprintAnnotations,
  BriefPack,
  DesignChoices,
  DecisionGate,
  LensType,
  SessionGraph,
  WorkflowArtifactPayload,
  WorkflowStage,
  buildReadiness,
  createEmptyBriefPack,
  createSessionGraph,
  normalizeStage,
  renderArtifactMarkdown,
  renderPromptWorkflowMarkdown,
  safeJsonParse,
  validateBriefPack,
} from "@/lib/workflow";
import {
  fallbackDesignOptions,
  generateBlueprintPlan,
  generateDesignOptions,
  generateLensAnnotations,
  generatePromptWorkflow,
} from "@/lib/ai-provider";

/* eslint-disable @typescript-eslint/no-explicit-any */

function errorWithStatus(message: string, status: number) {
  const error = new Error(message);
  (error as any).status = status;
  return error;
}

function stringify(value: unknown) {
  return JSON.stringify(value);
}

function now() {
  return new Date().toISOString();
}

function completedFromGraph(graph: SessionGraph, hasPromptWorkflow: boolean) {
  return new Set<string>([
    ...graph.completedStages,
    ...(graph.briefPack.validated ? ["BRIEF"] : []),
    ...(graph.designChoices.approved ? ["DESIGN"] : []),
    ...(hasPromptWorkflow ? ["WORKFLOW"] : []),
  ]);
}

function getGraph(project: any): SessionGraph {
  const graph = safeJsonParse<SessionGraph>(project.sessionGraph, createSessionGraph(normalizeStage(project.stage || project.activeStage)));
  graph.currentStage = normalizeStage(graph.currentStage || project.stage || project.activeStage);
  graph.briefPack = graph.briefPack || safeJsonParse(project.briefPack, createEmptyBriefPack());
  graph.blueprintAnnotations = graph.blueprintAnnotations || { product: [], architecture: [], design: [] };
  graph.designChoices = graph.designChoices || safeJsonParse(project.designChoices, {});
  graph.pendingDecisions = graph.pendingDecisions || safeJsonParse(project.pendingDecisions, []);
  graph.workflowPhases = graph.workflowPhases || safeJsonParse(project.workflowPhases, []);
  graph.selectedTool = graph.selectedTool || "Cursor";
  graph.lastActiveAt = now();
  return graph;
}

function updateGraph(graph: SessionGraph, patch: Partial<SessionGraph>) {
  return {
    ...graph,
    ...patch,
    completedStages: Array.from(new Set(patch.completedStages || graph.completedStages || [])),
    lastActiveAt: now(),
  };
}

export function serializeProject(project: any) {
  const artifacts = project.artifacts || [];
  const promptWorkflows = project.promptWorkflows || [];
  const sessionGraph = getGraph(project);
  const hasPromptWorkflow = promptWorkflows.some((workflow: any) => workflow.status === "READY") || sessionGraph.workflowPhases.length > 0;
  const readiness = buildReadiness(completedFromGraph(sessionGraph, hasPromptWorkflow), hasPromptWorkflow);

  return {
    ...project,
    stage: normalizeStage(project.stage || project.activeStage),
    activeStage: normalizeStage(project.activeStage || project.stage),
    features: safeJsonParse(project.features, []),
    design: safeJsonParse(project.design, {}),
    phases: safeJsonParse(project.phases, []),
    briefPack: safeJsonParse(project.briefPack, sessionGraph.briefPack),
    blueprintAnnotations: safeJsonParse(project.blueprintAnnotations, sessionGraph.blueprintAnnotations),
    sessionGraph,
    designChoices: safeJsonParse(project.designChoices, sessionGraph.designChoices),
    workflowPhases: safeJsonParse(project.workflowPhases, sessionGraph.workflowPhases),
    pendingDecisions: safeJsonParse(project.pendingDecisions, sessionGraph.pendingDecisions),
    artifacts: artifacts.map((artifact: any) => ({
      ...artifact,
      stage: normalizeStage(artifact.stage),
      structured: safeJsonParse(artifact.structuredJson, null),
    })),
    decisions: project.decisions || [],
    decisionGates: project.decisionGates || [],
    promptRatings: project.promptRatings || [],
    promptWorkflows: promptWorkflows.map((workflow: any) => ({
      ...workflow,
      phases: safeJsonParse(workflow.phases, []),
      prompts: safeJsonParse(workflow.prompts, []),
      targetTools: safeJsonParse(workflow.targetTools, []),
    })),
    workflowRuns: (project.workflowRuns || []).map((run: any) => ({
      ...run,
      stage: normalizeStage(run.stage),
      artifact: run.artifact
        ? {
            ...run.artifact,
            stage: normalizeStage(run.artifact.stage),
            structured: safeJsonParse(run.artifact.structuredJson, null),
          }
        : null,
    })),
    readiness,
  };
}

export async function getProject(projectId: string, userId?: string | null) {
  return db.project.findFirst({
    where: {
      id: projectId,
      userId: userId ? userId : null,
    },
    include: {
      artifacts: { orderBy: [{ stage: "asc" }, { version: "desc" }] },
      decisions: { orderBy: { createdAt: "asc" } },
      decisionGates: { orderBy: { createdAt: "asc" } },
      promptRatings: { orderBy: { createdAt: "desc" } },
      promptWorkflows: { orderBy: { createdAt: "desc" } },
      workflowRuns: {
        orderBy: { startedAt: "asc" },
        include: { artifact: true },
      },
    },
  });
}

export async function listProjects(userId?: string | null) {
  const projects = await db.project.findMany({
    where: userId ? { userId } : { userId: null },
    include: {
      artifacts: { orderBy: { version: "desc" }, take: 4 },
      promptWorkflows: { orderBy: { createdAt: "desc" }, take: 1 },
      workflowRuns: { orderBy: { startedAt: "desc" }, take: 1 },
      decisionGates: true,
      promptRatings: { take: 1 },
    },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  return projects.map(serializeProject);
}

export async function createProject(idea: string, userId?: string | null) {
  const title = idea.trim().replace(/\s+/g, " ").slice(0, 72);
  const graph = createSessionGraph("BRIEF");
  const project = await db.project.create({
    data: {
      title: title || "Untitled plan",
      idea,
      originalIdea: idea,
      synopsis: "",
      features: stringify([]),
      design: stringify({}),
      phases: stringify([]),
      briefPack: stringify(graph.briefPack),
      blueprintAnnotations: stringify(graph.blueprintAnnotations),
      sessionGraph: stringify(graph),
      designChoices: stringify(graph.designChoices),
      workflowPhases: stringify(graph.workflowPhases),
      pendingDecisions: stringify(graph.pendingDecisions),
      briefValidated: false,
      stage: "BRIEF",
      activeStage: "BRIEF",
      status: "Brief",
      pipelineMode: "MANUAL",
      userId: userId || null,
    },
    include: {
      artifacts: true,
      decisions: true,
      decisionGates: true,
      promptRatings: true,
      promptWorkflows: true,
      workflowRuns: true,
    },
  });

  return serializeProject(project);
}

async function saveProjectGraph(projectId: string, graph: SessionGraph, extra: Record<string, unknown> = {}) {
  return db.project.update({
    where: { id: projectId },
    data: {
      sessionGraph: stringify(graph),
      stage: graph.currentStage,
      activeStage: graph.currentStage,
      briefPack: stringify(graph.briefPack),
      blueprintAnnotations: stringify(graph.blueprintAnnotations),
      designChoices: stringify(graph.designChoices),
      workflowPhases: stringify(graph.workflowPhases),
      pendingDecisions: stringify(graph.pendingDecisions),
      briefValidated: graph.briefPack.validated,
      pipelineMode: graph.pipelineMode,
      ...extra,
    },
  });
}

export async function getSessionGraph(projectId: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  return serializeProject(project).sessionGraph;
}

export async function putSessionGraph(projectId: string, graph: SessionGraph, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  await saveProjectGraph(projectId, updateGraph(getGraph(project), graph));
  const updated = await getProject(projectId, userId);
  return serializeProject(updated);
}

export async function answerBriefQuestion(projectId: string, answer: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  if (!answer.trim()) throw errorWithStatus("Answer is required", 400);

  const graph = getGraph(project);
  const pack: BriefPack = graph.briefPack || createEmptyBriefPack();
  const index = Math.min(pack.currentQuestion || 0, 5);
  const keys: Array<keyof BriefPack["answers"]> = ["problem", "who", "tried", "success", "outOfScope", "risk"];
  pack.answers[keys[index]] = answer.trim();
  pack.currentQuestion = Math.min(index + 1, 6);
  pack.validation = validateBriefPack(pack);
  pack.validated = pack.currentQuestion >= 6 && Object.values(pack.validation).filter((value) => typeof value === "boolean").every(Boolean);
  pack.updatedAt = now();

  const completed = new Set(graph.completedStages);
  if (pack.validated) completed.add("BRIEF");
  const next = pack.validated ? "BLUEPRINT" : "BRIEF";
  const nextGraph = updateGraph(graph, {
    briefPack: pack,
    currentStage: next,
    completedStages: Array.from(completed) as WorkflowStage[],
  });

  await saveProjectGraph(projectId, nextGraph, {
    status: pack.validated ? "Blueprint ready" : `Brief question ${pack.currentQuestion + 1} of 6`,
    synopsis: pack.answers.problem || project.synopsis,
  });

  if (pack.validated) {
    await upsertStageArtifact(projectId, "BRIEF", {
      title: `${project.title} Brief Pack`,
      summary: pack.answers.problem,
      sections: [
        { heading: "Problem", body: pack.answers.problem },
        { heading: "Who", body: pack.answers.who },
        { heading: "Tried Before", body: pack.answers.tried },
        { heading: "30-Day Success", body: pack.answers.success },
        { heading: "Out of Scope", body: pack.answers.outOfScope },
        { heading: "Riskiest Assumption", body: pack.answers.risk },
      ],
      questions: [],
      decisions: [],
      nextAction: "Generate the Blueprint.",
      readinessNote: "Brief validation passed.",
    }, "APPROVED");
  }

  const updated = await getProject(projectId, userId);
  return {
    project: serializeProject(updated),
    briefPack: pack,
    aiMessage: pack.validated ? "Brief Pack is validated. Blueprint is ready to generate." : "Good. I captured that and moved to the next forcing question.",
  };
}

async function upsertStageArtifact(projectId: string, stage: WorkflowStage, payload: WorkflowArtifactPayload, status: "DRAFT" | "APPROVED" = "DRAFT") {
  const existing = await db.workflowArtifact.findFirst({
    where: { projectId, stage, status: { in: ["DRAFT", "APPROVED"] } },
    orderBy: { version: "desc" },
  });
  const markdown = renderArtifactMarkdown(stage, payload, status);
  if (existing) {
    return db.workflowArtifact.update({
      where: { id: existing.id },
      data: { title: payload.title, markdown, structuredJson: stringify(payload), status, approvedAt: status === "APPROVED" ? new Date() : existing.approvedAt },
    });
  }
  return db.workflowArtifact.create({
    data: {
      projectId,
      stage,
      command: stage === "BRIEF" ? "/office-hours" : stage === "BLUEPRINT" ? "/plan" : stage === "DESIGN" ? "/design-shotgun" : "/prompt-workflow",
      title: payload.title,
      markdown,
      structuredJson: stringify(payload),
      status,
      approvedAt: status === "APPROVED" ? new Date() : null,
    },
  });
}

function blueprintPayload(plan: any): WorkflowArtifactPayload {
  return {
    title: plan.title,
    summary: plan.summary,
    sections: plan.sections.map((section: any) => ({ heading: `${section.number}. ${section.title}`, body: section.content })),
    questions: [],
    decisions: [],
    nextAction: "Run Product, Architecture, and Design lenses.",
    readinessNote: "Blueprint generated and awaiting lens review.",
  };
}

export async function generateBlueprint(projectId: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  if (!graph.briefPack.validated) throw errorWithStatus("Brief must be validated before Blueprint", 409);

  const plan = await generateBlueprintPlan(graph.briefPack, project.title);
  const nextGraph = updateGraph(graph, {
    currentStage: "BLUEPRINT",
    blueprint: plan,
    blueprintAnnotations: graph.blueprintAnnotations || { product: [], architecture: [], design: [] },
  });
  await saveProjectGraph(projectId, nextGraph, { status: "Blueprint generated" });
  await upsertStageArtifact(projectId, "BLUEPRINT", blueprintPayload(plan), "DRAFT");

  const updated = await getProject(projectId, userId);
  return { project: serializeProject(updated), blueprint: plan };
}

export async function runBlueprintLens(projectId: string, lens: LensType, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  if (!graph.blueprint) throw errorWithStatus("Generate Blueprint before running lenses", 409);

  const annotations = await generateLensAnnotations(lens, graph.blueprint);
  const key = lens.toLowerCase() as keyof BlueprintAnnotations;
  const nextAnnotations = { ...graph.blueprintAnnotations, [key]: annotations };
  const pending = [
    ...graph.pendingDecisions.filter((decision) => decision.source !== `${lens}_LENS`),
    ...annotations
      .filter((annotation) => annotation.severity === "critical" && annotation.requiresDecision)
      .map((annotation): DecisionGate => ({
        id: `gate-${annotation.id}`,
        type: "SINGLE_SELECT",
        stage: "BLUEPRINT",
        question: `How should we resolve: ${annotation.concern}`,
        options: [
          { id: "accept-fix", title: "Accept suggested fix", description: annotation.suggestedFix },
          { id: "defer", title: "Defer with note", description: "Keep the concern open but unblock review for now." },
        ],
        resolved: false,
        source: `${lens}_LENS`,
        context: annotation.concern,
      })),
  ];

  const nextGraph = updateGraph(graph, {
    blueprintAnnotations: nextAnnotations,
    pendingDecisions: pending,
  });
  await saveProjectGraph(projectId, nextGraph, { status: "Blueprint lens review" });

  const updated = await getProject(projectId, userId);
  return { project: serializeProject(updated), annotations };
}

export async function resolveDecision(projectId: string, decisionId: string, resolution: unknown, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  const pendingDecisions = graph.pendingDecisions.map((decision) =>
    decision.id === decisionId ? { ...decision, resolved: true, resolution } : decision
  );
  const annotations = graph.blueprintAnnotations;
  for (const key of ["product", "architecture", "design"] as const) {
    annotations[key] = annotations[key].map((annotation) =>
      `gate-${annotation.id}` === decisionId ? { ...annotation, resolved: true, resolution: JSON.stringify(resolution) } : annotation
    );
  }
  const nextGraph = updateGraph(graph, { pendingDecisions, blueprintAnnotations: annotations });
  await saveProjectGraph(projectId, nextGraph);
  const updated = await getProject(projectId, userId);
  return serializeProject(updated);
}

export async function approveBlueprint(projectId: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  const all = [...graph.blueprintAnnotations.product, ...graph.blueprintAnnotations.architecture, ...graph.blueprintAnnotations.design];
  const criticalOpen = all.some((annotation) => annotation.severity === "critical" && !annotation.resolved);
  if (criticalOpen) throw errorWithStatus("Resolve critical annotations before approving Blueprint", 409);
  if (!graph.blueprint) throw errorWithStatus("Generate Blueprint before approval", 409);

  const completed = new Set(graph.completedStages);
  completed.add("BRIEF");
  completed.add("BLUEPRINT");
  const nextGraph = updateGraph(graph, { currentStage: "DESIGN", completedStages: Array.from(completed) as WorkflowStage[] });
  await saveProjectGraph(projectId, nextGraph, { status: "Design ready" });
  await upsertStageArtifact(projectId, "BLUEPRINT", blueprintPayload(graph.blueprint), "APPROVED");
  const updated = await getProject(projectId, userId);
  return serializeProject(updated);
}

export async function generateDesign(projectId: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  if (!graph.completedStages.includes("BLUEPRINT")) throw errorWithStatus("Approve Blueprint before Design", 409);

  const designOptions = await generateDesignOptions(graph.briefPack);
  const nextGraph = updateGraph(graph, { currentStage: "DESIGN", designOptions });
  await saveProjectGraph(projectId, nextGraph, { status: "Design options generated" });
  const updated = await getProject(projectId, userId);
  return { project: serializeProject(updated), designOptions };
}

export async function approveDesign(projectId: string, choices: DesignChoices, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  if (!choices.palette || !choices.fonts) throw errorWithStatus("Palette and font pair are required", 400);
  const graph = getGraph(project);
  const completed = new Set(graph.completedStages);
  completed.add("BRIEF");
  completed.add("BLUEPRINT");
  completed.add("DESIGN");
  const designChoices = { ...choices, approved: true };
  const nextGraph = updateGraph(graph, { currentStage: "WORKFLOW", completedStages: Array.from(completed) as WorkflowStage[], designChoices });
  await saveProjectGraph(projectId, nextGraph, { status: "Workflow ready", design: stringify(designChoices), designChoices: stringify(designChoices) });
  await upsertStageArtifact(projectId, "DESIGN", {
    title: `${project.title} Design Choices`,
    summary: `${choices.palette.name} with ${choices.fonts.name}.`,
    sections: [
      { heading: "Palette", body: JSON.stringify(choices.palette.colors, null, 2) },
      { heading: "Fonts", body: [`Heading: ${choices.fonts.heading}`, `Body: ${choices.fonts.body}`] },
    ],
    questions: [],
    decisions: [],
    nextAction: "Generate Workflow prompts.",
    readinessNote: "Design approved.",
  }, "APPROVED");
  const updated = await getProject(projectId, userId);
  return serializeProject(updated);
}

export async function runPromptWorkflow(projectId: string, input = "", userId?: string | null, command = "/prompt-workflow", runId?: string) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const graph = getGraph(project);
  if (!graph.designChoices.approved) throw errorWithStatus("Approve Design before Workflow", 409);

  const designOptions = graph.designOptions || fallbackDesignOptions(graph.briefPack);
  const payload = await generatePromptWorkflow({
    idea: project.originalIdea || project.idea,
    title: project.title,
    input,
    command,
    artifacts: project.artifacts || [],
    briefPack: graph.briefPack,
    blueprint: graph.blueprint,
    designOptions,
    tool: graph.selectedTool,
  });

  const completed = new Set(graph.completedStages);
  completed.add("BRIEF");
  completed.add("BLUEPRINT");
  completed.add("DESIGN");
  completed.add("WORKFLOW");
  const nextGraph = updateGraph(graph, { currentStage: "WORKFLOW", completedStages: Array.from(completed) as WorkflowStage[], workflowPhases: payload.phases });
  const markdown = renderPromptWorkflowMarkdown(payload);
  const artifact = await db.workflowArtifact.create({
    data: {
      projectId,
      stage: "WORKFLOW",
      command,
      title: payload.title,
      markdown,
      structuredJson: stringify(payload),
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });
  const promptWorkflow = await db.promptWorkflow.create({
    data: {
      projectId,
      architectureArtifactId: artifact.id,
      phases: stringify(payload.phases),
      prompts: stringify(payload.prompts.length ? payload.prompts : payload.phases),
      targetTools: stringify(payload.targetTools),
      status: "READY",
    },
  });

  if (runId) {
    await db.workflowRun.update({ where: { id: runId }, data: { status: "COMPLETED", artifactId: artifact.id, completedAt: new Date() } });
  }

  await saveProjectGraph(projectId, nextGraph, { status: "Workflow ready", phases: stringify(payload.phases), workflowPhases: stringify(payload.phases) });
  const updated = await getProject(projectId, userId);
  return {
    run: null,
    artifact: { ...artifact, structured: payload },
    workflow: { ...promptWorkflow, phases: payload.phases, prompts: payload.prompts, targetTools: payload.targetTools },
    questions: [],
    decisions: [],
    nextStage: "WORKFLOW",
    readiness: serializeProject(updated).readiness,
    project: serializeProject(updated),
  };
}

export async function runWorkflowCommand(projectId: string, commandText: string, input: string, fallbackStage: WorkflowStage = "BRIEF", userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const stage = normalizeStage(fallbackStage);
  const run = await db.workflowRun.create({
    data: { projectId, command: commandText || stage, stage, input, status: "RUNNING" },
  });

  try {
    let result: any;
    if (stage === "BRIEF") result = await answerBriefQuestion(projectId, input, userId);
    if (stage === "BLUEPRINT") result = await generateBlueprint(projectId, userId);
    if (stage === "DESIGN") result = await generateDesign(projectId, userId);
    if (stage === "WORKFLOW") result = await runPromptWorkflow(projectId, input, userId, commandText || "/prompt-workflow", run.id);

    await db.workflowRun.update({ where: { id: run.id }, data: { status: "COMPLETED", completedAt: new Date() } });
    return result;
  } catch (error) {
    await db.workflowRun.update({
      where: { id: run.id },
      data: { status: "FAILED", error: error instanceof Error ? error.message : "Command failed", completedAt: new Date() },
    });
    throw error;
  }
}

export async function runArtifactStage(projectId: string, stage: WorkflowStage, input: string, userId?: string | null) {
  return runWorkflowCommand(projectId, stage, input, stage, userId);
}

export async function approveStage(projectId: string, stage: WorkflowStage, userId?: string | null) {
  const normalized = normalizeStage(stage);
  if (normalized === "BLUEPRINT") return approveBlueprint(projectId, userId);
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  return serializeProject(project);
}

export async function approveArtifact(projectId: string, artifactId: string, approvalNote = "", userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const artifact = (project.artifacts || []).find((item: any) => item.id === artifactId);
  if (!artifact) throw errorWithStatus("Artifact not found", 404);
  await db.workflowArtifact.update({ where: { id: artifactId }, data: { status: "APPROVED", approvedAt: new Date(), approvalNote: approvalNote || null } });
  const updated = await getProject(projectId, userId);
  return { artifact, nextStage: normalizeStage(artifact.stage), readiness: serializeProject(updated).readiness, project: serializeProject(updated) };
}

export async function updateArtifact(projectId: string, artifactId: string, payload: WorkflowArtifactPayload, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const artifact = (project.artifacts || []).find((item: any) => item.id === artifactId);
  if (!artifact) throw errorWithStatus("Artifact not found", 404);
  const stage = normalizeStage(artifact.stage);
  const updatedArtifact = await db.workflowArtifact.update({
    where: { id: artifactId },
    data: {
      title: payload.title || artifact.title,
      markdown: renderArtifactMarkdown(stage, payload, artifact.status),
      structuredJson: stringify(payload),
      isEdited: true,
    },
  });
  const updated = await getProject(projectId, userId);
  return { artifact: { ...updatedArtifact, structured: payload }, project: serializeProject(updated) };
}

export async function listRuns(projectId: string, userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  return serializeProject(project).workflowRuns || [];
}

export async function savePromptRating(projectId: string, phaseNumber: number, rating: string, feedback = "", phaseTitle = "", userId?: string | null) {
  const project = await getProject(projectId, userId);
  if (!project) throw errorWithStatus("Project not found", 404);
  const saved = await db.promptRating.create({
    data: {
      projectId,
      userId: userId || null,
      phaseNumber,
      rating,
      feedback: feedback || null,
      phaseTitle: phaseTitle || null,
    },
  });
  return saved;
}

export async function getWorkspaceContext(userId?: string | null) {
  if (!userId) {
    return {
      techStack: {},
      designPrefs: {},
      antiPatterns: {},
      pastDecisions: {},
      promptRatings: {},
      defaultTool: "Cursor",
    };
  }
  const context = await db.workspaceContext.findUnique({ where: { userId } });
  if (!context) {
    return db.workspaceContext.create({
      data: {
        userId,
        techStack: stringify({ framework: ["Next.js"], styling: ["Tailwind"], database: ["PostgreSQL"], hosting: ["Vercel"] }),
        designPrefs: stringify({ keywords: ["minimal", "precise"] }),
        antiPatterns: stringify([]),
        pastDecisions: stringify([]),
        promptRatings: stringify({}),
        defaultTool: "Cursor",
      },
    });
  }
  return {
    ...context,
    techStack: safeJsonParse(context.techStack, {}),
    designPrefs: safeJsonParse(context.designPrefs, {}),
    antiPatterns: safeJsonParse(context.antiPatterns, []),
    pastDecisions: safeJsonParse(context.pastDecisions, []),
    promptRatings: safeJsonParse(context.promptRatings, {}),
  };
}

export async function updateWorkspaceContext(payload: any, userId?: string | null) {
  if (!userId) throw errorWithStatus("Sign in to save workspace context", 401);
  const data = {
    techStack: stringify(payload.techStack || {}),
    designPrefs: stringify(payload.designPrefs || {}),
    antiPatterns: stringify(payload.antiPatterns || []),
    pastDecisions: stringify(payload.pastDecisions || []),
    promptRatings: stringify(payload.promptRatings || {}),
    defaultTool: payload.defaultTool || "Cursor",
  };
  const context = await db.workspaceContext.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
  return {
    ...context,
    techStack: safeJsonParse(context.techStack, {}),
    designPrefs: safeJsonParse(context.designPrefs, {}),
    antiPatterns: safeJsonParse(context.antiPatterns, []),
    pastDecisions: safeJsonParse(context.pastDecisions, []),
    promptRatings: safeJsonParse(context.promptRatings, {}),
  };
}
