"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Palette, Layout, ArrowRight, X, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SEARCH_ITEMS = [
  { id: "s1", title: "Chain of Density", category: "Skill", href: "/skills", icon: Zap },
  { id: "s2", title: "Chain of Thought", category: "Skill", href: "/skills", icon: Zap },
  { id: "t1", title: "SaaS Starter", category: "Template", href: "/templates", icon: Layout },
  { id: "t2", title: "AI Agent Framework", category: "Template", href: "/templates", icon: Layout },
  { id: "d1", title: "Vercel Dark", category: "Design", href: "/designs", icon: Palette },
  { id: "d2", title: "Luma Cinematic", category: "Design", href: "/designs", icon: Palette },
];

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 md:px-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white border border-border-subtle rounded-[2rem] shadow-2xl overflow-hidden relative z-10"
            >
              <div className="flex items-center px-6 border-b border-border-subtle h-16">
                <Search className="w-5 h-5 text-muted mr-4" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates, skills, or designs..."
                  className="flex-grow bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted/60"
                />
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-section text-[10px] font-bold text-muted border border-border-subtle">ESC</span>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-section transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-section border border-border-subtle flex items-center justify-center group-hover:bg-white transition-colors">
                            <item.icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{item.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-muted text-sm">No results found for "{query}"</div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-section/30 border-t border-border-subtle flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-muted font-bold">
                    <span className="px-1.5 py-0.5 bg-white border border-border-subtle rounded">↑↓</span>
                    Navigate
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted font-bold">
                    <span className="px-1.5 py-0.5 bg-white border border-border-subtle rounded">↵</span>
                    Select
                  </div>
                </div>
                <div className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-50">Symphony Search</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Trigger (Optional visual aid) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 z-[500] w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all md:flex hidden"
        >
          <Command className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
