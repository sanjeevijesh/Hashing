import React from 'react';

/**
 * Watermark Component
 * Renders an ultra-subtle, small, repeating academic background watermark
 * for 'SIVAKAMA SUNDARI AP/CSE' that stays strictly in the background
 * without interfering with user interaction.
 */
export const Watermark: React.FC = () => {
  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden"
    >
      <svg className="w-full h-full opacity-40">
        <defs>
          <pattern
            id="academic-watermark-pattern"
            width="280"
            height="130"
            patternTransform="rotate(-20 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <text
              x="20"
              y="40"
              fill="#64748b"
              fontFamily="'JetBrains Mono', 'Courier New', monospace"
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.08em"
              opacity="0.35"
            >
              SIVAKAMA SUNDARI AP/CSE
            </text>
            <text
              x="30"
              y="58"
              fill="#94a3b8"
              fontFamily="'JetBrains Mono', 'Courier New', monospace"
              fontSize="9"
              fontWeight="500"
              letterSpacing="0.05em"
              opacity="0.25"
            >
              NATIONAL ENGINEERING COLLEGE
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#academic-watermark-pattern)" />
      </svg>
    </div>
  );
};
