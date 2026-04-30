import Anthropic from "@anthropic-ai/sdk";
import {
  BlueprintAnnotation,
  BlueprintPlan,
  BriefPack,
  DesignOptionsPayload,
  LensType,
  PromptWorkflowPayload,
  WorkflowArtifactPayload,
  WorkflowPhase,
  WorkflowStage,
  getCommandForStage,
} from "@/lib/workflow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "missing-key",
});

type ArtifactContext = {
  idea: string;
  title: string;
  artifacts: Array<{
    stage: string;
    markdown: string;
    structuredJson: string;
    status: string;
  }>;
  input?: string;
  command?: string;
};

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  const arrayFirst = text.indexOf("[");
  const arrayLast = text.lastIndexOf("]");
  if (arrayFirst >= 0 && arrayLast > arrayFirst) return text.slice(arrayFirst, arrayLast + 1);
  return text;
}

async function callAnthropic(system: string, user: string, maxTokens = 5000) {
  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620",
    max_tokens: maxTokens,
    temperature: 0.2,
    system,
    messages: [{ role: "user", content: user }],
  });

  const content = response.content[0];
  if (!content || content.type !== "text") throw new Error("AI returned no text");
  return content.text;
}

function briefLine(brief: BriefPack, key: keyof BriefPack["answers"], fallback: string) {
  return brief.answers[key]?.trim() || fallback;
}

export function fallbackBlueprint(brief: BriefPack, title: string): BlueprintPlan {
  const problem = briefLine(brief, "problem", "The project needs a clearer operating system for turning ideas into shipped software.");
  const who = briefLine(brief, "who", "A specific founder or builder who owns the product outcome.");
  const success = briefLine(brief, "success", "A validated workflow and usable build plan within 30 days.");
  const out = briefLine(brief, "outOfScope", "Anything not needed for the first workflow.");
  const sections: BlueprintPlan["sections"] = [
    ["Strategy", "Product Thesis", `Build ${title} as a disciplined workflow product: start with the real user pain, preserve a durable plan, and generate implementation prompts only after explicit gates.`],
    ["Strategy", "Problem", problem],
    ["Strategy", "Target User", who],
    ["Strategy", "Demand Signal", `The strongest signal to watch is whether ${who} will repeatedly use the workflow to clarify scope before writing implementation prompts.`],
    ["Strategy", "30-Day Success", success],
    ["Strategy", "Positioning", "A guided AI build operating system rather than a generic prompt generator."],
    ["Strategy", "Scope Boundary", out],
    ["Strategy", "Riskiest Assumption", briefLine(brief, "risk", "Users will tolerate gates because the resulting prompts are materially better.")],
    ["Architecture", "System Overview", "Next.js UI, Prisma-backed project/session graph, structured stage artifacts, and AI providers wrapped behind typed service functions."],
    ["Architecture", "Data Model", "Project stores briefPack, sessionGraph, blueprintAnnotations, designChoices, workflowPhases, pendingDecisions, and stage state."],
    ["Architecture", "State Machine", "BRIEF -> BLUEPRINT -> DESIGN -> WORKFLOW. Gates are stored server-side in the session graph."],
    ["Architecture", "API Surface", "Workspace APIs cover chat, session graph, lens review, decision resolution, design generation, prompt rating, and context preferences."],
    ["Architecture", "Auth Boundary", "Every project lookup is scoped to the session user when logged in and anonymous state remains isolated to null user projects."],
    ["Technical", "AI Provider", "System prompts are role-specific. Fallback generators keep the product usable without an API key."],
    ["Technical", "Brief Validation", "Problem length, target user specificity, measurable success, and explicit exclusions must pass before Blueprint."],
    ["Technical", "Lens Review", "Product, Architecture, and Design lenses run separate critique passes and produce structured annotations."],
    ["Technical", "Decision Gates", "Critical annotations can pause the pipeline until the user selects or approves a resolution."],
    ["Technical", "Run Pipeline", "Autopilot chains deterministic stages and pauses only for unresolved decisions or missing approvals."],
    ["Design", "Interaction Model", "The Workspace feels like a focused command factory with a persistent left rail, stage bar, and dense stage-specific panels."],
    ["Design", "Visual Style", "White, quiet, high-contrast UI with stage-specific accent colors and compact typography."],
    ["Design", "Design Stage", "Users select one palette and one font pair from live rendered previews before prompts are generated."],
    ["Design", "Accessibility", "The interface should preserve keyboard access, visible focus states, strong contrast, and mobile drawer fallbacks."],
    ["Operations", "Persistence", "Session graph is updated after every gate so page refreshes and re-opens restore exact state."],
    ["Operations", "Exports", "Workflow phases can be copied individually, copied as a pack, exported as markdown, or exported as JSON."],
    ["Operations", "Prompt Ratings", "Phase ratings feed back into Workspace Context after enough usage."],
    ["Operations", "Learning Loop", "Workspace Context stores tech stack, design preferences, anti-patterns, and past decisions per user."],
    ["Legal", "Data Handling", "Generated text is stored as project data and should never execute as HTML."],
    ["Legal", "Attribution", "GStack-inspired workflow concepts should retain MIT attribution if exact prompt text is copied."],
    ["Technical", "Testing Plan", "Cover stage gates, brief validation, lens resolution, design approval, prompt generation, reload restore, and mobile layout."],
    ["Operations", "Rollout Plan", "Ship Foundation, then Core Stages, then Decision Gates/Pipeline, then learning/export enhancements."],
    ["Strategy", "Acceptance Criteria", "A user can answer the six questions, approve Blueprint after lenses, select design tokens, and receive copy-ready workflow prompts from the approved context."],
  ].map(([category, sectionTitle, content], index) => ({
    number: index + 1,
    category: category as BlueprintPlan["sections"][number]["category"],
    title: sectionTitle,
    content,
  }));

  return {
    title: `${title} Blueprint`,
    summary: "A 31-section plan generated from the validated Brief Pack and prepared for lens review.",
    sections,
  };
}

