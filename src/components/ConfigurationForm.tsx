import React, { useState } from 'react';
import { VanityLength, VanityPosition } from '../config/constants';
import { validateVanityCharacters } from '../utils/format';

interface ConfigurationFormProps {
  vanityLength: VanityLength;
  isRestartingFromCancel?: boolean;
  onComplete: (characters: string, position: VanityPosition) => void;
  onBack: () => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ 
  vanityLength, 
  isRestartingFromCancel = false,
  onComplete, 
  onBack 
}) => {
  const [characters, setCharacters] = useState('');
  const [position, setPosition] = useState<VanityPosition>('prefix');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!validateVanityCharacters(characters)) {
      setError('Invalid characters. Use only base58 characters (no 0, O, I, l)');
      return;
    }
    
    if (characters.length !== vanityLength) {
      setError(`Please enter exactly ${vanityLength} characters`);
      return;
    }

    if (!acknowledged) {
      setError('Please read and acknowledge the steps above');
      return;
    }

    setError('');
    onComplete(characters, position);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
      <button
        onClick={onBack}
        className="solana-button-secondary"
      >
        ← Back
      </button>

      <div className="solana-card p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Configure Your Vanity Address</h3>
          <p className="text-gray-400">
            {vanityLength}-character vanity pattern
          </p>
        </div>

        {/* Character Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Vanity Characters ({vanityLength} characters)
            </label>
            <input
              type="text"
              value={characters}
              onChange={(e) => {
                const filtered = e.target.value
                  .slice(0, vanityLength)
                  .replace(/[^1-9A-HJ-NP-Za-km-z]/g, '');
                setCharacters(filtered);
                setError('');
              }}
              placeholder={`Enter ${vanityLength} characters`}
              maxLength={vanityLength}
              className="solana-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use base58 characters: 1-9, A-Z (except O, I), a-z (except l)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPosition('prefix')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  position === 'prefix'
                    ? 'border-solana-purple bg-solana-purple/20 text-solana-purple'
                    : 'border-gray-600 bg-gray-700 text-gray-300'
                }`}
              >
                <div className="font-semibold">Prefix</div>
                <div className="text-xs mt-1">Start of address</div>
                <div className="text-xs mt-2 font-mono opacity-70">
                  Example: <span className="text-solana-green">{characters || 'ABC'}</span>...xyz
                </div>
              </button>
              <button
                onClick={() => setPosition('suffix')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  position === 'suffix'
                    ? 'border-solana-purple bg-solana-purple/20 text-solana-purple'
                    : 'border-gray-600 bg-gray-700 text-gray-300'
                }`}
              >
                <div className="font-semibold">Suffix</div>
                <div className="text-xs mt-1">End of address</div>
                <div className="text-xs mt-2 font-mono opacity-70">
                  Example: xyz...<span className="text-solana-green">{characters || 'ABC'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps Explanation */}
        <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
          <h4 className="font-semibold text-lg mb-3">Next Steps:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-solana-purple font-bold">1.</span>
              <p className="text-gray-300">
                <strong>Connect Wallet</strong> - You&apos;ll be asked to connect your Solana wallet (Phantom or Solflare)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-solana-purple font-bold">2.</span>
              <p className="text-gray-300">
                <strong>Pay with SOL</strong> - A one-time payment to access the generator service for one address
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-solana-purple font-bold">3.</span>
              <p className="text-gray-300">
                <strong>Generate</strong> - Your browser will generate the vanity address locally (no server involved)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-solana-purple font-bold">4.</span>
              <p className="text-gray-300">
                <strong>Live Status Feed</strong> - You&apos;ll see real-time progress with attempts, rate, and ETA
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-solana-purple font-bold">5.</span>
              <p className="text-gray-300">
                <strong>Receive Private Keys</strong> - After generation, your private keys/phrase will appear <strong className="text-yellow-400">ONLY to you</strong>
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm mt-4">
            <strong>⚠️ Important:</strong> You are responsible for securely backing up your private keys. 
            They are generated 100% client-side and never leave your browser. We cannot recover lost keys.
          </div>
        </div>

        {/* Acknowledgment Checkbox */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => {
                setAcknowledged(e.target.checked);
                setError('');
              }}
              className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-solana-purple focus:ring-solana-purple focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-300">
              I have read and understand the steps above
            </span>
          </label>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!acknowledged || characters.length !== vanityLength}
            className="solana-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRestartingFromCancel ? 'Re-start Generation' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
