import React, { useState, useRef, useEffect } from 'react';
import { VanityLength, VanityPosition } from '../config/constants';
import { validateVanityCharacters, formatDuration, estimateTime } from '../utils/format';

interface VanityGeneratorProps {
  vanityLength: VanityLength;
  vanityCharacters: string;
  vanityPosition: VanityPosition;
  onComplete: (result: GenerationResult) => void;
}

interface GenerationResult {
  publicKey: string;
  secretKey: number[];
  attempts: number;
  duration: number;
}

interface ProgressData {
  attempts: number;
  rate: number;
  elapsed: number;
}

export const VanityGenerator: React.FC<VanityGeneratorProps> = ({ 
  vanityLength, 
  vanityCharacters,
  vanityPosition,
  onComplete 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    // Auto-start generation when component mounts
    const initializeGeneration = () => {
      setIsGenerating(true);
      setIsPaused(false);
      setProgress(null);
      
      // Create new worker
      workerRef.current = new Worker(new URL('../workers/vanity.worker.ts', import.meta.url));
      
      workerRef.current.onmessage = (event) => {
        const { type } = event.data;
        
        if (type === 'progress') {
          setProgress({
            attempts: event.data.attempts,
            rate: event.data.rate,
            elapsed: event.data.elapsed,
          });
        } else if (type === 'success') {
          setIsGenerating(false);
          onComplete({
            publicKey: event.data.publicKey,
            secretKey: event.data.secretKey,
            attempts: event.data.attempts,
            duration: event.data.duration,
          });
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }
        } else if (type === 'paused') {
          setIsPaused(true);
        } else if (type === 'resumed') {
          setIsPaused(false);
        } else if (type === 'cancelled') {
          setIsGenerating(false);
          setIsPaused(false);
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }
        }
      };
      
      workerRef.current.postMessage({
        type: 'generate',
        characters: vanityCharacters,
        position: vanityPosition,
      });
    };
    
    initializeGeneration();
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [vanityCharacters, vanityPosition, onComplete]);
  
  const pauseGeneration = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'pause' });
    }
  };
  
  const resumeGeneration = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'resume' });
    }
  };
  
  const cancelGeneration = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'cancel' });
    }
  };
  
  const estimatedTime = progress ? estimateTime(vanityLength, progress.rate) : 0;
  
  return (
    <div className="solana-card p-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Generating Vanity Address</h3>
        <p className="text-gray-400">
          {vanityLength}-character {vanityPosition} generation
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pattern:</span>
            <span className="font-mono font-semibold">
              {vanityPosition === 'prefix' ? `${vanityCharacters.toUpperCase()}...` : `...${vanityCharacters.toUpperCase()}`}
            </span>
          </div>
          
          {progress && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Attempts:</span>
                <span className="font-semibold">{progress.attempts.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rate:</span>
                <span className="font-semibold">{progress.rate.toLocaleString()} keys/sec</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Elapsed:</span>
                <span className="font-semibold">{formatDuration(progress.elapsed)}</span>
              </div>
              
              {estimatedTime > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Est. Time:</span>
                  <span className="font-semibold text-solana-green">
                    ~{formatDuration(estimatedTime)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-3">
          {!isPaused ? (
            <button
              onClick={pauseGeneration}
              className="solana-button-secondary flex-1"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={resumeGeneration}
              className="solana-button-primary flex-1"
            >
              Resume
            </button>
          )}
          
          <button
            onClick={cancelGeneration}
            className="solana-button-secondary flex-1 !bg-red-900/30 !border-red-700 !text-red-300 hover:!bg-red-900/50"
          >
            Cancel
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-solana-green">
          <div className="animate-spin h-5 w-5 border-2 border-solana-green border-t-transparent rounded-full" />
          <span>{isPaused ? 'Paused' : 'Generating...'}</span>
        </div>
      </div>
      
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm">
        <strong>Note:</strong> Generation time varies based on pattern complexity and your device&apos;s performance. 
        Estimated times are approximate.
      </div>
    </div>
  );
};
