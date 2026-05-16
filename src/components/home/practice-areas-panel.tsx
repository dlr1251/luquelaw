import {
  BriefcaseBusiness,
  Building2,
  LayoutGrid,
  Plane,
  Scale,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { HomeContent } from "@/lib/home/content";

type PracticeAreaIcon = "immigration" | "realEstate" | "corporate" | "advisory";

const iconMap: Record<PracticeAreaIcon, LucideIcon> = {
  immigration: Plane,
  realEstate: Building2,
  corporate: BriefcaseBusiness,
  advisory: Scale,
};

type Props = {
  label: string;
  areas: HomeContent["practiceAreas"];
  credentialsLine: string;
  className?: string;
  id?: string;
  theme?: "light" | "dark";
};

export function PracticeAreasPanel({
  label,
  areas,
  credentialsLine,
  className,
  id,
  theme = "light",
}: Props) {
  const isLight = theme === "light";

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 p-6 sm:p-8",
        isLight
          ? "border border-[color:var(--moss)]/30 bg-[color:var(--card)]"
          : "border border-[color:var(--parchment)]/10 bg-[color:var(--parchment)]/[0.04]",
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center border",
            isLight
              ? "border-[color:var(--moss)]/40 bg-[color:var(--surface)] text-[color:var(--moss)]"
              : "border-[color:var(--moss)]/40 bg-[color:var(--parchment)]/5 text-[color:var(--moss)]",
          )}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span
          className={cn(
            "font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.22em]",
            isLight ? "text-[color:var(--moss)]" : "text-[color:var(--parchment)]/70",
          )}
        >
          {label}
        </span>
      </div>

      <ul
        className={cn(
          "grid sm:grid-cols-2 lg:grid-cols-4",
          isLight ? "divide-y divide-[color:var(--moss)]/15 sm:divide-y-0" : "divide-y divide-[color:var(--parchment)]/10 sm:divide-y-0",
        )}
      >
        {areas.map((area) => {
          const Icon = iconMap[area.icon];
          return (
            <li key={area.title} className="flex items-start gap-3.5 py-4 sm:px-3 lg:px-4">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border",
                  isLight
                    ? "border-[color:var(--moss)]/35 bg-[color:var(--surface)] text-[color:var(--moss)]"
                    : "border-[color:var(--moss)]/35 bg-[color:var(--parchment)]/8 text-[color:var(--moss)]",
                )}
              >
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium uppercase tracking-[0.07em]",
                    isLight ? "text-[color:var(--forest)]" : "text-[color:var(--parchment)]/95",
                  )}
                >
                  {area.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[0.8125rem] leading-5",
                    isLight ? "text-[color:var(--muted)]" : "text-[color:var(--parchment)]/55",
                  )}
                >
                  {area.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "mt-4 border-t pt-5",
          isLight ? "border-[color:var(--moss)]/20" : "border-[color:var(--parchment)]/10",
        )}
      >
        <p
          className={cn(
            "font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.18em]",
            isLight ? "text-[color:var(--muted)]" : "text-[color:var(--parchment)]/40",
          )}
        >
          {credentialsLine}
        </p>
      </div>
    </section>
  );
}
