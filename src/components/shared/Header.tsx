"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center px-6 md:px-12 glass border-b border-border-subtle/50">
        <nav className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 bg-black rounded-full transition-transform group-hover:scale-110" />
            <span className="text-base font-semibold tracking-tighter">SymphonyAI</span>
          </Link>

          <div className="flex items-center gap-12">
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/workspace" 
                className={cn(
                  "text-xs font-normal transition-colors tracking-tight",
                  pathname.startsWith("/workspace") ? "text-primary font-medium" : "text-secondary hover:text-primary"
                )}
              >
                Workspace
              </Link>
              <Link 
                href="/library" 
                className={cn(
                  "text-xs font-normal transition-colors tracking-tight",
                  pathname === "/library" ? "text-primary font-medium" : "text-secondary hover:text-primary"
                )}
              >
                Library
              </Link>
              <Link 
                href="/skills" 
                className={cn(
                  "text-xs font-normal transition-colors tracking-tight",
                  pathname === "/skills" ? "text-primary font-medium" : "text-secondary hover:text-primary"
                )}
              >
                LLM Skills
              </Link>
              <Link 
                href="/designs" 
                className={cn(
                  "text-xs font-normal transition-colors tracking-tight",
                  pathname === "/designs" ? "text-primary font-medium" : "text-secondary hover:text-primary"
                )}
              >
                Design Hub
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block">
                <Button size="sm" className="rounded-full shadow-sm text-xs font-medium">Sign In</Button>
              </Link>
              
              <button 
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden p-2 hover:bg-section rounded-full transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />
    </>
  );
}
