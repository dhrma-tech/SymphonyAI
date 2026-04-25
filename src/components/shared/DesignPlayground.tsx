"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, X, Sliders, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function DesignPlayground() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    grain: 0.05,
    blur: 12,
    radius: 40,
    accent: "#FF5C00"
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--grain-opacity", config.grain.toString());
    root.style.setProperty("--glass-blur", `${config.blur}px`);
    root.style.setProperty("--card-radius", `${config.radius}px`);
    root.style.setProperty("--color-accent", config.accent);
  }, [config]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 left-10 z-[500] w-12 h-12 bg-white border border-border-subtle text-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all md:flex hidden"
        title="Design System Playground"
      >
        <Sliders className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[400px] bg-white z-[1002] border-r border-border-subtle p-12 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-serif">Aesthetic Playground</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-section rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                <section className="space-y-6">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Global Effects</div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Grain Intensity</label>
                      <span className="text-xs text-muted">{(config.grain * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="0.2" step="0.01" 
                      value={config.grain} 
                      onChange={(e) => setConfig({...config, grain: parseFloat(e.target.value)})}
                      className="w-full accent-black"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Glass Blur</label>
                      <span className="text-xs text-muted">{config.blur}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" step="1" 
                      value={config.blur} 
                      onChange={(e) => setConfig({...config, blur: parseInt(e.target.value)})}
                      className="w-full accent-black"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Border Radius</label>
                      <span className="text-xs text-muted">{config.radius}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="80" step="4" 
                      value={config.radius} 
                      onChange={(e) => setConfig({...config, radius: parseInt(e.target.value)})}
                      className="w-full accent-black"
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Brand Color</div>
                  <div className="grid grid-cols-5 gap-3">
                    {["#FF5C00", "#0066FF", "#5E6AD2", "#000000", "#10B981"].map(color => (
                      <button 
                        key={color}
                        onClick={() => setConfig({...config, accent: color})}
                        className={cn(
                          "w-12 h-12 rounded-xl border-2 transition-all",
                          config.accent === color ? "border-primary scale-110 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </section>

                <div className="pt-10 border-t border-border-subtle">
                  <Button className="w-full h-14 rounded-2xl" onClick={() => setIsOpen(false)}>Apply Global Theme</Button>
                  <p className="text-center text-[10px] text-muted font-medium mt-6 uppercase tracking-widest">Settings persist in session</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
