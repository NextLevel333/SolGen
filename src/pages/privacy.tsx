import React from 'react';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/20">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={100} className="transform hover:scale-110 transition-transform" />
          </Link>
          <Link href="/" className="solana-button-secondary">
            Back to Home
          </Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="solana-card p-8 fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold solana-gradient-text mb-6">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              Last Updated: February 14, 2026
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Overview</h2>
              <p>
                SolGen is a fully client-side Solana vanity wallet generator. Your privacy is our top priority. 
                This Privacy Policy explains how we handle your data - or rather, how we don&apos;t handle it, because 
                everything happens in your browser.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">No Data Collection</h2>
              <p className="mb-2">
                <strong className="text-solana-green">We do not collect, store, or transmit any personal data.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All wallet generation happens entirely in your browser using Web Workers</li>
                <li>Private keys are never transmitted to any server</li>
                <li>We have no backend servers or databases</li>
                <li>We do not use cookies, analytics, or tracking scripts</li>
                <li>We do not log IP addresses or user interactions</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">How It Works</h2>
              <p className="mb-2">The application is completely client-side:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All cryptographic operations happen in your browser</li>
                <li>Private keys are generated using the tweetnacl library</li>
                <li>Keys exist only in your browser&apos;s memory</li>
                <li>When you download your wallet, it&apos;s saved directly to your device</li>
                <li>We never see or have access to your private keys</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Blockchain Interactions</h2>
              <p className="mb-2">
                The only data that leaves your browser is standard Solana blockchain transactions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment transactions to our treasury wallet (public blockchain data)</li>
                <li>Token balance checks via Solana RPC (read-only, public data)</li>
                <li>These interactions are with the public Solana blockchain, not our servers</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Third-Party Services</h2>
              <p className="mb-2">
                We use minimal third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Solana RPC endpoints for blockchain interaction (public data only)</li>
                <li>Wallet adapters (Phantom, Solflare) - controlled by your wallet provider</li>
                <li>GitHub Pages for hosting (static file hosting, no server-side code)</li>
              </ul>
              <p className="mt-2">
                None of these services receive your private keys or personal information from us.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Open Source</h2>
              <p>
                SolGen is open source. You can review the entire codebase on{' '}
                <a 
                  href="https://github.com/NextLevel333/SolGen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-solana-purple hover:text-solana-green transition-colors underline"
                >
                  GitHub
                </a>
                {' '}to verify that we do exactly what we say.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Your Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Securely store your downloaded private keys</li>
                <li>Never share your private keys with anyone</li>
                <li>Verify the website URL before using (avoid phishing sites)</li>
                <li>Use secure internet connections</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please see our{' '}
                <Link href="/contact" className="text-solana-purple hover:text-solana-green transition-colors underline">
                  Contact page
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
