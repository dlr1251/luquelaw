"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { NormRecord, NormSectionRecord } from "@/lib/norms/types";
import { NORM_CATEGORIES, NORM_TYPES, normPublicPath } from "@/lib/norms/types";
import { cn } from "@/lib/utils";

type Props = {
  norm?: NormRecord | null;
  sections?: NormSectionRecord[];
  locale: "en" | "es";
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

type DraftSection = {
  localId: string;
  section_key: string;
  title: string;
  number_label: string;
  html: string;
  parent_section_key: string;
  sort_order: number;
  depth: number;
};

function newLocalId() {
  return `s-${Math.random().toString(36).slice(2, 10)}`;
}

function sectionsToDraft(sections: NormSectionRecord[]): DraftSection[] {
  const keyById = new Map(sections.map((s) => [s.id, s.section_key]));
  return sections.map((s) => ({
    localId: s.id,
    section_key: s.section_key,
    title: s.title,
    number_label: s.number_label ?? "",
    html: s.html ?? "",
    parent_section_key: s.parent_id ? keyById.get(s.parent_id) ?? "" : "",
    sort_order: s.sort_order,
    depth: s.depth,
  }));
}

function defaultDraft(locale: "en" | "es"): DraftSection[] {
  return [
    {
      localId: newLocalId(),
      section_key: "overview",
      title: locale === "es" ? "Generalidades" : "Overview",
      number_label: "",
      html:
        locale === "es"
          ? "<p>Texto normativo de referencia. Cargue el contenido por secciones.</p>"
          : "<p>Reference normative text. Load content section by section.</p>",
      parent_section_key: "",
      sort_order: 0,
      depth: 0,
    },
  ];
}

function draftToJson(draft: DraftSection[]): string {
  const payload = draft.map((s, index) => ({
    section_key: s.section_key.trim(),
    title: s.title.trim(),
    number_label: s.number_label.trim() || null,
    html: s.html,
    parent_section_key: s.parent_section_key.trim() || null,
    sort_order: Number.isFinite(s.sort_order) ? s.sort_order : index,
    depth: Number.isFinite(s.depth) ? s.depth : 0,
  }));
  return JSON.stringify(payload, null, 2);
}

function parseDraftFromJson(raw: string): DraftSection[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item, index) => {
      const o = (item ?? {}) as Record<string, unknown>;
      return {
        localId: newLocalId(),
        section_key: String(o.section_key ?? `section-${index}`),
        title: String(o.title ?? ""),
        number_label: o.number_label != null ? String(o.number_label) : "",
        html: o.html != null ? String(o.html) : "",
        parent_section_key:
          o.parent_section_key != null ? String(o.parent_section_key) : "",
        sort_order: Number(o.sort_order) || index,
        depth: Number(o.depth) || 0,
      };
    });
  } catch {
    return null;
  }
}

