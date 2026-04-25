"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { RevealText } from "@/components/shared/RevealText";
import { ArrowRight, Zap, Palette, Terminal, Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-primary font-sans overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-60 md:pb-52 px-6">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-section border border-border-subtle mb-10"
          >
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cinematic Orchestration v1.0</span>
          </motion.div>

          <RevealText 
            text="From idea to execution." 
            className="text-7xl md:text-[10rem] font-serif leading-[0.85] tracking-tighter mb-12"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-muted text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-normal"
          >
            The world's most immersive AI orchestrator. Architect complex digital products with cinematic precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/workspace">
              <Button className="h-16 px-12 rounded-[1.25rem] gap-3 text-sm font-bold uppercase tracking-widest shadow-xl shadow-black/5 active:scale-95 transition-all">
                Enter Workspace <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="secondary" className="h-16 px-12 rounded-[1.25rem] text-sm font-bold uppercase tracking-widest border-border-subtle bg-white hover:bg-section active:scale-95 transition-all">
                Explore Library
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Backdrop Ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)]" />
        </div>
      </section>

      {/* Bento Showcase */}
      <section className="py-32 px-6 bg-section">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 interactive-card p-12 bg-white border border-border-subtle rounded-[3rem] shadow-warm flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-section rounded-2xl flex items-center justify-center mb-12">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-5xl font-serif mb-6 leading-tight">Prompt <br /> Operating System</h3>
                <p className="text-muted text-lg max-w-md">A structured workspace for high-stakes AI orchestration. Multi-agent coordination with full persistence.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-[40%] h-[60%] bg-gradient-to-tl from-black/[0.02] to-transparent rounded-tl-[10rem] translate-y-8 translate-x-8 group-hover:translate-y-4 group-hover:translate-x-4 transition-transform duration-700" />
            </div>

            <div className="interactive-card p-12 bg-white border border-border-subtle rounded-[3rem] shadow-warm flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-section rounded-2xl flex items-center justify-center mb-12">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-serif mb-6">Design Hub</h3>
                <p className="text-muted">Extract and mirror the world's best design systems instantly.</p>
              </div>
              <Link href="/designs" className="mt-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                Browse Palettes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="interactive-card p-12 bg-white border border-border-subtle rounded-[3rem] shadow-warm flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-section rounded-2xl flex items-center justify-center mb-12">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-serif mb-6">Expert Skills</h3>
                <p className="text-muted">Master the art of prompting with 50+ specialized LLM techniques.</p>
              </div>
              <Link href="/skills" className="mt-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                View Techniques <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="md:col-span-2 interactive-card p-12 bg-[#0A0A0A] text-white rounded-[3rem] flex items-center justify-between group overflow-hidden relative">
              <div className="relative z-10 max-w-xl">
                <h3 className="text-5xl font-serif mb-6">Ready to build?</h3>
                <p className="text-white/60 text-lg mb-10">Join thousands of architects building the future of AI orchestration.</p>
                <Link href="/login">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-14 font-bold uppercase tracking-widest text-xs">Get Started ↗</Button>
                </Link>
              </div>
              <div className="hidden md:block absolute right-[-10%] top-[-10%] w-[50%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
