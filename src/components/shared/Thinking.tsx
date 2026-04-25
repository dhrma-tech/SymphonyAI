"use client";

import { motion } from "framer-motion";

export function ThinkingAnimation() {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-8 h-8 rounded-full bg-section border border-border-subtle flex items-center justify-center shrink-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-3 h-3 bg-black rounded-sm"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-1.5 p-5 bg-section/50 rounded-2xl rounded-tl-none border border-border-subtle/30">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -4, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-black rounded-full"
            />
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold"
        >
          Orchestrating Workflow...
        </motion.div>
      </div>
    </div>
  );
}
