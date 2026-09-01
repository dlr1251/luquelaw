import Link from "next/link";

import type { AdminTopbarStats } from "@/lib/admin/stats";

type Props = {
  stats: AdminTopbarStats;
};

function Stat({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link
      href={href}
      className="inline-flex items-baseline gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted"
    >
      <span className="font-medium tabular-nums text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </Link>
  );
}

export function AdminTopbar({ stats }: Props) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-background px-3 sm:px-4">
      <Link
        href="/admin/clkr"
        className="shrink-0 font-display text-sm font-normal tracking-tight text-[color:var(--forest)]"
      >
        Luque Law
        <span className="ml-1.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
          Admin
        </span>
      </Link>

      <div className="min-w-0 flex-1 overflow-x-auto">
        <nav className="flex items-center gap-0.5 sm:justify-center">
          <Stat href="/admin/clkr" label="articles" value={stats.articles} />
          <Stat href="/admin/users" label="users" value={stats.users} />
          <Stat href="/admin/tickets" label="open tickets" value={stats.openTickets} />
        </nav>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 text-xs">
        <Link href="/" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Site
        </Link>
        <Link
          href="/portal"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Portal
        </Link>
      </div>
    </header>
  );
}
