import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { WalletConnect } from '../components/WalletConnect';
import { LandingContent } from '../components/LandingContent';
import { ConfigurationForm } from '../components/ConfigurationForm';
import { PaymentGate } from '../components/PaymentGate';
import { VanityGenerator } from '../components/VanityGenerator';
import { ResultDisplay } from '../components/ResultDisplay';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { Logo } from '../components/Logo';
import { VanityLength, VanityPosition } from '../config/constants';

type Step = 'landing' | 'select-length' | 'configure' | 'payment' | 'generate' | 'result';

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
  const [vanityCharacters, setVanityCharacters] = useState<string>('');
  const [vanityPosition, setVanityPosition] = useState<'prefix' | 'suffix'>('prefix');
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  
  const handleLengthSelect = (length: VanityLength) => {
    setSelectedLength(length);
    setStep('configure');
  };
  
  const handleConfigurationComplete = () => {
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
    // No wallet connection required to start
    setStep('select-length');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20 scroll-smooth">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size={100} className="transform hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect />
            <HamburgerMenu />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'landing' && (
          <div className="fade-in-up">
            <LandingContent />
            <div className="max-w-4xl mx-auto px-4 mt-12">
              <button
                onClick={handleStartGeneration}
                className="solana-button-primary w-full text-lg md:text-xl py-4 pulse-glow"
              >
                Start Generating
              </button>
            </div>
          </div>
        )}
        
        {step === 'select-length' && (
          <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold solana-gradient-text mb-2">
                Choose Vanity Length
              </h2>
              <p className="text-sm md:text-base text-gray-400">
                Select how many custom characters you want
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <button
                onClick={() => handleLengthSelect(3)}
                className="solana-card p-6 md:p-8 hover:border-solana-purple transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl md:text-5xl mb-4">3️⃣</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">3 Characters</h3>
                <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.2 SOL</div>
                <div className="text-sm text-gray-400 mb-1">
                  <span className="text-solana-green">0.12 SOL</span> Tier 2 (1M+ tokens)
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <span className="text-solana-green">FREE</span> Tier 1 (10M+ tokens)
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Faster generation, perfect for most users
                </p>
              </button>
              
              <button
                onClick={() => handleLengthSelect(4)}
                className="solana-card p-6 md:p-8 hover:border-solana-purple transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl md:text-5xl mb-4">4️⃣</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">4 Characters</h3>
                <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.4 SOL</div>
                <div className="text-sm text-gray-400 mb-1">
                  <span className="text-solana-green">0.24 SOL</span> Tier 2 (1M+ tokens)
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <span className="text-solana-green">FREE</span> Tier 1 (10M+ tokens)
                </div>
                <p className="text-xs md:text-sm text-gray-400">
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
        
        {step === 'configure' && (
          <ConfigurationForm
            vanityLength={selectedLength}
            onComplete={(chars, pos) => {
              setVanityCharacters(chars);
              setVanityPosition(pos);
              handleConfigurationComplete();
            }}
            onBack={() => setStep('select-length')}
          />
        )}
        
        {step === 'payment' && (
          <PaymentGate
            vanityLength={selectedLength}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setStep('configure')}
          />
        )}
        
        {step === 'generate' && (
          <div className="max-w-2xl mx-auto fade-in-up">
            <VanityGenerator
              vanityLength={selectedLength}
              vanityCharacters={vanityCharacters}
              vanityPosition={vanityPosition}
              onComplete={handleGenerationComplete}
            />
          </div>
        )}
        
        {step === 'result' && generationResult && (
          <div className="max-w-2xl mx-auto fade-in-up">
            <ResultDisplay
              result={generationResult}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
      
      <footer className="border-t border-gray-800 mt-20 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* About Section */}
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h2 className="text-xl font-bold solana-gradient-text mb-3">About SolGen</h2>
            <p className="text-gray-400 text-sm mb-4">
              SolGen is a <strong className="text-gray-300">100% client-side</strong> Solana vanity wallet generator. 
              All cryptographic operations happen in your browser using Web Workers. We <strong className="text-gray-300">never store, transmit, or have access</strong> to your private keys. 
              The entire application is <strong className="text-gray-300">open-source</strong> and available on GitHub for full transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-solana-green">✓</span> No data collection
              </span>
              <span className="flex items-center gap-1">
                <span className="text-solana-green">✓</span> No analytics
              </span>
              <span className="flex items-center gap-1">
                <span className="text-solana-green">✓</span> No tracking
              </span>
              <span className="flex items-center gap-1">
                <span className="text-solana-green">✓</span> No external scripts
              </span>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-solana-purple transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-solana-purple transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-solana-purple transition-colors">
              Contact
            </Link>
            <Link href="/resources" className="text-gray-400 hover:text-solana-purple transition-colors">
              Resources
            </Link>
            <a 
              href="https://github.com/NextLevel333/SolGen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-solana-purple transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
          
          {/* Copyright & Disclaimer */}
          <div className="text-center text-gray-500 text-xs space-y-2">
            <p>
              <strong className="solana-gradient-text">SolGen</strong> - Privacy-First Solana Vanity Generator
            </p>
            <p>
              100% Client-Side • No Server Storage • Your Keys Never Leave Your Browser
            </p>
            <p className="text-xs text-gray-600">
              Always verify you&apos;ve securely saved your keys. This tool is provided as-is without warranty.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
