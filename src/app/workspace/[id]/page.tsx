"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Plus, Send, MoreVertical, Search, 
  Zap, Maximize2, Minimize2, ChevronLeft
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
import Link from "next/link";

export default function DynamicWorkspacePage() {
  const { id } = useParams();
  const { isFocusMode, setFocusMode, activePhase, setActivePhase, isSidebarOpen, setSidebarOpen } = useWorkspace();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [state, setState] = useState({
    title: "Untitled Project",
    idea: "",
    synopsis: "",
    features: [] as string[],
    design: { palette: [], fonts: [] },
    phases: [],
    step: 1,
    status: ""
  });

  // Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Data Hydration from DB
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/workspace/${id}`);
        if (res.ok) {
          const data = await res.json();
          setState({
            ...data,
            features: data.features ? JSON.parse(data.features) : [],
            design: data.design ? JSON.parse(data.design) : { palette: [], fonts: [] },
            phases: data.phases ? JSON.parse(data.phases) : []
          });
          setActivePhase(data.activePhase);
        }
      } catch (error) {
        console.error("Failed to hydrate project:", error);
      }
    }
    if (id) fetchProject();
  }, [id, setActivePhase]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsTyping(true);
    
    // Simulate AI update
    const updatedIdea = input;
    setInput("");
    
    setTimeout(async () => {
      setIsTyping(false);
      setActivePhase(2);
      // Persist to DB
      await fetch(`/api/workspace/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: updatedIdea,
          activePhase: 2,
          status: "Synopsis"
        })
      });
    }, 2000);
  };

  return (
    <main className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar - Hidden on mobile */}
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
            </div>
            
            <nav className="flex-grow px-2 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-widest text-muted px-4 py-3 mb-1 font-bold">Project Controls</div>
              <div className="space-y-1">
                {["Overview", "Collaborators", "Integrations", "Project Settings"].map((link) => (
                  <button key={link} className="w-full text-left px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-white rounded-xl transition-all font-medium">
                    {link}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-6 border-t border-border-subtle">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg" />
                <div className="text-xs">
                  <div className="font-bold">Project ID</div>
                  <div className="text-muted font-mono">{String(id).slice(0, 8)}...</div>
                </div>
              </div>
              <Button variant="secondary" className="w-full text-[10px] uppercase tracking-widest font-bold">Export Code</Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <section className="flex-grow flex flex-col bg-white overflow-hidden relative">
        {!isFocusMode && !isMobile && (
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-1 bg-white border border-border-subtle rounded-full shadow-sm"
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
              className="border-b border-border-subtle flex items-center px-4 md:px-8 justify-between shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-xs md:text-sm font-semibold tracking-tight truncate max-w-[150px]">{state.title}</span>
                <div className="flex items-center gap-1">
                  {["Ideation", "Synopsis", "Plan", "Design", "Phases"].map((phase, i) => (
                    <div key={phase} className="flex items-center">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                        activePhase === i + 1 ? "bg-black text-white" : "text-muted"
                      )}>
                        {phase}
                      </div>
                      {i < 4 && <div className="hidden md:block w-3 h-px bg-border-subtle mx-1" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <button onClick={() => setFocusMode(true)} className="p-2 hover:bg-section rounded-lg text-muted">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0"><MoreVertical className="w-4 h-4 text-muted" /></Button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Resizable Workstation */}
        <div className="flex-grow">
          <Group orientation={isMobile ? "vertical" : "horizontal"}>
            <Panel defaultSize={isMobile ? 100 : 40} minSize={30}>
              <div className="h-full flex flex-col items-center relative overflow-y-auto no-scrollbar">
                {isFocusMode && !isMobile && (
                  <button onClick={() => setFocusMode(false)} className="absolute right-6 top-6 z-50 p-2 bg-section border border-border-subtle rounded-xl text-muted">
                    <Minimize2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex-grow w-full max-w-2xl px-6 py-12 space-y-12">
                  <ChatMessage role="assistant" content={`Welcome back to your project: ${state.title}. Where should we pick up?`} />
                  {state.idea && <ChatMessage role="user" content={state.idea} />}
                  {isTyping && <ThinkingAnimation />}
                </div>

                <div className="w-full max-w-3xl p-8 pt-0">
                  <div className="relative bg-white border border-border-subtle rounded-[1.5rem] shadow-sm overflow-hidden focus-within:shadow-md transition-all">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Send a message to the orchestrator..."
                      disabled={isTyping}
                      className="w-full min-h-[80px] p-6 text-sm outline-none resize-none bg-transparent"
                    />
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border-subtle bg-section/30">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Shift+Enter for new line</span>
                      <button onClick={handleSend} disabled={isTyping || !input.trim()} className="p-2 bg-black text-white rounded-xl active:scale-95 transition-all">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {!isMobile && <Separator className="w-px bg-border-subtle hover:bg-black/20" />}

            <Panel defaultSize={isMobile ? 100 : 60} minSize={30}>
              <div className={cn("h-full bg-section overflow-y-auto p-12", isMobile && "border-t border-border-subtle")}>
                <div className="space-y-12 max-w-3xl">
                  <section className="p-10 bg-white border border-border-subtle rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-serif">Project Blueprint</h2>
                      <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Live: {state.status || 'Active'}</div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-3">Idea Archive</div>
                        <p className="text-sm leading-relaxed text-secondary">{state.idea || "Drafting core concept..."}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-section rounded-2xl border border-border-subtle">
                          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">Sync Status</div>
                          <div className="text-sm font-medium">Database Connected</div>
                        </div>
                        <div className="p-6 bg-section rounded-2xl border border-border-subtle">
                          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">ID Reference</div>
                          <div className="text-sm font-mono text-xs">{id}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </section>
    </main>
  );
}

function ChatMessage({ role, content }: { role: 'assistant' | 'user', content: string }) {
  return (
    <div className={cn("flex gap-6", role === 'user' ? "justify-end" : "justify-start")}>
      {role === 'assistant' && <div className="w-8 h-8 rounded-full bg-section border border-border-subtle flex items-center justify-center text-[10px] font-bold shrink-0">S</div>}
      <div className={cn(
        "p-5 text-sm leading-relaxed max-w-xl",
        role === 'user' ? "bg-black text-white rounded-2xl rounded-tr-none shadow-lg" : "bg-section border border-border-subtle rounded-2xl rounded-tl-none"
      )}>
        {content}
      </div>
      {role === 'user' && <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">U</div>}
    </div>
  );
}
