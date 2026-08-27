"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "es";
  title: string;
  url?: string;
  className?: string;
};

export function SharePageButton({ locale, title, url, className }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copy =
    locale === "es"
      ? {
          label: "Compartir",
          copied: "Enlace copiado",
          error: "No se pudo compartir",
        }
      : {
          label: "Share",
          copied: "Link copied",
          error: "Could not share",
        };

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (!shareUrl) return;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setStatus("copied");
        window.setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        window.setTimeout(() => setStatus("idle"), 2000);
      }
    }
  }

  const label =
    status === "copied" ? copy.copied : status === "error" ? copy.error : copy.label;

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2",
        className ?? "btn-secondary",
      )}
      aria-live="polite"
    >
      <Share2 className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
      {label}
    </button>
  );
}
