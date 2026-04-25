"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download, ExternalLink, Zap, Terminal, Palette, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    desc: string;
    icon: any;
    tags: string[];
    content?: string;
  } | null;
  mode: "creator" | "developer";
}

export function DetailModal({ isOpen, onClose, item, mode }: DetailModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isCreator = mode === "creator";

  const handleCopy = () => {
    if (item?.content) {
      navigator.clipboard.writeText(item.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border",
              isCreator ? "bg-white border-border-subtle" : "bg-[#0A0A0A] border-white/10 text-white"
            )}
          >
            {/* Sidebar Info */}
            <div className={cn(
              "w-full md:w-96 p-10 flex flex-col shrink-0 border-b md:border-b-0 md:border-r",
              isCreator ? "bg-section border-border-subtle" : "bg-white/5 border-white/10"
            )}>
              <div className="flex-grow">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-xl",
                  isCreator ? "bg-white border border-border-subtle" : "bg-white/10 border border-white/20"
                )}>
                  <item.icon className={cn("w-8 h-8", isCreator ? "text-primary" : "text-blue-500")} />
                </div>
                
                <h2 className="text-4xl font-serif mb-4 tracking-tighter leading-none">{item.title}</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tags.map(t => (
                    <span key={t} className={cn(
                      "text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full",
                      isCreator ? "bg-white border border-border-subtle" : "bg-white/10 border border-white/20"
                    )}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className={cn("text-base leading-relaxed font-light", isCreator ? "text-muted" : "text-white/40")}>
                  {item.desc}
                </p>
              </div>

              <div className="space-y-3 mt-12">
                <Button onClick={handleCopy} className="w-full h-14 rounded-2xl gap-3 text-xs font-bold uppercase tracking-widest shadow-xl">
                  {isCopied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
                </Button>
                <Button variant="secondary" className="w-full h-14 rounded-2xl gap-3 text-xs font-bold uppercase tracking-widest border-border-subtle">
                  Use in Workspace <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="flex-grow flex flex-col bg-transparent overflow-hidden">
              <div className="px-10 py-6 border-b border-current/10 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Prompt Artifact Preview</div>
                <button onClick={onClose} className="p-2 hover:bg-current/10 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-grow p-10 overflow-y-auto no-scrollbar font-mono text-sm leading-loose">
                 <div className={cn(
                   "p-10 rounded-[2rem] border whitespace-pre-wrap",
                   isCreator ? "bg-section border-border-subtle text-secondary" : "bg-black border-white/10 text-white/80"
                 )}>
                   {item.content || `// Prompt Pattern Logic for ${item.title}\n\nAct as an expert ${mode === 'creator' ? 'Creative Director' : 'Systems Architect'}. Your goal is to synthesize the following input using the '${item.title}' technique.\n\n[CONTEXT]\n- Focus on cinematic depth\n- Maintain structural integrity\n- Use spatial reasoning tokens\n\n[EXECUTION]\n1. Analyze the core intent...\n2. Map the visual hierarchy...\n3. Generate the tool-specific output...`}
                 </div>

                 <div className="mt-12 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Integration Instructions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {['Claude', 'Cursor', 'Antigravity'].map(tool => (
                         <div key={tool} className={cn("p-6 rounded-2xl border", isCreator ? "bg-white border-border-subtle" : "bg-white/5 border-white/10")}>
                            <div className="font-bold text-xs mb-2">{tool}</div>
                            <div className="text-[10px] opacity-60">Paste this artifact into a new chat to initialize the pattern.</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