export function fallbackLensAnnotations(lens: LensType, blueprint: BlueprintPlan): BlueprintAnnotation[] {
  const common = (id: string, sectionNumber: number, severity: BlueprintAnnotation["severity"], concern: string, suggestedFix: string, requiresDecision = false): BlueprintAnnotation => {
    const section = blueprint.sections.find((item) => item.number === sectionNumber);
    return {
      id,
      lens,
      sectionNumber,
      section: section?.title || `Section ${sectionNumber}`,
      severity,
      concern,
      suggestedFix,
      resolved: severity !== "critical",
      requiresDecision,
    };
  };

  if (lens === "PRODUCT") {
    return [
      common("product-1", 6, "warning", "Positioning risks sounding like a generic AI planning tool unless the gated artifact trail is named as the product advantage.", "Rewrite positioning around durable decision history and locked context."),
      common("product-2", 8, "critical", "The riskiest assumption needs a user-facing validation plan before the build scope expands.", "Add a concrete validation step in the first workflow phase.", true),
      common("product-3", 7, "suggestion", "Scope boundary is useful, but could list one explicitly rejected persona.", "Add a rejected user group to keep v1 focused."),
    ];
  }

  if (lens === "ARCHITECTURE") {
    return [
      common("architecture-1", 10, "critical", "Session graph and legacy artifact state can drift unless one source is treated as canonical.", "Make sessionGraph the canonical stage state and derive readiness from it.", true),
      common("architecture-2", 13, "warning", "Anonymous project isolation is mentioned, but migration to authenticated ownership is not specified.", "Add a handoff path when an anonymous user signs in."),
      common("architecture-3", 17, "suggestion", "Decision gates should have stable IDs so unresolved items survive regeneration.", "Persist gate IDs in the session graph and Decision model."),
    ];
  }

  return [
    common("design-1", 20, "warning", "The visual style is clear, but stage colors could become decorative if they do not map to progress and status.", "Use stage colors only for state indicators, badges, and subtle panels."),
    common("design-2", 22, "critical", "Mobile drawer fallback is named but not described for the Blueprint lens panel.", "Define how annotations appear as a bottom drawer below 1024px.", true),
    common("design-3", 21, "suggestion", "Design stage previews should show inputs and cards, not only swatches.", "Render heading, body, button, input, and card samples in each option."),
  ];
}

