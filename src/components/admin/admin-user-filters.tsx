"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  q: string;
  role: string;
};

export function AdminUserFilters({ q, role }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState(q);
  const [roleValue, setRoleValue] = useState(role || "all");

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    setRoleValue(role || "all");
  }, [role]);

  function push(nextQ: string, nextRole: string) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextRole && nextRole !== "all") params.set("role", nextRole);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/admin/users?${qs}` : "/admin/users");
    });
  }

  return (
    <div className={`flex flex-wrap items-end gap-3 ${pending ? "opacity-70" : ""}`}>
      <div className="min-w-[12rem] flex-1 space-y-1.5">
        <Label htmlFor="admin-users-q" className="text-xs">
          Search
        </Label>
        <Input
          id="admin-users-q"
          name="q"
          value={query}
          placeholder="Name or email…"
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => push(value, roleValue), 250);
          }}
        />
      </div>
      <div className="w-40 space-y-1.5">
        <Label htmlFor="admin-users-role" className="text-xs">
          Access
        </Label>
        <select
          id="admin-users-role"
          name="role"
          value={roleValue}
          onChange={(e) => {
            const value = e.target.value;
            setRoleValue(value);
            push(query, value);
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="all">All</option>
          <option value="admin">CMS admin</option>
          <option value="client">Client flag</option>
        </select>
      </div>
    </div>
  );
}
