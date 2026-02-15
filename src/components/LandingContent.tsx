import React from 'react';
import Image from 'next/image';
import { ScrollReveal } from './ScrollReveal';

export const LandingContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <ScrollReveal direction="fade" delay={0}>
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            <div className="flex justify-center">
              <Image src="/SolGenLogo.png" alt="SolGen Logo" width={320} height={103} priority className="h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse"/>
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            First Mobile Friendly Solana Vanity Wallet Generator
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Generate custom Solana wallet addresses with your chosen prefix or suffix.
            100% client-side. Zero server storage. Your keys never leave your browser.
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="solana-card p-4 md:p-6 space-y-3">
            <div className="flex justify-center">
              <Image src="/lock.png" alt="" width={60} height={60} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Fully Private</h3>
            <p className="text-sm md:text-base text-gray-400">
              All key generation happens in your browser using Web Workers. 
              No server communication. No data storage. Complete privacy.
            </p>
          </div>
          
          <div className="solana-card p-4 md:p-6 space-y-3">
            <div className="flex justify-center">
              <Image src="/power.png" alt="" width={60} height={60} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">High Performance</h3>
            <p className="text-sm md:text-base text-gray-400">
              Leverages Web Workers for parallel processing. 
              Real-time progress tracking with ETA. Pause and resume anytime.
            </p>
          </div>
          
          <div className="solana-card p-4 md:p-6 space-y-3">
            <div className="flex justify-center">
              <Image src="/tokens.png" alt="" width={60} height={60} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Token Benefits</h3>
            <p className="text-sm md:text-base text-gray-400">
              Yes, There are benefits to holding SolGen!
              A two tier system which grants holders 40-100%
              discounts off all current and future services.
              *Currently Live on pump.fun*
              
            </p>
          </div>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={150}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">How It Works</h2>
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
              <span>Pay the generation fee (Tier 2: 40% off for 1M+ token holders, Tier 1: Free for 10M+ holders)</span>
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
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={200}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-2">3-Character Vanity</h3>
              <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.2 SOL</div>
              <div className="text-sm md:text-base text-gray-400 space-y-1">
                <div>
                  <span className="text-solana-green font-semibold">0.12 SOL</span>
                  <span className="text-xs md:text-sm ml-2">(Tier 2: 1M+ tokens)</span>
                </div>
                <div>
                  <span className="text-solana-green font-semibold">FREE</span>
                  <span className="text-xs md:text-sm ml-2">(Tier 1: 10M+ tokens)</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-2">4-Character Vanity</h3>
              <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.4 SOL</div>
              <div className="text-sm md:text-base text-gray-400 space-y-1">
                <div>
                  <span className="text-solana-green font-semibold">0.24 SOL</span>
                  <span className="text-xs md:text-sm ml-2">(Tier 2: 1M+ tokens)</span>
                </div>
                <div>
                  <span className="text-solana-green font-semibold">FREE</span>
                  <span className="text-xs md:text-sm ml-2">(Tier 1: 10M+ tokens)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={250}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">Tier Holder System</h2>
          <p className="text-sm md:text-base text-gray-300">
            SolGen offers a two-tier reward system for token holders, providing significant benefits and discounts:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
            <div className="bg-gradient-to-br from-purple-900/30 to-gray-700/30 border border-purple-600/50 p-4 md:p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🥈</span>
                <h3 className="text-lg md:text-xl font-semibold text-purple-300">Tier 2</h3>
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-2">
                <strong>Requirement:</strong> Hold 1,000,000+ SolGen tokens
              </p>
              <p className="text-sm md:text-base text-solana-green font-semibold">
                ✓ 40% discount on all services
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/30 to-gray-700/30 border border-yellow-600/50 p-4 md:p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🥇</span>
                <h3 className="text-lg md:text-xl font-semibold text-yellow-300">Tier 1 - VIP</h3>
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-2">
                <strong>Requirement:</strong> Hold 10,000,000+ SolGen tokens
              </p>
              <p className="text-sm md:text-base text-solana-green font-semibold">
                ✓ 100% FREE - Complete VIP access to all services
              </p>
            </div>
          </div>
          
          <p className="text-xs md:text-sm text-gray-400 mt-4">
            Your tier is automatically detected when you connect your wallet. Simply hold the required tokens in the same wallet you use to pay, and the discount or free access will be applied instantly.
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={300}>
        <div className="solana-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">About SolGen Token</h2>
          <p className="text-sm md:text-base text-gray-300">
            SolGen is the native utility token for this platform. Token holders receive automatic discounts based on their tier level, ranging from 40% off (Tier 2) to completely free VIP access (Tier 1).
          </p>
          <p className="text-sm md:text-base text-gray-300">
            <strong>Status:</strong> Launched on pump.fun with LP
          </p>
          <p className="text-sm md:text-base text-gray-300">
            <strong>Contract Address:</strong> <span className="text-solana-green font-mono text-xs break-all">Ez28fsseNKQu7sLzLAfEz57q5iw1Uv1HtYGUFSvFpump</span>
          </p>
          <p className="text-xs md:text-sm text-gray-400">
            Your wallet is automatically checked for SolGen tokens when you connect. The appropriate tier discount is applied based on your balance.
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={350}>
        <div className="solana-card p-6 md:p-8 space-y-4 border-solana-purple/50">
          <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">🚀 Coming Soon in Development</h2>
          <h3 className="text-lg md:text-xl font-semibold text-solana-purple">Pump.fun Vanity Contract Deployer</h3>
          <p className="text-sm md:text-base text-gray-300">
            We&apos;re developing an innovative feature that will allow you to create a custom contract address (CA) token on pump.fun with your desired vanity pattern.
          </p>
          <div className="bg-gray-700/50 p-4 md:p-5 rounded-lg space-y-3">
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
            </ul>
          </div>
          <p className="text-xs md:text-sm text-gray-400">
            This is exactly the same as launching on pump.fun normally, but with the added benefit of a personalized contract address that makes your token more memorable and brandable.
          </p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={400}>
        <div className="solana-card p-6 md:p-8 space-y-4 border-solana-purple/50">
          <h2 className="text-xl md:text-2xl font-bold text-red-400">⚠️ Security Notice</h2>
          <p className="text-sm md:text-base text-gray-300">
            This tool generates real Solana keypairs that can hold funds. 
            Always verify you&apos;ve securely saved your seed phrase and private key before transferring any assets.
          </p>
          <p className="text-sm md:text-base text-gray-300">
            <strong>Never share your private key or seed phrase with anyone.</strong> 
            This tool does not and will never ask for your existing wallet&apos;s private keys.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};
