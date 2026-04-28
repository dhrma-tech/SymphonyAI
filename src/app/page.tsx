"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Clock, Layers, Code, Palette, Smartphone, Layout, Rocket } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter leading-[0.85] mb-10 max-w-5xl mx-auto"
          >
            Turn ideas into <span className="text-muted italic">structured</span> execution.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            SymphonyAI bridges the gap between raw ideas and complex AI builds. Generate tool-specific prompts for planning, designing, and engineering digital products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/workspace">
              <Button className="h-16 px-10 rounded-2xl text-[10px] uppercase tracking-widest font-bold shadow-2xl">
                Start Building <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="secondary" className="h-16 px-10 rounded-2xl text-[10px] uppercase tracking-widest font-bold border-border-subtle">
                Explore Library
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Abstract Hero Visual */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-black/[0.02] rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-black/[0.03] rounded-full"
          />
        </div>
      </section>

      {/* Concrete Use Cases */}
      <section className="py-32 px-6 bg-section/50 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <UseCase 
              icon={Layout} 
              title="Landing Pages" 
              desc="Convert a simple description into a high-end, cinematic web experience with specific prompts for Cursor and Framer Motion."
            />
            <UseCase 
              icon={Smartphone} 
              title="SaaS Dashboards" 
              desc="Generate relational schemas, authentication logic, and responsive UI nodes designed for production-ready products."
            />
            <UseCase 
              icon={Rocket} 
              title="Full-Stack Apps" 
              desc="Orchestrate multi-phase builds across Claude and GitHub Copilot with synchronized prompts for frontend and backend."
            />
          </div>
        </div>
      </section>

      {/* 3-Step Flow */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">The Workflow</div>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight">Three steps to execution.</h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-subtle -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-32 relative z-10">
            <Step 
              number="01" 
              title="Describe your vision." 
              desc="Type your idea in plain English. Our Discovery engine analyzes intent, technology needs, and project scope instantly."
              align="left"
            />
            <Step 
              number="02" 
              title="Refine the architecture." 
              desc="Answer clarifying questions to sharpen the blueprint. We suggest features, tech stacks, and visual design tokens."
              align="right"
            />
            <Step 
              number="03" 
              title="Get tool-ready prompts." 
              desc="SymphonyAI generates optimized prompts for each phase. Copy, paste into Claude or Cursor, and watch your product come to life."
              align="left"
            />
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">Beyond generation.</h2>
            <p className="text-lg text-white/40 max-w-xl font-light">Curated resources to accelerate every layer of your digital product build.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PillarCard icon={Layers} title="Prompt Library" desc="Curated patterns for UI, Logic, and AI." href="/library" />
            <PillarCard icon={Layout} title="Templates" desc="Ready-to-use project blueprints." href="/templates" />
            <PillarCard icon={Zap} title="LLM Skills" desc="Advanced techniques for prompt engineering." href="/library" />
            <PillarCard icon={Palette} title="Design System" desc="Visual tokens, colors, and font pairings." href="/library" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function UseCase({ icon: Icon, title, desc }: any) {
  return (
    <div className="space-y-6 group">
      <div className="w-14 h-14 bg-white border border-border-subtle rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
        <Icon className="w-6 h-6 text-secondary" />
      </div>
      <h3 className="text-2xl font-serif tracking-tight">{title}</h3>
      <p className="text-sm text-muted font-light leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc, align }: any) {
  return (
    <div className={cn("flex flex-col md:flex-row items-center gap-12", align === "right" && "md:flex-row-reverse")}>
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className={cn("space-y-6 px-4 md:px-12", align === "right" ? "text-left md:text-right" : "text-left")}>
          <div className="text-5xl font-serif text-muted italic opacity-20">{number}</div>
          <h3 className="text-3xl font-serif tracking-tight">{title}</h3>
          <p className="text-base text-muted font-light leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="w-full md:w-1/2" />
    </div>
  );
}

function PillarCard({ icon: Icon, title, desc, href }: any) {
  return (
    <Link href={href} className="block p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group h-full">
      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-sm text-white/40 font-light leading-relaxed mb-8">{desc}</p>
      <div className="text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
