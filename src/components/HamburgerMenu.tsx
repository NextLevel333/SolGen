import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuLink {
  name: string;
  url: string;
  icon: string;
  external?: boolean;
}

const ANIMATION_STAGGER_DELAY_MS = 50;

const menuLinks: MenuLink[] = [
  { 
    name: 'Privacy Policy', 
    url: '/privacy', 
    icon: '🔒' 
  },
  { 
    name: 'Terms of Service', 
    url: '/terms', 
    icon: '📄' 
  },
  { 
    name: 'Contact', 
    url: '/contact', 
    icon: '📧' 
  },
  { 
    name: 'Dexscreener', 
    url: 'https://dexscreener.com/solana/ez28fssenkqu7slzlafez57q5iw1uv1htygufsvfpump', 
    icon: '📊',
    external: true
  },
  { 
    name: 'Pumpfun', 
    url: 'https://pump.fun/coin/Ez28fsseNKQu7sLzLAfEz57q5iw1Uv1HtYGUFSvFpump', 
    icon: '🚀',
    external: true
  },
  { 
    name: 'Solscan', 
    url: 'https://solscan.io/token/Ez28fsseNKQu7sLzLAfEz57q5iw1Uv1HtYGUFSvFpump', 
    icon: '🔍',
    external: true
  },
  { 
    name: 'GitHub', 
    url: 'https://github.com/NextLevel333/SolGen', 
    icon: '💻',
    external: true
  },
];

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.hamburger-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="hamburger-menu-container relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 rounded-lg hover:bg-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-solana-purple"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-gray-100 transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-100 transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-100 transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-56 solana-card overflow-hidden transition-all duration-300 z-50 ${
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="py-2">
          {menuLinks.map((link, index) => (
            link.external ? (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group"
                style={{ animationDelay: `${index * ANIMATION_STAGGER_DELAY_MS}ms` }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                <span className="font-medium group-hover:text-solana-purple transition-colors">
                  {link.name}
                </span>
                <span className="ml-auto text-gray-500 group-hover:text-solana-green transition-colors">
                  ↗
                </span>
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.url}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group"
                style={{ animationDelay: `${index * ANIMATION_STAGGER_DELAY_MS}ms` }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                <span className="font-medium group-hover:text-solana-purple transition-colors">
                  {link.name}
                </span>
                <span className="ml-auto text-gray-500 group-hover:text-solana-green transition-colors">
                  →
                </span>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Mobile Full-Screen Menu */}
      <div
        className={`fixed inset-0 bg-gray-900 z-50 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold solana-gradient-text">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-700/50 transition-all"
              aria-label="Close menu"
            >
              <span className="block w-6 h-0.5 bg-gray-100 rotate-45 translate-y-0.5" />
              <span className="block w-6 h-0.5 bg-gray-100 -rotate-45 -translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 solana-card hover:border-solana-purple transition-all"
                  >
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <span className="text-lg font-medium block">{link.name}</span>
                      <span className="text-sm text-gray-400 block">
                        {link.url.replace('https://', '')}
                      </span>
                    </div>
                    <span className="text-solana-green text-xl">↗</span>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 solana-card hover:border-solana-purple transition-all"
                  >
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <span className="text-lg font-medium block">{link.name}</span>
                      <span className="text-sm text-gray-400 block">
                        {link.url}
                      </span>
                    </div>
                    <span className="text-solana-green text-xl">→</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
