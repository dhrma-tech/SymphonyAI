import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-section border-t border-border mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-black rounded-full" />
              <span className="font-normal text-base tracking-tight">SymphonyAI</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-[200px]">
              Structured AI workflows for digital product development.
            </p>
          </div>
          
          <div>
            <ul className="space-y-2">
              <li><Link href="/workspace" className="text-muted text-sm hover:text-primary transition-colors">Workspace</Link></li>
              <li><Link href="/library" className="text-muted text-sm hover:text-primary transition-colors">Library</Link></li>
              <li><Link href="/skills" className="text-muted text-sm hover:text-primary transition-colors">LLM Skills</Link></li>
              <li><Link href="/designs" className="text-muted text-sm hover:text-primary transition-colors">Design Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-muted text-sm hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-muted text-sm hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-muted text-sm hover:text-primary transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted text-sm hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="text-muted text-sm hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-muted text-sm hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">© 2026 SymphonyAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted hover:text-primary text-xs transition-colors">Twitter</Link>
            <Link href="#" className="text-muted hover:text-primary text-xs transition-colors">GitHub</Link>
            <Link href="#" className="text-muted hover:text-primary text-xs transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
