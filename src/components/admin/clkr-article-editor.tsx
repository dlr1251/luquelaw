"use client";

import { useState } from "react";

import type { ClkrArticleRecord, ClkrSection } from "@/lib/clkr/types";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";

type Props = {
  article?: ClkrArticleRecord | null;
  locale: "en" | "es";
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

const emptySection = (): ClkrSection => ({
  id: "",
  title: "",
  html: "",
});

export function ClkrArticleEditor({ article, locale, saveAction, deleteAction }: Props) {
  const [sections, setSections] = useState<ClkrSection[]>(
    article?.sections?.length ? article.sections : [emptySection()],
  );

  function updateSection(index: number, patch: Partial<ClkrSection>) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  const isEs = locale === "es";

  return (
    <form action={saveAction} className="space-y-8">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sections_json" value={JSON.stringify(sections)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
          Slug (URL)
          <input
            name="slug_key"
            defaultValue={article?.slug_key ?? ""}
            placeholder="investor-visa"
            pattern="[a-z0-9-]+"
            required
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 font-mono text-sm text-[color:var(--ink)]"
          />
          <span className="mt-1 block text-xs font-normal text-[color:var(--muted)]">
            {locale === "es" ? `/es/clkr/` : `/clkr/`}
            <span className="font-mono">slug-key</span>
          </span>
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
          Title
          <input
            name="title"
            defaultValue={article?.title ?? ""}
            required
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
          />
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
          Description (hub card)
          <textarea
            name="description"
            rows={3}
            defaultValue={article?.description ?? ""}
            required
            className="mt-1.5 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--ink)]"
          />
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)]">
          Category
          <select
            name="category"
            defaultValue={article?.category ?? "Immigration"}
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
          >
            {CLKR_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)]">
          Reading time
          <input
            name="reading_time"
            defaultValue={article?.reading_time ?? "10 min"}
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
          />
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)]">
          Status
          <select
            name="status"
            defaultValue={article?.status ?? "draft"}
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="block text-sm font-bold text-[color:var(--ink)]">
          Sort order (hub)
          <input
            name="sort_order"
            type="number"
            defaultValue={article?.sort_order ?? 0}
            className="mt-1.5 h-11 w-full border border-[color:var(--moss)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)]"
          />
        </label>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-normal text-[color:var(--forest)]">
            {isEs ? "Secciones" : "Sections"}
          </h3>
          <button type="button" onClick={addSection} className="btn-secondary btn-secondary-sm">
            {isEs ? "+ Sección" : "+ Section"}
          </button>
        </div>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          {isEs
            ? "Cada sección genera un encabezado en la tabla de contenidos. El cuerpo acepta HTML básico (p, strong, ul, ol, h3)."
            : "Each section becomes a table-of-contents entry. Body accepts basic HTML (p, strong, ul, ol, h3)."}
        </p>

        <div className="mt-4 space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--moss)]">
                  {isEs ? "Sección" : "Section"} {index + 1}
                </span>
                {sections.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-xs font-bold text-red-700 hover:underline"
                  >
                    {isEs ? "Eliminar" : "Remove"}
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-bold text-[color:var(--ink)]">
                  ID (anchor)
                  <input
                    value={section.id}
                    onChange={(e) => updateSection(index, { id: e.target.value })}
                    placeholder="definition"
                    className="mt-1.5 h-10 w-full border border-[color:var(--moss)]/40 bg-[color:var(--card)] px-3 font-mono text-sm"
                  />
                </label>
                <label className="block text-sm font-bold text-[color:var(--ink)]">
                  {isEs ? "Título" : "Title"}
                  <input
                    value={section.title}
                    onChange={(e) => updateSection(index, { title: e.target.value })}
                    placeholder="Definition"
                    className="mt-1.5 h-10 w-full border border-[color:var(--moss)]/40 bg-[color:var(--card)] px-3 text-sm"
                  />
                </label>
                <label className="block text-sm font-bold text-[color:var(--ink)] sm:col-span-2">
                  HTML body
                  <textarea
                    value={section.html}
                    onChange={(e) => updateSection(index, { html: e.target.value })}
                    rows={6}
                    className="mt-1.5 w-full border border-[color:var(--moss)]/40 bg-[color:var(--card)] px-3 py-2 font-mono text-xs leading-relaxed"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[color:var(--moss)]/25 pt-6">
        <button type="submit" className="btn-primary btn-primary-sm">
          {isEs ? "Guardar" : "Save article"}
        </button>
      </div>

      {article && deleteAction ? (
        <div className="border-t border-[color:var(--moss)]/25 pt-4">
          <button
            type="submit"
            formAction={deleteAction}
            className="text-xs font-bold text-red-700 hover:underline"
            onClick={(e) => {
              if (!confirm(isEs ? "¿Eliminar este artículo?" : "Delete this article?")) {
                e.preventDefault();
              }
            }}
          >
            {isEs ? "Eliminar artículo" : "Delete article"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
