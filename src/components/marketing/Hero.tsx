"use client";

import { motion } from "framer-motion";
import { Button } from "../shared/Button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block px-3 py-1 bg-section border border-border-subtle rounded-full text-[10px] uppercase tracking-widest text-muted mb-8">
            Prompt Operating System
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl mb-8 leading-[0.85] font-serif tracking-tight">
            From idea to execution — <br />
            structured AI workflows.
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            SymphonyAI turns plain-English ideas into step-by-step prompt systems 
            for planning, designing, building, and deploying digital products.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/dashboard">
              <Button size="lg">Start Building</Button>
            </Link>
            <Link href="/library">
              <Button variant="secondary" size="lg">Explore Library</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-warm border border-border-subtle">
            <Image
              src="/symphony_ui_preview_1777076560344.png"
              alt="SymphonyAI Workstation"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Subtle gradient overlay for cinematic feel */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white via-transparent to-transparent opacity-20" />
        </motion.div>
      </div>
    </section>
  );
}
