"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Code, Terminal, 
  ArrowRight, Layers, 
  MessageSquare, Cpu, type LucideIcon
} from "lucide-react";

const skillCategories = ["All", "Prompt Engineering", "Orchestration", "System Design"];

type SkillItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
  category: string;
  techniques: string[];
};

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
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8">Workflow Skills</h1>
          <p className="text-lg text-muted max-w-2xl font-light leading-relaxed">
            Practical techniques that power the guided workspace: forcing questions, scope pressure, architecture review, and prompt handoff.
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

function SkillCard({ skill }: { skill: SkillItem }) {
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
    title: "Forcing Questions", 
    desc: "Questions that turn a vague idea into a specific user, demand signal, status quo, and narrow wedge.", 
    icon: Layers, 
    category: "Prompt Engineering", 
    techniques: ["Office Hours", "Demand Test"]
  },
  { 
    title: "Scope Pressure", 
    desc: "Review mode that separates the v1 product from expansion ideas, reductions, and deferred work.", 
    icon: Code, 
    category: "System Design", 
    techniques: ["Selective Expansion", "Reduction"]
  },
  { 
    title: "Stage Gates", 
    desc: "A workflow control pattern that blocks later outputs until earlier artifacts are approved.", 
    icon: Cpu, 
    category: "Orchestration", 
    techniques: ["Approval Gates", "Readiness"]
  },
  { 
    title: "Architecture Lock", 
    desc: "The engineering review artifact that forces data flow, state, failure modes, security, tests, and acceptance criteria.", 
    icon: Brain, 
    category: "System Design", 
    techniques: ["Failure Modes", "Test Matrix"]
  },
  { 
    title: "Artifact Trail", 
    desc: "Versioned records that let every downstream prompt read what was decided before it.", 
    icon: Terminal, 
    category: "Orchestration", 
    techniques: ["Prisma Records", "Versioning"]
  },
  { 
    title: "Prompt Handoff", 
    desc: "Copy-ready build prompts generated from the locked architecture instead of a loose chat transcript.", 
    icon: MessageSquare, 
    category: "Orchestration", 
    techniques: ["Tool Phases", "Acceptance Criteria"]
  }
];
