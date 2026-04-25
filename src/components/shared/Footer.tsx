"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border-subtle py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded-md" />
            <span className="font-semibold tracking-tighter">SymphonyAI</span>
          </div>
          <p className="text-xs text-muted leading-relaxed max-w-xs">
            The Prompt Operating System for high-performance AI-assisted development. Convert ideas into execution phases instantly.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted mb-6">Product</h4>
          <ul className="space-y-4">
            <li><Link href="/workspace" className="text-xs text-secondary hover:text-primary transition-colors">Workspace</Link></li>
            <li><Link href="/library" className="text-xs text-secondary hover:text-primary transition-colors">Pattern Library</Link></li>
            <li><Link href="/templates" className="text-xs text-secondary hover:text-primary transition-colors">Templates</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted mb-6">Resources</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Documentation</Link></li>
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">API Guide</Link></li>
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Changelog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted mb-6">Connect</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">GitHub</Link></li>
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Twitter</Link></li>
            <li><Link href="#" className="text-xs text-secondary hover:text-primary transition-colors">Support</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-muted uppercase font-bold tracking-widest">© 2026 SymphonyAI Orchestrator. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="text-[10px] text-muted uppercase font-bold tracking-widest hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="text-[10px] text-muted uppercase font-bold tracking-widest hover:text-primary">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
