type Props = {
  size?: number;
  className?: string;
};

/** Slate LL mark — matches app favicon / apple-icon. */
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
      <rect width="32" height="32" fill="#1c1f24" />
      <rect
        x="3.8"
        y="3.8"
        width="24.4"
        height="24.4"
        fill="none"
        stroke="#45617d"
        strokeWidth="1.1"
      />
      {/* Back L */}
      <path
        d="M8.2 8.5H11.4V20.3H20.5V23.5H8.2Z"
        fill="#f5f6f7"
      />
      {/* Front L */}
      <path
        d="M12.6 10.3H15.8V22.1H24.9V25.3H12.6Z"
        fill="#8fb2d4"
        fillOpacity="0.92"
      />
    </svg>
  );
}
