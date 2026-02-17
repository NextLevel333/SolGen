import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const FADE_OUT_DURATION = 500; // Must match CSS transition-opacity duration
const PROGRESS_INCREMENT = 1.34; // Progress units per tick for 3-second loading duration
const PROGRESS_INTERVAL_MS = 40; // Milliseconds between progress updates

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showEnterButton, setShowEnterButton] = useState(false);

  useEffect(() => {
    // Simulate loading progress with extended duration (~3 seconds to reach 100%)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + PROGRESS_INCREMENT;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setShowEnterButton(true); // Show enter button when progress is complete
          return 100;
        }
        return newProgress;
      });
    }, PROGRESS_INTERVAL_MS);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onLoadingComplete, FADE_OUT_DURATION);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'} px-4`}>
      {/* Particle Background */}
      <div className="loading-particles" />
      
      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        {/* Logo with Pulsating Glow */}
        <div className="relative w-full flex justify-center">
          <Image 
            src="/alienlogo.svg" 
            alt="AlienTek Logo" 
            width={300} 
            height={119} 
            priority 
            className="h-auto max-w-full loading-logo-glow"
          />
        </div>

        {/* Loading Bar Container */}
        <div className="w-full">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-solana-purple via-solana-blue to-solana-green transition-all duration-300 ease-out loading-bar-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Button - Shows when progress reaches 100% */}
        {showEnterButton && (
          <button
            onClick={handleEnter}
            className="solana-button-primary text-lg px-8 py-4 animate-fadeIn"
          >
            Enter
          </button>
        )}
      </div>
    </div>
  );
};
