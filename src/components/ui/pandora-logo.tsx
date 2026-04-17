type PandoraLogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

/**
 * myPandora logo — renders the crown icon + "myPandora" text
 */
export function PandoraLogo({
  className = "",
  width = 140,
  height = 28,
}: PandoraLogoProps) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{ width, height }}
    >
      <PandoraCrownIcon size={height} className="text-[#2d2d2d]" />
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: height * 0.5,
          fontWeight: 400,
          letterSpacing: "0.05em",
          color: "currentColor",
          whiteSpace: "nowrap",
        }}
      >
        myPandora
      </span>
    </div>
  );
}

/**
 * Pandora Crown "O" icon — the ring with three crown prongs.
 * Used as favicon, sidebar icon, and chat assistant avatar.
 */
export function PandoraCrownIcon({
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
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      {/* Three crown prongs */}
      <line
        x1="256"
        y1="40"
        x2="256"
        y2="110"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <line
        x1="196"
        y1="65"
        x2="218"
        y2="125"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <line
        x1="316"
        y1="65"
        x2="294"
        y2="125"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
      />
      {/* Three dots at top of prongs */}
      <circle cx="256" cy="32" r="20" fill="currentColor" />
      <circle cx="192" cy="56" r="20" fill="currentColor" />
      <circle cx="320" cy="56" r="20" fill="currentColor" />
      {/* Ring / O shape */}
      <circle
        cx="256"
        cy="316"
        r="170"
        stroke="currentColor"
        strokeWidth="60"
        fill="none"
      />
    </svg>
  );
}
