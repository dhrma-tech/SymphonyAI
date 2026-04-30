"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Palette, Layout, Smartphone, Eye, 
  ExternalLink, Layers, Copy, Check, type LucideIcon
} from "lucide-react";

type DesignItem = {
  name: string;
  desc: string;
  icon: LucideIcon;
  category: string;
  bg: string;
  tags: string[];
  prompt: string;
};

export default function DesignLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(DESIGN_DATA.map((design) => design.category)))];
  const filteredDesigns = DESIGN_DATA.filter(d => 
    activeCategory === "All" || d.category === activeCategory
  );

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Visual References</div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8">Web Design Library</h1>
          <p className="text-lg text-muted max-w-2xl font-light leading-relaxed">
            Visual references for later design review passes. V1 keeps these as inspiration while Workspace focuses on product, plan, architecture, and prompt gates.
          </p>
        </header>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-8 mb-12 border-b border-border-subtle">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "h-12 px-6 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all border shrink-0",
                activeCategory === category ? "bg-black text-white border-transparent shadow-lg" : "bg-white text-muted border-border-subtle hover:bg-section"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDesigns.map((design, i) => (
            <motion.div
              key={design.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <DesignCard design={design} />
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function DesignCard({ design }: { design: DesignItem }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(design.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-border-subtle rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group">
      <div className={cn("h-64 flex items-center justify-center border-b border-border-subtle relative overflow-hidden", design.bg)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">
          <design.icon className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="p-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-serif tracking-tight">{design.name}</h3>
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted bg-section px-3 py-1 rounded-full">{design.category}</span>
        </div>
        <p className="text-sm text-muted font-light leading-relaxed mb-10">
          {design.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {design.tags.map((t: string) => (
            <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-section rounded-full border border-border-subtle text-muted">
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleCopy} className="h-14 rounded-2xl gap-2 text-[10px] uppercase tracking-widest font-bold shadow-xl">
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? "Copied" : "Copy Prompt"}
          </Button>
          <Button variant="secondary" className="h-14 rounded-2xl gap-2 text-[10px] uppercase tracking-widest font-bold border-border-subtle">
            Preview <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const DESIGN_DATA = [
  { 
    name: "Linear Precision", 
    desc: "A masterclass in dark-mode precision, featuring sharp borders, high-contrast typography, and subtle glow effects.", 
    icon: Layout, 
    category: "SaaS", 
    bg: "bg-[#0A0A0A]",
    tags: ["Minimalist", "Dark", "Sharp"],
    prompt: "Generate a UI theme inspired by Linear.app. Use #000000 for background, #171717 for cards, and #FFFFFF for primary text. Use Inter font with 400 and 600 weights. Implement subtle border glows for hover states."
  },
  { 
    name: "Luma Cinematic", 
    desc: "Cinematic AI interface design with wide spatial layouts, large typography, and fluid motion transitions.", 
    icon: Smartphone, 
    category: "Creative", 
    bg: "bg-[#F5F2EF]",
    tags: ["Fluid", "Light", "Cinematic"],
    prompt: "Create a cinematic landing page design. Use warm stone background (#F5F2EF), dark charcoal text (#1A1A1A), and ample whitespace. Focus on large serif headings and smooth Framer Motion transitions."
  },
  { 
    name: "Stripe Flow", 
    desc: "The gold standard for enterprise visual storytelling, using vibrant gradients and complex isometric grid layouts.", 
    icon: Palette, 
    category: "Enterprise", 
    bg: "bg-[#635BFF]",
    tags: ["Gradients", "Complex", "Vibrant"],
    prompt: "Design an enterprise dashboard with a Stripe-inspired aesthetic. Use #635BFF as the primary accent, with multi-layered SVG gradients. Implement a rigid 12-column grid with soft elevations."
  },
  { 
    name: "Vercel Utility", 
    desc: "Developer-first design system focusing on extreme clarity, monochromatic tones, and robust utility patterns.", 
    icon: Eye, 
    category: "Developer", 
    bg: "bg-black",
    tags: ["Monochrome", "Clear", "Utility"],
    prompt: "Generate a developer utility interface. Focus on monochromatic scale from #000 to #FFF. Use Geist Sans. Implement rigid layout blocks with minimal border-radius and maximum focus on data clarity."
  },
  { 
    name: "Reflect Editorial", 
    desc: "A soft, editorial approach to productivity design, using muted palettes and spacious typography.", 
    icon: Layers, 
    category: "Productivity", 
    bg: "bg-[#FAFAFA]",
    tags: ["Editorial", "Soft", "Clean"],
    prompt: "Design a personal productivity app with an editorial aesthetic. Use #FAFAFA background with #4e4e4e text. Use a combination of a serif font for headings and a clean sans-serif for body text. Implement card layouts with soft shadows."
  }
];
