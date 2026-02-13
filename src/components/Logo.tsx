import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <Image
      src="/SolGenLogo.png"
      alt="SolGen Logo"
      width={size * 1.5}
      height={size}
      className={className}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
};
