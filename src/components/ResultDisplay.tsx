import React, { useState } from 'react';
import { formatDuration } from '../utils/format';

interface GenerationResult {
  publicKey: string;
  secretKey: number[];
  attempts: number;
  duration: number;
}

interface ResultDisplayProps {
  result: GenerationResult;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  const secretKeyBytes = new Uint8Array(result.secretKey);
  const secretKeyBase58 = Array.from(secretKeyBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };
  
  const downloadKeys = () => {
    const data = {
      publicKey: result.publicKey,
      secretKey: Array.from(result.secretKey),
      secretKeyHex: secretKeyBase58,
      generatedAt: new Date().toISOString(),
      attempts: result.attempts,
      duration: result.duration,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solana-vanity-${result.publicKey.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="solana-card p-8 space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-semibold mb-2 solana-gradient-text">
          Success!
        </h3>
        <p className="text-gray-400">
          Your vanity address has been generated
        </p>
      </div>
      
      <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Attempts:</span>
          <span className="font-semibold">{result.attempts.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Duration:</span>
          <span className="font-semibold">{formatDuration(result.duration)}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Public Key (Address)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={result.publicKey}
              readOnly
              className="solana-input flex-1 font-mono text-sm"
            />
            <button
              onClick={() => handleCopy(result.publicKey, 'public')}
              className="solana-button-secondary px-4"
            >
              {copied === 'public' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Private Key (Hex)</label>
          <div className="flex gap-2">
            <input
              type={showPrivateKey ? 'text' : 'password'}
              value={secretKeyBase58}
              readOnly
              className="solana-input flex-1 font-mono text-sm"
            />
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="solana-button-secondary px-4"
            >
              {showPrivateKey ? '👁️' : '👁️‍🗨️'}
            </button>
            <button
              onClick={() => handleCopy(secretKeyBase58, 'private')}
              className="solana-button-secondary px-4"
            >
              {copied === 'private' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 space-y-2">
        <div className="font-semibold text-red-300">⚠️ Critical Security Warning</div>
        <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
          <li>Save your private key securely before closing this page</li>
          <li>Never share your private key with anyone</li>
          <li>Anyone with your private key can access your funds</li>
          <li>This key will not be shown again</li>
        </ul>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={downloadKeys}
          className="solana-button-primary flex-1"
        >
          Download Keys
        </button>
        <button
          onClick={onReset}
          className="solana-button-secondary flex-1"
        >
          Generate Another
        </button>
      </div>
      
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
        <strong>Next Steps:</strong> Import this private key into a Solana wallet (like Phantom) 
        to use your new vanity address. Keep multiple secure backups of your private key.
      </div>
    </div>
  );
};
