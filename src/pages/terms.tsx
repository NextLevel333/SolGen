import React from 'react';
import Link from 'next/link';
import { Logo } from '../components/Logo';

export default function Terms() {
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
            Terms of Service
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              Last Updated: February 14, 2026
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Agreement to Terms</h2>
              <p>
                By accessing and using SolGen, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, you must not use our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Service Description</h2>
              <p className="mb-2">
                SolGen provides a client-side tool for generating custom Solana wallet addresses 
                (vanity addresses). The service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Operates entirely in your browser</li>
                <li>Requires payment in SOL to use</li>
                <li>Offers discounts to SolGen token holders</li>
                <li>Is provided on an &quot;as-is&quot; basis</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">User Responsibilities</h2>
              <p className="mb-2">You are solely responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Securely storing your generated private keys</li>
                <li>Backing up your wallet files</li>
                <li>Verifying generated addresses before use</li>
                <li>Protecting your private keys from unauthorized access</li>
                <li>Any transactions made with generated wallets</li>
                <li>Compliance with applicable laws and regulations</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Payments and Refunds</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All payments are in SOL cryptocurrency</li>
                <li>Payments are non-refundable</li>
                <li>Generation may take variable time depending on pattern complexity</li>
                <li>Token holder discounts apply automatically if you hold SolGen tokens</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Disclaimers</h2>
              <p className="mb-2">
                <strong className="text-yellow-400">IMPORTANT:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do not guarantee any specific generation time</li>
                <li>We are not responsible for lost or stolen private keys</li>
                <li>We are not responsible for any funds lost due to user error</li>
                <li>The service is provided without warranties of any kind</li>
                <li>We do not store backups of your private keys</li>
                <li>Once a private key is lost, it cannot be recovered</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, SolGen and its developers shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages, including 
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Your access to or use of (or inability to use) the service</li>
                <li>Any conduct or content of any third party on the service</li>
                <li>Any content obtained from the service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Loss of private keys or wallet files</li>
                <li>Any bugs, errors, or security vulnerabilities</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Security</h2>
              <p className="mb-2">While we implement security best practices:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All generation is client-side, minimizing attack vectors</li>
                <li>We use established cryptographic libraries (tweetnacl)</li>
                <li>The codebase is open source for transparency</li>
                <li>However, we cannot guarantee absolute security</li>
                <li>Users should verify the website URL to avoid phishing</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Prohibited Uses</h2>
              <p className="mb-2">You may not use SolGen to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to reverse engineer or compromise the service</li>
                <li>Use automated tools to abuse the service</li>
                <li>Engage in fraudulent or malicious activities</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Open Source License</h2>
              <p>
                SolGen is open source software licensed under the MIT License. 
                See our{' '}
                <a 
                  href="https://github.com/NextLevel333/SolGen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-solana-purple hover:text-solana-green transition-colors underline"
                >
                  GitHub repository
                </a>
                {' '}for details.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting. Your continued use of the service after changes constitutes 
                acceptance of the new terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Contact</h2>
              <p>
                Questions about these Terms? See our{' '}
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