export function fallbackDesignOptions(brief: BriefPack): DesignOptionsPayload {
  const who = briefLine(brief, "who", "builders who value clarity");
  return {
    contextNote: `Based on the brief, the product should feel precise and calm for ${who}. The options below avoid noisy gradients and favor serious workflow readability.`,
    palettes: [
      {
        id: "palette-a",
        name: "Graphite Focus",
        vibe: "Minimal, serious, execution-first",
        colors: {
          background: "#FFFFFF",
          surface: "#FAFAFA",
          text: "#0A0A0A",
          secondary: "#4A4A4A",
          accent: "#0A0A0A",
          border: "#D4D4D4",
          buttonText: "#FFFFFF",
        },
        reasoning: "Best for a Codex-style tool where the output and decisions should carry the weight.",
      },
      {
        id: "palette-b",
        name: "Blueprint Signal",
        vibe: "Trust-first, technical, structured",
        colors: {
          background: "#FFFFFF",
          surface: "#F8FAFC",
          text: "#0F172A",
          secondary: "#475569",
          accent: "#1D4ED8",
          border: "#CBD5E1",
          buttonText: "#FFFFFF",
        },
        reasoning: "Blue accents reinforce architecture review and make dense planning feel controlled.",
      },
      {
        id: "palette-c",
        name: "Cyan Studio",
        vibe: "Modern, creative, product-led",
        colors: {
          background: "#FFFFFF",
          surface: "#F0FDFA",
          text: "#111827",
          secondary: "#4B5563",
          accent: "#0891B2",
          border: "#B6E5EE",
          buttonText: "#FFFFFF",
        },
        reasoning: "A sharper design-system feel for visual builders and product teams.",
      },
    ],
    fonts: [
      { id: "font-1", name: "Inter + Geist Mono", heading: "Inter", body: "Inter", tags: ["neutral", "saas"], note: "Clean and familiar for dense product workflows." },
      { id: "font-2", name: "Geist + Geist Mono", heading: "Geist", body: "Geist", tags: ["technical", "precise"], note: "Best fit for Codex-like command surfaces." },
      { id: "font-3", name: "Instrument Sans + Source Serif", heading: "Instrument Sans", body: "Source Serif 4", tags: ["editorial", "thoughtful"], note: "Adds editorial warmth while staying professional." },
    ],
  };
}

function workflowPrompt(phase: number, title: string, tool: string, context: string, extra: string) {
  return `CLEAR GOAL
${title}

CONTEXT
${context}

ROLE
Act as a senior product engineer working in ${tool}. Preserve the approved Brief Pack, Blueprint, and Design Choices.

OUTPUT FORMAT
Return changed files, implementation notes, and any follow-up checks.

CONSTRAINTS
Do not expand scope without explicit approval. Use the chosen design tokens. Keep the UI compact, accessible, and production-oriented.

STEP-BY-STEP
1. Inspect the relevant files.
2. Implement the smallest complete change.
3. Update state or API contracts if needed.
4. Verify with type/lint/build or a targeted smoke test.

EXAMPLES
Use stage-aware labels, decision gates, and durable artifacts rather than generic chat output.

SCOPE CONTROL
Phase ${phase} focuses only on ${extra}.

PRECISION LANGUAGE
Use exact file paths, exact schema fields, and exact acceptance criteria.

END CONDITION
Stop when this phase is implemented, verified, and ready for the next workflow prompt.`;
}

