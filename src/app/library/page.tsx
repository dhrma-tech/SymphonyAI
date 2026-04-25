"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, ArrowLeft, Zap, Terminal, Palette, Filter, Bookmark, ArrowRight, Code, Eye, Layers, Database, ShieldCheck, FileText } from "lucide-react";
import { RevealText } from "@/components/shared/RevealText";
import { DetailModal } from "@/components/shared/DetailModal";

type LibraryMode = "selection" | "creator" | "developer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 1, 1] as any
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 200
    }
  }
};

export default function LibraryPage() {
  const [mode, setMode] = useState<LibraryMode>("selection");

  return (
    <motion.main 
      animate={{ backgroundColor: mode === "developer" ? "#050505" : mode === "creator" ? "#FDFCFB" : "#0A0A0A" }}
      className="min-h-screen transition-colors duration-700 font-sans selection:bg-black selection:text-white overflow-x-hidden"
    >
      <Header />
      
      <div className="relative pt-20">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {mode === "selection" ? (
              <SelectionView key="selection" onSelect={setMode} />
            ) : (
              <InteriorView key="interior" mode={mode} onBack={() => setMode("selection")} />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      <Footer />
    </motion.main>
  );
}

function SelectionView({ onSelect }: { onSelect: (m: LibraryMode) => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
      className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden"
    >
      {/* Creator Mode */}
      <motion.div 
        layoutId="mode-bg-creator"
        onClick={() => onSelect("creator")}
        className="flex-grow relative group cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-white/10"
      >
        <div className="absolute inset-0 bg-[#FF5C00]/5 md:bg-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,0,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center z-10">
          <motion.div 
            layoutId="mode-icon-creator"
            transition={{ type: "spring" as const, damping: 20, stiffness: 120 }}
            className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform"
          >
            <Palette className="w-10 h-10 text-white/60" />
          </motion.div>
          <motion.h2 layoutId="mode-title-creator" className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tighter">Creator</motion.h2>
          <p className="text-white/30 text-lg max-w-sm font-light">The art of visual prompting and cinematic architecture.</p>
        </div>
      </motion.div>

      {/* Developer Mode */}
      <motion.div 
        layoutId="mode-bg-developer"
        onClick={() => onSelect("developer")}
        className="flex-grow relative group cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600/5 md:bg-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center z-10">
          <motion.div 
            layoutId="mode-icon-developer"
            transition={{ type: "spring" as const, damping: 20, stiffness: 120 }}
            className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform"
          >
            <Terminal className="w-10 h-10 text-white/60" />
          </motion.div>
          <motion.h2 layoutId="mode-title-developer" className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tighter">Developer</motion.h2>
          <p className="text-white/30 text-lg max-w-sm font-light">Agentic workflows, logical depth, and technical precision.</p>
        </div>
      </motion.div>
    </motion.section>
  );
}

function InteriorView({ mode, onBack }: { mode: LibraryMode, onBack: () => void }) {
  const isCreator = mode === "creator";
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("min-h-screen", isCreator ? "text-primary" : "text-white")}
    >
      <DetailModal 
        isOpen={!!selectedSkill} 
        onClose={() => setSelectedSkill(null)} 
        item={selectedSkill} 
        mode={isCreator ? "creator" : "developer"} 
      />

      {/* Liquid Header */}
      <motion.div 
        layoutId={isCreator ? "mode-bg-creator" : "mode-bg-developer"}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        className={cn(
          "h-[60vh] w-full relative flex flex-col items-center justify-center text-center px-6 overflow-hidden",
          isCreator ? "bg-[#FF5C00]/5" : "bg-blue-600/5"
        )}
      >
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onBack}
          className={cn(
            "absolute top-10 left-10 p-4 border rounded-2xl transition-all z-50 group",
            isCreator ? "bg-white border-border-subtle hover:bg-section" : "bg-white/5 border-white/10 hover:bg-white/10"
          )}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </motion.button>

        <div className="relative z-10">
          <motion.div 
            layoutId={isCreator ? "mode-icon-creator" : "mode-icon-developer"} 
            transition={{ type: "spring" as const, damping: 18, stiffness: 100 }}
            className={cn(
              "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl",
              isCreator ? "bg-white border border-border-subtle" : "bg-white/5 border border-white/10"
            )}
          >
            {isCreator ? <Palette className="w-10 h-10 text-primary" /> : <Terminal className="w-10 h-10 text-blue-500" />}
          </motion.div>
          
          <motion.div layoutId={isCreator ? "mode-title-creator" : "mode-title-developer"}>
             <RevealText 
                text={isCreator ? "Creator Library" : "Developer Library"} 
                className="text-6xl md:text-9xl font-serif tracking-tighter leading-none" 
              />
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className={cn("mt-8 text-lg max-w-xl mx-auto font-light", isCreator ? "text-muted" : "text-white/40")}
          >
            {isCreator ? "Advanced visual patterns for cinematic AI product design." : "Technical orchestration templates for high-stakes AI logic."}
          </motion.p>
        </div>

        {/* Dynamic Background Ornament */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
           {isCreator ? (
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,92,0,0.03),transparent_70%)]" />
           ) : (
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.05),transparent_70%)]" />
           )}
        </motion.div>
      </motion.div>

      {/* Grid Content Staggered */}
      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <motion.aside variants={itemVariants} className="w-full lg:w-72 space-y-12 sticky top-32">
            <div>
              <div className={cn("text-[10px] uppercase tracking-widest font-bold mb-6", isCreator ? "text-muted" : "text-white/40")}>Categories</div>
              <div className="space-y-1">
                {["All Techniques", "Recent", "Starred", "Featured"].map((c, i) => (
                  <button 
                    key={c} 
                    className={cn(
                      "w-full text-left px-5 py-3 text-sm rounded-2xl transition-all flex items-center justify-between group",
                      i === 0 
                        ? (isCreator ? "bg-black text-white" : "bg-white text-black") 
                        : (isCreator ? "hover:bg-section text-secondary" : "hover:bg-white/5 text-white/60")
                    )}
                  >
                    {c}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          <div className="flex-grow space-y-20">
            <motion.div variants={itemVariants} className={cn(
              "flex items-center gap-4 p-2 rounded-2xl border",
              isCreator ? "bg-white border-border-subtle shadow-sm" : "bg-white/5 border-white/10"
            )}>
              <Search className="w-5 h-5 text-muted ml-4" />
              <input 
                type="text" 
                placeholder="Search prompt artifacts..." 
                className="bg-transparent border-none outline-none flex-grow text-sm py-4 px-2" 
              />
              <Button variant="secondary" className={cn("gap-2 border-none", isCreator ? "bg-section" : "bg-white/10 text-white")}>
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {(isCreator ? CREATOR_SKILLS : DEVELOPER_SKILLS).map((skill, i) => (
                <SkillCard key={i} skill={skill} isCreator={isCreator} index={i} onClick={() => setSelectedSkill(skill)} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SkillCard({ skill, isCreator, index, onClick }: { skill: any, isCreator: boolean, index: number, onClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "p-10 rounded-[3rem] transition-all group relative overflow-hidden border cursor-pointer",
        isCreator 
          ? "bg-white border-border-subtle shadow-warm hover:shadow-2xl" 
          : "bg-[#0A0A0A] border-white/10 hover:border-white/20 shadow-2xl"
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
        isCreator 
          ? "bg-[radial-gradient(circle_at_top_right,rgba(255,92,0,0.03),transparent_70%)]" 
          : "bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.05),transparent_70%)]"
      )} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12",
            isCreator ? "bg-section border border-border-subtle" : "bg-white/5 border border-white/10"
          )}>
            <skill.icon className="w-6 h-6" />
          </div>
          <button className={cn("p-2 rounded-full", isCreator ? "hover:bg-section" : "hover:bg-white/10")}>
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-3xl font-medium mb-4 tracking-tight leading-tight">{skill.title}</h3>
        <p className={cn("text-base leading-relaxed mb-10 font-light", isCreator ? "text-muted" : "text-white/40")}>
          {skill.desc}
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-current/10">
          <div className="flex gap-2">
            {skill.tags.map((t: string) => (
              <span key={t} className={cn(
                "text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full",
                isCreator ? "bg-section border border-border-subtle" : "bg-white/5 border border-white/10"
              )}>
                {t}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group/btn">
            View Pattern 
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const CREATOR_SKILLS = [
  { title: "Chain of Density", desc: "Synthesize high-stakes information into information-dense artifacts without losing editorial nuance.", icon: Layers, tags: ["Expert", "Editorial"] },
  { title: "Visual Prompting", desc: "Direct the AI to generate UI architectures using spatial tokens and aesthetic reference points.", icon: Eye, tags: ["Design", "Layout"] },
  { title: "Persona Mirroring", desc: "Instantly adopt the precise expertise and tone of world-class creative directors.", icon: Palette, tags: ["Tone", "Creative"] },
  { title: "Cinematic Copy", desc: "Orchestrate text that feels alive, dynamic, and editorial rather than generic AI output.", icon: FileText, tags: ["Content", "Marketing"] },
];

const DEVELOPER_SKILLS = [
  { title: "Agentic Logic", desc: "Construct multi-agent frameworks where specialized AI nodes communicate via shared memory.", icon: Terminal, tags: ["Logical", "Backend"] },
  { title: "Prisma Orchestration", desc: "Automate the generation of complex relational schemas and data access layers from natural language.", icon: Database, tags: ["Data", "Prisma"] },
  { title: "Security First", desc: "Inject security-aware reasoning into every prompt to identify vulnerabilities in real-time.", icon: ShieldCheck, tags: ["Safety", "Audit"] },
  { title: "Step-by-Step Sync", desc: "Break down complex technical builds into manageable orchestration phases for maximum reliability.", icon: Zap, tags: ["Planning", "Technical"] },
];
