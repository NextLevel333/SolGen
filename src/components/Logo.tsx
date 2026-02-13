import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#9945FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#14F195', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#14F195', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#00D4FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#9945FF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#solanaGradient)"
        strokeWidth="2"
        fill="none"
      />

      {/* Diamond/Gem Shape */}
      <g transform="translate(50, 50)">
        {/* Top facet */}
        <path
          d="M 0,-30 L 20,-10 L 0,10 L -20,-10 Z"
          fill="url(#diamondGradient)"
          opacity="0.9"
        />
        {/* Bottom facet */}
        <path
          d="M 0,10 L 20,-10 L 0,30 Z"
          fill="url(#diamondGradient)"
          opacity="0.7"
        />
        <path
          d="M 0,10 L -20,-10 L 0,30 Z"
          fill="url(#diamondGradient)"
          opacity="0.5"
        />
        
        {/* Highlight */}
        <path
          d="M -5,-20 L 5,-20 L 0,-10 Z"
          fill="white"
          opacity="0.6"
        />
      </g>

      {/* Inner glow circle */}
      <circle
        cx="50"
        cy="50"
        r="32"
        stroke="url(#solanaGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
};
