"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, ExternalLink, Check, Code, FileText, Terminal, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Artifact {
  id: string;
  filename: string;
  language: string;
  content: string;
  icon: any;
}

const MOCK_ARTIFACTS: Artifact[] = [
  { 
    id: "1", 
    filename: "schema.prisma", 
    language: "prisma", 
    icon: Terminal,
    content: `datasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}\n\nmodel Project {\n  id        String   @id @default(cuid())\n  title     String\n  idea      String\n  features  String   // JSON array\n  status    String   @default("Active")\n  createdAt DateTime @default(now())\n}`
  },
  { 
    id: "2", 
    filename: "globals.css", 
    language: "css", 
    icon: Palette,
    content: `:root {\n  --background: #ffffff;\n  --primary: #000000;\n  --accent: #FF5C00;\n  --glass-blur: 12px;\n}\n\n.glass {\n  backdrop-filter: blur(var(--glass-blur));\n  background: rgba(255, 255, 255, 0.7);\n}`
  },
  { 
    id: "3", 
    filename: "Hero.tsx", 
    language: "typescript", 
    icon: Code,
    content: `export function Hero() {\n  return (\n    <section className="pt-32 pb-20 px-6">\n      <h1 className="text-8xl font-serif leading-tight">\n        From idea to execution.\n      </h1>\n    </section>\n  );\n}`
  },
];

interface ArtifactEngineProps {
  isOpen: boolean;
  onClose: () => void;
  isStreaming?: boolean;
}

export function ArtifactEngine({ isOpen, onClose, isStreaming }: ArtifactEngineProps) {
  const [activeTab, setActiveTab] = useState(MOCK_ARTIFACTS[0]);
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");

  // Streaming Effect
  useEffect(() => {
    if (isStreaming && isOpen) {
      let i = 0;
      const fullContent = activeTab.content;
      setDisplayedContent("");
      const interval = setInterval(() => {
        setDisplayedContent(fullContent.slice(0, i));
        i += 5;
        if (i > fullContent.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(activeTab.content);
    }
  }, [isStreaming, isOpen, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-[600px] bg-[#0A0A0A] text-white z-[200] shadow-2xl flex flex-col border-l border-white/10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white/60" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Project Artifacts</h2>
                {isStreaming && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Streaming Architecture</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center px-4 bg-black/20 border-b border-white/10 overflow-x-auto no-scrollbar">
            {MOCK_ARTIFACTS.map(artifact => (
              <button
                key={artifact.id}
                onClick={() => setActiveTab(artifact)}
                className={cn(
                  "px-4 py-3 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab.id === artifact.id 
                    ? "border-white text-white bg-white/5" 
                    : "border-transparent text-white/40 hover:text-white/60"
                )}
              >
                <artifact.icon className="w-3 h-3" />
                {artifact.filename}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-grow overflow-auto p-8 font-mono text-[13px] leading-relaxed relative selection:bg-white/20">
            <pre className="text-white/80">
              <code>{displayedContent}</code>
              <motion.span 
                animate={{ opacity: [0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-4 bg-white/60 ml-0.5 translate-y-0.5"
              />
            </pre>
          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md grid grid-cols-3 gap-3">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Code"}
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
              <ExternalLink className="w-3.5 h-3.5" />
              To Cursor
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