export function fallbackWorkflowPhases(title: string, tool: string, brief: BriefPack, blueprint?: BlueprintPlan, design?: DesignOptionsPayload): PromptWorkflowPayload {
  const context = `Project: ${title}. Problem: ${briefLine(brief, "problem", "not specified")}. User: ${briefLine(brief, "who", "not specified")}. Blueprint sections: ${blueprint?.sections.length || 31}. Design context: ${design?.contextNote || "use approved tokens"}.`;
  const phases: WorkflowPhase[] = [
    {
      number: 1,
      title: "Foundation schema and session graph",
      tool,
      estimate: "0.5 day",
      description: "Add the durable state model and server-side stage machine.",
      prompt: workflowPrompt(1, "Implement the Workspace foundation schema and session graph", tool, context, "DB models, Prisma client sync, and state helpers"),
    },
    {
      number: 2,
      title: "Brief forcing-function flow",
      tool,
      estimate: "0.5 day",
      description: "Build the six-question Brief stage with validation.",
      prompt: workflowPrompt(2, "Build the Brief stage with six forcing questions", tool, context, "one-at-a-time questions, validation criteria, and Brief Pack persistence"),
    },
    {
      number: 3,
      title: "Blueprint plan and lenses",
      tool,
      estimate: "1 day",
      description: "Generate the 31-section plan and lens annotations.",
      prompt: workflowPrompt(3, "Implement Blueprint generation and three lens review passes", tool, context, "31-section plan UI, lens tabs, annotations, and resolution state"),
    },
    {
      number: 4,
      title: "Design canvas",
      tool,
      estimate: "0.5 day",
      description: "Add live palette and font selection with design tokens.",
      prompt: workflowPrompt(4, "Build the visual Design stage", tool, context, "palette previews, font cards, custom values, and design approval"),
    },
    {
      number: 5,
      title: "Workflow phase delivery",
      tool,
      estimate: "1 day",
      description: "Generate and manage copy-ready implementation prompts.",
      prompt: workflowPrompt(5, "Build the Workflow stage", tool, context, "phase list, prompt detail, copy all, modify, rate, and export"),
    },
    {
      number: 6,
      title: "Decision gates and autopilot",
      tool,
      estimate: "1 day",
      description: "Add visual decision gates and Run Pipeline behavior.",
      prompt: workflowPrompt(6, "Implement decision gates and Run Pipeline", tool, context, "pipeline pause/resume, decision overlay, and stage mini-map"),
    },
  ];

  return {
    title: `${title} Workflow`,
    phases,
    prompts: phases.map((phase) => ({ title: phase.title, tool: phase.tool, prompt: phase.prompt })),
    targetTools: ["Cursor", "Claude Code", "Antigravity", "Generic IDE"],
  };
}

function validateArtifact(value: any): WorkflowArtifactPayload {
  if (!value || typeof value !== "object") throw new Error("AI response was not an object");
  if (!Array.isArray(value.sections)) throw new Error("AI response missing sections array");
  return {
    title: String(value.title || "Untitled artifact"),
    summary: String(value.summary || ""),
    sections: value.sections.map((section: any) => ({
      heading: String(section.heading || "Section"),
      body: Array.isArray(section.body) ? section.body.map((item: any) => String(item)) : String(section.body || ""),
    })),
    questions: Array.isArray(value.questions)
      ? value.questions.map((item: any) => ({
          question: String(item.question || ""),
          options: Array.isArray(item.options) ? item.options.map((option: any) => String(option)) : [],
          recommendation: String(item.recommendation || ""),
          answer: item.answer ? String(item.answer) : undefined,
        }))
      : [],
    decisions: Array.isArray(value.decisions)
      ? value.decisions.map((item: any) => ({
          question: String(item.question || ""),
          selectedOption: item.selectedOption ? String(item.selectedOption) : undefined,
          rationale: item.rationale ? String(item.rationale) : undefined,
          isResolved: Boolean(item.isResolved),
        }))
      : [],
    nextAction: String(value.nextAction || "Review this artifact and approve the stage."),
    readinessNote: String(value.readinessNote || ""),
  };
}

export async function generateBlueprintPlan(brief: BriefPack, title: string) {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackBlueprint(brief, title);

  const system = `You are the Blueprint stage generator. Return strict JSON only with {title, summary, sections:[{number,title,category,content}]}. Generate exactly 31 sections grouped across Strategy, Architecture, Design, Technical, Operations, and Legal.`;
  const user = `Project: ${title}\nBrief Pack:\n${JSON.stringify(brief, null, 2)}`;
  const text = await callAnthropic(system, user, 7000);
  const parsed = JSON.parse(extractJson(text));
  if (!Array.isArray(parsed.sections) || parsed.sections.length < 20) return fallbackBlueprint(brief, title);
  return parsed as BlueprintPlan;
}

