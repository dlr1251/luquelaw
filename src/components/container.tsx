import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function Container({ as: As = "div", children, className }: Props) {
  return (
    <As className={cn("mx-auto w-full max-w-6xl px-4", className)}>
      {children}
    </As>
  );
}

