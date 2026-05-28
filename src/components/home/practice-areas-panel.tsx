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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {areas.map((area) => {
          const Icon = iconMap[area.icon];
          return (
            <li
              key={area.title}
              className="flex h-full flex-col gap-3 border border-border bg-surface/60 p-4 sm:p-5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card text-foreground">
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-ui)] text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-foreground">
                  {area.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
              </div>
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
