"use client";

import { Bookmark } from "lucide-react";
import { useState, useTransition } from "react";

import { cn } from "@/lib/cn";
import { toggleUserSave, type SaveTargetType } from "@/lib/saves/actions";

export function SaveButton({
  targetType,
  targetSlug,
  title,
  locale,
  initiallySaved,
  loginHref = locale === "es" ? "/es/login?next=/portal/saved" : "/login?next=/portal/saved",
  tone = "default",
}: {
  targetType: SaveTargetType;
  targetSlug: string;
  title: string;
  locale: "en" | "es";
  initiallySaved: boolean;
  loginHref?: string;
  tone?: "default" | "inverse";
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();
  const [needsLogin, setNeedsLogin] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const copy =
    locale === "es"
      ? {
          save: "Guardar en favoritos",
          saved: "En favoritos",
          remove: "Quitar de favoritos",
          login: "Inicia sesión para guardar",
        }
      : {
          save: "Save to favorites",
          saved: "Saved to favorites",
          remove: "Remove from favorites",
          login: "Sign in to save",
        };

  const label = needsLogin ? copy.login : saved ? copy.saved : copy.save;
  const tip = needsLogin ? copy.login : saved ? copy.remove : copy.save;

  function onClick() {
    startTransition(async () => {
      const result = await toggleUserSave({
        targetType,
        targetSlug,
        title,
        locale,
      });
      if (!result.ok && result.error === "login_required") {
        setNeedsLogin(true);
        setTipOpen(true);
        window.setTimeout(() => setTipOpen(false), 1800);
        return;
      }
      if (result.ok) {
        setSaved(result.saved);
        setTipOpen(true);
        window.setTimeout(() => setTipOpen(false), 1800);
      }
    });
  }

  const icon = (
    <Bookmark
      className="size-5"
      strokeWidth={1.6}
      fill={saved && !needsLogin ? "currentColor" : "none"}
      aria-hidden
    />
  );

  const buttonClass = cn(
    "inline-flex size-9 items-center justify-center rounded-sm transition",
    tone === "inverse"
      ? "text-[color:var(--parchment)] hover:bg-[color:var(--parchment)]/10"
      : "text-[color:var(--forest)] hover:bg-[color:var(--forest)]/8",
  );

  const popup = (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute top-full right-0 z-50 mt-1.5 whitespace-nowrap rounded-sm bg-[color:var(--forest)] px-2.5 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--parchment)] shadow-sm transition duration-150",
        "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100",
        tipOpen && "translate-y-0 opacity-100",
        tone === "inverse" &&
          "bg-[color:var(--parchment)] text-[color:var(--forest)]",
      )}
    >
      {tip}
    </span>
  );

  return (
    <div className="group relative">
      {needsLogin ? (
        <a href={loginHref} className={buttonClass} aria-label={label}>
          {icon}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={pending}
          className={buttonClass}
          aria-pressed={saved}
          aria-label={label}
        >
          {icon}
        </button>
      )}
      {popup}
    </div>
  );
}
