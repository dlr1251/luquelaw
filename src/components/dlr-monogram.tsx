type Props = {
  size?: number;
  className?: string;
};

/** Luque Law seal: Forest field, Caramel frame, Cream letters. */
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
      <rect width="32" height="32" fill="#374f37" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        fill="none"
        stroke="#af9060"
        strokeWidth="2"
      />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fill="#f7ecdb"
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
