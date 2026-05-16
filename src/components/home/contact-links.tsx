import { Mail } from "lucide-react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/cn";

type Props = {
  whatsappHref: string;
  className?: string;
  align?: "center" | "end";
};

const linkClass =
  "inline-flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-sm font-medium text-[color:var(--parchment)]/85 transition hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]";

export function ContactLinks({ whatsappHref, className, align = "end" }: Props) {
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
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#5dde7a]">
            <WhatsappIcon className="h-3.5 w-3.5" />
          </span>
          +57 300 679 1123
        </a>
      </li>
    </ul>
  );
}
