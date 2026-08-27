import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  HeartHandshake,
  LayoutGrid,
  Plane,
  Receipt,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { HomeContent } from "@/lib/home/content";

type PracticeAreaIcon =
  | "immigration"
  | "labour"
  | "realEstate"
  | "family"
  | "corporate"
  | "taxes";

const iconMap: Record<PracticeAreaIcon, LucideIcon> = {
  immigration: Plane,
  labour: Users,
  realEstate: Building2,
  family: HeartHandshake,
  corporate: BriefcaseBusiness,
  taxes: Receipt,
};

type Props = {
  label: string;
  areas: HomeContent["practiceAreas"];
  credentialsLine: string;
  className?: string;
  id?: string;
};

export function PracticeAreasPanel({ label, areas, credentialsLine, className, id }: Props) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28 border border-border bg-card p-5 sm:p-7 lg:p-8", className)}
    >
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-surface text-muted-foreground">
          <LayoutGrid className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="marketing-eyebrow text-[0.625rem]">{label}</span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {areas.map((area) => {
          const Icon = iconMap[area.icon];
          const linked = Boolean(area.href);

          const body = (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-[color:var(--moss)] transition-[width] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-1.5 group-focus-visible:w-1.5"
              />
              <span
                aria-hidden="true"
                className="practice-area-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[color:var(--moss)]/25 to-transparent opacity-0"
              />
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card text-foreground transition-[border-color,background-color,color,box-shadow,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-[color:var(--moss)] group-hover:bg-[color:var(--moss)] group-hover:text-[color:var(--forest)] group-hover:shadow-[0_0_0_5px_color-mix(in_srgb,var(--moss)_20%,transparent)] group-focus-visible:-translate-y-0.5 group-focus-visible:border-[color:var(--moss)] group-focus-visible:bg-[color:var(--moss)] group-focus-visible:text-[color:var(--forest)]">
                <Icon
                  className="practice-area-icon h-[1.125rem] w-[1.125rem]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0 flex-1 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
                <p className="font-[family-name:var(--font-ui)] text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-foreground transition-[color,letter-spacing] duration-[400ms] ease-out group-hover:tracking-[0.1em] group-hover:text-[color:var(--moss)] group-focus-visible:tracking-[0.1em] group-focus-visible:text-[color:var(--moss)]">
                  {area.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 delay-75 group-hover:text-foreground/80 group-focus-visible:text-foreground/80">
                  {area.detail}
                </p>
                {linked ? (
                  <span
                    aria-hidden="true"
                    className="mt-3 inline-flex translate-x-[-0.4rem] items-center font-[family-name:var(--font-ui)] text-base leading-none text-[color:var(--moss)] opacity-0 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-75 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  >
                    →
                  </span>
                ) : null}
              </div>
            </>
          );

          const cardClass = cn(
            "practice-area-card group relative flex h-full flex-col gap-3 overflow-hidden border border-border bg-background p-4 outline-none transition-[transform,border-color,box-shadow,background-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5",
            "motion-reduce:transform-none motion-reduce:transition-colors",
          );

          const interactiveClass =
            "hover:-translate-y-1.5 hover:border-[color:var(--moss)]/80 hover:bg-card hover:shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--forest)_50%,transparent),0_0_0_1px_color-mix(in_srgb,var(--moss)_35%,transparent)] focus-visible:-translate-y-1.5 focus-visible:border-[color:var(--moss)] focus-visible:shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--forest)_50%,transparent),0_0_0_1px_color-mix(in_srgb,var(--moss)_45%,transparent)]";

          return (
            <li key={area.title} className="h-full">
              {area.href ? (
                <Link href={area.href} className={cn(cardClass, interactiveClass)}>
                  {body}
                </Link>
              ) : (
                <div className={cardClass}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-t border-border pt-5 sm:mt-8">
        <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {credentialsLine}
        </p>
      </div>
    </section>
  );
}
