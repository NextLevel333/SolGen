import React, { useState, useRef, useEffect } from 'react';
import { VanityLength, VanityPosition } from '../config/constants';
import { validateVanityCharacters, formatDuration, estimateTime } from '../utils/format';

interface VanityGeneratorProps {
  vanityLength: VanityLength;
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

export const VanityGenerator: React.FC<VanityGeneratorProps> = ({ vanityLength, onComplete }) => {
  const [characters, setCharacters] = useState('');
  const [position, setPosition] = useState<VanityPosition>('prefix');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState('');
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  const startGeneration = () => {
    if (!validateVanityCharacters(characters)) {
      setError('Invalid characters. Use only base58 characters (no 0, O, I, l)');
      return;
    }
    
    if (characters.length !== vanityLength) {
      setError(`Please enter exactly ${vanityLength} characters`);
      return;
    }
    
    setError('');
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
      characters,
      position,
    });
  };
  
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
        <h3 className="text-2xl font-semibold mb-2">Generate Vanity Address</h3>
        <p className="text-gray-400">
          {vanityLength}-character {position} generation
        </p>
      </div>
      
      {!isGenerating ? (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vanity Characters ({vanityLength} characters)
              </label>
              <input
                type="text"
                value={characters}
                onChange={(e) => {
                  const filtered = e.target.value
                    .slice(0, vanityLength)
                    .replace(/[^1-9A-HJ-NP-Za-km-z]/g, '');
                  setCharacters(filtered);
                }}
                placeholder={`Enter ${vanityLength} characters`}
                maxLength={vanityLength}
                className="solana-input uppercase"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use base58 characters: 1-9, A-Z (except O, I), a-z (except l)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPosition('prefix')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    position === 'prefix'
                      ? 'border-solana-purple bg-solana-purple/20 text-solana-purple'
                      : 'border-gray-600 bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="font-semibold">Prefix</div>
                  <div className="text-xs mt-1">Start of address</div>
                </button>
                <button
                  onClick={() => setPosition('suffix')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    position === 'suffix'
                      ? 'border-solana-purple bg-solana-purple/20 text-solana-purple'
                      : 'border-gray-600 bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="font-semibold">Suffix</div>
                  <div className="text-xs mt-1">End of address</div>
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}
          
          <button
            onClick={startGeneration}
            disabled={characters.length !== vanityLength}
            className="solana-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Generation
          </button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pattern:</span>
                <span className="font-mono font-semibold">
                  {position === 'prefix' ? `${characters.toUpperCase()}...` : `...${characters.toUpperCase()}`}
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
        </>
      )}
      
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm">
        <strong>Note:</strong> Generation time varies based on pattern complexity and your device&apos;s performance. 
        Estimated times are approximate.
      </div>
    </div>
  );
};
