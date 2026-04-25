"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { ArrowRight, Layers, Globe } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_70%)]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-white border border-border-subtle rounded-[3rem] p-12 md:p-16 shadow-warm relative z-10"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-6 h-6 bg-black rounded-full" />
            <span className="text-xl font-semibold tracking-tighter">SymphonyAI</span>
          </Link>
          <h1 className="text-4xl font-serif mb-4">Welcome back</h1>
          <p className="text-muted text-sm leading-relaxed">
            Sign in to access your AI planning workspace and resume orchestration.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Button variant="secondary" className="w-full h-14 rounded-2xl gap-3 text-sm font-medium border-border-subtle hover:bg-section transition-all">
            <Layers className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <Button variant="secondary" className="w-full h-14 rounded-2xl gap-3 text-sm font-medium border-border-subtle hover:bg-section transition-all">
            <Globe className="w-5 h-5" />
            Continue with Google
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground"><span className="bg-white px-4 text-muted">Or continue with email</span></div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted px-1">Email address</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              className="w-full h-14 rounded-2xl border border-border-subtle px-6 text-sm outline-none focus:border-primary/20 transition-all bg-section/30"
            />
          </div>
          <Link href="/workspace">
            <Button className="w-full h-14 rounded-2xl gap-2 font-bold uppercase tracking-widest text-xs mt-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted leading-relaxed">
          Don't have an account? <Link href="#" className="text-primary font-medium hover:underline">Start for free</Link>
        </p>
      </motion.div>

      {/* Footer minimal */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
          Cinematic Orchestration Engine v1.0
        </p>
      </div>
    </main>
  );
}
