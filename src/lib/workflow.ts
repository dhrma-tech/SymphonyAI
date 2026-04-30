export type WorkflowStage = "BRIEF" | "BLUEPRINT" | "DESIGN" | "WORKFLOW";

export type StageStatus = "LOCKED" | "READY" | "CURRENT" | "COMPLETED";
export type WorkflowRunStatus = "RUNNING" | "COMPLETED" | "FAILED";
export type ArtifactStatus = "DRAFT" | "APPROVED" | "SUPERSEDED";
export type LensType = "PRODUCT" | "ARCHITECTURE" | "DESIGN";
export type Severity = "critical" | "warning" | "suggestion";

export interface WorkflowCommand {
  command: string;
  aliases: string[];
  stage: WorkflowStage;
  role: string;
  label: string;
  description: string;
  nextCommand?: string;
}

export interface BriefAnswer {
  id: keyof BriefPack["answers"];
  label: string;
  question: string;
  shortQuestion: string;
  placeholder: string;
}

export interface BriefPack {
  answers: {
    problem: string;
    who: string;
    tried: string;
    success: string;
    outOfScope: string;
    risk: string;
  };
  currentQuestion: number;
  validated: boolean;
  validation: {
    problemDefined: boolean;
    targetUserSpecific: boolean;
    successMeasurable: boolean;
    scopeBounded: boolean;
    reasons: Record<string, string>;
  };
  updatedAt?: string;
}

export interface BlueprintSection {
  number: number;
  title: string;
  category: "Strategy" | "Architecture" | "Design" | "Technical" | "Operations" | "Legal";
  content: string;
}

export interface BlueprintPlan {
  title: string;
  summary: string;
  sections: BlueprintSection[];
}

export interface BlueprintAnnotation {
  id: string;
  lens: LensType;
  sectionNumber: number;
  section: string;
  severity: Severity;
  concern: string;
  suggestedFix: string;
  resolved: boolean;
  resolution?: string;
  requiresDecision?: boolean;
}

export interface BlueprintAnnotations {
  product: BlueprintAnnotation[];
  architecture: BlueprintAnnotation[];
  design: BlueprintAnnotation[];
}

export interface DesignOption {
  id: string;
  name: string;
  vibe: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    secondary: string;
    accent: string;
    border: string;
    buttonText: string;
  };
  reasoning: string;
}

export interface FontOption {
  id: string;
  name: string;
  heading: string;
  body: string;
  tags: string[];
  note: string;
}

export interface DesignChoices {
  palette?: DesignOption;
  fonts?: FontOption;
  custom?: boolean;
  approved?: boolean;
}

export interface DesignOptionsPayload {
  contextNote: string;
  palettes: DesignOption[];
  fonts: FontOption[];
}

export interface DecisionGate {
  id: string;
  type: "SINGLE_SELECT" | "MULTI_SELECT" | "APPROVAL" | "AB_CHOICE";
  stage: WorkflowStage;
  question: string;
  options: Array<{ id: string; title: string; description: string }>;
  resolved: boolean;
  resolution?: unknown;
  source?: string;
  context?: string;
}

export interface WorkflowPhase {
  number: number;
  title: string;
  tool: string;
  estimate: string;
  description: string;
  prompt: string;
  copied?: boolean;
  modified?: boolean;
  rating?: "PERFECT" | "NEEDS_EDIT" | "DIDNT_WORK";
}

export interface SessionGraph {
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  briefPack: BriefPack;
  blueprint?: BlueprintPlan;
  blueprintAnnotations: BlueprintAnnotations;
  designOptions?: DesignOptionsPayload;
  designChoices: DesignChoices;
  pendingDecisions: DecisionGate[];
  workflowPhases: WorkflowPhase[];
  selectedTool: string;
  pipelineMode?: "MANUAL" | "AUTOPILOT";
  lastActiveAt: string;
}

