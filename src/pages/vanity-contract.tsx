import React from 'react';
import Link from 'next/link';
import { WalletConnect } from '../components/WalletConnect';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { Logo } from '../components/Logo';
import { VanityContractForm } from '../components/VanityContractForm';

export default function VanityContract() {
  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="tech-particles" aria-hidden="true"></div>
      <div className="light-lines" aria-hidden="true"></div>
      
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3" aria-label="Navigate to homepage">
            <Logo size={100} className="transform hover:scale-110 transition-transform" />
          </Link>
          <div className="flex items-center gap-4">
            <WalletConnect />
            <HamburgerMenu />
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="fade-in-up space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold solana-gradient-text">
              🚀 Pump.fun Vanity Contract Deployer
            </h1>
            <p className="text-base md:text-lg text-gray-300">
              Create your custom contract address token on pump.fun
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Launch your token with a memorable vanity contract address. Same pump.fun protocol, same safety, with a personalized touch.
            </p>
          </div>
          
          <VanityContractForm />
        </div>
      </main>
      
      <footer className="border-t border-gray-800 mt-20 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong className="solana-gradient-text">SolGen</strong> - Vanity Contract Address Generator
            </p>
            <div className="flex justify-center gap-6 text-xs">
              <Link href="/privacy" className="text-gray-400 hover:text-solana-purple transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-solana-purple transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-solana-purple transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
