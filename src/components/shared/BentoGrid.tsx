"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Copy, Sparkles } from "lucide-react";

interface BentoItemProps {
  title: string;
  category: string;
  tags: string[];
  className?: string;
  index: number;
}

export function BentoItem({ title, category, tags, className, index }: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "bento-item p-8 flex flex-col justify-between group",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase tracking-widest text-muted">{category}</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button className="p-2 hover:bg-section rounded-xl border border-border-subtle bg-white shadow-sm transition-all">
            <Copy className="w-3.5 h-3.5 text-muted" />
          </button>
          <button className="p-2 hover:bg-section rounded-xl border border-border-subtle bg-white shadow-sm transition-all">
            <Sparkles className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl mb-4 font-serif leading-tight">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 bg-section border border-border-subtle rounded-full text-muted">{tag}</span>
          ))}
        </div>
      </div>

      {/* Subtle interactive background glow */}
      <div className="absolute -inset-px bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
