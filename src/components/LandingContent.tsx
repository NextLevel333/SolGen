import React from 'react';
import Image from 'next/image';

export function LandingContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold solana-gradient-text mb-6">
          Create Your Custom Solana Wallet
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Generate vanity Solana wallet addresses with your chosen prefix or suffix.
          100% client-side, zero server storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="solana-card p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/locks.png"
              alt="Secure"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-bold mb-3 solana-gradient-text">
            100% Client-Side
          </h3>
          <p className="text-gray-400">
            All key generation happens in your browser. Your private keys never leave your device.
          </p>
        </div>

        <div className="solana-card p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/power.png"
              alt="Fast"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-bold mb-3 solana-gradient-text">
            High Performance
          </h3>
          <p className="text-gray-400">
            Multi-threaded generation with real-time progress tracking and pause/resume controls.
          </p>
        </div>

        <div className="solana-card p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/tokens.png"
              alt="Token Gated"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-bold mb-3 solana-gradient-text">
            Token-Gated Discount
          </h3>
          <p className="text-gray-400">
            SolGen token holders get 50% off on all vanity address generation.
          </p>
        </div>
      </div>

      <div className="solana-card p-8 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center solana-gradient-text mb-6">
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="text-xl font-bold mb-2">3 Characters</h3>
              <p className="text-3xl font-bold solana-gradient-text mb-2">0.15 SOL</p>
              <p className="text-sm text-gray-400">Standard Price</p>
              <p className="text-lg font-semibold text-solana-green mt-2">0.075 SOL</p>
              <p className="text-xs text-gray-400">Token Holder Price</p>
            </div>
          </div>
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">4️⃣</div>
              <h3 className="text-xl font-bold mb-2">4 Characters</h3>
              <p className="text-3xl font-bold solana-gradient-text mb-2">0.40 SOL</p>
              <p className="text-sm text-gray-400">Standard Price</p>
              <p className="text-lg font-semibold text-solana-green mt-2">0.20 SOL</p>
              <p className="text-xs text-gray-400">Token Holder Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
