"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, Send, ChevronLeft, History, FolderOpen, 
  Sparkles, User, Terminal, ShieldCheck, Clock, 
  CheckCircle2, FileText, Palette, Layers, 
  Copy, Check, Download, RefreshCcw, Edit3, HelpCircle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { useWorkspace, WorkflowStage } from "@/lib/context/WorkspaceContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  stage?: WorkflowStage;
}

export default function WorkspacePage() {
  const { data: session } = useSession();
  const { 
    history, currentProject, setCurrentProject, 
    activeStage, setActiveStage, saveProject, 
    isSidebarOpen, setSidebarOpen, resetWorkspace 
  } = useWorkspace();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "What are we building today? Describe your idea in plain English." }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-section">
        <div className="max-w-sm w-full text-center space-y-8">
          <div className="w-16 h-16 bg-black rounded-xl mx-auto shadow-2xl" />
          <h1 className="text-3xl font-serif tracking-tight">Access Command Center</h1>
          <p className="text-muted text-sm">Please sign in to save your orchestrations and access the full workflow engine.</p>
          <Button onClick={() => signIn()} className="w-full h-14 rounded-2xl shadow-xl">
            Sign In to SymphonyAI
          </Button>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated Workflow Progression Logic
    setTimeout(() => {
      let nextMsg = "";
      if (activeStage === 1) {
        nextMsg = "That sounds intriguing. To better structure the plan, I have 3 clarifying questions:\n\n1. Who is the primary audience?\n2. What is the single most critical feature?\n3. Do you have a preferred tech stack or design vibe?";
        setActiveStage(2);
      } else if (activeStage === 2) {
        nextMsg = "Perfect. I've synthesized your intent. Here is the project synopsis and core feature set. Please review them below.";
        setActiveStage(3);
        saveProject({ 
          title: userMsg.content.slice(0, 30), 
          idea: userMsg.content,
          synopsis: "A high-performance digital ecosystem focused on seamless user experience and scalable architecture.",
          features: JSON.stringify(["User Authentication", "Real-time Dashboard", "Secure API Gateway", "Responsive UI System"]),
          activeStage: 3
        });
      } else if (activeStage === 3) {
        nextMsg = "Based on the functional requirements, I've curated this design system. Does this align with your vision?";
        setActiveStage(4);
      } else if (activeStage === 4) {
        nextMsg = "Orchestration complete. I have generated a 5-phase execution plan with tool-specific prompts for each stage.";
        setActiveStage(5);
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: nextMsg, stage: activeStage }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="flex h-screen bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Focused Workspace History */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border-subtle flex flex-col bg-section shrink-0 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded-md" />
                <span className="text-sm font-semibold tracking-tight">SymphonyAI</span>
              </Link>
              <button onClick={resetWorkspace} className="p-2 hover:bg-white rounded-lg transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow px-2 overflow-y-auto no-scrollbar">
              <div className="text-[10px] uppercase tracking-widest text-muted px-4 py-4 font-bold flex items-center gap-2">
                <History className="w-3 h-3" /> Project History
              </div>
              <div className="space-y-0.5">
                {history.map((project) => (
                  <button 
                    key={project.id} 
                    onClick={() => {
                      setCurrentProject(project);
                      setActiveStage(project.activeStage);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-xs rounded-xl transition-all flex items-center gap-3",
                      currentProject?.id === project.id ? "bg-white shadow-sm text-primary font-medium" : "text-secondary hover:bg-white/50"
                    )}
                  >
                    <FolderOpen className={cn("w-3.5 h-3.5", currentProject?.id === project.id ? "text-primary" : "text-muted")} />
                    <span className="truncate">{project.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase">
                  {session.user?.name?.[0]}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-semibold truncate">{session.user?.name}</div>
                  <div className="text-[10px] text-muted truncate">{session.user?.email}</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <section className="flex-grow flex flex-col min-w-0 bg-white relative">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-6 z-50 p-1.5 bg-white border border-border-subtle rounded-lg shadow-sm hover:bg-section transition-all"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
        </button>

        {/* Workflow Progress Header */}
        <header className="h-20 border-b border-border-subtle flex items-center px-16 justify-center shrink-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  activeStage === s ? "bg-black text-white scale-110 shadow-lg" : 
                  activeStage > s ? "bg-green-100 text-green-700" : "bg-section text-muted"
                )}>
                  {activeStage > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 5 && <div className={cn("w-8 h-0.5 mx-1", activeStage > s ? "bg-green-200" : "bg-section")} />}
              </div>
            ))}
          </div>
          <div className="absolute right-8 text-[10px] uppercase tracking-widest font-bold text-muted">
            Stage {activeStage}
          </div>
        </header>

        {/* Single Conversation Flow */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 pb-32">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={cn("flex gap-6", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                    msg.role === "assistant" ? "bg-white border-border-subtle" : "bg-black text-white border-transparent"
                  )}>
                    {msg.role === "assistant" ? <Sparkles className="w-5 h-5 text-secondary" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-8 rounded-3xl text-sm leading-relaxed",
                    msg.role === "assistant" ? "bg-section/50 text-secondary border border-border-subtle" : "bg-black text-white shadow-xl"
                  )}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
                
                {/* Stage-Specific Inline Cards */}
                {msg.role === "assistant" && (
                  <div className="mt-8 ml-16 space-y-6">
                    {msg.stage === 2 && activeStage >= 3 && <SynopsisSection />}
                    {msg.stage === 3 && activeStage >= 4 && <DesignSection />}
                    {msg.stage === 4 && activeStage >= 5 && <ExecutionSection />}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-6 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-subtle flex items-center justify-center shrink-0">
                  <RefreshCcw className="w-4 h-4 text-muted animate-spin" />
                </div>
                <div className="bg-section/30 px-6 py-4 rounded-2xl flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i} 
                      animate={{ opacity: [0.3, 1, 0.3] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-muted rounded-full" 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unified Input Area */}
        <div className="p-8 border-t border-border-subtle bg-white z-40">
          <div className="max-w-3xl mx-auto">
            <div className="relative group bg-section/30 border border-border-subtle rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-primary transition-all overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={
                  activeStage === 1 ? "Describe what you want to build..." :
                  "Any adjustments or refinements?"
                }
                className="w-full min-h-[100px] max-h-[300px] p-6 text-sm outline-none resize-none bg-transparent"
              />
              <div className="px-6 py-4 flex items-center justify-between bg-white/50 border-t border-border-subtle">
                <div className="flex items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" /> Stage {activeStage} Flow
                </div>
                <button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-black text-white rounded-xl transition-all disabled:opacity-30 disabled:scale-95 shadow-xl"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SynopsisSection() {
  const { currentProject } = useWorkspace();
  const features = JSON.parse(currentProject?.features || '[]');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm space-y-6">
      <div className="flex justify-between items-start">
        <div className="text-[10px] uppercase tracking-widest font-bold text-muted flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" /> Project Synopsis
        </div>
        <button className="p-2 hover:bg-section rounded-lg transition-all"><Copy className="w-3.5 h-3.5 text-muted" /></button>
      </div>
      <p className="text-lg font-serif text-primary leading-tight">{currentProject?.synopsis}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 p-3 bg-section rounded-xl border border-border-subtle">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span className="text-xs font-medium text-secondary">{f}</span>
          </div>
        ))}
      </div>

      <Button size="sm" className="w-full h-12 rounded-xl gap-2 text-[10px] uppercase tracking-widest font-bold">
        Approve Blueprint <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </motion.div>
  );
}

function DesignSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border-subtle rounded-2xl p-8 shadow-sm space-y-8">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted flex items-center gap-2">
        <Palette className="w-3.5 h-3.5" /> Design System
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-4">
          {["#000000", "#FFFFFF", "#F5F5F5", "#E5E5E5"].map(c => (
            <div key={c} className="w-12 h-12 rounded-xl border border-border-subtle shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="p-4 bg-section rounded-xl border border-border-subtle">
           <div className="text-[9px] font-bold text-muted uppercase mb-1">Typography</div>
           <div className="text-lg font-serif">Instrument Serif + Geist Sans</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button size="sm" className="flex-grow h-12 rounded-xl gap-2 text-[10px] uppercase tracking-widest font-bold">
          Accept Design <Check className="w-3.5 h-3.5" />
        </Button>
        <Button variant="secondary" size="sm" className="h-12 rounded-xl border-border-subtle"><RefreshCcw className="w-3.5 h-3.5" /></Button>
      </div>
    </motion.div>
  );
}

function ExecutionSection() {
  return (
    <div className="space-y-4">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted px-2 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5" /> Phase-Based Prompts
      </div>
      
      {[
        { name: "Foundational Architecture", tool: "Claude", desc: "Setting up Next.js 15, Prisma schema, and core authentication logic." },
        { name: "Visual Token Implementation", tool: "Cursor", desc: "Translating the approved design system into Tailwind CSS utility tokens." },
        { name: "Core Feature Scaffolding", tool: "Claude", desc: "Building the high-priority functional nodes identified in Stage 3." }
      ].map((p, i) => (
        <div key={p.name} className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm group hover:border-black/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-primary">{i+1}. {p.name}</h4>
            <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-md">{p.tool}</div>
          </div>
          <p className="text-[11px] text-muted leading-relaxed mb-6">{p.desc}</p>
          <div className="flex gap-2">
            <Button size="sm" className="flex-grow h-10 rounded-lg gap-2 text-[9px] uppercase tracking-widest font-bold">
              Copy Prompt <Copy className="w-3 h-3" />
            </Button>
            <Button variant="secondary" size="sm" className="w-10 h-10 rounded-lg p-0 border-border-subtle">
              <Edit3 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}

      <Button className="w-full h-14 rounded-2xl gap-3 text-[10px] uppercase tracking-widest font-bold shadow-xl">
        Download design.md <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
