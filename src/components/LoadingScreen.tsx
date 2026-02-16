import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const FADE_OUT_DURATION = 500; // Must match CSS transition-opacity duration

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    // Complete loading after progress reaches 100%
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, FADE_OUT_DURATION); // Wait for fade out animation
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}>
      {/* Particle Background */}
      <div className="loading-particles" />
      
      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8">
        {/* Logo with Pulsating Glow */}
        <div className="relative">
          <Image 
            src="/alienlogo.svg" 
            alt="AlienTek Logo" 
            width={300} 
            height={119} 
            priority 
            className="h-auto loading-logo-glow"
          />
        </div>

        {/* Loading Bar Container */}
        <div className="w-80 max-w-sm">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-solana-purple via-solana-blue to-solana-green transition-all duration-300 ease-out loading-bar-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
