import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnect } from '../components/WalletConnect';
import { LandingContent } from '../components/LandingContent';
import { PaymentGate } from '../components/PaymentGate';
import { VanityGenerator } from '../components/VanityGenerator';
import { ResultDisplay } from '../components/ResultDisplay';
import { VanityLength } from '../config/constants';

type Step = 'landing' | 'select-length' | 'payment' | 'generate' | 'result';

interface GenerationResult {
  publicKey: string;
  secretKey: number[];
  attempts: number;
  duration: number;
}

export default function Home() {
  const { connected } = useWallet();
  const [step, setStep] = useState<Step>('landing');
  const [selectedLength, setSelectedLength] = useState<VanityLength>(3);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  
  const handleLengthSelect = (length: VanityLength) => {
    setSelectedLength(length);
    setStep('payment');
  };
  
  const handlePaymentSuccess = () => {
    setStep('generate');
  };
  
  const handleGenerationComplete = (result: GenerationResult) => {
    setGenerationResult(result);
    setStep('result');
  };
  
  const handleReset = () => {
    setGenerationResult(null);
    setStep('select-length');
  };
  
  const handleStartGeneration = () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    setStep('select-length');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💎</div>
            <h1 className="text-2xl font-bold solana-gradient-text">SolGen</h1>
          </div>
          <WalletConnect />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'landing' && (
          <>
            <LandingContent />
            <div className="max-w-4xl mx-auto px-4 mt-12">
              <button
                onClick={handleStartGeneration}
                className="solana-button-primary w-full text-xl py-4 pulse-glow"
              >
                {connected ? 'Start Generating' : 'Connect Wallet to Start'}
              </button>
            </div>
          </>
        )}
        
        {step === 'select-length' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold solana-gradient-text mb-2">
                Choose Vanity Length
              </h2>
              <p className="text-gray-400">
                Select how many custom characters you want
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleLengthSelect(3)}
                className="solana-card p-8 hover:border-solana-purple transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="text-2xl font-bold mb-2">3 Characters</h3>
                <div className="text-3xl font-bold text-solana-purple mb-2">0.15 SOL</div>
                <div className="text-gray-400 text-sm mb-2">
                  <span className="text-solana-green">0.075 SOL</span> with SolGen tokens
                </div>
                <p className="text-gray-400 text-sm">
                  Faster generation, perfect for most users
                </p>
              </button>
              
              <button
                onClick={() => handleLengthSelect(4)}
                className="solana-card p-8 hover:border-solana-purple transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="text-5xl mb-4">4️⃣</div>
                <h3 className="text-2xl font-bold mb-2">4 Characters</h3>
                <div className="text-3xl font-bold text-solana-purple mb-2">0.40 SOL</div>
                <div className="text-gray-400 text-sm mb-2">
                  <span className="text-solana-green">0.20 SOL</span> with SolGen tokens
                </div>
                <p className="text-gray-400 text-sm">
                  More unique, takes longer to generate
                </p>
              </button>
            </div>
            
            <button
              onClick={() => setStep('landing')}
              className="solana-button-secondary w-full"
            >
              Back to Home
            </button>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <button
              onClick={() => setStep('select-length')}
              className="solana-button-secondary"
            >
              ← Back
            </button>
            <PaymentGate
              vanityLength={selectedLength}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}
        
        {step === 'generate' && (
          <div className="max-w-2xl mx-auto">
            <VanityGenerator
              vanityLength={selectedLength}
              onComplete={handleGenerationComplete}
            />
          </div>
        )}
        
        {step === 'result' && generationResult && (
          <div className="max-w-2xl mx-auto">
            <ResultDisplay
              result={generationResult}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
      
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p className="mb-2">
            <strong className="solana-gradient-text">SolGen</strong> - Privacy-First Solana Vanity Generator
          </p>
          <p>
            100% Client-Side • No Server Storage • Your Keys Never Leave Your Browser
          </p>
          <p className="mt-4 text-xs">
            Always verify you&apos;ve securely saved your keys. This tool is provided as-is without warranty.
          </p>
        </div>
      </footer>
    </div>
  );
}
