import Link from "next/link";

import { Container } from "@/components/container";
import { getAllArticlesForAdmin } from "@/lib/clkr/get-articles";
import { clkrPublicPath } from "@/lib/clkr/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Search = { error?: string; saved?: string; deleted?: string };

export default async function AdminClkrPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const articles = isSupabaseConfigured() ? await getAllArticlesForAdmin() : [];
  const en = articles.filter((a) => a.locale === "en");
  const es = articles.filter((a) => a.locale === "es");

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="font-display text-[1.65rem] font-normal leading-tight text-[color:var(--forest)]">
            CLKR articles
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Create and edit CLKR guides stored in Supabase. Published articles appear on{" "}
            <Link href="/clkr" className="font-bold text-[color:var(--moss)] hover:underline">
              /clkr
            </Link>{" "}
            and{" "}
            <Link href="/es/clkr" className="font-bold text-[color:var(--moss)] hover:underline">
              /es/clkr
            </Link>
            .
          </p>
          {!isSupabaseConfigured() ? (
            <p className="mt-3 text-sm text-amber-800">
              Supabase is not configured. Add keys to <code className="font-mono">.env.local</code>{" "}
              and run migrations in <code className="font-mono">supabase/migrations/</code>.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/clkr/new?locale=en" className="btn-primary btn-primary-sm">
            + English article
          </Link>
          <Link href="/admin/clkr/new?locale=es" className="btn-secondary btn-secondary-sm">
            + Spanish article
          </Link>
        </div>
      </div>

      {sp.error ? (
        <p className="mt-6 border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {sp.error}
        </p>
      ) : null}
      {sp.deleted ? (
        <p className="mt-6 border border-[color:var(--moss)]/50 bg-[color:var(--surface)] px-4 py-3 text-sm">
          Article deleted.
        </p>
      ) : null}

      <div className="mt-10 space-y-12">
        <AdminArticleList locale="en" title="English (/clkr)" items={en} />
        <AdminArticleList locale="es" title="Spanish (/es/clkr)" items={es} />
      </div>
    </Container>
  );
}

function AdminArticleList({
  locale,
  title,
  items,
}: {
  locale: "en" | "es";
  title: string;
  items: Awaited<ReturnType<typeof getAllArticlesForAdmin>>;
}) {
  return (
    <section>
      <h3 className="border-b border-[color:var(--moss)]/35 pb-2 font-display text-lg font-normal text-[color:var(--forest)]">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          No articles yet.{" "}
          <Link href={`/admin/clkr/new?locale=${locale}`} className="font-bold text-[color:var(--moss)] hover:underline">
            Create one →
          </Link>
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-[color:var(--moss)]/20 border border-[color:var(--moss)]/30 bg-[color:var(--card)]">
          {items.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--moss)]">
                  {article.category} · {article.status} · order {article.sort_order}
                </p>
                <p className="mt-1 font-display text-base text-[color:var(--forest)]">{article.title}</p>
                <p className="mt-0.5 font-mono text-xs text-[color:var(--muted)]">{article.slug_key}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3 text-sm font-bold">
                <Link href={`/admin/clkr/${article.id}/edit`} className="text-[color:var(--forest)] hover:underline">
                  Edit
                </Link>
                {article.status === "published" ? (
                  <Link
                    href={clkrPublicPath(article.slug_key, article.locale)}
                    className="text-[color:var(--moss)] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
