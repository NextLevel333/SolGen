import React from 'react';
import Link from 'next/link';
import { Logo } from '../components/Logo';

interface ExternalResource {
  name: string;
  url: string;
  icon: string;
  description: string;
}

const resources: ExternalResource[] = [
  {
    name: 'DexScreener',
    url: 'https://dexscreener.com/solana',
    icon: '📊',
    description: 'Track Solana token prices and charts'
  },
  {
    name: 'pump.fun',
    url: 'https://pump.fun',
    icon: '🚀',
    description: 'Solana token launch platform'
  },
  {
    name: 'Solscan',
    url: 'https://solscan.io',
    icon: '🔍',
    description: 'Solana blockchain explorer'
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="tech-particles" aria-hidden="true"></div>
      <div className="light-lines" aria-hidden="true"></div>
      
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
        <div className="space-y-6 fade-in-up">
          <div className="solana-card p-8">
            <h1 className="text-3xl md:text-4xl font-bold solana-gradient-text mb-6">
              External Resources
            </h1>
            
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">Important Notice</h2>
                  <p className="text-gray-300 mb-3">
                    The links below are to external, third-party websites that are <strong>not affiliated with or controlled by SolGen</strong>. 
                    These resources are provided for informational purposes only.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 ml-4">
                    <li>We are not responsible for the content, privacy practices, or security of external sites</li>
                    <li>Visiting these sites is at your own risk</li>
                    <li>We do not endorse or guarantee the services offered by these sites</li>
                    <li>Always verify URLs and be cautious of phishing attempts</li>
                    <li>Never share your private keys on any website</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Solana Ecosystem Tools</h2>
              {resources.map((resource) => (
                <div key={resource.name} className="solana-card p-6 bg-gray-700/50">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{resource.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-100 mb-2">{resource.name}</h3>
                      <p className="text-gray-400 mb-3">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-solana-purple hover:text-solana-green transition-colors"
                      >
                        <span>Visit {resource.name}</span>
                        <span>→</span>
                      </a>
                      <p className="text-xs text-gray-500 mt-2">
                        External link: {resource.url}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="solana-card p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-3">Additional Resources</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <a 
                    href="https://docs.solana.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-solana-purple hover:text-solana-green transition-colors underline"
                  >
                    Solana Documentation
                  </a>
                  <p className="text-sm text-gray-400">Official Solana developer documentation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <a 
                    href="https://phantom.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-solana-purple hover:text-solana-green transition-colors underline"
                  >
                    Phantom Wallet
                  </a>
                  <p className="text-sm text-gray-400">Popular Solana wallet browser extension</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <a 
                    href="https://solflare.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-solana-purple hover:text-solana-green transition-colors underline"
                  >
                    Solflare Wallet
                  </a>
                  <p className="text-sm text-gray-400">Feature-rich Solana wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
