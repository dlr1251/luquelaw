import Link from "next/link";

import { Container } from "@/components/container";
import { clearClkrArticleSettings, saveClkrArticleSettings } from "./actions";
import type { ClkrArticle } from "@/lib/clkr/articles";
import { clkrArticles, clkrArticlesEs } from "@/lib/clkr/articles";
import { createClient } from "@/lib/supabase/server";
import { slugKeyFromArticle } from "@/lib/clkr/slug-key";

type SettingsRow = {
  slug_key: string;
  locale: string;
  sort_order: number;
  is_hidden: boolean;
  title_override: string | null;
  description_override: string | null;
};

async function loadSettings(): Promise<SettingsRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clkr_article_settings")
      .select("slug_key, locale, sort_order, is_hidden, title_override, description_override");
    if (error || !data) return [];
    return data as SettingsRow[];
  } catch {
    return [];
  }
}

type Search = { error?: string; saved?: string; cleared?: string };

export default async function AdminClkrPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const settings = await loadSettings();
  const map = new Map<string, SettingsRow>(
    settings.map((r) => [`${r.locale}:${r.slug_key}`, r]),
  );

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <h2 className="font-display text-[1.65rem] font-normal leading-tight text-[color:var(--forest)]">
          CLKR hub posts
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Control sort order (lower numbers appear first), hide posts from the public hub, and
          optionally override titles or descriptions. Source content stays in the codebase; this
          table only stores presentation rules.
        </p>
        <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
          Database access: run the migration in{" "}
          <code className="bg-[color:var(--surface)] px-1 text-[color:var(--ink)]">
            supabase/migrations/
          </code>{" "}
          and add your account email to{" "}
          <code className="bg-[color:var(--surface)] px-1 text-[color:var(--ink)]">
            admin_allowlist
          </code>{" "}
          or set App metadata <code className="bg-[color:var(--surface)] px-1">role: admin</code>{" "}
          on your user in Supabase.
        </p>
      </div>

      {sp.error ? (
        <p
          className="mt-6 border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-950/30 dark:text-red-100"
          role="alert"
        >
          {sp.error}
        </p>
      ) : null}
      {sp.saved ? (
        <p className="mt-6 border border-[color:var(--caramel)]/50 bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--ink)]">
          Saved. Public CLKR pages were updated.
        </p>
      ) : null}
      {sp.cleared ? (
        <p className="mt-6 border border-[color:var(--caramel)]/50 bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--ink)]">
          Row removed; defaults from code apply again.
        </p>
      ) : null}

      <div className="mt-10 space-y-12">
        <AdminLocaleSection
          locale="en"
          title="English hub (/clkr)"
          articles={clkrArticles}
          map={map}
          saveAction={saveClkrArticleSettings}
          clearAction={clearClkrArticleSettings}
        />
        <AdminLocaleSection
          locale="es"
          title="Spanish hub (/es/clkr)"
          articles={clkrArticlesEs}
          map={map}
          saveAction={saveClkrArticleSettings}
          clearAction={clearClkrArticleSettings}
        />
      </div>
    </Container>
  );
}

function AdminLocaleSection({
  locale,
  title,
  articles,
  map,
  saveAction,
  clearAction,
}: {
  locale: "en" | "es";
  title: string;
  articles: ClkrArticle[];
  map: Map<string, SettingsRow>;
  saveAction: typeof saveClkrArticleSettings;
  clearAction: typeof clearClkrArticleSettings;
}) {
  return (
    <section>
      <h3 className="border-b border-[color:var(--caramel)]/35 pb-2 font-display text-lg font-normal text-[color:var(--forest)]">
        {title}
      </h3>
      <div className="mt-6 space-y-8">
        {articles.map((article) => {
          const key = slugKeyFromArticle(article, locale);
          const row = map.get(`${locale}:${key}`);
          return (
            <div
              key={key}
              className="border border-[color:var(--caramel)]/40 bg-[color:var(--card)] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--caramel)]">
                    {article.category} · {key}
                  </p>
                  <p className="mt-1 font-display text-base font-normal text-[color:var(--forest)]">
                    {article.title}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">{article.slug}</p>
                </div>
                <Link
                  href={article.slug}
                  className="text-sm font-bold text-[color:var(--caramel)] hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View live →
                </Link>
              </div>

              <form action={saveAction} className="mt-5 grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="slug_key" value={key} />
                <input type="hidden" name="locale" value={locale} />
                <label className="block text-sm font-bold text-[color:var(--ink)]">
                  Sort order
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={row?.sort_order ?? 0}
                    className="mt-1.5 h-10 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
                  />
                </label>
                <label className="block text-sm font-bold text-[color:var(--ink)]">
                  Hub visibility
                  <select
                    name="visibility"
                    defaultValue={row?.is_hidden ? "hidden" : "visible"}
                    className="mt-1.5 h-10 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
                  >
                    <option value="visible">Published on hub</option>
                    <option value="hidden">Hidden from hub</option>
                  </select>
                </label>
                <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
                  Title override (optional)
                  <input
                    name="title_override"
                    type="text"
                    defaultValue={row?.title_override ?? ""}
                    placeholder={article.title}
                    className="mt-1.5 h-10 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
                  />
                </label>
                <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
                  Description override (optional)
                  <textarea
                    name="description_override"
                    rows={3}
                    defaultValue={row?.description_override ?? ""}
                    placeholder={article.description}
                    className="mt-1.5 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--ink)]"
                  />
                </label>
                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button type="submit" className="btn-primary btn-primary-sm">
                    Save
                  </button>
                </div>
              </form>

              {row ? (
                <form action={clearAction} className="mt-3 border-t border-[color:var(--caramel)]/25 pt-3">
                  <input type="hidden" name="slug_key" value={key} />
                  <input type="hidden" name="locale" value={locale} />
                  <button type="submit" className="text-xs font-bold text-[color:var(--caramel)] hover:underline">
                    Reset this post to code defaults
                  </button>
                </form>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
