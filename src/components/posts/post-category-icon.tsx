import {
  BriefcaseBusiness,
  Building2,
  Plane,
  type LucideIcon,
} from "lucide-react";

import type { PostCategory } from "@/lib/posts/types";

const iconMap: Record<PostCategory, LucideIcon> = {
  Immigration: Plane,
  "Real Estate": Building2,
  Business: BriefcaseBusiness,
};

export function PostCategoryIcon({
  category,
  className = "h-4 w-4",
}: {
  category: PostCategory;
  className?: string;
}) {
  const Icon = iconMap[category];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
