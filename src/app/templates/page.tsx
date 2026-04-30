"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { motion } from "framer-motion";
import { 
  Layout, Smartphone, BarChart, ShoppingCart, 
  Rocket, Cpu, Play, ExternalLink, type LucideIcon 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/lib/context/WorkspaceContext";

type TemplateItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
  category: string;
};

export default function TemplatesPage() {
  const router = useRouter();
  const { saveProject, resetWorkspace } = useWorkspace();

  const handleUseTemplate = async (template: TemplateItem) => {
    resetWorkspace();
    await saveProject({
      title: template.title,
      idea: `Build a ${template.title} using the ${template.category} pattern.`,
      activeStage: 1,
      status: "Ideation"
    });
    router.push("/workspace");
  };

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20 text-center max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Starting Points</div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-8">Workflow Templates</h1>
          <p className="text-lg text-muted font-light leading-relaxed">
            Accelerate your build with pre-configured project blueprints. Each template initializes a workspace with optimized prompt structures.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES_DATA.map((template, i) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border-subtle rounded-[1.5rem] p-10 flex flex-col h-full group hover:shadow-xl hover:border-black/10 transition-all"
            >
              <div className="w-14 h-14 bg-section rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <template.icon className="w-6 h-6 text-secondary" />
              </div>
              
              <h3 className="text-2xl font-serif mb-4">{template.title}</h3>
              <p className="text-sm text-muted font-light leading-relaxed mb-10 flex-grow">
                {template.desc}
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full h-14 rounded-2xl gap-3 text-[10px] uppercase tracking-widest font-bold shadow-xl"
                >
                  Use Template <Play className="w-3.5 h-3.5 fill-current" />
                </Button>
                <div className="flex items-center justify-between px-2 text-[9px] uppercase tracking-widest font-bold text-muted">
                  <span>{template.category}</span>
                  <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                    Preview <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

const TEMPLATES_DATA = [
  { 
    title: "SaaS Dashboard", 
    desc: "A data-intensive interface with real-time charts, side navigation, and tenant-based auth logic blueprints.", 
    icon: BarChart, 
    category: "Product" 
  },
  { 
    title: "Creative Portfolio", 
    desc: "Minimalist grid focusing on high-end motion, typography rhythm, and spatial layouts for designers.", 
    icon: Layout, 
    category: "Web" 
  },
  { 
    title: "E-Commerce Suite", 
    desc: "Full checkout flow, product catalog, and Stripe integration patterns for high-conversion storefronts.", 
    icon: ShoppingCart, 
    category: "Store" 
  },
  { 
    title: "Marketing Site", 
    desc: "Optimized landing page blueprint with bento grids and SEO-ready semantic architecture.", 
    icon: Rocket, 
    category: "Marketing" 
  },
  { 
    title: "Mobile App Hub", 
    desc: "Responsive, PWA-ready framework with bottom navigation and touch-optimized interactive nodes.", 
    icon: Smartphone, 
    category: "App" 
  },
  { 
    title: "AI Agent Platform", 
    desc: "Blueprint for streaming chat interfaces, role-specific agents, and message history persistence.", 
    icon: Cpu, 
    category: "AI" 
  }
];
