type Props = {
  size?: number;
  className?: string;
};

export function DlrMonogram({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Luque Law"
    >
      <rect width="32" height="32" fill="#1a3a1f" />
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="none"
        stroke="#f5f2ec"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fill="#f5f2ec"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="-0.04em"
      >
        LL
      </text>
    </svg>
  );
}
