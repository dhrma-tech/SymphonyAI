"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, User, Library, Zap, Palette, Home, Settings } from "lucide-react";
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
    { name: "Design Hub", href: "/designs", icon: Palette },
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] md:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] md:hidden flex flex-col p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded-full" />
                <span className="font-semibold tracking-tight">SymphonyAI</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-section rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-grow space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      isActive ? "bg-black text-white shadow-lg" : "text-secondary hover:bg-section"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-border-subtle space-y-4">
              <Link href="/login" onClick={onClose}>
                <Button className="w-full h-14 rounded-2xl">Sign In</Button>
              </Link>
              <div className="flex justify-center gap-6 pt-4 text-muted text-xs">
                <Link href="#">Terms</Link>
                <Link href="#">Privacy</Link>
                <Link href="#">GitHub</Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
