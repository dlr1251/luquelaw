import Link from "next/link";

import { Container } from "@/components/container";
import { CommunityAskForm } from "@/components/community/ask-form";
import { listQuestions } from "@/lib/community/queries";
import { getSignedInFlag } from "@/lib/auth/signed-in";

export const dynamic = "force-dynamic";

export default async function ComunidadPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sp = await searchParams;
  const sort =
    sp.sort === "top" || sp.sort === "unanswered" ? sp.sort : "newest";
  const [questions, signedIn] = await Promise.all([
    listQuestions({ locale: "es", sort }),
    getSignedInFlag(),
  ]);

  return (
    <main>
      <section className="border-b border-border bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <p className="marketing-eyebrow marketing-eyebrow-on-hero">Comunidad</p>
          <h1 className="marketing-display text-hero-foreground">Pregunta en el foro</h1>
          <p className="marketing-lead max-w-2xl italic text-hero-muted">
            Preguntas y respuestas entre pares sobre temas legales en Colombia. No es asesoría
            jurídica — para eso, agenda una consulta. Torny sigue siendo la consulta con IA
            prepaga en el portal.
          </p>
        </Container>
      </section>

      <Container className="marketing-section space-y-10">
        <div className="flex flex-wrap gap-3 text-sm">
          {(
            [
              ["newest", "Recientes"],
              ["top", "Mejor votadas"],
              ["unanswered", "Sin respuesta"],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              href={key === "newest" ? "/es/comunidad" : `/es/comunidad?sort=${key}`}
              className={
                sort === key
                  ? "font-medium text-[var(--forest)] underline"
                  : "text-muted-foreground hover:underline"
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/community" className="ml-auto text-muted-foreground hover:underline">
            EN
          </Link>
        </div>

        {signedIn ? (
          <CommunityAskForm locale="es" />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login?next=/es/comunidad" className="underline">
              Inicia sesión
            </Link>{" "}
            para preguntar, votar o responder.
          </p>
        )}

        <ul className="divide-y border-y">
          {questions.length === 0 ? (
            <li className="py-8 text-sm text-muted-foreground">Aún no hay preguntas.</li>
          ) : (
            questions.map((q) => (
              <li key={q.id} className="flex gap-4 py-4">
                <div className="w-16 shrink-0 text-center text-xs text-muted-foreground">
                  <div className="text-lg font-semibold text-foreground">{q.score}</div>
                  votos
                  <div className="mt-1">{q.answer_count} resp</div>
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/es/comunidad/${q.slug}`}
                    className="font-medium text-[var(--forest)] hover:underline"
                  >
                    {q.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.author_display_name} · {new Date(q.created_at).toLocaleDateString("es-CO")}
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
