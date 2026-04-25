"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { Zap, Clock, ArrowRight, Layout, Database, Shield, Globe, Cpu } from "lucide-react";

const TEMPLATES = [
  {
    title: "SaaS Launch Engine",
    desc: "A complete orchestration for modern B2B SaaS products including pricing models and user dashboards.",
    icon: Layout,
    difficulty: "Beginner",
    time: "5 min",
    tags: ["Next.js", "Tailwind", "Stripe"]
  },
  {
    title: "AI Agent Framework",
    desc: "Pre-built logic for multi-agent systems that communicate via shared memory and tool-calling.",
    icon: Cpu,
    difficulty: "Advanced",
    time: "15 min",
    tags: ["Python", "LangGraph", "Docker"]
  },
  {
    title: "Enterprise E-commerce",
    desc: "Scalable architecture for global commerce with high-performance product indexing and checkout.",
    icon: Database,
    difficulty: "Intermediate",
    time: "10 min",
    tags: ["Remix", "Shopify", "Vercel"]
  },
  {
    title: "Design System Master",
    desc: "Extract and build a comprehensive design system from a brand idea, including tokens and UI kits.",
    icon: Palette,
    difficulty: "Beginner",
    time: "3 min",
    tags: ["Figma", "Tokens", "Storybook"]
  }
];

function Palette({ className }: { className?: string }) {
  return <PaletteIcon className={className} />;
}
function PaletteIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.39 2.3-1 .6-.61 1-1.38 1-2.3 0-1.27-1.03-2.3-2.3-2.3H11c-1.45 0-2.7-1.15-2.7-2.6 0-1.45 1.15-2.7 2.6-2.7h1.4c2.09 0 3.7 1.61 3.7 3.7 0 .1 0 .21-.01.31.01-.01.02-.01.03-.01.92 0 1.7.39 2.3 1 .61.61 1 1.38 1 2.3 0 5.52-4.48 10-10 10-5.52 0-10-4.48-10-10S6.48 2 12 2z"/></svg>;
}

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-24">
            <h1 className="text-6xl md:text-8xl mb-8 font-serif leading-[0.9]">
              Workflow <br /> Templates
            </h1>
            <p className="text-muted text-xl leading-relaxed">
              Accelerate your build with pre-built orchestration blueprints designed for performance and scale.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((template, i) => (
              <div key={i} className="group p-10 bg-section border border-border-subtle rounded-[2.5rem] hover:bg-white hover:shadow-card transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-14 h-14 bg-white border border-border-subtle rounded-2xl flex items-center justify-center shadow-sm group-hover:border-primary/20 transition-colors">
                      <template.icon className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white border border-border-subtle rounded-full text-[9px] uppercase tracking-widest font-bold text-muted">
                        {template.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-white border border-border-subtle rounded-full text-[9px] uppercase tracking-widest font-bold text-muted flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {template.time}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-medium mb-4 tracking-tight">{template.title}</h3>
                  <p className="text-muted text-base leading-relaxed mb-10 max-w-md">{template.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-12">
                    {template.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-3 py-1 bg-white/50 border border-border-subtle rounded-full text-secondary font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-muted font-medium">Orchestration Ready</span>
                  <Button className="rounded-2xl px-8 gap-2 group-hover:translate-x-1 transition-transform">
                    Use Template <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Section */}
          <div className="mt-24 p-12 bg-[#0A0A0A] rounded-[3rem] text-center text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif">Need something bespoke?</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Describe your unique business logic and our AI will architect a custom template from scratch in seconds.
              </p>
              <Button variant="secondary" className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-14 font-bold uppercase tracking-widest text-xs">
                Create Custom Blueprint
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
