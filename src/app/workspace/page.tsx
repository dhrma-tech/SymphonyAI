"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Grid3X3,
  Layers,
  Library,
  Loader2,
  Menu,
  Palette,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BRIEF_QUESTIONS,
  BlueprintAnnotation,
  BlueprintAnnotations,
  BlueprintPlan,
  BriefPack,
  DesignChoices,
  DesignOptionsPayload,
  DecisionGate,
  SessionGraph,
  WORKFLOW_STAGES,
  WorkflowPhase,
  WorkflowStage,
  createEmptyBriefPack,
  createSessionGraph,
  normalizeStage,
} from "@/lib/workflow";

type Project = {
  id: string;
  title: string;
  idea: string;
  status: string;
  stage: WorkflowStage;
  activeStage: WorkflowStage;
  briefValidated: boolean;
  briefPack: BriefPack;
  blueprintAnnotations: BlueprintAnnotations;
  sessionGraph: SessionGraph;
  designChoices: DesignChoices;
  workflowPhases: WorkflowPhase[];
  pendingDecisions: DecisionGate[];
  readiness: {
    brief: boolean;
    blueprint: boolean;
    design: boolean;
    workflow: boolean;
    productDefined: boolean;
    planReviewed: boolean;
    architectureLocked: boolean;
    promptsReady: boolean;
  };
  updatedAt: string;
};

const navLinks = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/skills", label: "LLM Skills", icon: Sparkles },
  { href: "/designs", label: "Designs", icon: Palette },
  { href: "/templates", label: "Templates", icon: Grid3X3 },
];

const stageColors: Record<WorkflowStage, string> = {
  BRIEF: "#7C3AED",
  BLUEPRINT: "#1D4ED8",
  DESIGN: "#0891B2",
  WORKFLOW: "#059669",
};

const stageLabels: Record<WorkflowStage, string> = {
  BRIEF: "Brief",
  BLUEPRINT: "Blueprint",
  DESIGN: "Design",
  WORKFLOW: "Workflow",
};

