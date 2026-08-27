"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  listToLines,
  type VisaCategoryRecord,
} from "@/lib/visas/types";

type Props = {
  visa?: VisaCategoryRecord | null;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

function BiText({
  base,
  label,
  en,
  es,
  rows = 3,
  required,
}: {
  base: string;
  label: string;
  en?: string;
  es?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`${base}_en`}>{label} (EN)</Label>
        <Textarea
          id={`${base}_en`}
          name={`${base}_en`}
          defaultValue={en ?? ""}
          rows={rows}
          required={required}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${base}_es`}>{label} (ES)</Label>
        <Textarea
          id={`${base}_es`}
          name={`${base}_es`}
          defaultValue={es ?? ""}
          rows={rows}
          required={required}
        />
      </div>
    </div>
  );
}

function BiList({
  base,
  label,
  hint,
  en,
  es,
  required,
}: {
  base: string;
  label: string;
  hint: string;
  en?: string[];
  es?: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${base}_en`}>EN</Label>
          <Textarea
            id={`${base}_en`}
            name={`${base}_en`}
            defaultValue={listToLines(en)}
            rows={6}
            required={required}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${base}_es`}>ES</Label>
          <Textarea
            id={`${base}_es`}
            name={`${base}_es`}
            defaultValue={listToLines(es)}
            rows={6}
            required={required}
            className="font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export function VisaEditor({ visa, saveAction, deleteAction }: Props) {
  const workMode =
    visa?.work_permit === true ? "yes" : visa?.work_permit === false ? "no" : visa ? "custom" : "no";

  return (
    <form action={saveAction} className="space-y-8 pb-24">
      {visa ? <input type="hidden" name="id" value={visa.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={visa?.slug ?? ""}
            placeholder="transito-aeroportuario"
            pattern="[a-z0-9-]+"
            required
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Type</Label>
          <select
            id="category"
            name="category"
            defaultValue={visa?.category ?? "V"}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
            required
          >
            <option value="V">V — Visitante</option>
            <option value="M">M — Migrante</option>
            <option value="R">R — Residente</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="article_num">Article number</Label>
          <Input
            id="article_num"
            name="article_num"
            type="number"
            min={1}
            defaultValue={visa?.article_num ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={visa?.status ?? "draft"}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
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
            defaultValue={visa?.sort_order ?? visa?.article_num ?? 0}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="related_guide_slug">Related CLKR guide slug (optional)</Label>
          <Input
            id="related_guide_slug"
            name="related_guide_slug"
            defaultValue={visa?.related_guide_slug ?? ""}
            placeholder="last-legal-day"
            className="font-mono"
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name="enable_norm_comments"
            defaultChecked={visa?.enable_norm_comments ?? false}
          />
          Show discussion comments (Resolución 5477 article thread)
        </label>
      </div>

      <BiText base="name" label="Name" en={visa?.name.en} es={visa?.name.es} rows={2} required />
      <BiText
        base="summary"
        label="Summary"
        en={visa?.summary.en}
        es={visa?.summary.es}
        rows={4}
        required
      />
      <BiText
        base="who_for"
        label="Who is it for?"
        en={visa?.who_for.en}
        es={visa?.who_for.es}
        rows={3}
        required
      />
      <BiText
        base="eligibility"
        label="General eligibility (optional)"
        en={visa?.eligibility?.en}
        es={visa?.eligibility?.es}
        rows={5}
      />
      <BiList
        base="rights"
        label="Rights / scope (optional)"
        hint="One item per line."
        en={visa?.rights?.en}
        es={visa?.rights?.es}
      />
      <BiList
        base="restrictions"
        label="Restrictions (optional)"
        hint="One item per line."
        en={visa?.restrictions?.en}
        es={visa?.restrictions?.es}
      />
      <BiList
        base="application_checklist"
        label="Application checklist (optional)"
        hint="One item per line. Shown as the main filing checklist when present."
        en={visa?.application_checklist?.en}
        es={visa?.application_checklist?.es}
      />
      <BiList
        base="key_requirements"
        label="Key requirements"
        hint="One item per line. Used when checklist is empty, or as a short summary."
        en={visa?.key_requirements.en}
        es={visa?.key_requirements.es}
        required
      />
      <BiText
        base="duration_notes"
        label="Validity / stay"
        en={visa?.duration_notes.en}
        es={visa?.duration_notes.es}
        rows={3}
        required
      />

      <div className="space-y-3">
        <Label htmlFor="work_permit_mode">Work authorization</Label>
        <select
          id="work_permit_mode"
          name="work_permit_mode"
          defaultValue={workMode}
          className="w-full border border-border bg-background px-3 py-2 text-sm sm:max-w-xs"
        >
          <option value="no">No (default)</option>
          <option value="yes">Yes (within category scope)</option>
          <option value="custom">Custom bilingual notes</option>
        </select>
        <BiText
          base="work_permit_notes"
          label="Custom work-permit notes"
          en={visa?.work_permit_notes?.en}
          es={visa?.work_permit_notes?.es}
          rows={2}
        />
      </div>

      <BiText
        base="beneficiary_notes"
        label="Beneficiaries"
        en={visa?.beneficiary_notes.en}
        es={visa?.beneficiary_notes.es}
        rows={2}
        required
      />

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit">Save visa</Button>
        {visa && deleteAction ? (
          <Button
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            formNoValidate
            onClick={(e) => {
              if (!window.confirm("Delete this visa category from the CMS?")) {
                e.preventDefault();
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
