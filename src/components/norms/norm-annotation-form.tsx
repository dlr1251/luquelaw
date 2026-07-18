"use client";

import { useState } from "react";

import { saveNormAnnotation } from "@/lib/annotations/actions";

type Props = {
  normId: string;
  sectionId: string;
  locale?: "en" | "es";
  canAnnotate: boolean;
};

export function NormAnnotationForm({
  normId,
  sectionId,
  locale = "en",
  canAnnotate,
}: Props) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const copy =
    locale === "es"
      ? {
          title: "Tu anotación (suscriptor)",
          placeholder: "Notas de estudio sobre esta sección…",
          save: "Guardar",
          locked: "Las anotaciones requieren plan Estudiante o Profesional.",
          pricing: "Ver planes",
          saved: "Guardado.",
        }
      : {
          title: "Your annotation (subscriber)",
          placeholder: "Study notes for this section…",
          save: "Save",
          locked: "Annotations require a Student or Professional plan.",
          pricing: "View plans",
          saved: "Saved.",
        };

  if (!canAnnotate) {
    return (
      <div className="mt-10 border-t border-[color:var(--moss)]/20 pt-6">
        <p className="text-sm text-muted-foreground">{copy.locked}</p>
        <a href="/pricing" className="mt-2 inline-block text-sm font-bold text-[color:var(--forest)] underline">
          {copy.pricing}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-[color:var(--moss)]/20 pt-6">
      <h3 className="font-display text-lg text-[color:var(--forest)]">{copy.title}</h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder={copy.placeholder}
        className="mt-3 w-full rounded border px-3 py-2 text-sm"
      />
      <button
        type="button"
        className="btn-secondary mt-3"
        disabled={pending || !body.trim()}
        onClick={async () => {
          setPending(true);
          setStatus(null);
          const res = await saveNormAnnotation({ normId, sectionId, body });
          setPending(false);
          if (res.ok) {
            setBody("");
            setStatus(copy.saved);
          } else {
            setStatus(res.error);
          }
        }}
      >
        {pending ? "…" : copy.save}
      </button>
      {status ? <p className="mt-2 text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
