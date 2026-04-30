"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ArrowRight, Layers, Palette,
  Database, ShieldCheck, Layout, 
  Lock, type LucideIcon
} from "lucide-react";
import { DetailModal } from "@/components/shared/DetailModal";

const categories = ["All", "Frontend", "Backend", "System Design", "AI Logic", "DevOps"];

type LibraryItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
  category: string;
  tags: string[];
  content: string;
};

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = LIBRARY_DATA.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Workflow Artifacts</div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8">The Pattern Library</h1>
          <p className="text-lg text-muted max-w-2xl font-light leading-relaxed">
            Curated patterns for the guided build flow: product definition, scope review, architecture lock, and final prompt handoff.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search techniques or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 bg-section rounded-2xl border border-border-subtle outline-none focus:border-black transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={cn(
                  "h-14 px-6 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all border shrink-0",
                  activeCategory === c ? "bg-black text-white border-transparent shadow-lg" : "bg-white text-muted border-border-subtle hover:bg-section"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <LibraryCard item={item} onClick={() => setSelectedItem(item)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <div className="text-xl font-medium text-muted">No artifacts found.</div>
          </div>
        )}
      </div>

      <DetailModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
        mode="developer" 
      />
      <Footer />
    </main>
  );
}

function LibraryCard({ item, onClick }: { item: LibraryItem, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-border-subtle rounded-[1.5rem] p-8 hover:shadow-xl hover:border-black/10 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 bg-section rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <item.icon className="w-5 h-5 text-secondary" />
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-muted bg-section px-3 py-1 rounded-full">
          {item.category}
        </div>
      </div>
      
      <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
      <p className="text-sm text-muted font-light leading-relaxed mb-10 flex-grow">
        {item.desc}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
        <div className="flex gap-1.5">
          {item.tags.slice(0, 2).map((t: string) => (
            <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-section rounded text-muted">
              {t}
            </span>
          ))}
        </div>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
      </div>
    </div>
  );
}

const LIBRARY_DATA = [
  { 
    title: "Office-Hours Product Definition", 
    desc: "Force specificity before planning: real user, demand evidence, status quo, wedge, constraints, and premises.", 
    icon: Layers, 
    category: "AI Logic", 
    tags: ["Define", "Product"],
    content: "Create a product definition artifact with Problem Statement, Demand Evidence, Status Quo, Target User, Narrowest Wedge, Constraints, Premises, Alternatives, Recommendation, and Assignment."
  },
  { 
    title: "Scope Review Gate", 
    desc: "Challenge the idea before architecture work starts. Decide what expands, what shrinks, and what is explicitly deferred.", 
    icon: Database, 
    category: "AI Logic", 
    tags: ["Plan", "Scope"],
    content: "Review the product definition in Selective Expansion mode. Output critique, expansion options, reduction options, accepted scope, rejected scope, product risks, and the final product plan."
  },
  { 
    title: "Architecture Lock", 
    desc: "Turn an approved product plan into system architecture, data flow, state machine, failure paths, security, and tests.", 
    icon: Palette, 
    category: "System Design", 
    tags: ["Eng", "Review"],
    content: "Create a locked architecture artifact with System Architecture, Data Flow, State Machine, Error Paths, Failure Modes, Security Concerns, Test Plan, Acceptance Criteria, and Final Locked Architecture."
  },
  { 
    title: "Prompt Workflow Handoff", 
    desc: "Generate build prompts only from the locked architecture so implementation follows approved decisions.", 
    icon: Lock, 
    category: "AI Logic", 
    tags: ["Prompts", "Handoff"],
    content: "Create copy-ready prompts grouped by tool and phase. Each prompt must cite the locked architecture, acceptance criteria, test plan, and known constraints."
  },
  { 
    title: "Readiness Dashboard", 
    desc: "A compact status pattern for showing Product Defined, Plan Reviewed, Architecture Locked, and Prompts Ready.", 
    icon: Layout, 
    category: "Frontend", 
    tags: ["UI", "Status"],
    content: "Build a stage dashboard with four gates. Each gate shows locked, current, draft, approved, or ready state and links to the latest artifact."
  },
  { 
    title: "Artifact Version Trail", 
    desc: "Preserve regenerated stage outputs as versions instead of overwriting the product decision history.", 
    icon: ShieldCheck, 
    category: "Backend", 
    tags: ["Prisma", "History"],
    content: "Store each stage output as a WorkflowArtifact with stage, markdown, structuredJson, version, supersedesId, and status."
  }
];
