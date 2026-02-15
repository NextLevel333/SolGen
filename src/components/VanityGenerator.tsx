import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VanityLength, VanityPosition } from '../config/constants';
import { validateVanityCharacters, formatDuration, estimateTime } from '../utils/format';
import { analyzeDifficulty, getDifficultyDescription } from '../utils/difficulty';
import { consumeTicket } from '../utils/ticket';

interface VanityGeneratorProps {
  vanityLength: VanityLength;
  vanityCharacters: string;
  vanityPosition: VanityPosition;
  onComplete: (result: GenerationResult) => void;
  onCancel?: (action: 'retry' | 'change') => void;
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
  onComplete,
  onCancel
}) => {
  const { publicKey } = useWallet();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
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
          
          // Consume ticket on successful generation
          if (publicKey) {
            consumeTicket(publicKey.toBase58());
          }
          
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
      workerRef.current.terminate();
    }
    setShowCancelDialog(true);
    // Clear worker reference after state update
    setTimeout(() => {
      workerRef.current = null;
    }, 0);
  };

  const handleCancelAction = (action: 'retry' | 'change') => {
    setShowCancelDialog(false);
    if (onCancel) {
      onCancel(action);
    }
  };
  
  const estimatedTime = progress ? estimateTime(vanityLength, progress.rate) : 0;
  const difficultyAnalysis = analyzeDifficulty(vanityCharacters, vanityPosition, vanityLength);
  
  // Show cancel dialog if requested
  if (showCancelDialog) {
    return (
      <div className="solana-card p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2 text-red-400">Generation Cancelled</h3>
          <p className="text-gray-400">
            Your vanity address generation has been stopped.
          </p>
        </div>

        <div className="bg-gray-700/50 p-6 rounded-lg space-y-4">
          <div className="border-b border-gray-600 pb-4">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Understanding Generation Difficulty</span>
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Difficulty Level: <span className="font-semibold text-solana-purple">
                {difficultyAnalysis.difficultyLevel.toUpperCase()}
              </span> - {getDifficultyDescription(difficultyAnalysis.difficultyLevel)}
            </p>
            <p className="text-sm text-gray-400">
              Average attempts needed: <span className="font-mono text-solana-green">
                ~{difficultyAnalysis.estimatedAttempts.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Tips for Your Pattern:</h4>
            {difficultyAnalysis.tips.map((tip, index) => (
              <div key={index} className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded">
                {tip}
              </div>
            ))}
          </div>

          {difficultyAnalysis.suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-400">Suggestions:</h4>
              {difficultyAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-gray-300 bg-yellow-900/20 border border-yellow-700/50 p-3 rounded">
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCancelAction('retry')}
            className="solana-button-primary w-full"
          >
            Try Again with Same Pattern
          </button>
          <button
            onClick={() => handleCancelAction('change')}
            className="solana-button-secondary w-full"
          >
            Change Characters
          </button>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
          <strong>Pro Tip:</strong> The generation process is completely random. Sometimes you get lucky and find a match quickly, 
          other times it takes longer than expected. Patience is key for longer patterns!
        </div>
      </div>
    );
  }
  
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
              {vanityPosition === 'prefix' ? `${vanityCharacters}...` : `...${vanityCharacters}`}
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