export interface WorkflowArtifactPayload {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string | string[];
  }>;
  questions: Array<{
    question: string;
    options: string[];
    recommendation: string;
    answer?: string;
  }>;
  decisions: Array<{
    question: string;
    selectedOption?: string;
    rationale?: string;
    isResolved: boolean;
  }>;
  nextAction: string;
  readinessNote: string;
}

export interface PromptWorkflowPayload {
  title: string;
  phases: WorkflowPhase[];
  prompts: Array<{
    title: string;
    tool: string;
    prompt: string;
  }>;
  targetTools: string[];
}

export const BRIEF_QUESTIONS: BriefAnswer[] = [
  {
    id: "problem",
    label: "PROBLEM",
    question: "What problem does this actually solve?",
    shortQuestion: "What problem does this solve?",
    placeholder: "Tell me what you want to build and the pain it removes...",
  },
  {
    id: "who",
    label: "WHO",
    question: "Who specifically has this problem?",
    shortQuestion: "Who specifically has this problem?",
    placeholder: "Describe the exact person, role, team, or buyer...",
  },
  {
    id: "tried",
    label: "TRIED",
    question: "What have they tried before?",
    shortQuestion: "What have they tried before?",
    placeholder: "List tools, workarounds, spreadsheets, processes, or failed attempts...",
  },
  {
    id: "success",
    label: "SUCCESS",
    question: "What does success look like in 30 days?",
    shortQuestion: "What does success look like in 30 days?",
    placeholder: "Give a measurable outcome, deadline, or target signal...",
  },
  {
    id: "outOfScope",
    label: "OUT OF SCOPE",
    question: "What is explicitly OUT of scope?",
    shortQuestion: "What is explicitly excluded?",
    placeholder: "Name features, audiences, platforms, or complexity we are excluding...",
  },
  {
    id: "risk",
    label: "RISK",
    question: "What's the riskiest assumption you're making?",
    shortQuestion: "Riskiest assumption?",
    placeholder: "Name the assumption that could make the whole plan wrong...",
  },
];

export const WORKFLOW_STAGES: Array<{
  id: WorkflowStage;
  label: string;
  command: string;
  description: string;
  color: string;
}> = [
  {
    id: "BRIEF",
    label: "Brief",
    command: "/office-hours",
    description: "Answer six forcing questions and validate the Brief Pack.",
    color: "#7C3AED",
  },
  {
    id: "BLUEPRINT",
    label: "Blueprint",
    command: "/plan",
    description: "Generate a 31-section plan and resolve Product, Architecture, and Design lens annotations.",
    color: "#1D4ED8",
  },
  {
    id: "DESIGN",
    label: "Design",
    command: "/design-shotgun",
    description: "Choose live palette and font previews tailored to the brief.",
    color: "#0891B2",
  },
  {
    id: "WORKFLOW",
    label: "Workflow",
    command: "/prompt-workflow",
    description: "Generate, copy, modify, rate, and export execution prompts.",
    color: "#059669",
  },
];

export const STAGE_ORDER = WORKFLOW_STAGES.map((stage) => stage.id);

export const WORKFLOW_COMMANDS: WorkflowCommand[] = [
  {
    command: "/office-hours",
    aliases: ["/brief"],
    stage: "BRIEF",
    role: "Product Critic",
    label: "Brief",
    description: "Ask the six forcing questions, one at a time, and compile the Brief Pack.",
    nextCommand: "/plan",
  },
  {
    command: "/plan",
    aliases: ["/blueprint", "/plan-ceo-review"],
    stage: "BLUEPRINT",
    role: "Blueprint reviewer",
    label: "Blueprint",
    description: "Create the 31-section plan and run Product, Architecture, and Design lenses.",
    nextCommand: "/design-shotgun",
  },
  {
    command: "/design-shotgun",
    aliases: ["/design"],
    stage: "DESIGN",
    role: "Design Critic",
    label: "Design",
    description: "Generate palette and font options with live component previews.",
    nextCommand: "/prompt-workflow",
  },
  {
    command: "/prompt-workflow",
    aliases: ["/workflow", "/prompts"],
    stage: "WORKFLOW",
    role: "QA Engineer",
    label: "Workflow",
    description: "Generate tool-specific prompt phases from approved brief, blueprint, and design choices.",
  },
];

