import React from 'react';
import Image from 'next/image';

export const LandingContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 stagger-animation">
      <div className="text-center space-y-6 fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold">
        <div className="flex justify-center">
             <Image src="/SolGenLogo.png" alt="SolGen Logo" width={320} height={103} priority className="h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse"/>
        </div>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          First Solana Vanity Wallet Generator
        </p>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Generate custom Solana wallet addresses with your chosen prefix or suffix.
          100% client-side. Zero server storage. Your keys never leave your browser.
        </p>
      </div>
      
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
            *2 Tier holder system from Discounted to VIP
             membership for Free services. 
            Launched on pump.fun/LP (contract TBA).
          </p>
        </div>
      </div>
      
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
            <span>Pay the generation fee (50% off for tier 2 SolGen token holders)</span>
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
      
      <div className="solana-card p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-2">3-Character Vanity</h3>
            <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.15 SOL</div>
            <div className="text-sm md:text-base text-gray-400">
              <span className="line-through">0.15 SOL</span>
              <span className="text-solana-green ml-2 font-semibold">0.075 SOL</span>
              <span className="text-xs md:text-sm ml-2">(for SolGen holders)</span>
            </div>
          </div>
          <div className="bg-gray-700/50 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-2">4-Character Vanity</h3>
            <div className="text-2xl md:text-3xl font-bold text-solana-purple mb-2">0.40 SOL</div>
            <div className="text-sm md:text-base text-gray-400">
              <span className="line-through">0.40 SOL</span>
              <span className="text-solana-green ml-2 font-semibold">0.20 SOL</span>
              <span className="text-xs md:text-sm ml-2">(for SolGen holders)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="solana-card p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold solana-gradient-text">About SolGen Token</h2>
        <p className="text-sm md:text-base text-gray-300">
          SolGen is the native utility token for this platform, offering holders a 50% discount on all vanity address generation fees.
        </p>
        <p className="text-sm md:text-base text-gray-300">
          <strong>Status:</strong> Launched on pump.fun with LP
        </p>
        <p className="text-sm md:text-base text-gray-300">
          <strong>Contract Address:</strong> <span className="text-solana-green font-mono">To be updated</span>
        </p>
        <p className="text-xs md:text-sm text-gray-400">
          Any wallet holding SolGen tokens automatically qualifies for the discount.
        </p>
      </div>
      
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
    </div>
  );
};
