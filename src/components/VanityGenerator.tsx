import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VanityLength, VanityPosition, PerformanceMode, PERFORMANCE_CONFIG } from '../config/constants';
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

interface WorkerRef {
  worker: Worker;
  id: number;
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
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('balanced');
  const [showModeSelector, setShowModeSelector] = useState(true);
  const workersRef = useRef<WorkerRef[]>([]);
  const workerProgressRef = useRef<Map<number, ProgressData>>(new Map());
  
  // Helper function to get safe worker count
  const getSafeWorkerCount = (mode: PerformanceMode): number => {
    const maxWorkers = PERFORMANCE_CONFIG[mode].workers;
    const hardwareConcurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency 
      ? navigator.hardwareConcurrency 
      : 4;
    
    // Cap at 4 workers and not exceed hardwareConcurrency-1 for device safety
    return Math.min(maxWorkers, 4, Math.max(1, hardwareConcurrency - 1));
  };

  // Aggregate progress from all workers
  const aggregateProgress = (): ProgressData | null => {
    if (workerProgressRef.current.size === 0) return null;
    
    let totalAttempts = 0;
    let totalRate = 0;
    let maxElapsed = 0;
    
    workerProgressRef.current.forEach((progress) => {
      totalAttempts += progress.attempts;
      totalRate += progress.rate;
      maxElapsed = Math.max(maxElapsed, progress.elapsed);
    });
    
    return {
      attempts: totalAttempts,
      rate: totalRate,
      elapsed: maxElapsed,
    };
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(null);
    setShowModeSelector(false);
    workerProgressRef.current.clear();
    
    const config = PERFORMANCE_CONFIG[performanceMode];
    const workerCount = getSafeWorkerCount(performanceMode);
    
    // Create worker pool
    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(new URL('../workers/vanity.worker.ts', import.meta.url));
      
      worker.onmessage = (event) => {
        const { type, workerId = 0 } = event.data;
        
        if (type === 'progress') {
          workerProgressRef.current.set(workerId, {
            attempts: event.data.attempts,
            rate: event.data.rate,
            elapsed: event.data.elapsed,
          });
          setProgress(aggregateProgress());
        } else if (type === 'success') {
          // First worker to find a match wins
          setIsGenerating(false);
          
          // Terminate all workers
          workersRef.current.forEach(({ worker: w }) => w.terminate());
          workersRef.current = [];
          
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
        } else if (type === 'cancelled') {
          setIsGenerating(false);
          // Clean up all workers
          workersRef.current.forEach(({ worker: w }) => w.terminate());
          workersRef.current = [];
        }
      };
      
      worker.postMessage({
        type: 'generate',
        characters: vanityCharacters,
        position: vanityPosition,
        workerId: i,
        progressInterval: config.progressInterval,
        yieldInterval: config.yieldInterval,
      });
      
      workersRef.current.push({ worker, id: i });
    }
  };
  
  useEffect(() => {
    // Don't auto-start - wait for user to select performance mode and click start
    return () => {
      // Cleanup workers on unmount
      workersRef.current.forEach(({ worker }) => worker.terminate());
      workersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const cancelGeneration = () => {
    workersRef.current.forEach(({ worker }) => {
      worker.postMessage({ type: 'cancel' });
      worker.terminate();
    });
    workersRef.current = [];
    setShowCancelDialog(true);
  };

  const handleCancelAction = (action: 'retry' | 'change') => {
    setShowCancelDialog(false);
    setShowModeSelector(true); // Show mode selector for both retry and change
    if (onCancel) {
      onCancel(action);
    }
  };
  
  const estimatedTime = progress ? estimateTime(vanityLength, progress.rate) : 0;
  const difficultyAnalysis = analyzeDifficulty(vanityCharacters, vanityPosition, vanityLength);
  
  // Show performance mode selector before starting generation
  if (showModeSelector && !isGenerating) {
    return (
      <div className="solana-card p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Select Performance Mode</h3>
          <p className="text-gray-400">
            Choose how fast you want to generate your {vanityLength}-character {vanityPosition} address
          </p>
        </div>

        <div className="space-y-3">
          {(Object.keys(PERFORMANCE_CONFIG) as PerformanceMode[]).map((mode) => {
            const config = PERFORMANCE_CONFIG[mode];
            const workerCount = getSafeWorkerCount(mode);
            return (
              <button
                key={mode}
                onClick={() => setPerformanceMode(mode)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  performanceMode === mode
                    ? 'border-solana-purple bg-solana-purple/20'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold capitalize">{mode}</span>
                    {mode === 'balanced' && (
                      <span className="text-xs bg-solana-green/20 text-solana-green px-2 py-1 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{workerCount} worker{workerCount > 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm text-gray-300">{config.description}</p>
              </button>
            );
          })}
        </div>

        <button
          onClick={startGeneration}
          className="solana-button-primary w-full"
        >
          Start Generation
        </button>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
          <strong>💡 Performance Tip:</strong> For optimal performance, close other apps on your device and ensure your browser tab stays active during generation.
        </div>
      </div>
    );
  }
  
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
          {vanityLength}-character {vanityPosition} generation in <span className="capitalize font-semibold text-solana-purple">{performanceMode}</span> mode
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Using {workersRef.current.length} worker{workersRef.current.length > 1 ? 's' : ''}
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
          <button
            onClick={cancelGeneration}
            className="solana-button-secondary w-full !bg-red-900/30 !border-red-700 !text-red-300 hover:!bg-red-900/50"
          >
            Cancel
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-solana-green">
          <div className="animate-spin h-5 w-5 border-2 border-solana-green border-t-transparent rounded-full" />
          <span>Generating...</span>
        </div>
      </div>
      
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm">
        <strong>⚡ Performance Tip:</strong> Generation time varies based on pattern complexity and your device&apos;s performance. 
        For best results, avoid running other heavy apps during generation and keep this tab active.
      </div>
    </div>
  );
};