export async function generateLensAnnotations(lens: LensType, blueprint: BlueprintPlan) {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackLensAnnotations(lens, blueprint);

  const prompts: Record<LensType, string> = {
    PRODUCT: "You are a senior product strategist. Identify scope creep risks, missing user-facing features, and assumptions that could invalidate the plan.",
    ARCHITECTURE: "You are a staff-level software architect. Identify technology mismatches, missing infrastructure, security gaps, and scalability ceiling issues.",
    DESIGN: "You are a senior product designer. Identify missing UX flows, accessibility oversights, mobile edge cases, and needless component complexity.",
  };
  const system = `${prompts[lens]} Return strict JSON array: [{id,lens,sectionNumber,section,severity,concern,suggestedFix,resolved,requiresDecision}]. Severity is critical, warning, or suggestion.`;
  const text = await callAnthropic(system, JSON.stringify(blueprint), 3500);
  const parsed = JSON.parse(extractJson(text));
  return Array.isArray(parsed) ? (parsed as BlueprintAnnotation[]) : fallbackLensAnnotations(lens, blueprint);
}

export async function generateDesignOptions(brief: BriefPack) {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackDesignOptions(brief);
  const system = "You are the Design stage generator. Return strict JSON with {contextNote,palettes:[3],fonts:[3]}. Each palette has id,name,vibe,colors,reasoning. Each font has id,name,heading,body,tags,note.";
  const text = await callAnthropic(system, JSON.stringify(brief), 3500);
  const parsed = JSON.parse(extractJson(text));
  return parsed as DesignOptionsPayload;
}

export async function generatePromptWorkflow(context: ArtifactContext & { briefPack?: BriefPack; blueprint?: BlueprintPlan; designOptions?: DesignOptionsPayload; tool?: string }) {
  const brief = context.briefPack || {
    answers: { problem: context.idea, who: "", tried: "", success: "", outOfScope: "", risk: "" },
    currentQuestion: 6,
    validated: true,
    validation: { problemDefined: true, targetUserSpecific: true, successMeasurable: true, scopeBounded: true, reasons: {} },
  };
  const tool = context.tool || "Cursor";
  if (!process.env.ANTHROPIC_API_KEY) return fallbackWorkflowPhases(context.title, tool, brief, context.blueprint, context.designOptions);

  const system = `You are the Workflow stage generator. Return strict JSON only with {title,targetTools,phases,prompts}. Generate 5-8 phases. Each phase prompt must include: Clear Goal, Context, Role, Output Format, Constraints, Step-by-Step, Examples, Scope Control, Precision Language, End Condition.`;
  const user = JSON.stringify({ title: context.title, brief, blueprint: context.blueprint, design: context.designOptions, tool }, null, 2);
  const text = await callAnthropic(system, user, 7000);
  const parsed = JSON.parse(extractJson(text));
  if (!Array.isArray(parsed.phases)) return fallbackWorkflowPhases(context.title, tool, brief, context.blueprint, context.designOptions);
  return parsed as PromptWorkflowPayload;
}

export async function generateWorkflowArtifact(stage: WorkflowStage, context: ArtifactContext) {
  const command = getCommandForStage(stage);
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      title: `${command.label}: ${context.title}`,
      summary: `${command.label} artifact for ${context.title}.`,
      sections: [{ heading: command.label, body: command.description }],
      questions: [],
      decisions: [],
      nextAction: command.nextCommand ? `Run ${command.nextCommand}.` : "Review the workflow.",
      readinessNote: "Generated by the fallback workflow engine.",
    };
  }

  const system = `You are SymphonyAI's workflow engine. Return strict JSON only. Command: ${command.command}. Role: ${command.role}. Output shape: {title,summary,sections,questions,decisions,nextAction,readinessNote}.`;
  const user = JSON.stringify(context, null, 2);
  const text = await callAnthropic(system, user, 4500);
  return validateArtifact(JSON.parse(extractJson(text)));
}