export const COMMAND_ALIASES = WORKFLOW_COMMANDS.reduce<Record<string, WorkflowCommand>>((acc, item) => {
  acc[item.command] = item;
  for (const alias of item.aliases) acc[alias] = item;
  return acc;
}, {});

export function createEmptyBriefPack(): BriefPack {
  return {
    answers: {
      problem: "",
      who: "",
      tried: "",
      success: "",
      outOfScope: "",
      risk: "",
    },
    currentQuestion: 0,
    validated: false,
    validation: {
      problemDefined: false,
      targetUserSpecific: false,
      successMeasurable: false,
      scopeBounded: false,
      reasons: {},
    },
  };
}

export function validateBriefPack(pack: BriefPack): BriefPack["validation"] {
  const problemWords = pack.answers.problem.trim().split(/\s+/).filter(Boolean).length;
  const who = pack.answers.who.toLowerCase();
  const success = pack.answers.success;
  const out = pack.answers.outOfScope.trim();
  const targetUserSpecific = Boolean(pack.answers.who.trim()) && !/\b(everyone|anyone|all users|people)\b/i.test(who);
  const successMeasurable = /\d|day|week|month|percent|%|revenue|users|customers|hours|minutes|saved|reduced|increased/i.test(success);

  const validation = {
    problemDefined: problemWords >= 30,
    targetUserSpecific,
    successMeasurable,
    scopeBounded: out.length > 8,
    reasons: {} as Record<string, string>,
  };

  if (!validation.problemDefined) validation.reasons.problemDefined = "Problem answer needs at least 30 words.";
  if (!validation.targetUserSpecific) validation.reasons.targetUserSpecific = "Target user must be more specific than everyone or anyone.";
  if (!validation.successMeasurable) validation.reasons.successMeasurable = "Success must include a measurable result, number, deadline, or concrete signal.";
  if (!validation.scopeBounded) validation.reasons.scopeBounded = "Scope needs at least one explicit exclusion.";
  return validation;
}

export function createSessionGraph(stage: WorkflowStage = "BRIEF"): SessionGraph {
  const briefPack = createEmptyBriefPack();
  return {
    currentStage: stage,
    completedStages: [],
    briefPack,
    blueprintAnnotations: { product: [], architecture: [], design: [] },
    designChoices: {},
    pendingDecisions: [],
    workflowPhases: [],
    selectedTool: "Cursor",
    pipelineMode: "MANUAL",
    lastActiveAt: new Date().toISOString(),
  };
}

export function normalizeStage(stage?: string | null): WorkflowStage {
  if (stage === "DEFINE_PRODUCT") return "BRIEF";
  if (stage === "REFINE_IDEA" || stage === "LOCK_ARCHITECTURE") return "BLUEPRINT";
  if (stage === "PROMPT_WORKFLOW") return "WORKFLOW";
  if (stage === "BRIEF" || stage === "BLUEPRINT" || stage === "DESIGN" || stage === "WORKFLOW") return stage;
  return "BRIEF";
}

export function parseWorkflowCommand(input: string, fallbackStage: WorkflowStage = "BRIEF") {
  const trimmed = input.trim();
  for (const [command, definition] of Object.entries(COMMAND_ALIASES)) {
    if (trimmed === command || trimmed.startsWith(`${command} `)) {
      return {
        command: definition.command,
        stage: definition.stage,
        input: trimmed.slice(command.length).trim(),
        definition,
      };
    }
  }

  const definition = WORKFLOW_COMMANDS.find((item) => item.stage === fallbackStage) || WORKFLOW_COMMANDS[0];
  return {
    command: definition.command,
    stage: definition.stage,
    input: trimmed,
    definition,
  };
}

export function getCommandForStage(stage: WorkflowStage) {
  return WORKFLOW_COMMANDS.find((item) => item.stage === stage) || WORKFLOW_COMMANDS[0];
}

