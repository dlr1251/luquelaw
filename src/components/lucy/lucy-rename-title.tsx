"use client";

import { useRef, useState, useTransition } from "react";

import { renameLucyChat } from "@/app/(dashboard)/portal/lucy/actions";
import { cn } from "@/lib/utils";

export function LucyRenameTitle({
  chatId,
  projectId,
  title,
  variant = "header",
}: {
  chatId: string;
  projectId: string;
  title: string;
  variant?: "header" | "nav";
}) {
  const [value, setValue] = useState(title);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function save() {
    const next = value.trim().slice(0, 80) || "New chat";
    setValue(next);
    setEditing(false);
    if (next === title) return;
    const fd = new FormData();
    fd.set("chat_id", chatId);
    fd.set("project_id", projectId);
    fd.set("title", next);
    startTransition(() => {
      void renameLucyChat(fd);
    });
  }

  if (variant === "nav" && !editing) {
    return (
      <button
        type="button"
        title="Rename chat"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setEditing(true);
          requestAnimationFrame(() => inputRef.current?.select());
        }}
        className="min-w-0 flex-1 truncate text-left"
      >
        {value}
      </button>
    );
  }

  if (!editing && variant === "header") {
    return (
      <button
        type="button"
        onClick={() => {
          setEditing(true);
          requestAnimationFrame(() => inputRef.current?.select());
        }}
        className="block max-w-full truncate text-left text-sm font-medium hover:underline"
        title="Rename chat"
      >
        {value}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={value}
      maxLength={80}
      autoFocus
      aria-label="Chat title"
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          save();
        }
        if (e.key === "Escape") {
          setValue(title);
          setEditing(false);
        }
      }}
      className={cn(
        "w-full bg-transparent outline-none",
        variant === "header"
          ? "text-sm font-medium"
          : "rounded px-0.5 text-sm",
      )}
    />
  );
}
