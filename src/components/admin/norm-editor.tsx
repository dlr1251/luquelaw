"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { NormRecord, NormSectionRecord } from "@/lib/norms/types";
import { NORM_CATEGORIES, NORM_TYPES, normPublicPath } from "@/lib/norms/types";

type Props = {
  norm?: NormRecord | null;
  sections?: NormSectionRecord[];
  locale: "en" | "es";
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

function sectionsToJson(sections: NormSectionRecord[]): string {
  const keyById = new Map(sections.map((s) => [s.id, s.section_key]));
  const payload = sections.map((s) => ({
    section_key: s.section_key,
    title: s.title,
    number_label: s.number_label,
    html: s.html,
    parent_section_key: s.parent_id ? keyById.get(s.parent_id) ?? null : null,
    sort_order: s.sort_order,
    depth: s.depth,
  }));
  return JSON.stringify(payload, null, 2);
}

function defaultSectionsJson(locale: "en" | "es"): string {
  return JSON.stringify(
    [
      {
        section_key: "overview",
        title: locale === "es" ? "Generalidades" : "Overview",
        number_label: null,
        html:
          locale === "es"
            ? "<p>Texto normativo de referencia. Cargue el contenido por secciones.</p>"
            : "<p>Reference normative text. Load content section by section.</p>",
        parent_section_key: null,
        sort_order: 0,
        depth: 0,
      },
    ],
    null,
    2,
  );
}

export function NormEditor({ norm, sections = [], locale, saveAction, deleteAction }: Props) {
  const [sectionsJson, setSectionsJson] = useState(() =>
    sections.length ? sectionsToJson(sections) : defaultSectionsJson(locale),
  );

  const jsonValid = useMemo(() => {
    try {
      JSON.parse(sectionsJson);
      return true;
    } catch {
      return false;
    }
  }, [sectionsJson]);

  const isEs = locale === "es";

  return (
    <form action={saveAction} className="space-y-8">
      {norm ? <input type="hidden" name="id" value={norm.id} /> : null}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sections_json" value={sectionsJson} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug_key">Slug (URL)</Label>
          <Input
            id="slug_key"
            name="slug_key"
            defaultValue={norm?.slug_key ?? ""}
            placeholder="constitucion-colombia"
            pattern="[a-z0-9-]+"
            required
            className="font-mono"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={norm?.title ?? ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_title">Short title (optional)</Label>
          <Input id="short_title" name="short_title" defaultValue={norm?.short_title ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={norm?.sort_order ?? 0}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={norm?.description ?? ""} rows={3} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="norm_type">Type</Label>
          <select
            id="norm_type"
            name="norm_type"
            defaultValue={norm?.norm_type ?? "code"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {NORM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={norm?.category ?? "civil"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {NORM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="official_reference">Official reference</Label>
          <Input
            id="official_reference"
            name="official_reference"
            defaultValue={norm?.official_reference ?? ""}
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="official_source_url">Official source URL (optional)</Label>
          <Input
            id="official_source_url"
            name="official_source_url"
            type="url"
            defaultValue={norm?.official_source_url ?? ""}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={norm?.status ?? "draft"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sections_json">Sections (JSON)</Label>
        <p className="text-xs text-muted-foreground">
          Flat array with <code className="font-mono">section_key</code>,{" "}
          <code className="font-mono">parent_section_key</code>, <code className="font-mono">title</code>,{" "}
          <code className="font-mono">html</code>, <code className="font-mono">depth</code>,{" "}
          <code className="font-mono">sort_order</code>. Use hierarchy for titles, chapters, and articles.
        </p>
        <Textarea
          id="sections_json"
          value={sectionsJson}
          onChange={(e) => setSectionsJson(e.target.value)}
          rows={18}
          className="font-mono text-xs"
        />
        {!jsonValid ? <p className="text-xs text-destructive">Invalid JSON</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={!jsonValid}>
          {isEs ? "Guardar norma" : "Save norm"}
        </Button>
        {norm && deleteAction ? (
          <Button
            type="submit"
            variant="destructive"
            formAction={deleteAction}
            onClick={(e) => {
              if (!confirm(isEs ? "¿Eliminar esta norma?" : "Delete this norm?")) {
                e.preventDefault();
              }
            }}
          >
            {isEs ? "Eliminar" : "Delete"}
          </Button>
        ) : null}
        {norm?.status === "published" ? (
          <a
            href={normPublicPath(norm.slug_key, norm.locale)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center px-4 text-sm font-medium underline-offset-4 hover:underline"
          >
            {isEs ? "Ver en vivo" : "View live"}
          </a>
        ) : null}
      </div>
    </form>
  );
}
