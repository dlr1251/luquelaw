import {
  LL_MARK_DOT,
  LL_MARK_FONT_SIZE,
  LL_MARK_LEFT,
  LL_MARK_RIGHT,
  LL_MARK_VIEW_SIZE,
} from "@/lib/brand/ll-mark";

type Props = {
  size?: number;
  className?: string;
};

/** Luque • Law wordmark — matches app favicon / apple-icon. */
export function DlrMonogram({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${LL_MARK_VIEW_SIZE} ${LL_MARK_VIEW_SIZE}`}
      className={className}
      role="img"
      aria-label="Luque Law"
    >
      <rect width={LL_MARK_VIEW_SIZE} height={LL_MARK_VIEW_SIZE} fill="#1c1f24" />
      <text
        x={LL_MARK_LEFT.x}
        y={LL_MARK_LEFT.y}
        fill="#f5f6f7"
        fontFamily="var(--font-display), Arbutus Slab, Georgia, serif"
        fontSize={LL_MARK_FONT_SIZE}
        fontWeight={400}
      >
        {LL_MARK_LEFT.text}
      </text>
      <circle
        cx={LL_MARK_DOT.cx}
        cy={LL_MARK_DOT.cy}
        r={LL_MARK_DOT.r}
        fill="#f0cd3a"
      />
      <text
        x={LL_MARK_RIGHT.x}
        y={LL_MARK_RIGHT.y}
        fill="#f5f6f7"
        fontFamily="var(--font-display), Arbutus Slab, Georgia, serif"
        fontSize={LL_MARK_FONT_SIZE}
        fontWeight={400}
      >
        {LL_MARK_RIGHT.text}
      </text>
    </svg>
  );
}
