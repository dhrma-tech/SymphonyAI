"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User, FolderOpen } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-border-subtle/50">
        <nav className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 bg-black rounded-md transition-transform group-hover:scale-110 shadow-sm" />
            <span className="text-base font-semibold tracking-tighter">SymphonyAI</span>
          </Link>

          <div className="flex items-center gap-12">
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/workspace" 
                className={cn(
                  "text-[11px] uppercase tracking-widest font-bold transition-colors",
                  pathname.startsWith("/workspace") ? "text-primary" : "text-muted hover:text-primary"
                )}
              >
                Workspace
              </Link>
              <Link 
                href="/library" 
                className={cn(
                  "text-[11px] uppercase tracking-widest font-bold transition-colors",
                  pathname === "/library" ? "text-primary" : "text-muted hover:text-primary"
                )}
              >
                Library
              </Link>
              <Link 
                href="/templates" 
                className={cn(
                  "text-[11px] uppercase tracking-widest font-bold transition-colors",
                  pathname === "/templates" ? "text-primary" : "text-muted hover:text-primary"
                )}
              >
                Templates
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <div className="hidden sm:flex items-center gap-4 p-1.5 bg-section rounded-full border border-border-subtle">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    {session.user?.name?.[0]}
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="pr-2 text-[10px] uppercase tracking-widest font-bold text-muted hover:text-red-600 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button size="sm" className="rounded-full shadow-sm text-[10px] uppercase tracking-widest font-bold px-6 h-10">Sign In</Button>
                </Link>
              )}
              
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
