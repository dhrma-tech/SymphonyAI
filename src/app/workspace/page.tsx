"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Copy, Check, Sparkles, FileText, Download, History, X, Plus, Terminal, Palette, Layers, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type WorkflowStage = "idle" | "thinking" | "questions" | "review" | "complete";

interface Phase {
  number: number;
  title: string;
  tool: string;
  description: string;
  prompt: string;
}

interface GeneratedPlan {
  synopsis: string;
  features: string[];
  improvements: string[];
  design: {
    palette: Array<{ name: string; hex: string }>;
    fonts: Array<{ role: string; name: string }>;
  };
  phases: Phase[];
}

export default function WorkspacePage() {
  const [stage, setStage] = useState<WorkflowStage>("idle");
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectHistory, setProjectHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load project history
  useEffect(() => {
    fetch("/api/workspace")
      .then(res => res.json())
      .then(data => setProjectHistory(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load history:", err));
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stage, questions, plan]);

  const handleStart = async () => {
    if (!input.trim()) return;

    setStage("thinking");
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: input,
          conversationHistory: conversationHistory 
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: JSON.stringify(data) }
      ]);

      if (data.stage === "questions") {
        setQuestions(data.questions);
        setStage("questions");
      } else {
        setPlan(data);
        setSelectedFeatures(data.features || []);
        setStage("review");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setStage("idle");
    }
  };

  const handleAnswerQuestions = async () => {
    if (answers.length !== questions.length) return;

    setStage("thinking");

    const answersText = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join("\n\n");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: answersText,
          conversationHistory: conversationHistory 
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: answersText },
        { role: "assistant", content: JSON.stringify(data) }
      ]);

      setPlan(data);
      setSelectedFeatures(data.features || []);
      setStage("review");
    } catch (error) {
      console.error("Generation failed:", error);
      setStage("questions");
    }
  };

  const handleApprove = async () => {
    if (!plan) return;

    setStage("complete");

    // Save to database
    try {
      await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.slice(0, 50),
          idea: input,
          synopsis: plan.synopsis,
          features: selectedFeatures,
          design: plan.design,
          phases: plan.phases,
        }),
      });
      
      // Refresh history
      const res = await fetch("/api/workspace");
      const data = await res.json();
      setProjectHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setStage("idle");
    setInput("");
    setQuestions([]);
    setAnswers([]);
    setPlan(null);
    setSelectedFeatures([]);
    setConversationHistory([]);
  };

  return (
    <main className="flex h-screen bg-white overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border-subtle flex flex-col bg-section shrink-0 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-5 h-5 bg-black rounded-md transition-transform group-hover:scale-110 shadow-sm" />
                <span className="text-sm font-semibold tracking-tighter">SymphonyAI</span>
              </Link>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white rounded-lg transition-all text-muted hover:text-black"
                title="New Project"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-grow px-2 overflow-y-auto no-scrollbar">
              <div className="text-[10px] uppercase tracking-widest text-muted px-4 py-4 font-bold flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Projects
              </div>
              <div className="space-y-0.5">
                {projectHistory.map((project) => (
                  <button
                    key={project.id}
                    className="w-full text-left px-4 py-3 text-xs rounded-xl hover:bg-white transition-all group"
                  >
                    <div className="font-medium truncate group-hover:text-primary transition-colors">{project.title}</div>
                    <div className="text-[10px] text-muted truncate mt-0.5">{project.synopsis}</div>
                  </button>
                ))}
                {projectHistory.length === 0 && (
                  <div className="px-4 py-8 text-center text-[10px] text-muted uppercase tracking-widest font-bold">
                    No history yet
                  </div>
                )}
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="flex-grow flex flex-col min-w-0 bg-white relative">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-6 z-50 p-1.5 bg-white border border-border-subtle rounded-lg shadow-sm hover:bg-section transition-all"
        >
          <Plus className={cn("w-4 h-4 transition-transform", isSidebarOpen ? "rotate-45" : "rotate-0")} />
        </button>

        {/* Header */}
        <header className="h-20 border-b border-border-subtle flex items-center px-16 justify-between shrink-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight">Workspace</h1>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-muted">
              <Terminal className="w-3 h-3" /> Tool Orchestration
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-section rounded-full text-[9px] font-bold uppercase tracking-widest text-muted border border-border-subtle">
               Status: {stage === "idle" ? "Idle" : stage === "thinking" ? "Processing" : "Ready"}
             </div>
          </div>
        </header>

        {/* Chat/Workflow Area */}
        <div className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 pb-32">
            {/* Idle State */}
            {stage === "idle" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-section rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-5xl md:text-6xl font-serif tracking-tight mb-8">What are we <br /> <span className="italic text-muted">building</span> today?</h2>
                <p className="text-muted text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
                  Describe your idea in plain English. SymphonyAI will decompose it into a structured execution plan for Claude, Cursor, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                  {["Landing page for meditation app", "SaaS Dashboard with real-time charts", "E-commerce store for handmade ceramics", "AI chatbot platform with auth"].map(example => (
                    <button
                      key={example}
                      onClick={() => setInput(example)}
                      className="px-6 py-2.5 bg-section border border-border-subtle rounded-full text-[10px] uppercase tracking-widest font-bold text-muted hover:bg-white hover:text-black hover:border-black/20 transition-all shadow-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Thinking State */}
            {stage === "thinking" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-6 p-10 bg-section/50 rounded-[2rem] border border-border-subtle"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-border-subtle flex items-center justify-center shrink-0">
                  <RefreshCcw className="w-5 h-5 text-muted animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Orchestrating your build...</p>
                  <p className="text-[11px] text-muted font-light">Claude 3.5 Sonnet is analyzing intent and complexity.</p>
                </div>
              </motion.div>
            )}

            {/* Questions State */}
            {stage === "questions" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="p-10 bg-section/50 border border-border-subtle rounded-[2.5rem]">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-8 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Clarification Required
                  </div>
                  <div className="space-y-8">
                    {questions.map((q, i) => (
                      <div key={i} className="space-y-3">
                        <label className="block text-sm font-medium tracking-tight px-1">{q}</label>
                        <input
                          type="text"
                          value={answers[i] || ""}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[i] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                          className="w-full px-6 py-4 bg-white border border-border-subtle rounded-2xl outline-none focus:border-black/20 transition-all shadow-sm text-sm"
                          placeholder="Type your response..."
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleAnswerQuestions}
                    disabled={answers.length !== questions.length || answers.some(a => !a.trim())}
                    className="mt-12 w-full h-14 rounded-2xl text-[11px] uppercase tracking-widest font-bold gap-2 shadow-xl"
                  >
                    Generate Execution Plan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Review & Complete State */}
            {(stage === "review" || stage === "complete") && plan && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Synopsis Section */}
                <div className="p-10 bg-section/30 border border-border-subtle rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText className="w-32 h-32" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-6">Strategic Synopsis</div>
                  <p className="text-2xl font-serif leading-tight tracking-tight text-primary">{plan.synopsis}</p>
                </div>

                {/* Features Section */}
                <div className="p-10 bg-white border border-border-subtle rounded-[2.5rem] shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-8">Functional Architecture</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.features.map((feature, i) => (
                      <label 
                        key={i} 
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group",
                          selectedFeatures.includes(feature) ? "bg-black text-white border-transparent shadow-lg" : "bg-section border-border-subtle hover:border-black/10"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFeatures([...selectedFeatures, feature]);
                            } else {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                            }
                          }}
                          className="hidden"
                        />
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center transition-colors",
                          selectedFeatures.includes(feature) ? "bg-white/20" : "bg-white border border-border-subtle"
                        )}>
                          {selectedFeatures.includes(feature) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Design System Section */}
                <div className="p-10 bg-white border border-border-subtle rounded-[2.5rem] shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-8">Design Tokens</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <div className="text-[9px] font-bold text-muted uppercase tracking-widest mb-4">Color Palette</div>
                      <div className="flex gap-4">
                        {plan.design.palette.map((color, i) => (
                          <div key={i} className="group flex flex-col items-center">
                            <div
                              className="w-12 h-12 rounded-xl border border-border-subtle mb-3 shadow-sm group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="text-[8px] font-bold uppercase tracking-tighter text-muted">{color.hex}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-bold text-muted uppercase tracking-widest mb-4">Typography Pairings</div>
                      <div className="space-y-3">
                        {plan.design.fonts.map((font, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-section rounded-xl border border-border-subtle">
                            <span className="text-[8px] uppercase tracking-widest font-bold text-muted">{font.role}</span>
                            <span className="text-[10px] font-bold">{font.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution Phases */}
                <div className="space-y-6">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted px-2">Sequential Execution Phases</div>
                  {plan.phases.map((phase, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-10 bg-white border border-border-subtle rounded-[2.5rem] shadow-sm group hover:border-black/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-xl">
                            {phase.number}
                          </div>
                          <div>
                            <h3 className="text-xl font-serif tracking-tight">{phase.title}</h3>
                            <p className="text-[11px] text-muted font-light mt-1">{phase.description}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-section rounded-full text-[9px] uppercase tracking-widest font-bold border border-border-subtle">
                          {phase.tool}
                        </div>
                      </div>
                      
                      <div className="relative group/prompt">
                        <div className="mt-8 p-8 bg-section/50 rounded-2xl font-mono text-[11px] leading-relaxed border border-border-subtle overflow-x-auto">
                          <pre className="whitespace-pre-wrap break-words">{phase.prompt}</pre>
                        </div>
                        <button
                          onClick={() => handleCopy(phase.prompt, i)}
                          className="absolute top-4 right-4 p-3 bg-white border border-border-subtle rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Final Actions */}
                <AnimatePresence>
                  {stage === "review" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 pt-8"
                    >
                      <Button onClick={handleApprove} className="flex-1 h-16 rounded-2xl text-[11px] uppercase tracking-widest font-bold gap-3 shadow-2xl">
                        <Check className="w-5 h-5" /> Approve & Save Orchestration
                      </Button>
                      <Button onClick={handleReset} variant="secondary" className="px-10 h-16 rounded-2xl text-[11px] uppercase tracking-widest font-bold border-border-subtle">
                        Reset
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {stage === "complete" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 bg-black text-white rounded-[3rem] text-center shadow-3xl"
                  >
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-serif mb-4">Orchestration Finalized.</h3>
                    <p className="text-white/40 text-sm font-light mb-12 max-w-sm mx-auto">Your execution plan is saved and ready for deployment. Copy the prompts to start building.</p>
                    <Button onClick={handleReset} className="bg-white text-black hover:bg-white/90 rounded-2xl px-12 h-14 text-[11px] uppercase tracking-widest font-bold">
                      New Project
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Floating Input Bar */}
        <AnimatePresence>
          {stage === "idle" && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-50"
            >
              <div className="bg-white/80 backdrop-blur-xl p-3 border border-border-subtle rounded-[2rem] shadow-2xl flex gap-3 focus-within:border-black/20 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder="I want to build a..."
                  className="flex-1 px-8 py-5 text-sm outline-none bg-transparent"
                />
                <Button 
                  onClick={handleStart} 
                  disabled={!input.trim()} 
                  className="px-10 rounded-2xl text-[11px] uppercase tracking-widest font-bold shadow-xl"
                >
                  Generate Plan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
