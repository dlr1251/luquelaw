import { Mail } from "lucide-react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/cn";

type Props = {
  whatsappHref: string;
  className?: string;
  align?: "center" | "end";
  variant?: "dark" | "light";
};

export function ContactLinks({ whatsappHref, className, align = "end", variant = "dark" }: Props) {
  const linkClass =
    variant === "light"
      ? "inline-flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-sm font-medium text-foreground transition hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      : "inline-flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-sm font-medium text-hero-foreground/85 transition hover:text-hero-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/40";
  return (
    <ul
      className={cn(
        "flex flex-col gap-2.5",
        align === "center" ? "items-center" : "items-center lg:items-end",
        className,
      )}
    >
      <li>
        <a href="mailto:daniel@luquelaw.co" className={linkClass}>
          <Mail className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          daniel@luquelaw.co
        </a>
      </li>
      <li>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className={linkClass}>
          <WhatsappIcon className="h-4 w-4 shrink-0" />
          +57 300 679 1123
        </a>
      </li>
    </ul>
  );
}
