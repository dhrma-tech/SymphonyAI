"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Brain, Code, Terminal, 
  Search, ArrowRight, Layers, 
  MessageSquare, Sparkles, Cpu
} from "lucide-react";

const skillCategories = ["All", "Prompt Engineering", "Orchestration", "System Design"];

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = SKILLS_DATA.filter(s => 
    activeCategory === "All" || s.category === activeCategory
  );

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Core Competencies</div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8">LLM Skills</h1>
          <p className="text-lg text-muted max-w-2xl font-light leading-relaxed">
            Advanced techniques for prompt engineering, multi-turn orchestration, and complex agentic reasoning.
          </p>
        </header>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8 mb-12 border-b border-border-subtle">
          {skillCategories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                "h-12 px-6 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all border shrink-0",
                activeCategory === c ? "bg-black text-white border-transparent shadow-lg" : "bg-white text-muted border-border-subtle hover:bg-section"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function SkillCard({ skill }: { skill: any }) {
  return (
    <div className="bg-white border border-border-subtle rounded-[2rem] p-10 hover:shadow-xl hover:border-black/10 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-10">
        <div className="w-14 h-14 bg-section rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <skill.icon className="w-6 h-6 text-secondary" />
        </div>
        <div className="text-[9px] uppercase tracking-widest font-bold text-muted bg-section px-3 py-1 rounded-full">
          {skill.category}
        </div>
      </div>
      
      <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">{skill.title}</h3>
      <p className="text-sm text-muted font-light leading-relaxed mb-10 flex-grow">
        {skill.desc}
      </p>

      <div className="space-y-4 mb-10">
        <div className="text-[9px] uppercase tracking-widest font-bold text-muted mb-2">Key Techniques</div>
        <div className="flex flex-wrap gap-2">
          {skill.techniques.map((t: string) => (
            <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 bg-section rounded border border-border-subtle text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-border-subtle">
        <Button variant="secondary" className="w-full h-14 rounded-2xl gap-3 text-[10px] uppercase tracking-widest font-bold border-border-subtle">
          View Documentation <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

const SKILLS_DATA = [
  { 
    title: "Chain of Density", 
    desc: "A recursive summarization technique that increases information density without losing semantic detail.", 
    icon: Layers, 
    category: "Prompt Engineering", 
    techniques: ["Information Density", "Recursive Refinement"]
  },
  { 
    title: "Few-Shot Patterning", 
    desc: "Using structured examples to guide LLM output format, tone, and logical consistency.", 
    icon: Code, 
    category: "Prompt Engineering", 
    techniques: ["Pattern Recognition", "Format Injection"]
  },
  { 
    title: "Agentic Loop Controls", 
    desc: "Orchestrating autonomous loops for research, code generation, and self-correction.", 
    icon: Cpu, 
    category: "Orchestration", 
    techniques: ["Self-Correction", "Multi-Step Loops"]
  },
  { 
    title: "System Role Persona", 
    desc: "Building high-fidelity system prompts that define strict boundaries and specialized expertise.", 
    icon: Brain, 
    category: "System Design", 
    techniques: ["Role Definition", "Boundary Setting"]
  },
  { 
    title: "Tool Integration Flow", 
    desc: "Protocols for connecting LLMs to external APIs, terminal commands, and browser tools.", 
    icon: Terminal, 
    category: "Orchestration", 
    techniques: ["API Interfacing", "Tool Schema"]
  },
  { 
    title: "Dynamic Context Mirror", 
    desc: "Reflecting user intent back into the context window to maximize relevance and coherence.", 
    icon: MessageSquare, 
    category: "Orchestration", 
    techniques: ["Intent Reflection", "Context Management"]
  }
];
