import React from 'react';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export default function Contact() {
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
        <div className="solana-card p-8 fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold solana-gradient-text mb-6">
            Contact Us
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              We&apos;re here to help! If you have questions, feedback, or need support, here are the best ways to reach us:
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">GitHub</h2>
              <div className="solana-card p-6 bg-gray-700/50">
                <p className="mb-3">
                  For bug reports, feature requests, or technical questions:
                </p>
                <a 
                  href="https://github.com/NextLevel333/AlienTek/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 solana-button-primary"
                >
                  <span>🐛</span>
                  <span>Open an Issue on GitHub</span>
                </a>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Source Code</h2>
              <div className="solana-card p-6 bg-gray-700/50">
                <p className="mb-3">
                  Review our code, contribute, or fork the project:
                </p>
                <a 
                  href="https://github.com/NextLevel333/AlienTek" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 solana-button-primary"
                >
                  <span>💻</span>
                  <span>View on GitHub</span>
                </a>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Security Issues</h2>
              <div className="solana-card p-6 bg-gray-700/50 border-yellow-600">
                <p className="mb-3 text-yellow-400 font-semibold">
                  ⚠️ Found a security vulnerability?
                </p>
                <p className="mb-3">
                  Please report security issues responsibly through GitHub&apos;s security advisory feature:
                </p>
                <a 
                  href="https://github.com/NextLevel333/AlienTek/security/advisories/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 solana-button-primary bg-yellow-600 hover:bg-yellow-700"
                >
                  <span>🔒</span>
                  <span>Report Security Issue</span>
                </a>
                <p className="mt-3 text-sm text-gray-400">
                  Please do not publicly disclose security issues until we&apos;ve had a chance to address them.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">General Support</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <strong className="block text-gray-100">Documentation</strong>
                    <p className="text-sm">
                      Check our{' '}
                      <a 
                        href="https://github.com/NextLevel333/AlienTek#readme" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-solana-purple hover:text-solana-green transition-colors underline"
                      >
                        README
                      </a>
                      {' '}and documentation files for answers to common questions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <strong className="block text-gray-100">Discussions</strong>
                    <p className="text-sm">
                      Join community discussions on{' '}
                      <a 
                        href="https://github.com/NextLevel333/AlienTek/discussions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-solana-purple hover:text-solana-green transition-colors underline"
                      >
                        GitHub Discussions
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Response Time</h2>
              <p className="text-sm text-gray-400">
                We&apos;re a small open-source project. While we try to respond as quickly as possible, 
                please allow a few days for non-urgent inquiries. Security issues are prioritized.
              </p>
            </section>
            
            <section className="border-t border-gray-700 pt-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Before You Contact Us</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li>Search existing GitHub issues to see if your question has been answered</li>
                <li>Review our{' '}
                  <Link href="/privacy" className="text-solana-purple hover:text-solana-green transition-colors underline">
                    Privacy Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/terms" className="text-solana-purple hover:text-solana-green transition-colors underline">
                    Terms of Service
                  </Link>
                </li>
                <li>Check the documentation in the GitHub repository</li>
                <li>Provide as much detail as possible when reporting issues</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
