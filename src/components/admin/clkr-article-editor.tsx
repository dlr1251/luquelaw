"use client";

import { useMemo, useState } from "react";

import { ClkrSectionBody } from "@/components/clkr/section-body";
import { Prose } from "@/components/prose";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultArticleMarkdown,
  markdownToSections,
  sectionsToMarkdown,
} from "@/lib/clkr/markdown";
import type { ClkrArticleRecord } from "@/lib/clkr/types";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";
import { cn } from "@/lib/utils";

type Props = {
  article?: ClkrArticleRecord | null;
  locale: "en" | "es";
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

type EditorMode = "write" | "preview";

export function ClkrArticleEditor({ article, locale, saveAction, deleteAction }: Props) {
  const [markdown, setMarkdown] = useState(() =>
    article?.sections?.length ? sectionsToMarkdown(article.sections) : defaultArticleMarkdown(),
  );
  const [mode, setMode] = useState<EditorMode>("write");

  const previewSections = useMemo(() => markdownToSections(markdown), [markdown]);
  const isEs = locale === "es";

  const copy = isEs
    ? {
        body: "Contenido del artículo",
        bodyHint:
          "Usa ## para títulos de sección (tabla de contenidos). Usa ### para subtítulos dentro de cada sección. Markdown: **negrita**, listas, enlaces.",
        write: "Escribir",
        preview: "Vista previa",
        previewEmpty: "Añade al menos un título ## para generar secciones.",
        save: "Guardar",
        delete: "Eliminar artículo",
        deleteConfirm: "¿Eliminar este artículo?",
      }
    : {
        body: "Article content",
        bodyHint:
          "Use ## for section titles (table of contents). Use ### for subtitles within a section. Markdown: **bold**, lists, links.",
        write: "Write",
        preview: "Preview",
        previewEmpty: "Add at least one ## heading to create sections.",
        save: "Save article",
        delete: "Delete article",
        deleteConfirm: "Delete this article?",
      };

  return (
    <form action={saveAction} className="space-y-8">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="body_markdown" value={markdown} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug_key">Slug (URL)</Label>
          <Input
            id="slug_key"
            name="slug_key"
            defaultValue={article?.slug_key ?? ""}
            placeholder="investor-visa"
            pattern="[a-z0-9-]+"
            required
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {locale === "es" ? `/es/clkr/` : `/clkr/`}
            <span className="font-mono">slug-key</span>
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={article?.title ?? ""} required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description (hub card)</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={article?.description ?? ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? "Immigration"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {CLKR_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reading_time">Reading time</Label>
          <Input
            id="reading_time"
            name="reading_time"
            defaultValue={article?.reading_time ?? "10 min"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={article?.status ?? "draft"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order (hub)</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={article?.sort_order ?? 0}
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
            rows={24}
            className="min-h-[28rem] font-mono text-sm leading-relaxed"
            spellCheck
          />
        ) : (
          <div className="min-h-[28rem] rounded-md border border-input bg-[color:var(--parchment,#f5f2ec)] p-6 sm:p-8">
            {previewSections.length ? (
              <Prose>
                <ClkrSectionBody sections={previewSections} />
              </Prose>
            ) : (
              <p className="text-sm text-muted-foreground">{copy.previewEmpty}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button type="submit">{copy.save}</Button>
      </div>

      {article && deleteAction ? (
        <div className="border-t pt-4">
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
        </div>
      ) : null}
    </form>
  );
}
