"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Command, X, Zap, Terminal, Palette, FileText, ArrowRight, Star, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: "skill" | "template" | "design" | "project";
  title: string;
  desc: string;
  category: string;
  icon: any;
  href: string;
}

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const results: SearchResult[] = [
    { id: "1", type: "skill" as any, title: "Chain of Density", desc: "Synthesize high-stakes information", category: "Creator", icon: Zap, href: "/library" },
    { id: "2", type: "template" as any, title: "Luma Labs Clone", desc: "Cinematic AI product layout", category: "Designs", icon: Palette, href: "/designs" },
    { id: "3", type: "skill" as any, title: "Agentic Logic", desc: "Multi-agent framework nodes", category: "Developer", icon: Terminal, href: "/library" },
    { id: "4", type: "project" as any, title: "Meditation App", desc: "Resume your last orchestration", category: "Recent", icon: Clock, href: "/workspace" },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Command Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-border-subtle relative z-10"
            >
              <div className="flex items-center px-8 py-6 border-b border-border-subtle">
                <Search className="w-5 h-5 text-muted mr-4" />
                <input 
                  autoFocus
                  placeholder="Search prompts, templates, or projects..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-grow text-lg font-medium placeholder:text-muted/50"
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-section rounded-lg border border-border-subtle">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">ESC</span>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 no-scrollbar">
                {query === "" && (
                  <div className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-muted">Suggestions</div>
                )}
                
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        router.push(result.href);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-section transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <result.icon className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{result.title}</span>
                          <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-section rounded-md text-muted">{result.type}</span>
                        </div>
                        <div className="text-xs text-muted truncate max-w-md">{result.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-section rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-muted" />
                    </div>
                    <div className="text-sm font-medium">No results found for "{query}"</div>
                    <div className="text-xs text-muted mt-1">Try searching for "Creator" or "SaaS"</div>
                  </div>
                )}
              </div>

              <div className="px-8 py-4 bg-section border-t border-border-subtle flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <div className="px-1.5 py-0.5 bg-white border border-border-subtle rounded-md">↑↓</div> Select
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <div className="px-1.5 py-0.5 bg-white border border-border-subtle rounded-md">↵</div> Open
                  </div>
                </div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-50">SymphonyAI Command</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-[80] w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <Command className="w-6 h-6" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl border border-border-subtle opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all shadow-xl pointer-events-none whitespace-nowrap">
          Command Bar (Cmd+K)
        </span>
      </button>
    </>
  );
}
