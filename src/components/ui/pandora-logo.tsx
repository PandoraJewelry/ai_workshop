type PandoraLogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function PandoraLogo({
  className = "",
  width = 120,
  height = 24,
}: PandoraLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 24"
      fill="none"
      className={className}
    >
      <text
        x="0"
        y="18"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        fontWeight="400"
        letterSpacing="4"
        fill="currentColor"
      >
        PANDORA
      </text>
    </svg>
  );
}

export function PandoraCrown({
  className = "",
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      {/* Crown / "O" symbol inspired by Pandora brand */}
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 20C10 15.5817 12.6863 12 16 12C19.3137 12 22 15.5817 22 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}
