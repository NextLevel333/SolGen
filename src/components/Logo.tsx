import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 100, className = '' }: LogoProps) {
  return (
    <Image
      src="/SolGenLogo.png"
      alt="SolGen Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
