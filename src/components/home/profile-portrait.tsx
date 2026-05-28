import Image from "next/image";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  align?: "center" | "end";
  size?: "default" | "sm";
};

/** Circular portrait cropped to the face. */
export function ProfilePortrait({ className, align = "end", size = "default" }: Props) {
  return (
    <div
      className={cn(
        size === "sm"
          ? "w-full max-w-[112px] sm:max-w-[128px]"
          : "w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]",
        align === "center" ? "mx-auto" : "mx-auto lg:mx-0 lg:ml-auto",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-full border-2 border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.2)] ring-2 ring-hero-foreground/10">
        <Image
          src="/images/profile.png"
          alt="Daniel Luque Restrepo"
          fill
          sizes="(max-width: 640px) 240px, 320px"
          className="scale-[1.05] object-cover object-[50%_0%]"
          priority
        />
      </div>
    </div>
  );
}
