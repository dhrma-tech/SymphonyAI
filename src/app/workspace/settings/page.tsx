"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Grid3X3, Library, Loader2, Palette, Plus, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const frameworks = ["React", "Next.js", "Vue", "Nuxt", "Svelte", "Vanilla JS", "Angular"];
const styling = ["Tailwind", "CSS Modules", "Styled Components", "Sass", "None"];
const databases = ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Firebase", "Supabase", "None"];
const hosting = ["Vercel", "Netlify", "Railway", "AWS", "GCP", "Self-hosted"];
const tools = [
  ["Cursor", "Best for multi-file app implementation."],
  ["Claude Code", "Best for long reasoning and refactors."],
  ["Antigravity", "Best for autonomous build workflows."],
  ["v0", "Best for UI-first generation."],
  ["Generic IDE", "Best for tool-neutral prompts."],
];

type ContextShape = {
  techStack?: Record<string, string[]>;
  designPrefs?: { keywords?: string[] };
  antiPatterns?: string[] | string;
  defaultTool?: string;
};

export default function WorkspaceSettingsPage() {
  const [context, setContext] = useState<ContextShape>({});
  const [keywordInput, setKeywordInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/workspace/context")
      .then((res) => res.json())
      .then((data) => setContext(data));
  }, []);

  const dirtyPayload = useMemo(() => ({
    techStack: context.techStack || {},
    designPrefs: context.designPrefs || { keywords: [] },
    antiPatterns: Array.isArray(context.antiPatterns)
      ? context.antiPatterns
      : String(context.antiPatterns || "").split(",").map((item) => item.trim()).filter(Boolean),
    defaultTool: context.defaultTool || "Cursor",
  }), [context]);

  function toggle(group: string, value: string) {
    const stack = context.techStack || {};
    const selected = new Set(stack[group] || []);
    if (selected.has(value)) selected.delete(value);
    else selected.add(value);
    setContext({ ...context, techStack: { ...stack, [group]: Array.from(selected) } });
  }

  function addKeyword(value: string) {
    const keyword = value.trim().replace(/,$/, "");
    if (!keyword) return;
    const keywords = new Set(context.designPrefs?.keywords || []);
    keywords.add(keyword);
    setContext({ ...context, designPrefs: { ...(context.designPrefs || {}), keywords: Array.from(keywords).slice(0, 8) } });
    setKeywordInput("");
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/workspace/context", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dirtyPayload),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
    setSaving(false);
  }

  return (
    <main className="flex min-h-screen bg-white text-[#0A0A0A]">
      <SettingsSidebar />
      <section className="min-w-0 flex-1">
        <header className="border-b border-[rgba(0,0,0,0.07)] px-8 py-7">
          <h1 className="text-[24px] font-light tracking-[-0.02em]">Settings</h1>
          <p className="mt-1 text-[14px] text-[#8A8A8A]">Workspace preferences that apply to all new plans.</p>
        </header>
        <div className="mx-auto max-w-[640px] px-8 pb-28">
          <Section title="Workspace Context" sub="These preferences automatically enrich your Brief and Workflow prompts.">
            <ChipGroup label="Preferred Framework" options={frameworks} selected={context.techStack?.framework || []} onToggle={(value) => toggle("framework", value)} />
            <ChipGroup label="Styling Library" options={styling} selected={context.techStack?.styling || []} onToggle={(value) => toggle("styling", value)} />
            <ChipGroup label="Database" options={databases} selected={context.techStack?.database || []} onToggle={(value) => toggle("database", value)} />
            <ChipGroup label="Hosting" options={hosting} selected={context.techStack?.hosting || []} onToggle={(value) => toggle("hosting", value)} />
            <label className="mt-6 block text-[12px] font-semibold">Design Style Keywords</label>
            <div className="mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-2">
              {(context.designPrefs?.keywords || []).map((keyword) => (
                <button key={keyword} onClick={() => setContext({ ...context, designPrefs: { ...(context.designPrefs || {}), keywords: (context.designPrefs?.keywords || []).filter((item) => item !== keyword) } })} className="rounded-full bg-black px-2 py-1 text-[11px] text-white">
                  {keyword} x
                </button>
              ))}
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addKeyword(keywordInput);
                  }
                }}
                placeholder="e.g. minimal, editorial, bold..."
                className="min-w-[180px] flex-1 bg-transparent text-[13px] outline-none"
              />
            </div>
            <label className="mt-6 block text-[12px] font-semibold">Always avoid in generated prompts</label>
            <textarea
              value={Array.isArray(context.antiPatterns) ? context.antiPatterns.join(", ") : context.antiPatterns || ""}
              onChange={(event) => setContext({ ...context, antiPatterns: event.target.value })}
              placeholder="No Redux, avoid inline styles, no class components..."
              className="mt-2 min-h-20 w-full rounded-lg border border-transparent bg-[#F5F5F5] px-3 py-2 text-[13px] outline-none focus:border-black"
            />
          </Section>

          <Section title="AI Tool" sub="Pre-select the target tool for Workflow phases.">
            <div className="grid gap-3 sm:grid-cols-2">
              {tools.map(([tool, description]) => (
                <button key={tool} onClick={() => setContext({ ...context, defaultTool: tool })} className={cn("relative rounded-xl border p-4 text-left", (context.defaultTool || "Cursor") === tool ? "border-2 border-black bg-black/[0.03]" : "border-[#D4D4D4]")}>
                  <span className={cn("absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full border", (context.defaultTool || "Cursor") === tool && "border-black bg-black text-white")}>{(context.defaultTool || "Cursor") === tool && <Check className="h-2.5 w-2.5" />}</span>
                  <div className="text-[14px] font-semibold">{tool}</div>
                  <p className="mt-1 text-[12px] leading-[1.4] text-[#8A8A8A]">{description}</p>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Prompt Performance" sub="Ratings from your past workflow phases.">
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] p-5 text-center text-[13px] text-[#8A8A8A]">
              No ratings yet. Use prompts and rate them to improve future generation.
            </div>
          </Section>
        </div>
        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[rgba(0,0,0,0.07)] bg-white px-8 py-3">
          <button className="h-9 rounded-lg px-4 text-[13px] text-[#4A4A4A] hover:bg-[#F5F5F5]">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white disabled:opacity-40">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </section>
    </main>
  );
}

function SettingsSidebar() {
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
          ["/workspace/settings", "Settings", Settings],
        ].map(([href, label, Icon]) => (
          <Link key={String(href)} href={String(href)} className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-[#4A4A4A] hover:bg-[rgba(10,10,10,0.05)]">
            <Icon className="h-3.5 w-3.5 text-[#8A8A8A]" /> {String(label)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="pt-8">
      <h2 className="text-[16px] font-medium">{title}</h2>
      <p className="mt-1 text-[13px] text-[#8A8A8A]">{sub}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChipGroup({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-[12px] font-semibold">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} onClick={() => onToggle(option)} className={cn("h-7 rounded-full border px-3 text-[12px] font-medium", selected.includes(option) ? "border-black bg-black text-white" : "border-[#D4D4D4] bg-white text-[#4A4A4A] hover:border-[#8A8A8A]")}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
