"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Zap, Terminal, Palette, Filter, 
  Bookmark, ArrowRight, Code, Eye, Layers, 
  Database, ShieldCheck, FileText, Layout, 
  Smartphone, Globe, Cpu, Lock
} from "lucide-react";
import { DetailModal } from "@/components/shared/DetailModal";

const categories = ["All", "Frontend", "Backend", "Design", "AI Logic", "DevOps"];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Prompt Artifacts</div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8">The Pattern Library</h1>
          <p className="text-lg text-muted max-w-2xl font-light leading-relaxed">
            A curated collection of production-ready prompt patterns for full-stack engineering, design systems, and agentic orchestration.
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

function LibraryCard({ item, onClick }: { item: any, onClick: () => void }) {
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
    title: "Chain of Density", 
    desc: "A technique for summarizing complex information without losing editorial nuance or data density.", 
    icon: Layers, 
    category: "AI Logic", 
    tags: ["Expert", "Synthesis"],
    content: "Act as a synthesis expert. Rewrite the provided input to increase information density while maintaining a cinematic tone. Identify high-stakes verbs and technical nouns."
  },
  { 
    title: "Prisma Schema Gen", 
    desc: "Generate optimized database schemas with relations and indexes from natural language descriptions.", 
    icon: Database, 
    category: "Backend", 
    tags: ["Data", "Prisma"],
    content: "Generate a full Prisma schema based on the following requirements. Ensure all CUID IDs, explicit relations, and performance indexes are included."
  },
  { 
    title: "React Token System", 
    desc: "Convert a design vision into a structured Tailwind configuration and global CSS tokens.", 
    icon: Palette, 
    category: "Design", 
    tags: ["Tailwind", "CSS"],
    content: "Translate the design tokens provided into a tailwind.config.ts file. Focus on spacing scales, semantic colors, and shadow elevations for high-end SaaS products."
  },
  { 
    title: "OAuth Auth Logic", 
    desc: "Secure implementation of NextAuth with social providers and session management.", 
    icon: Lock, 
    category: "Backend", 
    tags: ["Auth", "Security"],
    content: "Implement NextAuth configuration for a Next.js 15 application. Include Google/GitHub providers and Prisma adapters. Scope all project data to the session user ID."
  },
  { 
    title: "Cinematic Layouts", 
    desc: "Prompt patterns for creating high-end, responsive landing pages with Framer Motion.", 
    icon: Layout, 
    category: "Frontend", 
    tags: ["UI", "Motion"],
    content: "Design a high-end SaaS landing page using a 12-column grid. Implement 'Liquid Motion' using Framer Motion. Focus on typography rhythm and whitespace."
  },
  { 
    title: "API Rate Limiting", 
    desc: "Configure edge-native rate limiting and protection for serverless API routes.", 
    icon: ShieldCheck, 
    category: "DevOps", 
    tags: ["Security", "Edge"],
    content: "Create a middleware.ts implementation for rate limiting API routes using Upstash Redis. Ensure 429 responses are returned for excessive requests."
  }
];
