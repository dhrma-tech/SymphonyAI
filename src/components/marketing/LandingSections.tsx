"use client";

import { motion } from "framer-motion";
import { Button } from "../shared/Button";
import Link from "next/link";
import { ArrowRight, Code2, Layout, Zap, Database } from "lucide-react";

export function TrustStrip() {
  return (
    <div className="py-12 border-y border-border-subtle bg-white">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale">
        <span className="text-xl font-bold tracking-tighter">CLAUDE</span>
        <span className="text-xl font-bold tracking-tighter">CURSOR</span>
        <span className="text-xl font-bold tracking-tighter">GITHUB</span>
        <span className="text-xl font-bold tracking-tighter">STITCH</span>
        <span className="text-xl font-bold tracking-tighter">ANTIGRAVITY</span>
      </div>
    </div>
  );
}

export function FeatureGrid() {
  const features = [
    {
      title: "Structured Strategy",
      description: "Convert vague ideas into precise project synopses and feature lists automatically.",
      icon: Layout,
    },
    {
      title: "Agentic Execution",
      description: "Generate 8-phase prompts optimized for Claude, Copilot, and custom AI agents.",
      icon: Zap,
    },
    {
      title: "Design Language",
      description: "Automated design.md generation with color palettes and font pairings.",
      icon: Code2,
    },
    {
      title: "Skill Library",
      description: "Pre-built LLM skills for debugging, deployment, and systems architecture.",
      icon: Database,
    },
  ];

  return (
    <section className="py-32 px-6 bg-section">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white border border-border-subtle rounded-2xl shadow-card"
            >
              <f.icon className="w-6 h-6 mb-6 stroke-[1.5px]" />
              <h3 className="text-xl mb-4">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-40 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
          Ready to build your next <br />
          digital masterpiece?
        </h2>
        <p className="text-muted text-lg mb-12 max-w-xl mx-auto">
          Join the next generation of AI-assisted developers and start building with SymphonyAI today.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="h-14 px-10">Get Started for Free</Button>
        </Link>
      </div>
    </section>
  );
}