function getInitialGraph(): SessionGraph {
  return createSessionGraph("BRIEF");
}

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeStage, setActiveStage] = useState<WorkflowStage>("BRIEF");
  const [briefInput, setBriefInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLens, setSelectedLens] = useState<"product" | "architecture" | "design">("product");
  const [selectedPalette, setSelectedPalette] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [activePhase, setActivePhase] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [ratingFeedback, setRatingFeedback] = useState("");

  useEffect(() => {
    refreshProjects();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) loadProject(id);
  }, []);

  async function refreshProjects() {
    const res = await fetch("/api/workspace");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  }

  async function loadProject(id: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/workspace/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load plan");
      setCurrentProject(data);
      setActiveStage(normalizeStage(data.sessionGraph?.currentStage || data.stage));
      setSelectedPalette(data.designChoices?.palette?.id || "");
      setSelectedFont(data.designChoices?.fonts?.id || "");
      setActivePhase(data.workflowPhases?.[0]?.number || 1);
      window.history.replaceState(null, "", `/workspace?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plan");
    } finally {
      setLoading(false);
    }
  }

  async function newPlan() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: "Untitled plan" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create plan");
      setCurrentProject(data);
      setActiveStage("BRIEF");
      setBriefInput("");
      await refreshProjects();
      window.history.replaceState(null, "", `/workspace?id=${data.id}&stage=brief`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setLoading(false);
    }
  }

  async function postBriefAnswer() {
    if (!currentProject || !briefInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, message: briefInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save answer");
      setCurrentProject(data.project);
      setBriefInput("");
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save answer");
    } finally {
      setLoading(false);
    }
  }

  async function generateBlueprint() {
    if (!currentProject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/blueprint/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, action: "generate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate blueprint");
      setCurrentProject(data.project);
      setActiveStage("BLUEPRINT");
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate blueprint");
    } finally {
      setLoading(false);
    }
  }

  async function runLens(lens: "PRODUCT" | "ARCHITECTURE" | "DESIGN") {
    if (!currentProject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/blueprint/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, lens }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lens failed");
      setCurrentProject(data.project);
      setSelectedLens(lens.toLowerCase() as "product" | "architecture" | "design");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lens failed");
    } finally {
      setLoading(false);
    }
  }

  async function resolveDecision(decision: DecisionGate, optionId: string) {
    if (!currentProject) return;
    const res = await fetch("/api/workspace/decision/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: currentProject.id, decisionId: decision.id, resolution: { optionId } }),
    });
    const data = await res.json();
    if (res.ok) setCurrentProject(data);
  }

  async function approveBlueprint() {
    if (!currentProject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/blueprint/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, action: "approve" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");
      setCurrentProject(data);
      setActiveStage("DESIGN");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  }

  async function generateDesign() {
    if (!currentProject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/design/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate design");
      setCurrentProject(data.project);
      setActiveStage("DESIGN");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate design");
    } finally {
      setLoading(false);
    }
  }

  async function approveDesign() {
    if (!currentProject) return;
    const options = currentProject.sessionGraph.designOptions;
    const palette = options?.palettes.find((item) => item.id === selectedPalette);
    const fonts = options?.fonts.find((item) => item.id === selectedFont);
    if (!palette || !fonts) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/design/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, action: "approve", designChoices: { palette, fonts } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve design");
      setCurrentProject(data);
      setActiveStage("WORKFLOW");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve design");
    } finally {
      setLoading(false);
    }
  }

  async function generateWorkflow() {
    if (!currentProject) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/workspace/${currentProject.id}/generate-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Generate the complete Workflow prompt pack." }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate workflow");
      setCurrentProject(data.project);
      setActivePhase(data.project.workflowPhases?.[0]?.number || 1);
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate workflow");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  async function ratePhase(phase: WorkflowPhase, rating: "PERFECT" | "NEEDS_EDIT" | "DIDNT_WORK") {
    if (!currentProject) return;
    await fetch("/api/workspace/prompt/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: currentProject.id,
        phaseNumber: phase.number,
        phaseTitle: phase.title,
        rating,
        feedback: ratingFeedback,
      }),
    });
    setRatingFeedback("");
  }

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) => `${project.title} ${project.status}`.toLowerCase().includes(q));
  }, [projects, search]);

  const graph = currentProject?.sessionGraph || getInitialGraph();
  const decision = currentProject?.pendingDecisions?.find((item) => !item.resolved);

  return (
    <main className="flex h-screen overflow-hidden bg-white text-[#0A0A0A] selection:bg-black selection:text-white">
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}
      <WorkspaceSidebar
        projects={filteredProjects}
        currentProject={currentProject}
        search={search}
        onSearch={setSearch}
        onNewPlan={newPlan}
        onLoad={loadProject}
        graph={graph}
        open={sidebarOpen}
      />

      <section className="relative flex min-w-0 flex-1 flex-col bg-white">
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-md border border-[#D4D4D4] bg-white md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        {!currentProject ? (
          <EmptyState onNewPlan={newPlan} isLoading={isLoading} />
        ) : (
          <>
            <StageBar
              project={currentProject}
              activeStage={activeStage}
              setActiveStage={setActiveStage}
              onGenerateBlueprint={generateBlueprint}
              onRunAllLenses={async () => {
                await runLens("PRODUCT");
                await runLens("ARCHITECTURE");
                await runLens("DESIGN");
              }}
            />
            {error && <div className="border-b border-red-200 bg-red-50 px-5 py-2 text-sm text-red-700">{error}</div>}
            {activeStage === "BRIEF" && (
              <BriefStage project={currentProject} input={briefInput} setInput={setBriefInput} onSend={postBriefAnswer} isLoading={isLoading} onGenerateBlueprint={generateBlueprint} />
            )}
            {activeStage === "BLUEPRINT" && (
              <BlueprintStage
                project={currentProject}
                selectedLens={selectedLens}
                setSelectedLens={setSelectedLens}
                onGenerate={generateBlueprint}
                onRunLens={runLens}
                onApprove={approveBlueprint}
                isLoading={isLoading}
              />
            )}
            {activeStage === "DESIGN" && (
              <DesignStage
                project={currentProject}
                selectedPalette={selectedPalette}
                selectedFont={selectedFont}
                setSelectedPalette={setSelectedPalette}
                setSelectedFont={setSelectedFont}
                onGenerate={generateDesign}
                onApprove={approveDesign}
                isLoading={isLoading}
              />
            )}
            {activeStage === "WORKFLOW" && (
              <WorkflowStageView
                project={currentProject}
                activePhase={activePhase}
                setActivePhase={setActivePhase}
                copied={copied}
                onCopy={copyText}
                onGenerate={generateWorkflow}
                onRate={ratePhase}
                ratingFeedback={ratingFeedback}
                setRatingFeedback={setRatingFeedback}
                isLoading={isLoading}
              />
            )}
            {decision && <DecisionGateOverlay decision={decision} onResolve={resolveDecision} />}
          </>
        )}
      </section>
    </main>
  );
}

function WorkspaceSidebar({
  projects,
  currentProject,
  search,
  onSearch,
  onNewPlan,
  onLoad,
  graph,
  open,
}: {
  projects: Project[];
  currentProject: Project | null;
  search: string;
  onSearch: (value: string) => void;
  onNewPlan: () => void;
  onLoad: (id: string) => void;
  graph: SessionGraph;
  open: boolean;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] transition-transform md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-[52px] items-center justify-between border-b border-[rgba(0,0,0,0.07)] px-4">
        <Link href="/workspace" className="text-[15px] font-semibold tracking-[-0.02em]">
          Archon
        </Link>
        <button onClick={onNewPlan} title="New plan" className="grid h-7 w-7 place-items-center rounded-md border border-[#D4D4D4] text-[#4A4A4A] hover:border-black hover:bg-[#F5F5F5]">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-2 pb-2 pt-2">
        <button onClick={onNewPlan} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0A0A0A] text-[13px] font-medium text-white hover:bg-[#1A1A1A]">
          <Plus className="h-4 w-4" /> New Plan
        </button>
      </div>
      <nav className="border-b border-[rgba(0,0,0,0.07)] px-2 pb-2">
        {navLinks.map((item) => (
          <Link key={item.href} href={item.href} className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-[#4A4A4A] hover:bg-[rgba(10,10,10,0.05)] hover:text-black">
            <item.icon className="h-3.5 w-3.5 text-[#8A8A8A]" /> {item.label}
          </Link>
        ))}
        <Link href="/workspace/settings" className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-[#4A4A4A] hover:bg-[rgba(10,10,10,0.05)] hover:text-black">
          <Settings className="h-3.5 w-3.5 text-[#8A8A8A]" /> Settings
        </Link>
      </nav>

      {currentProject && (
        <div className="border-b border-[rgba(0,0,0,0.07)] px-4 py-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Pipeline Status</div>
          <StageMiniMap graph={graph} />
        </div>
      )}

      <div className="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Plans</div>
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#C0C0C0]" />
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search plans..." className="h-9 w-full rounded-lg border border-[#D4D4D4] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-black focus:ring-4 focus:ring-black/5" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {projects.length === 0 ? (
          <div className="p-4 text-center text-[13px] text-[#8A8A8A]">No plans yet</div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onLoad(project.id)}
              className={cn(
                "relative mb-1 min-h-[52px] w-full rounded-lg px-2.5 py-2 text-left hover:bg-[rgba(10,10,10,0.04)]",
                currentProject?.id === project.id && "bg-[rgba(10,10,10,0.07)] pl-3 before:absolute before:left-0 before:top-2 before:h-[36px] before:w-0.5 before:bg-black"
              )}
            >
              <div className="truncate text-[13px] font-medium">{project.title}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <StageBadge stage={normalizeStage(project.stage || project.activeStage)} />
                <span className="text-[11px] text-[#8A8A8A]">recent</span>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="border-t border-[rgba(0,0,0,0.07)] p-3">
        <button className="h-8 w-full rounded-md text-left text-[13px] text-[#8A8A8A] hover:text-[#DC2626]">Sign out</button>
      </div>
    </aside>
  );
}

function StageMiniMap({ graph }: { graph: SessionGraph }) {
  return (
    <div className="space-y-1">
      {WORKFLOW_STAGES.map((stage, index) => {
        const done = graph.completedStages.includes(stage.id) || (stage.id === "BRIEF" && graph.briefPack.validated);
        const active = graph.currentStage === stage.id;
        return (
          <div key={stage.id}>
            <div className="flex items-center gap-2 text-[12px]">
              <span
                className={cn("grid h-4 w-4 place-items-center rounded-full text-[9px] text-white", active && "animate-pulse")}
                style={{ backgroundColor: done ? "#16A34A" : active ? stage.color : "#D4D4D4" }}
              >
                {done ? "✓" : ""}
              </span>
              <span className={cn("font-medium", active ? "text-black" : done ? "text-[#4A4A4A]" : "text-[#8A8A8A]")}>{stage.label.toUpperCase()}</span>
            </div>
            {index < WORKFLOW_STAGES.length - 1 && <div className="ml-2 h-4 border-l border-[#E5E5E5]" />}
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ onNewPlan, isLoading }: { onNewPlan: () => void; isLoading: boolean }) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-[400px] text-center">
        <Wand2 className="mx-auto h-8 w-8 text-[#D4D4D4]" />
        <h1 className="mt-4 text-[24px] font-light tracking-[-0.02em]">What are you building?</h1>
        <p className="mx-auto mt-2 max-w-[320px] text-[14px] leading-[1.6] text-[#8A8A8A]">
          Describe your idea. I will ask 6 focused questions to define your project, then generate a complete architecture, design system, and prompt workflow.
        </p>
        <button onClick={onNewPlan} disabled={isLoading} className="mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-black px-6 text-[14px] font-medium text-white disabled:opacity-40">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Start a new plan
        </button>
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#E5E5E5]" />
          <span className="text-[12px] font-medium text-[#C0C0C0]">or</span>
          <span className="h-px flex-1 bg-[#E5E5E5]" />
        </div>
        <Link href="/templates" className="inline-flex h-9 items-center rounded-full border border-[#D4D4D4] px-6 text-[14px] font-medium">
          Browse Templates
        </Link>
      </div>
    </div>
  );
}

function StageBar({
  project,
  activeStage,
  setActiveStage,
  onGenerateBlueprint,
  onRunAllLenses,
}: {
  project: Project;
  activeStage: WorkflowStage;
  setActiveStage: (stage: WorkflowStage) => void;
  onGenerateBlueprint: () => void;
  onRunAllLenses: () => void;
}) {
  const graph = project.sessionGraph;
  const annotations = [...graph.blueprintAnnotations.product, ...graph.blueprintAnnotations.architecture, ...graph.blueprintAnnotations.design];
  const resolved = annotations.filter((item) => item.resolved).length;
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.07)] bg-white px-5">
      <div className="flex items-center gap-2 overflow-x-auto">
        {WORKFLOW_STAGES.map((stage, index) => {
          const done = graph.completedStages.includes(stage.id) || (stage.id === "BRIEF" && graph.briefPack.validated);
          const locked = index > 0 && !graph.completedStages.includes(WORKFLOW_STAGES[index - 1].id) && !(stage.id === "BLUEPRINT" && graph.briefPack.validated);
          return (
            <button key={stage.id} onClick={() => !locked && setActiveStage(stage.id)} disabled={locked} className="flex items-center gap-2 whitespace-nowrap text-[12px] font-medium disabled:cursor-not-allowed">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] text-white" style={{ backgroundColor: done ? "#16A34A" : activeStage === stage.id ? stage.color : "#D4D4D4" }}>
                {done ? "✓" : ""}
              </span>
              <span style={{ color: activeStage === stage.id ? stage.color : done ? "#4A4A4A" : "#8A8A8A", fontWeight: activeStage === stage.id ? 600 : 500 }}>{stage.label.toUpperCase()}</span>
              {index < WORKFLOW_STAGES.length - 1 && <span className="h-px w-6 bg-[#E5E5E5]" />}
            </button>
          );
        })}
      </div>
      <div className="hidden items-center gap-2 text-[13px] font-medium text-[#8A8A8A] sm:flex">
        {activeStage === "BRIEF" && `Question ${Math.min(graph.briefPack.currentQuestion + 1, 6)} of 6`}
        {activeStage === "BLUEPRINT" && (
          <>
            {resolved} of {annotations.length || 0} annotations resolved
            <button onClick={graph.blueprint ? onRunAllLenses : onGenerateBlueprint} className="ml-2 inline-flex h-8 items-center gap-1 rounded-md px-2 text-black hover:bg-[#F5F5F5]">
              <Sparkles className="h-3.5 w-3.5" /> {graph.blueprint ? "Run All Lenses" : "Generate Blueprint"}
            </button>
          </>
        )}
        {activeStage === "WORKFLOW" && project.readiness.workflow && <span className="rounded-full bg-[#16A34A] px-2 py-1 text-[11px] font-semibold text-white">Pipeline complete</span>}
      </div>
    </div>
  );
}

function BriefStage({ project, input, setInput, onSend, isLoading, onGenerateBlueprint }: { project: Project; input: string; setInput: (value: string) => void; onSend: () => void; isLoading: boolean; onGenerateBlueprint: () => void }) {
  const pack = project.briefPack || createEmptyBriefPack();
  const answered = BRIEF_QUESTIONS.filter((question) => pack.answers[question.id]).length;
  const current = BRIEF_QUESTIONS[Math.min(pack.currentQuestion, 5)];
  const validation = pack.validation;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <AiBubble label={`QUESTION ${Math.min(pack.currentQuestion + 1, 6)} OF 6`}>{answered === 0 ? "Tell me what you want to build. Give me the core idea; one or two sentences is fine." : current.question}</AiBubble>
          {BRIEF_QUESTIONS.map((question, index) =>
            pack.answers[question.id] ? (
              <div key={question.id} className="space-y-4">
                <UserBubble>{pack.answers[question.id]}</UserBubble>
                {index < 5 && <AiBubble label={`QUESTION ${index + 2} OF 6`}>{BRIEF_QUESTIONS[index + 1].question}</AiBubble>}
              </div>
            ) : null
          )}
          {answered >= 3 && <div className="rounded-lg border border-[#7C3AED]/15 bg-[#7C3AED]/[0.06] px-4 py-2 text-[13px] text-[#7C3AED]">Brief Pack is building on the right.</div>}
          {isLoading && <AiBubble><span className="inline-flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4D4D4]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4D4D4] [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4D4D4] [animation-delay:240ms]" /></span></AiBubble>}
        </div>
        <div className="border-t border-[rgba(0,0,0,0.07)] bg-white px-5 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                }
              }}
              placeholder={current.placeholder}
              className="max-h-40 min-h-11 flex-1 resize-y rounded-xl border border-transparent bg-[#F5F5F5] px-3.5 py-2.5 text-[14px] leading-[1.55] outline-none focus:border-black focus:bg-white"
            />
            <button onClick={onSend} disabled={!input.trim() || isLoading} className="grid h-9 w-9 place-items-center rounded-lg bg-black text-white disabled:bg-[#F5F5F5] disabled:text-[#C0C0C0]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-1.5 text-center text-[11px] text-[#C0C0C0]">Enter to send. Shift+Enter for new line.</div>
        </div>
      </div>
      {answered > 0 && (
        <aside className="hidden w-[280px] shrink-0 overflow-y-auto border-l border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-4 lg:block">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold">Brief Pack</h2>
            <span className="text-[11px] text-[#8A8A8A]">{pack.validated ? "Ready" : `${answered} of 6`}</span>
          </div>
          {BRIEF_QUESTIONS.map((question) => (
            <div key={question.id} className={cn("relative mb-2 rounded-lg border bg-white p-3", pack.answers[question.id] ? "border-[rgba(0,0,0,0.07)]" : "border-dashed border-[#E5E5E5]")}>
              {pack.answers[question.id] && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#16A34A]" />}
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">{question.label}</div>
              <p className="text-[13px] leading-[1.5] text-[#0A0A0A]">{pack.answers[question.id] || "-"}</p>
            </div>
          ))}
          {answered >= 6 && (
            <div className="mt-4 border-t border-[rgba(0,0,0,0.07)] pt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Brief Validation</div>
              <ValidationRow label="Problem defined" ok={validation.problemDefined} reason={validation.reasons.problemDefined} />
              <ValidationRow label="Target user specific" ok={validation.targetUserSpecific} reason={validation.reasons.targetUserSpecific} />
              <ValidationRow label="Success measurable" ok={validation.successMeasurable} reason={validation.reasons.successMeasurable} />
              <ValidationRow label="Scope bounded" ok={validation.scopeBounded} reason={validation.reasons.scopeBounded} />
              <button onClick={onGenerateBlueprint} disabled={!pack.validated || isLoading} className="mt-4 h-9 w-full rounded-lg bg-black text-[13px] font-medium text-white disabled:opacity-40">
                Advance to Blueprint
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

function AiBubble({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex max-w-[72%] gap-2.5">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-[#F5F5F5] text-[11px] font-bold text-[#8A8A8A]">A</div>
      <div className="rounded-[4px_12px_12px_12px] border border-[rgba(0,0,0,0.08)] bg-white px-3.5 py-3 text-[14px] leading-[1.6]">
        {label && <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7C3AED]">{label}</div>}
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto flex max-w-[72%] flex-row-reverse gap-2.5">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black text-[11px] font-bold text-white">U</div>
      <div className="rounded-[12px_12px_4px_12px] bg-black px-3.5 py-3 text-[14px] leading-[1.6] text-white">{children}</div>
    </div>
  );
}

function ValidationRow({ label, ok, reason }: { label: string; ok: boolean; reason?: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-[12px] font-medium">
        <span>{label}</span>
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /> : <X className="h-3.5 w-3.5 text-[#DC2626]" />}
      </div>
      {!ok && reason && <div className="mt-0.5 text-[11px] text-[#DC2626]">{reason}</div>}
    </div>
  );
}

function BlueprintStage({ project, selectedLens, setSelectedLens, onGenerate, onRunLens, onApprove, isLoading }: { project: Project; selectedLens: "product" | "architecture" | "design"; setSelectedLens: (lens: "product" | "architecture" | "design") => void; onGenerate: () => void; onRunLens: (lens: "PRODUCT" | "ARCHITECTURE" | "DESIGN") => void; onApprove: () => void; isLoading: boolean }) {
  const graph = project.sessionGraph;
  const blueprint = graph.blueprint;
  const allAnnotations = blueprint ? [...graph.blueprintAnnotations.product, ...graph.blueprintAnnotations.architecture, ...graph.blueprintAnnotations.design] : [];
  const criticalOpen = allAnnotations.some((annotation) => annotation.severity === "critical" && !annotation.resolved);

  if (!blueprint) {
    return (
      <div className="grid flex-1 place-items-center p-8">
        <div className="max-w-sm text-center">
          <Layers className="mx-auto h-8 w-8 text-[#D4D4D4]" />
          <h2 className="mt-4 text-[24px] font-light tracking-[-0.02em]">Generate your Blueprint</h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#8A8A8A]">The validated Brief Pack becomes a 31-section plan, then three specialist lenses review it.</p>
          <button onClick={onGenerate} disabled={isLoading} className="mt-6 h-9 rounded-lg bg-black px-5 text-[13px] font-medium text-white disabled:opacity-40">
            {isLoading ? "Generating..." : "Generate 31-section plan"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 overflow-y-auto p-6">
        <h1 className="text-[24px] font-light tracking-[-0.02em]">{blueprint.title}</h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">{blueprint.summary}</p>
        <div className="sticky top-0 z-10 mt-5 flex h-10 gap-2 overflow-x-auto border-b border-[rgba(0,0,0,0.07)] bg-white py-1">
          {["All", "Strategy", "Architecture", "Design", "Technical", "Operations", "Legal"].map((category) => (
            <span key={category} className="inline-flex h-7 shrink-0 items-center rounded-full border border-[#D4D4D4] px-3 text-[12px] font-semibold text-[#4A4A4A]">{category}</span>
          ))}
        </div>
        <div className="mt-3">
          {blueprint.sections.map((section) => {
            const sectionAnnotations = allAnnotations.filter((annotation) => annotation.sectionNumber === section.number);
            return <BlueprintSectionItem key={section.number} section={section} annotations={sectionAnnotations} />;
          })}
        </div>
      </div>
      <aside className="min-h-0 overflow-y-auto border-l border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold">Lens Review</h2>
          <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[11px] font-semibold text-[#4A4A4A]">{allAnnotations.length}</span>
        </div>
        <div className="grid grid-cols-3 rounded-lg bg-[#F0F0F0] p-1">
          {(["product", "architecture", "design"] as const).map((lens) => (
            <button key={lens} onClick={() => setSelectedLens(lens)} className={cn("h-8 rounded-md text-[12px] font-medium capitalize", selectedLens === lens && "bg-white shadow-sm")}>
              {lens === "architecture" ? "Arch" : lens}
            </button>
          ))}
        </div>
        <LensPanel lens={selectedLens} annotations={graph.blueprintAnnotations[selectedLens]} onRun={() => onRunLens(selectedLens.toUpperCase() as "PRODUCT" | "ARCHITECTURE" | "DESIGN")} isLoading={isLoading} />
        <div className="sticky bottom-0 mt-6 border-t border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] pt-3">
          <div className="mb-2 text-[12px] text-[#8A8A8A]">{allAnnotations.length} annotations total. {allAnnotations.filter((a) => a.severity === "critical").length} critical.</div>
          <button onClick={onApprove} disabled={criticalOpen || isLoading} className="h-9 w-full rounded-lg bg-black text-[13px] font-medium text-white disabled:opacity-40">
            Approve Blueprint
          </button>
        </div>
      </aside>
    </div>
  );
}

function BlueprintSectionItem({ section, annotations }: { section: BlueprintPlan["sections"][number]; annotations: BlueprintAnnotation[] }) {
  return (
    <details className="border-b border-[rgba(0,0,0,0.07)] py-1">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 hover:bg-[#FAFAFA]">
        <span className="min-w-6 text-[11px] font-semibold text-[#C0C0C0]">{section.number}</span>
        <span className="flex-1 text-[14px] font-medium">{section.title}</span>
        {annotations.length > 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">{annotations.length}</span>}
        <ChevronDown className="h-3.5 w-3.5 text-[#C0C0C0]" />
      </summary>
      <div className="px-4 pb-4 pl-14 pt-2 text-[14px] leading-[1.65] text-[#4A4A4A]">
        {section.content}
        {annotations.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Lens annotations</div>
            {annotations.map((annotation) => <AnnotationCard key={annotation.id} annotation={annotation} />)}
          </div>
        )}
      </div>
    </details>
  );
}

function AnnotationCard({ annotation }: { annotation: BlueprintAnnotation }) {
  const color = annotation.severity === "critical" ? "#DC2626" : annotation.severity === "warning" ? "#D97706" : "#2563EB";
  return (
    <div className="rounded-r-md border-l-[3px] p-3" style={{ borderColor: color, backgroundColor: `${color}0F` }}>
      <div className="mb-1 flex gap-2">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ backgroundColor: `${color}1A`, color }}>{annotation.severity}</span>
        <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#4A4A4A]">{annotation.lens}</span>
        {annotation.resolved && <span className="ml-auto text-[11px] font-semibold text-[#16A34A]">Resolved</span>}
      </div>
      <p className="text-[13px] leading-[1.55] text-black">{annotation.concern}</p>
      <p className="mt-1 text-[12px] text-[#4A4A4A]"><span className="font-semibold text-[#8A8A8A]">Suggested fix:</span> {annotation.suggestedFix}</p>
    </div>
  );
}

function LensPanel({ lens, annotations, onRun, isLoading }: { lens: string; annotations: BlueprintAnnotation[]; onRun: () => void; isLoading: boolean }) {
  if (!annotations?.length) {
    return (
      <div className="mt-10 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-[#D4D4D4]" />
        <p className="mt-2 text-[13px] text-[#8A8A8A]">Not run yet</p>
        <button onClick={onRun} disabled={isLoading} className="mt-4 h-9 w-full rounded-lg border border-[#D4D4D4] bg-white text-[13px] font-medium disabled:opacity-40">
          Run {lens === "architecture" ? "Architecture" : lens[0].toUpperCase() + lens.slice(1)} Lens
        </button>
      </div>
    );
  }
  return (
    <div className="mt-4 space-y-2">
      {annotations.map((annotation) => (
        <div key={annotation.id} className="flex gap-2 rounded-lg bg-white p-3 text-left">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: annotation.severity === "critical" ? "#DC2626" : annotation.severity === "warning" ? "#D97706" : "#2563EB" }} />
          <div className="min-w-0">
            <div className="text-[11px] text-[#8A8A8A]">Section {annotation.sectionNumber}</div>
            <div className="text-[13px] font-medium">{annotation.concern}</div>
          </div>
          {annotation.resolved ? <Check className="ml-auto h-3.5 w-3.5 text-[#16A34A]" /> : <AlertTriangle className="ml-auto h-3.5 w-3.5 text-[#D97706]" />}
        </div>
      ))}
    </div>
  );
}

function DesignStage({ project, selectedPalette, selectedFont, setSelectedPalette, setSelectedFont, onGenerate, onApprove, isLoading }: { project: Project; selectedPalette: string; selectedFont: string; setSelectedPalette: (id: string) => void; setSelectedFont: (id: string) => void; onGenerate: () => void; onApprove: () => void; isLoading: boolean }) {
  const options = project.sessionGraph.designOptions;
  if (!options) {
    return (
      <div className="grid flex-1 place-items-center p-8">
        <div className="max-w-sm text-center">
          <Palette className="mx-auto h-8 w-8 text-[#D4D4D4]" />
          <h2 className="mt-4 text-[24px] font-light tracking-[-0.02em]">Generate Design Canvas</h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#8A8A8A]">Create 3 palettes and 3 font pairs from the approved Brief and Blueprint.</p>
          <button onClick={onGenerate} disabled={isLoading} className="mt-6 h-9 rounded-lg bg-black px-5 text-[13px] font-medium text-white disabled:opacity-40">
            {isLoading ? "Generating..." : "Generate design options"}
          </button>
        </div>
      </div>
    );
  }
  const palette = options.palettes.find((item) => item.id === selectedPalette);
  const font = options.fonts.find((item) => item.id === selectedFont);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[760px] px-6 py-6">
        <div className="rounded-xl border border-[#0891B2]/15 bg-[#0891B2]/[0.05] p-4">
          <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-[#0891B2]"><Sparkles className="h-3.5 w-3.5" /> Based on your brief</div>
          <p className="text-[13px] leading-[1.55] text-[#4A4A4A]">{options.contextNote}</p>
        </div>
        <OptionHeader title="Color Palette" meta="3 options. Select one" />
        <div className="grid gap-3 md:grid-cols-3">
          {options.palettes.map((item) => <PaletteCard key={item.id} option={item} selected={selectedPalette === item.id} onSelect={() => setSelectedPalette(item.id)} />)}
        </div>
        <OptionHeader title="Font Pairing" meta="3 options. Select one" className="mt-8" />
        <div className="grid gap-3 md:grid-cols-3">
          {options.fonts.map((item) => <FontCard key={item.id} option={item} selected={selectedFont === item.id} onSelect={() => setSelectedFont(item.id)} />)}
        </div>
      </div>
      <div className="sticky bottom-0 flex items-center justify-between border-t border-[rgba(0,0,0,0.07)] bg-white px-6 py-4">
        <div className="text-[13px] text-[#8A8A8A]">{palette && font ? `Palette: ${palette.name}. Fonts: ${font.name}` : "Select a palette and font pair to continue"}</div>
        <button onClick={onApprove} disabled={!palette || !font || isLoading} className="h-9 rounded-lg bg-black px-5 text-[13px] font-medium text-white disabled:opacity-40">Approve Design</button>
      </div>
    </div>
  );
}

function OptionHeader({ title, meta, className }: { title: string; meta: string; className?: string }) {
  return <div className={cn("mb-4 mt-6 flex items-center justify-between", className)}><h2 className="text-[18px] font-medium tracking-[-0.01em]">{title}</h2><span className="text-[12px] text-[#8A8A8A]">{meta}</span></div>;
}

function PaletteCard({ option, selected, onSelect }: { option: DesignOptionsPayload["palettes"][number]; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={cn("relative rounded-xl border bg-white p-4 text-left transition hover:-translate-y-px hover:shadow-sm", selected ? "border-2 border-black shadow-[0_0_0_3px_rgba(10,10,10,0.08)]" : "border-[#D4D4D4]")}>
      {selected && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-black text-white"><Check className="h-3 w-3" /></span>}
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">{option.id.replace("palette-", "Option ").toUpperCase()}</div>
      <div className="flex overflow-hidden rounded-md">{Object.values(option.colors).slice(0, 5).map((color) => <span key={color} className="h-8 flex-1" style={{ backgroundColor: color }} title={color} />)}</div>
      <div className="mt-2 text-[13px] font-semibold">{option.name}</div>
      <div className="text-[12px] text-[#8A8A8A]">{option.vibe}</div>
      <div className="mt-3 border-t border-[rgba(0,0,0,0.07)] pt-3" style={{ color: option.colors.text }}>
        <div className="rounded-lg border p-2" style={{ backgroundColor: option.colors.surface, borderColor: option.colors.border }}>
          <div className="text-[14px] font-medium">Preview heading</div>
          <div className="mt-1 text-[12px]" style={{ color: option.colors.secondary }}>Body text with a working control.</div>
          <span className="mt-2 inline-flex h-6 items-center rounded-md px-2 text-[11px]" style={{ backgroundColor: option.colors.accent, color: option.colors.buttonText }}>Button</span>
        </div>
      </div>
    </button>
  );
}

function FontCard({ option, selected, onSelect }: { option: DesignOptionsPayload["fonts"][number]; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={cn("relative rounded-xl border bg-white p-4 text-left transition hover:-translate-y-px hover:shadow-sm", selected ? "border-2 border-black shadow-[0_0_0_3px_rgba(10,10,10,0.08)]" : "border-[#D4D4D4]")}>
      {selected && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-black text-white"><Check className="h-3 w-3" /></span>}
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">{option.id.replace("font-", "Pair ")}</div>
      <div className="text-[20px] font-medium">{option.heading}</div>
      <div className="mt-1 text-[13px] leading-[1.5] text-[#4A4A4A]">The quick brown fox defines a precise project workflow.</div>
      <div className="mt-3 text-[12px] font-semibold">Heading: {option.heading}</div>
      <div className="text-[12px] text-[#4A4A4A]">Body: {option.body}</div>
      <div className="mt-2 flex flex-wrap gap-1">{option.tags.map((tag) => <span key={tag} className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[11px] text-[#8A8A8A]">{tag}</span>)}</div>
    </button>
  );
}

function WorkflowStageView({ project, activePhase, setActivePhase, copied, onCopy, onGenerate, onRate, ratingFeedback, setRatingFeedback, isLoading }: { project: Project; activePhase: number; setActivePhase: (phase: number) => void; copied: string | null; onCopy: (id: string, text: string) => void; onGenerate: () => void; onRate: (phase: WorkflowPhase, rating: "PERFECT" | "NEEDS_EDIT" | "DIDNT_WORK") => void; ratingFeedback: string; setRatingFeedback: (value: string) => void; isLoading: boolean }) {
  const phases = project.workflowPhases || [];
  const phase = phases.find((item) => item.number === activePhase) || phases[0];
  if (!phases.length) {
    return (
      <div className="grid flex-1 place-items-center p-8">
        <div className="max-w-sm text-center">
          <FileText className="mx-auto h-8 w-8 text-[#D4D4D4]" />
          <h2 className="mt-4 text-[24px] font-light tracking-[-0.02em]">Generate Workflow Phases</h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-[#8A8A8A]">Turn the approved Brief, Blueprint, and Design Choices into 5-8 copy-ready prompts.</p>
          <button onClick={onGenerate} disabled={isLoading} className="mt-6 h-9 rounded-lg bg-black px-5 text-[13px] font-medium text-white disabled:opacity-40">
            {isLoading ? "Generating..." : "Generate workflow"}
          </button>
        </div>
      </div>
    );
  }
  const allText = phases.map((item) => `# Phase ${item.number}: ${item.title}\n\n${item.prompt}`).join("\n\n---\n\n");
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-[52px] items-center justify-between border-b border-[rgba(0,0,0,0.07)] px-5">
        <div className="text-[12px] font-medium text-[#8A8A8A]">Optimized for: <span className="rounded-lg border border-[#D4D4D4] px-3 py-1.5 text-[13px] font-medium text-black">{phase?.tool || "Cursor"}</span></div>
        <div className="flex gap-2">
          <button onClick={() => onCopy("all", allText)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D4D4D4] px-3 text-[13px]"><Layers className="h-3.5 w-3.5" /> {copied === "all" ? "Copied All" : "Copy All"}</button>
          <button onClick={() => onCopy("json", JSON.stringify(phases, null, 2))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D4D4D4] px-3 text-[13px]"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-2">
          <div className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Phases</div>
          {phases.map((item) => (
            <button key={item.number} onClick={() => setActivePhase(item.number)} className={cn("mb-1 min-h-[52px] w-full rounded-lg p-2 text-left hover:bg-[rgba(10,10,10,0.04)]", item.number === activePhase && "border border-[#059669]/20 bg-[#059669]/[0.06]")}>
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-black text-[10px] font-bold text-white">{item.number}</span>
                <span className="truncate text-[13px] font-medium">{item.title}</span>
              </div>
              <div className="mt-1 text-[11px] text-[#8A8A8A]">Est: {item.estimate}</div>
            </button>
          ))}
          <button className="mt-3 h-8 w-full rounded-lg border border-dashed border-[#D4D4D4] text-[13px] text-[#8A8A8A]">+ Add custom phase</button>
        </aside>
        {phase && (
          <section className="min-w-0 overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#059669] text-[15px] font-bold text-white">{phase.number}</span>
                <h1 className="mt-3 text-[24px] font-light tracking-[-0.02em]">{phase.title}</h1>
                <p className="mt-1 text-[13px] text-[#8A8A8A]">Est: {phase.estimate}. Tool: {phase.tool}</p>
              </div>
              <button onClick={() => onCopy(`phase-${phase.number}`, phase.prompt)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-black px-3 text-[13px] font-medium text-white"><Copy className="h-3.5 w-3.5" /> {copied === `phase-${phase.number}` ? "Copied" : "Copy"}</button>
            </div>
            <pre className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-[#0A0A0A] p-5 font-mono text-[13px] leading-[1.75] text-white/85">{phase.prompt}</pre>
            <div className="mt-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-4">
              <div className="mb-2 text-[13px] font-semibold">Modify this phase</div>
              <textarea className="min-h-16 w-full rounded-lg border border-[#D4D4D4] bg-white px-3 py-2 text-[14px] outline-none focus:border-black" placeholder="Describe changes... e.g. use Vue instead of React" />
              <button className="mt-2 h-8 rounded-lg bg-black px-3 text-[13px] font-medium text-white">Apply Modification</button>
            </div>
            <div className="mt-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] text-[#8A8A8A]">How did this prompt perform?</span>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => onRate(phase, "PERFECT")} className="h-7 rounded-full border border-[#16A34A] bg-[#16A34A]/10 px-3 text-[12px] font-medium text-[#16A34A]"><ThumbsUp className="mr-1 inline h-3 w-3" /> Worked</button>
                  <button onClick={() => onRate(phase, "NEEDS_EDIT")} className="h-7 rounded-full border border-[#D97706] bg-[#D97706]/10 px-3 text-[12px] font-medium text-[#D97706]">Needed edits</button>
                  <button onClick={() => onRate(phase, "DIDNT_WORK")} className="h-7 rounded-full border border-[#DC2626] bg-[#DC2626]/10 px-3 text-[12px] font-medium text-[#DC2626]"><ThumbsDown className="mr-1 inline h-3 w-3" /> Did not work</button>
                </div>
              </div>
              <textarea value={ratingFeedback} onChange={(event) => setRatingFeedback(event.target.value)} placeholder="Optional feedback" className="mt-3 min-h-10 w-full rounded-lg border border-[#D4D4D4] bg-white px-3 py-2 text-[13px] outline-none focus:border-black" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DecisionGateOverlay({ decision, onResolve }: { decision: DecisionGate; onResolve: (decision: DecisionGate, optionId: string) => void }) {
  const [selected, setSelected] = useState("");
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-white/95 backdrop-blur-sm">
      <div className="w-[min(480px,90%)] rounded-2xl border border-black/10 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.07)] pb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#DC2626]">Decision Required</div>
          <div className="text-[11px] text-[#8A8A8A]">Flagged by: {decision.source}</div>
        </div>
        <h2 className="py-4 text-[18px] font-normal leading-[1.5]">{decision.question}</h2>
        {decision.context && <div className="mb-4 border-l-4 border-[#D4D4D4] pl-3 text-[13px] italic text-[#4A4A4A]">{decision.context}</div>}
        <div className="space-y-2">
          {decision.options.map((option) => (
            <button key={option.id} onClick={() => setSelected(option.id)} className={cn("w-full rounded-lg border p-3 text-left", selected === option.id ? "border-2 border-black bg-black/[0.03]" : "border-[#D4D4D4]")}>
              <div className="text-[14px] font-medium">{option.title}</div>
              <div className="mt-1 text-[12px] text-[#8A8A8A]">{option.description}</div>
            </button>
          ))}
        </div>
        <button onClick={() => selected && onResolve(decision, selected)} disabled={!selected} className="mt-5 h-9 w-full rounded-lg bg-black text-[13px] font-medium text-white disabled:opacity-40">Confirm decision</button>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: WorkflowStage }) {
  return <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ backgroundColor: `${stageColors[stage]}1F`, color: stageColors[stage] }}>{stageLabels[stage]}</span>;
}
