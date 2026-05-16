import {
  BriefcaseBusiness,
  Building2,
  Plane,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { ClkrCategory } from "@/lib/clkr/articles";

const iconMap: Record<ClkrCategory, LucideIcon> = {
  Immigration: Plane,
  "Real Estate": Building2,
  Corporate: BriefcaseBusiness,
  Labor: Users,
  Civil: Scale,
};

export function ClkrCategoryIcon({
  category,
  className = "h-4 w-4",
}: {
  category: ClkrCategory;
  className?: string;
}) {
  const Icon = iconMap[category];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
