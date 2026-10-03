import React, { useState } from 'react';

const HOTLINK_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1V-Zb_hhpk71mBxIwqK0DFU0W6pUPrnzWHnbeYNYSmBecvv1I_QpqREY4P2g2_EiLcyJ1aVA1gt80sY3GbJGcIgCBc02LWMJ9aL7BT5_-6iDh1pDlhCknYLXaeqDiUgOQv7t1332XT-v2FrolKKt7Ydb1g4MRuxYJ82ppY2V2xpbfA5ldXsiJC3yWgu1HyIuJvOJla_9DKiHmC7zz4CsUWNEMDNzVjS6e852NqEYu4O-WjYQz-aKRytmFKQ';

interface TacticalLogoProps {
  className?: string;
  size?: number;
}

export const TacticalLogo: React.FC<TacticalLogoProps> = ({ className = 'h-8 w-auto object-contain', size = 32 }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    // Vector tactical hexagon X emblem matching Image 7 / 8
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <polygon
          points="50,4 92,26 92,74 50,96 8,74 8,26"
          fill="#0d1322"
          stroke="#00eefc"
          strokeWidth="3.5"
        />
        <polygon
          points="50,8 88,28 88,72 50,92 12,72 12,28"
          fill="#151b2b"
          stroke="#0ea5e9"
          strokeWidth="1.5"
        />
        {/* Crosshair grid lines */}
        <line x1="50" y1="12" x2="50" y2="88" stroke="#00eefc" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.6" />
        <line x1="16" y1="50" x2="84" y2="50" stroke="#00eefc" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.6" />
        {/* Cyan Glowing 'X' */}
        <path
          d="M 32 30 L 50 48 L 68 30 L 76 38 L 58 56 L 76 74 L 68 82 L 50 64 L 32 82 L 24 74 L 42 56 L 24 38 Z"
          fill="#00eefc"
          filter="drop-shadow(0px 0px 4px #00eefc)"
        />
        {/* Center glowing focal point */}
        <circle cx="50" cy="56" r="4.5" fill="#ffffff" />
        <circle cx="50" cy="56" r="8" stroke="#4edea3" strokeDasharray="2 2" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <img
      src={HOTLINK_LOGO_URL}
      alt="RANGER-X Tactical Crest Logo"
      className={className}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
