"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Search, Bookmark, ArrowRight, Sparkles, Terminal, Palette, Code } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SKILLS = [
  { id: "cod", title: "Chain of Density", icon: Zap, category: "Logic", desc: "Extract high-density info without nuance loss." },
  { id: "cot", title: "Chain of Thought", icon: Terminal, category: "Logic", desc: "Forces step-by-step reasoning for complex tasks." },
  { id: "pm", title: "Persona Mirror", icon: Palette, category: "Tone", desc: "Adopt the exact expertise of a Senior Architect." },
  { id: "vp", title: "Visual Prompting", icon: Code, category: "Design", desc: "Use spatial tokens to describe UI layouts." },
  { id: "sss", title: "Step-by-Step Sync", icon: Sparkles, category: "Planning", desc: "Synchronize multiple agents across phases." },
];

interface SkillToolboxProps {
  isOpen: boolean;
  onClose: () => void;
  onInject: (skill: any) => void;
}

export function SkillToolbox({ isOpen, onClose, onInject }: SkillToolboxProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = SKILLS.filter(s => 
    (activeCategory === "All" || s.category === activeCategory) &&
    (s.title.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-border-subtle z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-serif">Skill Toolbox</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-section rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-border-subtle bg-section/30">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search techniques..." 
                  className="w-full bg-white border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary/20 transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "Logic", "Tone", "Design", "Planning"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all",
                      activeCategory === cat ? "bg-black text-white" : "bg-white border border-border-subtle text-muted hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
              {filteredSkills.map(skill => (
                <div 
                  key={skill.id}
                  onClick={() => onInject(skill)}
                  className="p-5 border border-border-subtle rounded-[1.5rem] hover:bg-section transition-all cursor-pointer group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-white border border-border-subtle rounded-xl flex items-center justify-center group-hover:border-primary/20 transition-colors">
                      <skill.icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <button className="text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{skill.title}</h3>
                  <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{skill.desc}</p>
                  <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-white border border-border-subtle rounded-full">{skill.category}</span>
                    <span className="text-[9px] font-bold text-primary flex items-center gap-1">Inject <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border-subtle bg-section/30">
              <p className="text-[10px] text-muted text-center leading-relaxed">
                Injecting a skill will prepend specialized reasoning <br /> to your next orchestrator command.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
