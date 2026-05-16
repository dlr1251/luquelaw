import Image from "next/image";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  align?: "center" | "end";
};

/**
 * Portrait frame: rounded rectangle (not circle) so wide/tall photos
 * are not clipped at the sides. object-contain keeps the full subject visible.
 */
export function ProfilePortrait({ className, align = "end" }: Props) {
  return (
    <div
      className={cn(
        "w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[280px]",
        align === "center" ? "mx-auto" : "mx-auto lg:mx-0 lg:ml-auto",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[color:var(--moss)]/45 bg-[color:var(--parchment)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-[color:var(--parchment)]/10">
        <Image
          src="/images/profile.png"
          alt="Daniel Luque Restrepo"
          fill
          sizes="(max-width: 640px) 240px, 280px"
          className="object-contain object-center p-4 sm:p-5"
          priority
        />
      </div>
    </div>
  );
}
