"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Archive, Copy, Grid3X3, Library, Palette, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { normalizeStage, WorkflowStage } from "@/lib/workflow";

type Project = {
  id: string;
  title: string;
  status: string;
  stage: WorkflowStage;
  activeStage: WorkflowStage;
  updatedAt: string;
  createdAt: string;
  briefPack?: { answers?: { problem?: string } };
};

const colors: Record<WorkflowStage, string> = {
  BRIEF: "#7C3AED",
  BLUEPRINT: "#1D4ED8",
  DESIGN: "#0891B2",
  WORKFLOW: "#059669",
};

export default function WorkspacePlansPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("ALL");

  useEffect(() => {
    fetch("/api/workspace").then((res) => res.json()).then((data) => setProjects(Array.isArray(data) ? data : []));
  }, []);

  const filtered = useMemo(() => projects.filter((project) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || `${project.title} ${project.status}`.toLowerCase().includes(q);
    const normalized = normalizeStage(project.stage || project.activeStage);
    const matchesStage = stage === "ALL" || normalized === stage;
    return matchesQuery && matchesStage;
  }), [projects, query, stage]);

  return (
    <main className="flex min-h-screen bg-white text-[#0A0A0A]">
      <PlansSidebar />
      <section className="min-w-0 flex-1">
        <header className="flex items-center justify-between px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[24px] font-light tracking-[-0.02em]">All Plans</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#C0C0C0]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search plans..." className="h-9 w-[280px] rounded-lg border border-[#D4D4D4] pl-9 pr-3 text-[13px] outline-none focus:border-black" />
              </div>
              <select value={stage} onChange={(event) => setStage(event.target.value)} className="h-9 rounded-lg border border-[#D4D4D4] px-3 text-[13px] outline-none">
                <option value="ALL">All stages</option>
                <option value="BRIEF">Brief</option>
                <option value="BLUEPRINT">Blueprint</option>
                <option value="DESIGN">Design</option>
                <option value="WORKFLOW">Workflow</option>
              </select>
            </div>
          </div>
          <Link href="/workspace" className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white"><Plus className="h-4 w-4" /> New Plan</Link>
        </header>
        <div className="mx-auto max-w-[900px] px-8">
          <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.07)]">
            <div className="grid h-9 grid-cols-[1fr_120px_130px_120px] items-center bg-[#FAFAFA] px-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A8A8A]">
              <span>Title</span><span>Stage</span><span>Last updated</span><span>Actions</span>
            </div>
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-[14px] text-[#8A8A8A]">{projects.length ? `No plans match "${query}"` : "No plans yet"}</div>
            ) : filtered.map((project) => {
              const normalized = normalizeStage(project.stage || project.activeStage);
              return (
                <Link key={project.id} href={`/workspace?id=${project.id}`} className="grid min-h-[52px] grid-cols-[1fr_120px_130px_120px] items-center border-t border-[rgba(0,0,0,0.05)] px-4 hover:bg-[#FAFAFA]">
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium">{project.title}</span>
                    <span className="block truncate text-[12px] text-[#8A8A8A]">{project.briefPack?.answers?.problem || project.status}</span>
                  </span>
                  <span className="w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ backgroundColor: `${colors[normalized]}1F`, color: colors[normalized] }}>{normalized}</span>
                  <span className="text-[13px] text-[#8A8A8A]">recent</span>
                  <span className="flex gap-1 opacity-60">
                    <Copy className="h-4 w-4" /><Archive className="h-4 w-4" /><Trash2 className="h-4 w-4 text-[#DC2626]" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function PlansSidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] md:flex">
      <div className="flex h-[52px] items-center justify-between border-b border-[rgba(0,0,0,0.07)] px-4">
        <Link href="/workspace" className="text-[15px] font-semibold tracking-[-0.02em]">Archon</Link>
        <Link href="/workspace" className="grid h-7 w-7 place-items-center rounded-md border border-[#D4D4D4]"><Plus className="h-3.5 w-3.5" /></Link>
      </div>
      <nav className="p-2">
        {[
          ["/library", "Library", Library],
          ["/skills", "LLM Skills", Sparkles],
          ["/designs", "Designs", Palette],
          ["/templates", "Templates", Grid3X3],
        ].map(([href, label, Icon]) => (
          <Link key={String(href)} href={String(href)} className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-[#4A4A4A] hover:bg-[rgba(10,10,10,0.05)]">
            <Icon className="h-3.5 w-3.5 text-[#8A8A8A]" /> {String(label)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
