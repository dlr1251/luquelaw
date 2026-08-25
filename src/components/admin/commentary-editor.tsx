"use client";

import { useMemo, useState } from "react";

import { Prose } from "@/components/prose";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { markdownToHtml } from "@/lib/clkr/markdown";
import { fetchSectionsForNorm } from "@/app/(dashboard)/admin/commentaries/section-options";
import type {
  NormOption,
  SectionOption,
} from "@/lib/commentaries/get-commentaries";
import type { DoctrinalCommentaryRecord } from "@/lib/commentaries/types";
import { cn } from "@/lib/utils";

type Props = {
  commentary?: DoctrinalCommentaryRecord | null;
  locale: "en" | "es";
  norms: NormOption[];
  initialSections: SectionOption[];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

type EditorMode = "write" | "preview";

export function CommentaryEditor({
  commentary,
  locale,
  norms,
  initialSections,
  saveAction,
  deleteAction,
}: Props) {
  const localeNorms = useMemo(
    () => norms.filter((n) => n.locale === locale),
    [norms, locale],
  );

  const [normId, setNormId] = useState(
    () => commentary?.norm_id ?? localeNorms[0]?.id ?? "",
  );
  const [sectionId, setSectionId] = useState(
    () => commentary?.section_id ?? initialSections[0]?.id ?? "",
  );
  const [sections, setSections] = useState<SectionOption[]>(initialSections);
  const [loadingSections, setLoadingSections] = useState(false);
  const [markdown, setMarkdown] = useState(
    () => commentary?.body_markdown ?? defaultCommentaryMarkdown(locale),
  );
  const [mode, setMode] = useState<EditorMode>("write");

  const previewHtml = useMemo(() => markdownToHtml(markdown), [markdown]);
  const isEs = locale === "es";

  async function loadSections(nextNormId: string) {
    setNormId(nextNormId);
    setLoadingSections(true);
    try {
      const next = await fetchSectionsForNorm(nextNormId);
      setSections(next);
      setSectionId(next[0]?.id ?? "");
    } catch {
      setSections([]);
      setSectionId("");
    } finally {
      setLoadingSections(false);
    }
  }

  const copy = isEs
    ? {
        body: "Comentario doctrinal",
        bodyHint:
          "Markdown: **negrita**, listas, enlaces. Este texto aparece en la sección pública de la norma, antes del hilo de discusión.",
        write: "Escribir",
        preview: "Vista previa",
        save: "Guardar",
        delete: "Eliminar comentario",
        deleteConfirm: "¿Eliminar este comentario doctrinal?",
      }
    : {
        body: "Doctrinal commentary",
        bodyHint:
          "Markdown: **bold**, lists, links. This appears on the public norm section, above the discussion thread.",
        write: "Write",
        preview: "Preview",
        save: "Save commentary",
        delete: "Delete commentary",
        deleteConfirm: "Delete this doctrinal commentary?",
      };

  return (
    <form action={saveAction} className="space-y-8 pb-24">
      {commentary ? <input type="hidden" name="id" value={commentary.id} /> : null}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="body_markdown" value={markdown} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="norm_id">Norm</Label>
          <select
            id="norm_id"
            name="norm_id"
            value={normId}
            onChange={(e) => void loadSections(e.target.value)}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {localeNorms.length === 0 ? (
              <option value="">No norms for this locale</option>
            ) : (
              localeNorms.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title} ({n.slug_key}) · {n.status}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="section_id">Section</Label>
          <select
            id="section_id"
            name="section_id"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            required
            disabled={loadingSections || !sections.length}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
          >
            {!sections.length ? (
              <option value="">
                {loadingSections ? "Loading sections…" : "No sections"}
              </option>
            ) : (
              sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {"—".repeat(Math.min(s.depth, 4))}
                  {s.number_label ? `${s.number_label} · ` : ""}
                  {s.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={commentary?.title ?? ""}
            placeholder={
              isEs ? "Comentario Luque Law" : "Luque Law commentary"
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={commentary?.status ?? "draft"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={commentary?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{copy.body}</h3>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {copy.bodyHint}
            </p>
          </div>
          <div className="inline-flex rounded-md border border-input p-0.5">
            <button
              type="button"
              onClick={() => setMode("write")}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium transition",
                mode === "write"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.write}
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium transition",
                mode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.preview}
            </button>
          </div>
        </div>

        {mode === "write" ? (
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={18}
            className="min-h-[22rem] font-mono text-sm leading-relaxed"
            spellCheck
          />
        ) : (
          <div className="min-h-[22rem] rounded-md border border-input bg-[color:var(--parchment,#f5f2ec)] p-6 sm:p-8">
            {previewHtml ? (
              <Prose>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </Prose>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isEs ? "Escribe el comentario para previsualizar." : "Write commentary to preview."}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap gap-3 border-t border-border bg-background/95 px-1 py-4 backdrop-blur supports-backdrop-filter:bg-background/80">
        <Button type="submit" disabled={!normId || !sectionId}>
          {copy.save}
        </Button>
        {commentary && deleteAction ? (
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            formAction={deleteAction}
            onClick={(e) => {
              if (!confirm(copy.deleteConfirm)) {
                e.preventDefault();
              }
            }}
          >
            {copy.delete}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function defaultCommentaryMarkdown(locale: "en" | "es"): string {
  return locale === "es"
    ? "En Luque Law leemos esta disposición junto con el contexto migratorio y registral vigente. Confirma siempre el texto oficial antes de actuar.\n"
    : "At Luque Law we read this provision alongside the current immigration and registry context. Always confirm the official text before acting.\n";
}
