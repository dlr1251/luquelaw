import { markdownToHtml } from "@/lib/clkr/markdown";
import type { DoctrinalCommentaryRecord } from "@/lib/commentaries/types";
import { Prose } from "@/components/prose";

type Props = {
  commentaries: DoctrinalCommentaryRecord[];
  locale: "en" | "es";
};

export function NormDoctrinalCommentaries({ commentaries, locale }: Props) {
  if (!commentaries.length) return null;

  const copy =
    locale === "es"
      ? {
          eyebrow: "Comentario Luque Law",
          disclaimer:
            "Orientación del despacho para lectura de esta disposición. No sustituye el texto oficial ni una consulta formal.",
        }
      : {
          eyebrow: "Luque Law commentary",
          disclaimer:
            "Firm guidance for reading this provision. It does not replace the official text or a formal consultation.",
        };

  return (
    <aside className="mt-10 space-y-6 border-t border-[color:var(--moss)]/25 pt-8">
      <div>
        <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
          {copy.eyebrow}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {copy.disclaimer}
        </p>
      </div>

      {commentaries.map((item) => {
        const html = markdownToHtml(item.body_markdown);
        return (
          <article
            key={item.id}
            className="rounded-md border border-[color:var(--moss)]/20 bg-[color:var(--parchment,#f5f2ec)]/60 px-4 py-5 sm:px-5"
          >
            <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--forest)]">
              {item.title}
            </h3>
            {html ? (
              <Prose className="mt-3">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Prose>
            ) : null}
          </article>
        );
      })}
    </aside>
  );
}