export function NormEditor({
  norm,
  sections = [],
  locale,
  saveAction,
  deleteAction,
}: Props) {
  const [draft, setDraft] = useState<DraftSection[]>(() =>
    sections.length ? sectionsToDraft(sections) : defaultDraft(locale),
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedJson, setAdvancedJson] = useState(() =>
    draftToJson(
      sections.length ? sectionsToDraft(sections) : defaultDraft(locale),
    ),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const sectionsJson = useMemo(() => draftToJson(draft), [draft]);
  const sectionKeys = useMemo(
    () => draft.map((s) => s.section_key).filter(Boolean),
    [draft],
  );
  const isEs = locale === "es";

  function updateRow(localId: string, patch: Partial<DraftSection>) {
    setDraft((prev) =>
      prev.map((row) => (row.localId === localId ? { ...row, ...patch } : row)),
    );
  }

  function addSection() {
    setDraft((prev) => [
      ...prev,
      {
        localId: newLocalId(),
        section_key: `section-${prev.length + 1}`,
        title: isEs ? "Nueva sección" : "New section",
        number_label: "",
        html: "<p></p>",
        parent_section_key: "",
        sort_order: prev.length,
        depth: 0,
      },
    ]);
  }

  function removeSection(localId: string) {
    setDraft((prev) => {
      if (prev.length <= 1) return prev;
      const removed = prev.find((r) => r.localId === localId);
      const next = prev.filter((r) => r.localId !== localId);
      return next.map((row, index) => ({
        ...row,
        parent_section_key:
          removed && row.parent_section_key === removed.section_key
            ? ""
            : row.parent_section_key,
        sort_order: index,
      }));
    });
  }

  function moveSection(localId: string, direction: -1 | 1) {
    setDraft((prev) => {
      const index = prev.findIndex((r) => r.localId === localId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next.map((row, i) => ({ ...row, sort_order: i }));
    });
  }

  function applyAdvancedJson() {
    const parsed = parseDraftFromJson(advancedJson);
    if (!parsed) {
      setJsonError(isEs ? "JSON inválido" : "Invalid JSON");
      return;
    }
    setJsonError(null);
    setDraft(parsed);
    setAdvancedOpen(false);
  }

  return (
    <form action={saveAction} className="space-y-8 pb-24">
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
          <Textarea
            id="description"
            name="description"
            defaultValue={norm?.description ?? ""}
            rows={3}
            required
          />
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

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">
              {isEs ? "Secciones" : "Sections"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {isEs
                ? "Edita la jerarquía por filas. Usa parent key y depth para títulos, capítulos y artículos."
                : "Edit hierarchy row by row. Use parent key and depth for titles, chapters, and articles."}
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addSection}>
            {isEs ? "+ Sección" : "+ Section"}
          </Button>
        </div>

        <div className="space-y-4">
          {draft.map((row, index) => (
            <div
              key={row.localId}
              className="space-y-3 rounded-md border border-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {isEs ? "Sección" : "Section"} {index + 1}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => moveSection(row.localId, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === draft.length - 1}
                    onClick={() => moveSection(row.localId, 1)}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={draft.length <= 1}
                    onClick={() => removeSection(row.localId)}
                  >
                    {isEs ? "Quitar" : "Remove"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Key</Label>
                  <Input
                    value={row.section_key}
                    onChange={(e) =>
                      updateRow(row.localId, { section_key: e.target.value })
                    }
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Number label</Label>
                  <Input
                    value={row.number_label}
                    onChange={(e) =>
                      updateRow(row.localId, { number_label: e.target.value })
                    }
                    placeholder="Art. 1"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={row.title}
                    onChange={(e) =>
                      updateRow(row.localId, { title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Parent key</Label>
                  <select
                    value={row.parent_section_key}
                    onChange={(e) =>
                      updateRow(row.localId, {
                        parent_section_key: e.target.value,
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="">
                      {isEs ? "(sin padre)" : "(no parent)"}
                    </option>
                    {sectionKeys
                      .filter((key) => key !== row.section_key)
                      .map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Depth</Label>
                  <Input
                    type="number"
                    min={0}
                    value={row.depth}
                    onChange={(e) =>
                      updateRow(row.localId, {
                        depth: Number.parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>HTML body</Label>
                  <Textarea
                    value={row.html}
                    onChange={(e) =>
                      updateRow(row.localId, { html: e.target.value })
                    }
                    rows={5}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-dashed border-border">
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium",
              advancedOpen && "border-b border-border",
            )}
            onClick={() => {
              setAdvancedOpen((open) => {
                if (!open) setAdvancedJson(sectionsJson);
                return !open;
              });
            }}
          >
            <span>{isEs ? "Avanzado: JSON" : "Advanced: JSON"}</span>
            <span className="text-muted-foreground">
              {advancedOpen ? "−" : "+"}
            </span>
          </button>
          {advancedOpen ? (
            <div className="space-y-3 p-4">
              <Textarea
                value={advancedJson}
                onChange={(e) => {
                  setAdvancedJson(e.target.value);
                  setJsonError(null);
                }}
                rows={14}
                className="font-mono text-xs"
              />
              {jsonError ? (
                <p className="text-xs text-destructive">{jsonError}</p>
              ) : null}
              <Button type="button" size="sm" variant="outline" onClick={applyAdvancedJson}>
                {isEs ? "Aplicar JSON al editor" : "Apply JSON to editor"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap gap-3 border-t border-border bg-background/95 px-1 py-4 backdrop-blur supports-backdrop-filter:bg-background/80">
        <Button type="submit">{isEs ? "Guardar norma" : "Save norm"}</Button>
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
            className="inline-flex h-9 items-center px-3 text-sm font-medium underline-offset-4 hover:underline"
          >
            {isEs ? "Ver en vivo" : "View live"}
          </a>
        ) : null}
      </div>
    </form>
  );
}
