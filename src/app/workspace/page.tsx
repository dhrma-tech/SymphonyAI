"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Send, MoreVertical, Search, 
  Zap, Maximize2, Minimize2, ChevronLeft,
  CheckCircle2, Circle, Clock, Edit3, 
  Layers, Code, Smartphone, Layout, X,
  FileText, Sparkles, User, Palette, Terminal, ShieldCheck, History, FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { 
  Panel, 
  Group, 
  Separator 
} from "react-resizable-panels";
import { useWorkspace } from "@/lib/context/WorkspaceContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThinkingAnimation } from "@/components/shared/Thinking";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { SkillToolbox } from "@/components/shared/SkillToolbox";
import { ArtifactEngine } from "@/components/shared/ArtifactEngine";
import Link from "next/link";

type AgentRole = "orchestrator" | "architect" | "designer" | "security" | "user";

interface Message {
  id: string;
  role: AgentRole;
  content: string;
  isThinking?: boolean;
}

export default function WorkspacePage() {
  const { 
    isFocusMode, setFocusMode, 
    activePhase, setActivePhase, 
    isSidebarOpen, setSidebarOpen,
    history, currentProject, setCurrentProject 
  } = useWorkspace();
  
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [orchestrationProgress, setOrchestrationProgress] = useState(0);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSkills, setActiveSkills] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "orchestrator", content: "Welcome to the SymphonyAI Orchestrator. What project are we architecting today?" }
  ]);
  
  const [state, setState] = useState({
    idea: "",
    synopsis: "Awaiting your first orchestration command...",
    tech: "Next.js 15, Tailwind 4.0",
    tone: "Professional & Cinematic",
    audience: "Early Adopters",
    subTasks: [
      { name: "Analyzing intent", status: "pending" },
      { name: "Mapping data architecture", status: "pending" },
      { name: "Synthesizing visual tokens", status: "pending" },
      { name: "Generating project blueprint", status: "pending" }
    ]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setActiveSkills([]);

    // Trigger Multi-Agent Sequence
    simulateMultiAgentResponse(input);
  };

  const simulateMultiAgentResponse = async (idea: string) => {
    // 1. Architect Interjection
    const archThinking: Message = { id: "arch-think", role: "architect", content: "", isThinking: true };
    setMessages(prev => [...prev, archThinking]);
    
    await new Promise(r => setTimeout(r, 1500));
    setMessages(prev => [
      ...prev.filter(m => m.id !== "arch-think"),
      { id: "arch-1", role: "architect", content: "I've analyzed the data requirements. We'll need a relational schema for the user profiles and a high-performance cache for the real-time feeds." }
    ]);

    // 2. Designer Interjection
    const designThinking: Message = { id: "design-think", role: "designer", content: "", isThinking: true };
    setMessages(prev => [...prev, designThinking]);
    
    await new Promise(r => setTimeout(r, 2000));
    setMessages(prev => [
      ...prev.filter(m => m.id !== "design-think"),
      { id: "design-1", role: "designer", content: "From a UX perspective, let's lean into a high-contrast dark mode with glassmorphism. It will emphasize the premium nature of the platform." }
    ]);

    // 3. Orchestrator Synthesis
    startOrchestration();
  };

  const startOrchestration = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setOrchestrationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setActivePhase(2);
        setOrchestrationProgress(0);
        setState(prev => ({
          ...prev,
          synopsis: "A high-end SaaS ecosystem focused on seamless user onboarding and cinematic data visualization.",
          subTasks: prev.subTasks.map(t => ({ ...t, status: "completed" }))
        }));
        setMessages(prev => [...prev, { id: "orch-final", role: "orchestrator", content: "Synthesis complete. The project blueprint is now ready for your review in the control panel." }]);
      }
    }, 40);
  };

  return (
    <main className="flex h-screen bg-white overflow-hidden font-sans relative">
      <SkillToolbox 
        isOpen={isToolboxOpen} 
        onClose={() => setIsToolboxOpen(false)} 
        onInject={(skill) => {
          if (!activeSkills.find(s => s.id === skill.id)) setActiveSkills([...activeSkills, skill]);
          setIsToolboxOpen(false);
        }}
      />

      <ArtifactEngine 
        isOpen={isArtifactOpen} 
        onClose={() => setIsArtifactOpen(false)} 
        isStreaming={isStreaming}
      />

      {/* Sidebar with History */}
      <AnimatePresence>
        {!isFocusMode && isSidebarOpen && !isMobile && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border-subtle flex flex-col bg-section shrink-0 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-full" />
                <span className="text-base font-medium tracking-tight">SymphonyAI</span>
              </Link>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <nav className="flex-grow px-2 overflow-y-auto no-scrollbar">
              <div className="text-[10px] uppercase tracking-widest text-muted px-4 py-3 mb-1 font-bold flex items-center gap-2">
                <Clock className="w-3 h-3" /> Recent Projects
              </div>
              <div className="space-y-0.5">
                {history.length > 0 ? (
                  history.map((project) => (
                    <button 
                      key={project.id} 
                      onClick={() => setCurrentProject(project)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-xs rounded-xl transition-all group flex items-center gap-3",
                        currentProject?.id === project.id ? "bg-white shadow-sm text-primary font-semibold" : "text-secondary hover:bg-white/50"
                      )}
                    >
                      <FolderOpen className={cn("w-3.5 h-3.5", currentProject?.id === project.id ? "text-primary" : "text-muted")} />
                      <span className="truncate">{project.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <div className="text-[10px] text-muted font-medium italic">No past orchestrations</div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="text-[10px] uppercase tracking-widest text-muted px-4 py-3 mb-1 font-bold flex items-center gap-2">
                  <User className="w-3 h-3" /> Team Agents
                </div>
                {[
                  { name: "Lead Orchestrator", role: "orchestrator", color: "bg-black" },
                  { name: "System Architect", role: "architect", color: "bg-blue-600" },
                  { name: "Interface Designer", role: "designer", color: "bg-orange-500" },
                ].map((agent) => (
                  <div key={agent.name} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/50 transition-all cursor-default">
                    <div className={cn("w-1.5 h-1.5 rounded-full", agent.color)} />
                    <span className="text-[11px] font-medium text-secondary">{agent.name}</span>
                  </div>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-border-subtle bg-white/30">
               <div className="p-4 bg-black text-white rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black/90 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">U</div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Pro Account</div>
                      <div className="text-xs font-semibold">User Profile</div>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <section className="flex-grow flex flex-col bg-white overflow-hidden relative">
        {!isFocusMode && !isMobile && (
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-1 bg-white border border-border-subtle rounded-full shadow-sm hover:bg-section transition-all"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
          </button>
        )}

        {/* Header */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.header 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 64, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border-subtle flex items-center px-8 justify-between shrink-0 overflow-hidden bg-white/80 backdrop-blur-md z-40"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-tight">
                    {currentProject ? currentProject.title : "New Orchestration"}
                  </span>
                </div>
                <div className="h-4 w-px bg-border-subtle" />
                <div className="flex items-center gap-1">
                  {["Analyze", "Sync", "Plan", "Design", "Export"].map((phase, i) => (
                    <div key={phase} className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                      activePhase === i + 1 ? "bg-black text-white" : "text-muted"
                    )}>
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Resizable Workstation */}
        <div className="flex-grow">
          <Group orientation={isMobile ? "vertical" : "horizontal"}>
            {/* Chat Panel */}
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full flex flex-col items-center relative overflow-y-auto no-scrollbar">
                <div className="flex-grow w-full max-w-2xl px-6 py-12 space-y-8">
                  {messages.map((msg) => (
                    <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <ChatMessage message={msg} />
                    </div>
                  ))}
                </div>

                <div className="w-full max-w-3xl p-8 pt-0">
                  <div className="relative group bg-white border border-border-subtle rounded-[2rem] shadow-sm focus-within:shadow-md transition-all overflow-hidden">
                    {/* Active Skills Bar */}
                    <AnimatePresence>
                      {activeSkills.length > 0 && (
                        <div className="px-6 pt-4 flex flex-wrap gap-2">
                          {activeSkills.map(skill => (
                            <div key={skill.id} className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                              <Zap className="w-3 h-3" />
                              {skill.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Collaborate with your agent team..."
                      className="w-full min-h-[100px] p-6 text-sm outline-none resize-none bg-transparent"
                    />
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border-subtle bg-section/30">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setIsToolboxOpen(true)} className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center hover:scale-110 transition-all">
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={handleSend} className="p-3 bg-black text-white rounded-2xl transition-all">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Separator className="w-px bg-border-subtle hover:bg-black/20 transition-colors" />

            {/* Control Panel */}
            <Panel defaultSize={60} minSize={30}>
              <div className="h-full bg-section overflow-y-auto p-12 relative">
                {activePhase >= 2 && !isArtifactOpen && (
                  <button onClick={() => setIsArtifactOpen(true)} className="absolute right-10 top-10 z-30 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl shadow-2xl transition-all">
                    <FileText className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Show Artifacts</span>
                  </button>
                )}

                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-8 bg-white border border-border-subtle rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                      <ProgressRing progress={orchestrationProgress} size={100} />
                      <div className="mt-4 text-[10px] uppercase tracking-widest font-bold text-muted">Sync Status</div>
                    </div>
                    <div className="md:col-span-2 p-8 bg-white border border-border-subtle rounded-[2.5rem]">
                      <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-4">Team Synchronization</div>
                      <div className="flex gap-6">
                        {["Orchestrator", "Architect", "Designer"].map(a => (
                          <div key={a} className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-section border border-border-subtle flex items-center justify-center">
                              {a[0]}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BlueprintCard icon={Edit3} title="Project Synopsis" content={currentProject?.synopsis || state.synopsis} />
                    <BlueprintCard icon={Code} title="Technical Stack" content={state.tech} />
                    <BlueprintCard icon={Layout} title="Visual Tone" content={state.tone} />
                    <BlueprintCard icon={Smartphone} title="Target Audience" content={state.audience} />
                  </div>

                  {activePhase >= 2 && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => { setIsArtifactOpen(true); setIsStreaming(true); }} className="h-16 rounded-[1.5rem] gap-3 text-sm font-bold uppercase tracking-widest shadow-xl">
                        Generate Artifacts <Sparkles className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" className="h-16 rounded-[1.5rem] gap-3 text-sm font-bold uppercase tracking-widest border-border-subtle">
                        Refine Plan <History className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </section>
    </main>
  );
}

function BlueprintCard({ icon: Icon, title, content }: any) {
  return (
    <div className="p-8 bg-white border border-border-subtle rounded-[2.5rem] hover:shadow-warm transition-all group">
      <div className="w-10 h-10 bg-section rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-5 h-5 text-muted" />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-3">{title}</div>
      <p className="text-sm font-medium leading-relaxed text-secondary">{content}</p>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  
  const config = {
    orchestrator: { icon: Layers, color: "bg-black", label: "Orchestrator" },
    architect: { icon: Terminal, color: "bg-blue-600", label: "Architect" },
    designer: { icon: Palette, color: "bg-orange-500", label: "Designer" },
    security: { icon: ShieldCheck, color: "bg-green-600", label: "Security" },
    user: { icon: User, color: "bg-section", label: "You" }
  }[message.role];

  return (
    <div className={cn("flex gap-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg", config.color)}>
          <config.icon className="w-4 h-4" />
        </div>
      )}
      <div className="max-w-xl space-y-2">
        <div className={cn("text-[9px] font-bold uppercase tracking-widest text-muted px-1", isUser && "text-right")}>
          {config.label}
        </div>
        <div className={cn(
          "p-6 text-sm leading-relaxed relative",
          isUser ? "bg-black text-white rounded-3xl rounded-tr-none shadow-xl" : "bg-white border border-border-subtle rounded-3xl rounded-tl-none shadow-sm"
        )}>
          {message.isThinking ? (
            <div className="flex gap-1.5 py-1">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.3, 1, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-muted rounded-full" 
                />
              ))}
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-section border border-border-subtle flex items-center justify-center text-muted shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
