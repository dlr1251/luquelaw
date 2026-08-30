import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
  footer?: ReactNode;
  homeHref?: string;
};

export function AuthShell({
  title,
  lead,
  children,
  footer,
  homeHref = "/",
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside className="bg-hero text-hero-foreground px-6 py-8 sm:px-10 lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:px-12 lg:py-14 xl:px-16">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-[0.3em] font-display text-lg font-normal leading-none tracking-tight text-hero-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-accent"
          aria-label="Luque Law — home"
        >
          <span>Luque</span>
          <span aria-hidden="true" className="brand-mark-dot" />
          <span>Law</span>
        </Link>

        <div className="mt-12 max-w-md lg:mt-0">
          <p className="marketing-eyebrow marketing-eyebrow-on-hero">Portal</p>
          <h1 className="marketing-display mt-5 text-hero-foreground">{title}</h1>
          {lead ? (
            <p className="marketing-lead mt-6 max-w-sm italic text-hero-muted">{lead}</p>
          ) : null}
        </div>

        <p className="mt-12 hidden font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-hero-muted lg:block">
          Medellín
        </p>
      </aside>

      <div className="relative flex flex-1 flex-col justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16 xl:px-24">
        <div className="mx-auto w-full max-w-[26rem]">
          {children}
          {footer ? <div className="mt-10">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export const authLabelClass =
  "font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--forest)]";

export const authFieldClass =
  "mt-2 h-12 w-full border border-border bg-card px-4 text-base text-foreground outline-none ring-[color:var(--moss)]/35 placeholder:text-muted-foreground focus:ring-2 sm:text-sm";

export function AuthNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm leading-6 text-foreground"
          : "border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground"
      }
    >
      {children}
    </p>
  );
}

export function AuthFooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="text-sm leading-6 text-muted-foreground">
      <Link
        href={href}
        className="font-medium text-[color:var(--forest)] underline-offset-4 hover:underline"
      >
        {children}
      </Link>
    </p>
  );
}
