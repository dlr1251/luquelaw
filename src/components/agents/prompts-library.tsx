"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { LibraryPrompt, LibrarySkill } from "@/lib/agents/get-agents";
import type { ClkrCategory } from "@/lib/clkr/types";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";
import { cn } from "@/lib/utils";

type Tab = "prompts" | "skills";

type Props = {
  prompts: LibraryPrompt[];
  skills: LibrarySkill[];
  locale: "en" | "es";
  initialTab?: Tab;
};

export function PromptsLibrary({ prompts, skills, locale, initialTab = "prompts" }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClkrCategory | "All">("All");

  const copy =
    locale === "es"
      ? {
          search: "Buscar",
          searchPlaceholder: "Título, tema o tarea…",
          filter: "Área",
          all: "Todas",
          empty: "Sin resultados.",
          prompt: "Prompt",
          skill: "Skill",
          view: "Ver",
        }
      : {
          search: "Search",
          searchPlaceholder: "Title, topic, or task…",
          filter: "Practice area",
          all: "All",
          empty: "No matches.",
          prompt: "Prompt",
          skill: "Skill",
          view: "View",
        };

  const categoryLabels: Record<ClkrCategory, string> =
    locale === "es"
      ? {
          Immigration: "Inmigración",
          "Real Estate": "Inmobiliario",
          Corporate: "Corporativo",
          Labor: "Laboral",
          Civil: "Civil",
          Family: "Familia",
          Tax: "Tributario",
          Digital: "Digital",
          Administrative: "Administrativo",
          IP: "Propiedad intelectual",
          Criminal: "Penal",
          International: "Internacional",
        }
      : {
          Immigration: "Immigration",
          "Real Estate": "Real Estate",
          Corporate: "Corporate",
          Labor: "Labor",
          Civil: "Civil",
          Family: "Family",
          Tax: "Tax",
          Digital: "Digital",
          Administrative: "Administrative",
          IP: "IP",
          Criminal: "Criminal",
          International: "International",
        };

  const items = tab === "prompts" ? prompts : skills;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, query, category, tab]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return CLKR_CATEGORIES.filter((c) => set.has(c));
  }, [items]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2 border-b border-[color:var(--moss)]/20">
        {(["prompts", "skills"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-4 py-2 font-[family-name:var(--font-ui)] text-sm font-medium capitalize transition",
              tab === t
                ? "border-[color:var(--forest)] text-[color:var(--forest)]"
                : "border-transparent text-muted-foreground hover:text-[color:var(--forest)]",
            )}
          >
            {t === "prompts" ? copy.prompt + "s" : copy.skill + "s"}
            <span className="ml-2 tabular-nums opacity-60">
              {t === "prompts" ? prompts.length : skills.length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <label className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
            {copy.search}
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-11 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--moss)]/35"
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
            {copy.filter}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("All")}
              className={cn(
                "h-9 border px-3 text-[0.7rem] font-medium uppercase tracking-[0.06em]",
                category === "All"
                  ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                  : "border-[color:var(--moss)]/35 bg-[color:var(--card)]",
              )}
            >
              {copy.all}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "h-9 border px-3 text-[0.7rem] font-medium uppercase tracking-[0.06em]",
                  category === c
                    ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                    : "border-[color:var(--moss)]/35 bg-[color:var(--card)]",
                )}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium tabular-nums text-[color:var(--forest)]">{filtered.length}</span>{" "}
        {tab}
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.slug}
                className="flex h-full flex-col border border-[color:var(--moss)]/30 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/55"
              >
                <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.14em] text-[color:var(--moss)]">
                  {tab === "prompts" ? copy.prompt : copy.skill}
                  {"useCase" in item && item.useCase ? ` · ${item.useCase}` : ""}
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-[color:var(--forest)]">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
                <span className="mt-4 text-sm font-bold text-[color:var(--forest)]">
                  {copy.view} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
