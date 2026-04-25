"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <h1 className="text-6xl md:text-8xl mb-8 font-serif leading-[0.9]">
              LLM <br /> Skills
            </h1>
            <p className="text-muted text-xl leading-relaxed">
              Techniques, repos, and guides that make AI tools 10x better.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-20 pb-8 border-b border-border-subtle">
            {["All", "Claude", "Cursor", "Antigravity", "All LLMs"].map((filter) => (
              <button
                key={filter}
                className={cn(
                  "px-8 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all border border-border-subtle font-bold",
                  filter === "All" ? "bg-black text-white" : "bg-white text-muted hover:text-primary hover:border-primary/20"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                tool: "Cursor",
                title: ".cursorrules — Project-Wide AI Rules",
                desc: "A standardized set of rules that force Cursor's AI to adhere to specific architecture, naming conventions, and file structures.",
                steps: [
                  "Create .cursorrules in root",
                  "Define stack + conventions",
                  "Add forbidden patterns",
                  "Restart Cursor"
                ]
              },
              {
                tool: "Claude",
                title: "Artifacts Orchestration",
                desc: "Mastering the multi-turn context window to build full React components within Claude's artifact environment.",
                steps: [
                  "Initialize context",
                  "Define design system tokens",
                  "Iterate component blocks",
                  "Refine UI interaction"
                ]
              },
              {
                tool: "Antigravity",
                title: "Agentic Tool Use",
                desc: "Instructional guides for connecting Antigravity to local CLI tools and automated browser testing sessions.",
                steps: [
                  "Register MCP servers",
                  "Configure environment vars",
                  "Define tool permissions",
                  "Execute orchestration"
                ]
              },
              {
                tool: "All LLMs",
                title: "Chain-of-Thought Prompting",
                desc: "Universal techniques to force LLMs to think out loud before providing the final answer, reducing hallucinations by 40%.",
                steps: [
                  "Step-by-step reasoning",
                  "Self-correction loop",
                  "Output verification",
                  "Final distillation"
                ]
              },
            ].map((skill, i) => (
              <div key={i} className="p-10 bg-section border border-border-subtle rounded-[2.5rem] hover:shadow-card transition-all group flex flex-col justify-between hover:bg-white">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted bg-white border border-border-subtle px-3 py-1 rounded-full">{skill.tool}</span>
                  </div>
                  
                  <h3 className="text-2xl font-medium mb-4 tracking-tight">{skill.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-8 line-clamp-2">{skill.desc}</p>
                  
                  <div className="space-y-4 mb-12">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">How to apply:</div>
                    <ul className="space-y-2">
                      {skill.steps.map((step, j) => (
                        <li key={j} className="flex items-center gap-3 text-xs text-secondary">
                          <div className="w-1.5 h-1.5 rounded-full bg-border-subtle group-hover:bg-black transition-colors" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-border-subtle">
                  <Button variant="ghost" className="px-0 h-auto hover:bg-transparent group-hover:translate-x-1 transition-transform font-bold text-xs uppercase tracking-widest">
                    View on GitHub →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
