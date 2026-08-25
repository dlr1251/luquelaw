"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  basePath: string;
  q: string;
  status: string;
  placeholder?: string;
};

export function AdminContentFilters({
  basePath,
  q,
  status,
  placeholder = "Search title or slug…",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function push(nextQ: string, nextStatus: string) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${basePath}?${qs}` : basePath);
    });
  }

  return (
    <div
      className={`flex flex-wrap items-end gap-3 ${pending ? "opacity-70" : ""}`}
    >
      <div className="min-w-[12rem] flex-1 space-y-1.5">
        <Label htmlFor="admin-filter-q" className="text-xs">
          Search
        </Label>
        <Input
          id="admin-filter-q"
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.target.value;
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => push(value, status), 250);
          }}
        />
      </div>
      <div className="w-40 space-y-1.5">
        <Label htmlFor="admin-filter-status" className="text-xs">
          Status
        </Label>
        <select
          id="admin-filter-status"
          name="status"
          defaultValue={status || "all"}
          onChange={(e) => push(q, e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );
}
