type PandoraRobotProps = {
  className?: string;
  size?: number;
};

/**
 * 3D-styled Pandora robot mascot — a friendly helper bot with Pandora branding.
 * Features a crown on its head, glowing pink eyes, and a welcoming pose.
 */
export function PandoraRobot({
  className = "",
  size = 200,
}: PandoraRobotProps) {
  const scale = size / 200;

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      fill="none"
      className={className}
    >
      <defs>
        {/* 3D gradient for robot body */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f0f5" />
          <stop offset="50%" stopColor="#d8d8e0" />
          <stop offset="100%" stopColor="#b8b8c5" />
        </linearGradient>
        {/* Pink glow gradient */}
        <radialGradient id="pinkGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0007a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e0007a" stopOpacity="0" />
        </radialGradient>
        {/* Eye glow */}
        <radialGradient id="eyeGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff4da6" />
          <stop offset="60%" stopColor="#e0007a" />
          <stop offset="100%" stopColor="#b30062" />
        </radialGradient>
        {/* Head 3D gradient */}
        <linearGradient id="headGrad" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#f5f5fa" />
          <stop offset="100%" stopColor="#c8c8d5" />
        </linearGradient>
        {/* Shadow */}
        <radialGradient id="shadowGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Arm gradient */}
        <linearGradient id="armGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e8f0" />
          <stop offset="100%" stopColor="#b0b0c0" />
        </linearGradient>
        {/* Screen gradient */}
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#2d2d4a" />
        </linearGradient>
        {/* Crown gradient */}
        <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff69b4" />
          <stop offset="100%" stopColor="#e0007a" />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <ellipse cx="100" cy="232" rx="55" ry="8" fill="url(#shadowGrad)" />

      {/* === LEGS === */}
      {/* Left leg */}
      <rect x="72" y="185" width="16" height="30" rx="6" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
      {/* Left foot */}
      <rect x="66" y="210" width="26" height="12" rx="6" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
      {/* Right leg */}
      <rect x="112" y="185" width="16" height="30" rx="6" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
      {/* Right foot */}
      <rect x="108" y="210" width="26" height="12" rx="6" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />

      {/* === BODY === */}
      <rect x="62" y="120" width="76" height="70" rx="14" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1.5" />

      {/* Chest screen / display */}
      <rect x="74" y="130" width="52" height="36" rx="6" fill="url(#screenGrad)" />
      {/* Screen content - heart icon */}
      <path
        d="M100 155 C100 155, 88 145, 88 140 C88 136, 91 134, 94 134 C97 134, 100 137, 100 137 C100 137, 103 134, 106 134 C109 134, 112 136, 112 140 C112 145, 100 155, 100 155Z"
        fill="#e0007a"
        opacity="0.9"
      />
      {/* Screen scan lines */}
      <line x1="74" y1="138" x2="126" y2="138" stroke="#ffffff" strokeWidth="0.3" opacity="0.2" />
      <line x1="74" y1="146" x2="126" y2="146" stroke="#ffffff" strokeWidth="0.3" opacity="0.2" />
      <line x1="74" y1="154" x2="126" y2="154" stroke="#ffffff" strokeWidth="0.3" opacity="0.2" />

      {/* Belly button / power indicator */}
      <circle cx="100" cy="176" r="4" fill="#e0007a" opacity="0.8" />
      <circle cx="100" cy="176" r="6" fill="none" stroke="#e0007a" strokeWidth="1" opacity="0.3" />

      {/* === ARMS === */}
      {/* Left arm - waving */}
      <g transform="rotate(-30, 58, 130)">
        <rect x="32" y="120" width="16" height="45" rx="8" fill="url(#armGrad)" stroke="#a0a0b0" strokeWidth="1" />
        {/* Left hand - open/waving */}
        <circle cx="40" cy="110" r="10" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
        {/* Fingers spread */}
        <line x1="34" y1="104" x2="32" y2="96" stroke="#c0c0d0" strokeWidth="3" strokeLinecap="round" />
        <line x1="39" y1="101" x2="38" y2="93" stroke="#c0c0d0" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="101" x2="45" y2="93" stroke="#c0c0d0" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Right arm - relaxed/helpful */}
      <g>
        <rect x="152" y="128" width="16" height="40" rx="8" fill="url(#armGrad)" stroke="#a0a0b0" strokeWidth="1" />
        {/* Right hand */}
        <circle cx="160" cy="172" r="10" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
      </g>

      {/* === HEAD === */}
      <rect x="58" y="42" width="84" height="74" rx="20" fill="url(#headGrad)" stroke="#a0a0b0" strokeWidth="1.5" />

      {/* Antenna base */}
      <rect x="94" y="32" width="12" height="14" rx="4" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />

      {/* === CROWN on top === */}
      <g transform="translate(100, 18)">
        {/* Crown prongs */}
        <polygon points="0,-16 -4,-4 4,-4" fill="url(#crownGrad)" />
        <polygon points="-12,-10 -10,-2 -6,-6" fill="url(#crownGrad)" />
        <polygon points="12,-10 10,-2 6,-6" fill="url(#crownGrad)" />
        {/* Crown dots */}
        <circle cx="0" cy="-17" r="3" fill="#ff69b4" />
        <circle cx="-12" cy="-11" r="2.5" fill="#ff69b4" />
        <circle cx="12" cy="-11" r="2.5" fill="#ff69b4" />
        {/* Crown base */}
        <rect x="-14" y="-4" width="28" height="6" rx="2" fill="url(#crownGrad)" />
      </g>

      {/* === FACE === */}
      {/* Ear panels */}
      <rect x="48" y="60" width="14" height="24" rx="5" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
      <rect x="138" y="60" width="14" height="24" rx="5" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />

      {/* Eye sockets */}
      <rect x="72" y="58" width="22" height="18" rx="6" fill="#1a1a2e" />
      <rect x="106" y="58" width="22" height="18" rx="6" fill="#1a1a2e" />

      {/* Eyes - glowing pink */}
      <ellipse cx="83" cy="67" rx="8" ry="6" fill="url(#eyeGlow)" />
      <ellipse cx="117" cy="67" rx="8" ry="6" fill="url(#eyeGlow)" />
      {/* Eye highlights */}
      <ellipse cx="86" cy="64" rx="3" ry="2" fill="white" opacity="0.7" />
      <ellipse cx="120" cy="64" rx="3" ry="2" fill="white" opacity="0.7" />

      {/* Eye glow effect */}
      <ellipse cx="83" cy="67" rx="12" ry="10" fill="url(#pinkGlow)" opacity="0.4" />
      <ellipse cx="117" cy="67" rx="12" ry="10" fill="url(#pinkGlow)" opacity="0.4" />

      {/* Mouth - friendly smile */}
      <path
        d="M88 88 Q100 98, 112 88"
        fill="none"
        stroke="#a0a0b0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Cheek blush */}
      <ellipse cx="72" cy="84" rx="7" ry="4" fill="#e0007a" opacity="0.15" />
      <ellipse cx="128" cy="84" rx="7" ry="4" fill="#e0007a" opacity="0.15" />

      {/* Neck */}
      <rect x="90" y="114" width="20" height="10" rx="4" fill="url(#bodyGrad)" stroke="#a0a0b0" strokeWidth="1" />
    </svg>
  );
}