export function getNextCommand(stage: WorkflowStage) {
  return getCommandForStage(stage).nextCommand || null;
}

export function getStageLabel(stage: WorkflowStage) {
  return WORKFLOW_STAGES.find((item) => item.id === stage)?.label ?? stage;
}

export function nextStage(stage: WorkflowStage): WorkflowStage {
  const index = STAGE_ORDER.indexOf(stage);
  return STAGE_ORDER[Math.min(index + 1, STAGE_ORDER.length - 1)];
}

export function previousRequiredStage(stage: WorkflowStage): WorkflowStage | null {
  const index = STAGE_ORDER.indexOf(stage);
  if (index <= 0) return null;
  return STAGE_ORDER[index - 1];
}

export function emptyReadiness() {
  return {
    brief: false,
    blueprint: false,
    design: false,
    workflow: false,
    productDefined: false,
    planReviewed: false,
    architectureLocked: false,
    promptsReady: false,
  };
}

export function buildReadiness(completedStages: Set<string>, hasPromptWorkflow: boolean) {
  return {
    brief: completedStages.has("BRIEF"),
    blueprint: completedStages.has("BLUEPRINT"),
    design: completedStages.has("DESIGN"),
    workflow: hasPromptWorkflow || completedStages.has("WORKFLOW"),
    productDefined: completedStages.has("BRIEF"),
    planReviewed: completedStages.has("BLUEPRINT"),
    architectureLocked: completedStages.has("BLUEPRINT"),
    promptsReady: hasPromptWorkflow || completedStages.has("WORKFLOW"),
  };
}

export function renderArtifactMarkdown(stage: WorkflowStage, payload: WorkflowArtifactPayload, status = "DRAFT") {
  const command = getCommandForStage(stage);
  const lines = [
    `# ${payload.title || getStageLabel(stage)}`,
    "",
    `Stage: ${getStageLabel(stage)}`,
    `Command: ${command.command}`,
    `Role: ${command.role}`,
    `Status: ${status}`,
    "",
    "## Summary",
    payload.summary,
    "",
  ];

  for (const section of payload.sections || []) {
    lines.push(`## ${section.heading}`);
    if (Array.isArray(section.body)) {
      lines.push(...section.body.map((item) => `- ${item}`));
    } else {
      lines.push(section.body);
    }
    lines.push("");
  }

  if (payload.questions?.length) {
    lines.push("## Open Questions");
    for (const item of payload.questions) {
      lines.push(`- ${item.question}`);
      lines.push(`  Recommendation: ${item.recommendation}`);
      if (item.answer) lines.push(`  Answer: ${item.answer}`);
    }
    lines.push("");
  }

  if (payload.decisions?.length) {
    lines.push("## Decisions");
    for (const decision of payload.decisions) {
      lines.push(`- ${decision.question}`);
      if (decision.selectedOption) lines.push(`  Selected: ${decision.selectedOption}`);
      if (decision.rationale) lines.push(`  Rationale: ${decision.rationale}`);
      lines.push(`  Resolved: ${decision.isResolved ? "yes" : "no"}`);
    }
    lines.push("");
  }

  if (payload.readinessNote) {
    lines.push("## Readiness", payload.readinessNote, "");
  }

  lines.push("## Next Action", payload.nextAction || "Review and approve this stage.");
  return lines.join("\n");
}

export function renderPromptWorkflowMarkdown(payload: PromptWorkflowPayload) {
  const lines = [`# ${payload.title}`, "", "## Target Tools", payload.targetTools.join(", "), ""];

  for (const phase of payload.phases) {
    lines.push(`## ${phase.number}. ${phase.title}`);
    lines.push(`Tool: ${phase.tool}`);
    lines.push(`Estimate: ${phase.estimate}`);
    lines.push(phase.description);
    lines.push("");
    lines.push("```text");
    lines.push(phase.prompt);
    lines.push("```");
    lines.push("");
  }

  return lines.join("\n");
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
