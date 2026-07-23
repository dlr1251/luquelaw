import Link from "next/link";

import { Container } from "@/components/container";
import { CommunityAskForm } from "@/components/community/ask-form";
import { listQuestions } from "@/lib/community/queries";
import { getSignedInFlag } from "@/lib/auth/signed-in";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sp = await searchParams;
  const sort =
    sp.sort === "top" || sp.sort === "unanswered" ? sp.sort : "newest";
  const [questions, signedIn] = await Promise.all([
    listQuestions({ locale: "en", sort }),
    getSignedInFlag(),
  ]);

  return (
    <main>
      <section className="border-b border-border bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <p className="marketing-eyebrow marketing-eyebrow-on-hero">Community</p>
          <h1 className="marketing-display text-hero-foreground">Ask the forum</h1>
          <p className="marketing-lead max-w-2xl italic text-hero-muted">
            Peer Q&A on Colombian legal topics. Not legal advice — for firm counsel, book a
            consultation. Torny remains a prepaid AI consult in the portal.
          </p>
        </Container>
      </section>

      <Container className="marketing-section space-y-10">
        <div className="flex flex-wrap gap-3 text-sm">
          {(
            [
              ["newest", "Newest"],
              ["top", "Top"],
              ["unanswered", "Unanswered"],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              href={key === "newest" ? "/community" : `/community?sort=${key}`}
              className={
                sort === key
                  ? "font-medium text-[var(--forest)] underline"
                  : "text-muted-foreground hover:underline"
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/es/comunidad" className="ml-auto text-muted-foreground hover:underline">
            ES
          </Link>
        </div>

        {signedIn ? (
          <CommunityAskForm locale="en" />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login?next=/community" className="underline">
              Sign in
            </Link>{" "}
            to ask a question, vote, or answer.
          </p>
        )}

        <ul className="divide-y border-y">
          {questions.length === 0 ? (
            <li className="py-8 text-sm text-muted-foreground">No questions yet.</li>
          ) : (
            questions.map((q) => (
              <li key={q.id} className="flex gap-4 py-4">
                <div className="w-16 shrink-0 text-center text-xs text-muted-foreground">
                  <div className="text-lg font-semibold text-foreground">{q.score}</div>
                  votes
                  <div className="mt-1">{q.answer_count} ans</div>
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/community/${q.slug}`}
                    className="font-medium text-[var(--forest)] hover:underline"
                  >
                    {q.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.author_display_name} · {new Date(q.created_at).toLocaleDateString()}
                    {q.tags?.length ? ` · ${q.tags.join(", ")}` : ""}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </Container>
    </main>
  );
}
