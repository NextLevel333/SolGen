import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <Image
      src="/alienlogo1.svg"
      alt="SolGen Logo"
      width={size * 1.2}
      height={size}
      className={`object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] ${className}`}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
};
