"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, User, Library, Zap, Palette, Home, Layout } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Workspace", href: "/workspace", icon: User },
    { name: "Library", href: "/library", icon: Library },
    { name: "LLM Skills", href: "/skills", icon: Zap },
    { name: "Web Design Library", href: "/designs", icon: Palette },
    { name: "Templates", href: "/templates", icon: Layout },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] flex flex-col p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded-md shadow-sm" />
                <span className="font-semibold tracking-tighter">SymphonyAI</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-section rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all",
                      isActive ? "bg-black text-white shadow-lg" : "text-muted hover:bg-section hover:text-black"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-border-subtle space-y-4">
              <Link href="/login" onClick={onClose}>
                <Button className="w-full h-14 rounded-2xl text-[10px] uppercase tracking-widest font-bold">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
