import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ScrollReveal } from './ScrollReveal';
import { CONFIG } from '../config/constants';

interface LandingContentProps {
  onStartGeneration: () => void;
}

type ToolSelection = 'wallet' | 'contract';

export const LandingContent: React.FC<LandingContentProps> = ({ onStartGeneration }) => {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<ToolSelection>('wallet');
  const [isToolDropdownOpen, setIsToolDropdownOpen] = useState(false);

  const handleToolAction = () => {
    if (selectedTool === 'wallet') {
      onStartGeneration();
    } else {
      router.push('/vanity-contract');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <ScrollReveal direction="fade" delay={0}>
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            <div className="flex justify-center">
              <Image src="/alienlogo.svg" alt="AlienTek Logo" width={260} height={103} priority className="h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse"/>
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Solana Blockchain Tools
          </p>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
            AlienTek offers mobile-friendly tools for generating custom Solana wallets and deploying custom contract addresses on pump.fun.
            Solana Blockchain tools built for everyone!
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={100}>
        <div className="solana-card p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400">
            Secure High Performance
          </h2>
          
          {/* Three images in a row */}
          <div className="flex justify-center items-center gap-6 md:gap-8">
            <div className="flex justify-center">
              <Image src="/lock.svg" alt="Private" width={50} height={50} className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
            <div className="flex justify-center">
              <Image src="/power.svg" alt="Performance" width={50} height={50} className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
            <div className="flex justify-center">
              <Image src="/tokens.svg" alt="Benefits" width={50} height={50} className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          {/* Combined description */}
          <p className="text-sm md:text-base text-gray-200 max-w-3xl mx-auto">
            Custom wallet generation happens in your browser using Web Workers—no server communication, no data storage, complete privacy. 
            Leveraging parallel processing with real-time progress tracking and ETA for high performance. 
            Our 3-tier holder system grants holders discounts off all current and future services. 
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={250}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text text-center">About AlienTek Token</h2>
          {/* Image placeholder - replace with custom image */}
          <div className="w-full bg-gray-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-4 md:p-6">
            <Image src="/img1.svg" alt="AlienTek Logo" width={600} height={337} priority className="w-full h-auto object-contain"/>          </div>
          <p className="text-sm md:text-base text-gray-300">
            AlienTek is the native utility token for this platform. Launched on pump.fun through our &quot;Custom CA Maker&quot;. Token holders receive automatic discounts based on their tier level.
            Developer fees that are collected will go back into the token&apos;s eco-system i.e. development, marketing, giveaways, and future staking programs.
          </p>
          <p className="text-sm md:text-base text-gray-300">
            <strong>Status:</strong> NOT LIVE
          </p>
          <p className="text-sm md:text-base text-gray-300">
            <strong>Contract Address:</strong> <span className="text-solana-green font-mono text-xs break-all">TBA</span>
          </p>
          <p className="text-xs md:text-sm text-gray-200 text-center">
            Your wallet is automatically checked for AlienTek tokens when you connect. The appropriate tier discount is applied based on your balance.
          </p>
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="solana-button-primary inline-flex items-center gap-2 mt-4"
          >
            <span className="text-xl">🚀</span>
            <span>BUY $ALIENT</span>
          </a>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={300}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text text-center">Tier Holder System</h2>
          {/* Image placeholder - replace with custom image */}
          <div className="w-full bg-gray-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-4 md:p-6">
            <Image src="/tier.svg" alt="tier" width={600} height={400} priority className="w-full h-auto object-contain"/>          </div>
          <p className="text-sm md:text-base text-gray-300">
            AlienTek offers a 3-tier reward system for token holders, providing significant benefits and discounts:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
            <div className="bg-gradient-to-br from-purple-900/30 to-gray-700/30 border border-purple-600/50 p-4 md:p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🥉</span>
                <h3 className="text-lg md:text-xl font-semibold text-purple-300">Tier 3</h3>
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-2">
                <strong>Requirement:</strong> Hold 1,000,000+ $ALIENT tokens
              </p>
              <p className="text-sm md:text-base text-solana-green font-semibold">
                ✓ 40% discount on all services
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-gray-700/30 border border-purple-600/50 p-4 md:p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🥈</span>
                <h3 className="text-lg md:text-xl font-semibold text-purple-300">Tier 2</h3>
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-2">
                <strong>Requirement:</strong> Hold 5,000,000+ $ALIENT tokens
              </p>
              <p className="text-sm md:text-base text-solana-green font-semibold">
                ✓ 80% discount on all services
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/30 to-gray-700/30 border border-yellow-600/50 p-4 md:p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🥇</span>
                <h3 className="text-lg md:text-xl font-semibold text-yellow-300">Tier 1 - VIP</h3>
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-2">
                <strong>Requirement:</strong> Hold 10,000,000+ $ALIENT tokens
              </p>
              <p className="text-sm md:text-base text-solana-green font-semibold">
                ✓ 100% FREE - Complete VIP access to all services
              </p>
            </div>
          </div>
          
          <p className="text-xs md:text-sm text-gray-200 mt-4">
            Your tier is automatically detected when you connect your wallet. Simply hold the required tokens in the same wallet you use to pay, and the discount or free access will be applied instantly.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={325}>
        <div className="solana-card p-6 md:p-8 space-y-6 relative overflow-hidden border-2 border-solana-purple/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90">
          {/* Sci-fi background effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-solana-purple to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-solana-green to-transparent animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              <span className="solana-gradient-text">⚡ AlienTek Tools ⚡</span>
            </h2>
            <p className="text-center text-gray-200 text-sm md:text-base mb-6">
              Advanced Solana generation technology at your command
            </p>

            {/* Tool Selector */}
            <div className="relative mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-2 text-center">
                Select Tool
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsToolDropdownOpen(!isToolDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-700/80 border-2 border-solana-purple/50 rounded-lg text-left flex items-center justify-between hover:border-solana-purple transition-all"
                >
                  <span className="font-semibold">
                    {selectedTool === 'wallet' ? '🌟 Custom Wallet Maker' : '🚀 Custom CA Maker'}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isToolDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isToolDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-gray-700 border-2 border-solana-purple/50 rounded-lg shadow-xl overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedTool('wallet');
                        setIsToolDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors ${
                        selectedTool === 'wallet' ? 'bg-solana-purple/20 border-l-4 border-solana-purple' : ''
                      }`}
                    >
                      <div className="font-semibold">🌟 Custom Wallet Maker</div>
                      <div className="text-xs text-gray-200 mt-1">Generate custom Solana wallet addresses</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTool('contract');
                        setIsToolDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors ${
                        selectedTool === 'contract' ? 'bg-solana-purple/20 border-l-4 border-solana-purple' : ''
                      }`}
                    >
                      <div className="font-semibold">🚀 Custom CA Maker</div>
                      <div className="text-xs text-gray-200 mt-1">Deploy custom contract addresses on pump.fun</div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tool Content - Wallet Maker */}
            {selectedTool === 'wallet' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-full bg-gray-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-4 md:p-6">
                 <Image src="/wallet.svg" alt="wallet" width={600} height={400} priority className="w-full h-auto object-contain"/>          </div>
                
                <p className="text-sm md:text-base text-gray-300">
                  Generate custom Solana wallet addresses with your chosen prefix or suffix.
                  100% client-side. Zero server storage. Your keys never leave your browser.
                </p>
                
                <h3 className="text-lg md:text-xl font-semibold solana-gradient-text pt-4 text-center">How It Works</h3>
                <ol className="space-y-3 text-sm md:text-base text-gray-300">
                  <li className="flex gap-3">
                    <span className="solana-gradient-text font-bold">1.</span>
                    <span>Connect your Solana wallet (Phantom or Solflare)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="solana-gradient-text font-bold">2.</span>
                    <span>Choose your vanity pattern (3 or 4 characters, prefix or suffix)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="solana-gradient-text font-bold">3.</span>
                    <span>Pay the generation fee (discounts apply: Tier 3 at 1M+ tokens gets 40% off, Tier 2 at 5M+ tokens gets 80% off, Tier 1 at 10M+ tokens is free)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="solana-gradient-text font-bold">4.</span>
                    <span>Wait for generation (usually seconds to minutes depending on pattern)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="solana-gradient-text font-bold">5.</span>
                    <span>Securely save your seed phrase and private key</span>
                  </li>
                </ol>
                
                <h3 className="text-lg md:text-xl font-semibold solana-gradient-text pt-4 text-center">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg md:text-xl font-semibold mb-2">3-Character Vanity</h4>
                    <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">{CONFIG.PRICING.THREE_CHAR.full} SOL</div>
                    <div className="text-sm md:text-base text-gray-200 space-y-1">
                      <div>
                        <span className="text-solana-green font-semibold">{(CONFIG.PRICING.THREE_CHAR.full * 0.6).toFixed(2)} SOL</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 3: 1M+ tokens, 40% off)</span>
                      </div>
                      <div>
                        <span className="text-solana-green font-semibold">{(CONFIG.PRICING.THREE_CHAR.full * 0.2).toFixed(2)} SOL</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 2: 5M+ tokens, 80% off)</span>
                      </div>
                      <div>
                        <span className="text-solana-green font-semibold">FREE</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 1: 10M+ tokens)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg md:text-xl font-semibold mb-2">4-Character Vanity</h4>
                    <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">{CONFIG.PRICING.FOUR_CHAR.full} SOL</div>
                    <div className="text-sm md:text-base text-gray-200 space-y-1">
                      <div>
                        <span className="text-solana-green font-semibold">{(CONFIG.PRICING.FOUR_CHAR.full * 0.6).toFixed(2)} SOL</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 3: 1M+ tokens, 40% off)</span>
                      </div>
                      <div>
                        <span className="text-solana-green font-semibold">{(CONFIG.PRICING.FOUR_CHAR.full * 0.2).toFixed(2)} SOL</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 2: 5M+ tokens, 80% off)</span>
                      </div>
                      <div>
                        <span className="text-solana-green font-semibold">FREE</span>
                        <span className="text-xs md:text-sm ml-2">(Tier 1: 10M+ tokens)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tool Content - Contract Address Maker */}
            {selectedTool === 'contract' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-full bg-gray-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-4 md:p-6">
                 <Image src="/ca.svg" alt="ca" width={600} height={400} priority className="w-full h-auto object-contain"/>          </div>
                <h3 className="text-lg md:text-xl font-semibold text-solana-purple">Launch your custom CA on pump.fun!</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Create a custom contract address (CA) token on pump.fun with your desired vanity pattern.
                  Launch with a memorable, brandable contract address that makes your token stand out.
                </p>
                <div className="bg-gray-700/50 p-4 md:p-5 rounded-lg space-y-3 border border-gray-600">
                  <h4 className="font-semibold text-gray-200">Key Features:</h4>
                  <ul className="space-y-2 text-sm md:text-base text-gray-300">
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>Launch tokens with custom vanity contract addresses on pump.fun</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>Includes initial developer purchase capability</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>Acquire your custom CA before the token goes live</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>Same LP (liquidity pool), same safety, same protocol as standard pump.fun</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>The only difference: your token gets a memorable, custom contract address</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-solana-green">✓</span>
                      <span>Perfect for creating a strong brand identity from day one</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg space-y-2 border border-gray-600">
                  <h4 className="font-semibold text-gray-200">Pricing</h4>
                  <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">{CONFIG.PRICING.VANITY_CONTRACT.full} SOL</div>
                  <div className="text-sm md:text-base text-gray-200 space-y-1">
                    <div>
                      <span className="text-solana-green font-semibold">{(CONFIG.PRICING.VANITY_CONTRACT.full * 0.6).toFixed(2)} SOL</span>
                      <span className="text-xs md:text-sm ml-2">(Tier 3: 1M+ tokens, 40% off)</span>
                    </div>
                    <div>
                      <span className="text-solana-green font-semibold">{(CONFIG.PRICING.VANITY_CONTRACT.full * 0.2).toFixed(2)} SOL</span>
                      <span className="text-xs md:text-sm ml-2">(Tier 2: 5M+ tokens, 80% off)</span>
                    </div>
                    <div>
                      <span className="text-solana-green font-semibold">FREE</span>
                      <span className="text-xs md:text-sm ml-2">(Tier 1: 10M+ tokens)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-200 mt-2">
                    Plus optional initial developer buy (0.02 SOL fee + buy amount)
                  </p>
                </div>
                
                <p className="text-xs md:text-sm text-gray-200">
                  This is exactly the same as launching on pump.fun normally, but with the added benefit of a personalized contract address that makes your token more memorable and brandable.
                </p>
              </div>
            )}

            {/* Single Action Button */}
            <button
              onClick={handleToolAction}
              className="solana-button-primary w-full text-lg md:text-xl py-4 pulse-glow mt-6 text-center"
            >
              {selectedTool === 'wallet' ? 'Generate Custom Wallet' : 'Generate Custom CA'}
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
