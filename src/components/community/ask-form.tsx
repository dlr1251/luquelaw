"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createQuestion } from "@/lib/community/actions";

export function CommunityAskForm({ locale }: { locale: "en" | "es" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const copy =
    locale === "es"
      ? {
          title: "Título",
          body: "Detalles",
          tags: "Etiquetas (coma)",
          submit: "Publicar pregunta",
          note: "Esto no es asesoría jurídica.",
        }
      : {
          title: "Title",
          body: "Details",
          tags: "Tags (comma-separated)",
          submit: "Post question",
          note: "This is not legal advice.",
        };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "");
    const body = String(fd.get("body") ?? "");
    const tags = String(fd.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      setError(null);
      const result = await createQuestion({ title, body, tags, locale });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(
        locale === "es" ? `/es/comunidad/${result.slug}` : `/community/${result.slug}`,
      );
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-3 rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{copy.note}</p>
      <label className="block space-y-1 text-sm">
        {copy.title}
        <input name="title" required minLength={8} className="w-full rounded border px-3 py-2" />
      </label>
      <label className="block space-y-1 text-sm">
        {copy.body}
        <textarea
          name="body"
          required
          minLength={16}
          rows={5}
          className="w-full rounded border px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        {copy.tags}
        <input name="tags" className="w-full rounded border px-3 py-2" placeholder="visa, migración" />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={pending}>
        {copy.submit}
      </button>
    </form>
  );
}
