import {
  BriefcaseBusiness,
  Building2,
  Copyright,
  Gavel,
  Globe2,
  Landmark,
  Plane,
  Receipt,
  Scale,
  Shield,
  Smartphone,
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
  Family: Users,
  Tax: Receipt,
  Digital: Smartphone,
  Administrative: Landmark,
  IP: Copyright,
  Criminal: Gavel,
  International: Globe2,
};

export function ClkrCategoryIcon({
  category,
  className = "h-4 w-4",
}: {
  category: ClkrCategory;
  className?: string;
}) {
  const Icon = iconMap[category] ?? Shield;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
