"use client";

import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Palette, Layers, Smartphone, Bookmark } from "lucide-react";
import { RevealText } from "@/components/shared/RevealText";

type DesignTab = "copy" | "resources" | "colors";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 200
    }
  }
};

export default function DesignsPage() {
  const [activeTab, setActiveTab] = useState<DesignTab>("copy");

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Header />
      
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Magnetic Tab Switcher */}
          <div className="flex justify-center mb-32">
            <div className="bg-section p-1.5 rounded-full flex gap-2 border border-border-subtle shadow-sm relative">
              {[
                { id: "copy", label: "Copy Designs" },
                { id: "resources", label: "Resources" },
                { id: "colors", label: "Colors & Fonts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DesignTab)}
                  className={cn(
                    "relative px-8 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all z-10",
                    activeTab === tab.id ? "text-white" : "text-muted hover:text-primary"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="active-tab-pill"
                      className="absolute inset-0 bg-black rounded-full shadow-lg -z-10"
                      transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "copy" && (
              <motion.section 
                key="copy"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="max-w-3xl mb-20">
                  <RevealText 
                    text="Copy Designs" 
                    className="text-6xl md:text-9xl mb-10 font-serif tracking-tighter leading-none" 
                  />
                  <motion.p variants={itemVariants} className="text-muted text-xl leading-relaxed font-light">
                    Click any reference site to copy a structured AI prompt that extracts and rebuilds its exact design system.
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-16">
                  {["All", "SaaS", "Dark", "Editorial", "Portfolio", "Luxury", "Awards"].map((filter) => (
                    <button key={filter} className="px-6 py-2 rounded-full text-xs border border-border-subtle bg-white text-muted hover:bg-section transition-colors">
                      {filter}
                    </button>
                  ))}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {COPY_DESIGNS.map((ref, i) => (
                    <DesignCard key={ref.name} refData={ref} index={i} />
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "resources" && (
              <motion.section 
                key="resources"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="max-w-3xl mb-20">
                  <RevealText 
                    text="Design Resources" 
                    className="text-6xl md:text-9xl mb-10 font-serif tracking-tighter leading-none" 
                  />
                  <motion.p variants={itemVariants} className="text-muted text-xl leading-relaxed font-light">
                    60+ curated free and freemium tools, assets, and references.
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                  {[
                    { label: "Total resources", value: "63" },
                    { label: "Free tier", value: "47" },
                    { label: "Categories", value: "7" },
                    { label: "Featured", value: "12" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-10 bg-section border border-border-subtle rounded-[2rem] text-center">
                      <div className="text-4xl font-serif mb-1">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {RESOURCES.map((res, i) => (
                    <motion.div 
                      key={res.name}
                      variants={itemVariants}
                      custom={i}
                      className="p-8 bg-white border border-border-subtle rounded-[2.5rem] hover:shadow-card transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-medium">{res.name}</h3>
                        <span className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase bg-green-50 text-green-700 border border-green-100">{res.type}</span>
                      </div>
                      <p className="text-muted text-sm leading-relaxed mb-8">{res.desc}</p>
                      <button className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 group/btn">
                        Explore <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "colors" && (
              <motion.section 
                key="colors"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="max-w-3xl mb-20">
                  <RevealText 
                    text="Colors & Fonts" 
                    className="text-6xl md:text-9xl mb-10 font-serif tracking-tighter leading-none" 
                  />
                  <motion.p variants={itemVariants} className="text-muted text-xl leading-relaxed font-light">
                    Describe your project for AI-matched suggestions. Hover over a palette to "Mirror" the theme.
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="p-10 bg-section border border-border-subtle rounded-[3rem] mb-20">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="e.g. luxury spa ecosystem..."
                      className="flex-grow bg-white border border-border-subtle rounded-2xl py-5 px-8 text-sm outline-none focus:border-black/10 transition-all shadow-sm"
                    />
                    <Button className="h-16 px-12 gap-3 rounded-2xl font-bold uppercase tracking-widest text-xs">Suggest <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PALETTES.map((palette, i) => (
                    <PaletteCard key={palette.name} palette={palette} index={i} />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function DesignCard({ refData, index }: { refData: any, index: number }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white border border-border-subtle rounded-[3rem] overflow-hidden shadow-warm hover:shadow-2xl transition-all group"
    >
      <div className={cn("h-48 flex items-center justify-center border-b border-border-subtle relative overflow-hidden", refData.color)}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
         <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10">
            <div className="w-8 h-8 bg-white rounded-full opacity-40 animate-pulse" />
         </div>
      </div>
      <div className="p-10">
        <h3 className="text-3xl font-medium mb-2 tracking-tight">{refData.name}</h3>
        <p className="text-sm text-muted mb-8 leading-relaxed font-light">{refData.desc}</p>
        <div className="flex flex-wrap gap-2 mb-10">
          {refData.tags.map((tag: string) => (
            <span key={tag} className="text-[9px] px-3 py-1 bg-section border border-border-subtle rounded-full text-muted uppercase tracking-widest font-bold">{tag}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" size="sm" className="rounded-2xl text-[10px] uppercase tracking-widest font-bold py-5">Visit Site</Button>
          <Button size="sm" className="rounded-2xl text-[10px] uppercase tracking-widest font-bold py-5">Copy Prompt</Button>
        </div>
      </div>
    </motion.div>
  );
}

function PaletteCard({ palette, index, setPreview }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-border-subtle rounded-[2.5rem] overflow-hidden shadow-warm transition-all cursor-pointer group"
    >
      <div className="h-24 flex">
        {palette.colors.map((c: string, i: number) => (
          <div key={i} className="flex-grow" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="p-10">
        <h3 className="text-2xl font-medium mb-1 tracking-tight">{palette.name}</h3>
        <p className="text-[10px] text-muted uppercase tracking-[0.2em] mb-8 font-bold">{palette.category}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" className="rounded-xl text-[9px] uppercase tracking-widest font-bold">Tailwind</Button>
          <Button variant="secondary" size="sm" className="rounded-xl text-[9px] uppercase tracking-widest font-bold">CSS Props</Button>
        </div>
      </div>
    </motion.div>
  );
}

const COPY_DESIGNS = [
  { name: "Linear", desc: "Minimal SaaS precision", tags: ["minimal", "dark", "sharp"], color: "bg-[#F7F7F8]" },
  { name: "Luma Labs", desc: "Cinematic AI product design", tags: ["cinematic", "bold", "alive"], color: "bg-[#F5F2EF]" },
  { name: "Vercel", desc: "Premium dark developer brand", tags: ["dark", "minimal", "tech"], color: "bg-black" },
  { name: "Stripe", desc: "Enterprise conversion mastery", tags: ["gradient", "enterprise", "trust"], color: "bg-[#1A2540]" },
  { name: "Awwwards", desc: "Best of web design globally", tags: ["awards", "diverse", "reference"], color: "bg-white" },
  { name: "Reflect", desc: "Soft editorial notes tool", tags: ["editorial", "light", "notes"], color: "bg-[#FAFAFA]" },
];

const RESOURCES = [
  { name: "Spline", type: "freemium", desc: "3D design tool for web" },
  { name: "LottieFiles", type: "free", desc: "JSON animations for web" },
  { name: "Lucide", type: "free", desc: "Clean icon set" },
  { name: "Framer Motion", type: "free", desc: "React animation library" },
  { name: "Shadcn UI", type: "free", desc: "Copy-paste components" },
  { name: "Pexels", type: "free", desc: "Curated stock assets" },
  { name: "Inter Font", type: "free", desc: "The standard UI typeface" },
  { name: "Grains", type: "free", desc: "SVG noise generators" },
];

const PALETTES = [
  { name: "Intercom Warm", category: "Editorial SaaS", colors: ["#000000", "#FFFFFF", "#FF5C00", "#F5E6D3"] },
  { name: "Vercel Dark", category: "Developer Dark", colors: ["#000000", "#171717", "#FFFFFF", "#333333"] },
  { name: "Linear Purple", category: "Precision SaaS", colors: ["#FFFFFF", "#F7F7F8", "#5E6AD2", "#000000"] },
];
