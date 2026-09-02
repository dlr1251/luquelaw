import type { TranslationNoteRecord } from "@/lib/norms/citations";

type Props = {
  notes: TranslationNoteRecord[];
  locale: "en" | "es";
  compact?: boolean;
};

export function NormTranslationNotes({ notes, locale, compact = false }: Props) {
  if (locale !== "en" || !notes.length) return null;

  return (
    <aside
      className={
        compact
          ? "mt-6 space-y-3 border-t border-[color:var(--moss)]/15 pt-5"
          : "mt-8 space-y-4 border-t border-[color:var(--moss)]/20 pt-6"
      }
    >
      <div>
        <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
          Translator’s notes
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Unofficial desk rendering (U.S. English). Notes flag ambiguity and the U.K./OECD
          equivalent a common-lawyer might expect.
        </p>
      </div>
      {notes.map((note) => (
        <article
          key={note.id}
          className="rounded-md border border-[color:var(--moss)]/20 px-4 py-4"
        >
          <p className="text-sm text-[color:var(--forest)]">
            <span className="italic">{note.span_es}</span>
            <span className="text-muted-foreground"> → </span>
            {note.rendering_us}
          </p>
          {note.variant_uk ? (
            <p className="mt-1 text-xs text-muted-foreground">
              U.K./OECD: {note.variant_uk}
            </p>
          ) : null}
          {note.note_html ? (
            <div
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: note.note_html }}
            />
          ) : null}
        </article>
      ))}
    </aside>
  );
}
