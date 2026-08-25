"use client";

import { useState, useTransition } from "react";

import { toggleUserSave, type SaveTargetType } from "@/lib/saves/actions";

export function SaveButton({
  targetType,
  targetSlug,
  title,
  locale,
  initiallySaved,
  loginHref = "/login?next=/portal/saved",
}: {
  targetType: SaveTargetType;
  targetSlug: string;
  title: string;
  locale: "en" | "es";
  initiallySaved: boolean;
  loginHref?: string;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();
  const [needsLogin, setNeedsLogin] = useState(false);

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
        return;
      }
      if (result.ok) setSaved(result.saved);
    });
  }

  if (needsLogin) {
    return (
      <a href={loginHref} className="btn-secondary btn-secondary-sm">
        Sign in to save
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="btn-secondary btn-secondary-sm"
      aria-pressed={saved}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
