import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Ink color for the H block. Defaults to brand ink. */
  ink?: string;
  /** Accent color for the acceleration stroke and circuit. Defaults to brand red. */
  red?: string;
};

/**
 * H Legal brand mark — italic block "H" with a red acceleration stroke and
 * circuit, per the H Legal identity (propuesta 3E). Wordmark is rendered
 * separately alongside this glyph.
 */
export function HLegalLogo({ className, ink = "#FFFFFF", red = "#E63946" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <g transform="skewX(-9)" fill={ink}>
        <rect x="10" y="10" width="10" height="44" rx="1.5" />
        <rect x="34" y="10" width="10" height="44" rx="1.5" />
        <rect x="14" y="28" width="30" height="9" rx="1.5" />
      </g>
      <path d="M30 24 L60 14 L57 22 L33 31 Z" fill={red} />
      <g stroke={red} strokeWidth="1.6" fill="none" opacity="0.9">
        <path d="M45 20 H53 V13" />
        <path d="M47 27 H57" />
      </g>
      <circle cx="53" cy="13" r="1.8" fill={red} />
      <circle cx="57" cy="27" r="1.8" fill={red} />
      <g fill={red}>
        <rect x="58" y="17" width="2.4" height="2.4" />
        <rect x="61.5" y="20.5" width="1.8" height="1.8" opacity="0.7" />
        <rect x="59" y="24" width="1.6" height="1.6" opacity="0.5" />
      </g>
    </svg>
  );
}
