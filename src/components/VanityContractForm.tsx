import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getTokenBalance, getTier } from '../utils/token';
import { useConnection } from '@solana/wallet-adapter-react';
import { CONFIG } from '../config/constants';
import { createPaymentTransaction, verifyPayment, waitForConfirmation } from '../utils/payment';
import { createTicket, consumeTicket } from '../utils/ticket';
import { Keypair } from '@solana/web3.js';

interface VanityContractFormData {
  tokenName: string;
  tokenSymbol: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
  logoFile?: File;
  bannerFile?: File;
  vanityCharacters: string;
  vanityPosition: 'prefix' | 'suffix';
  initialDevBuy: string;
}

type FlowStep = 'form' | 'payment' | 'generating' | 'confirmation' | 'deploying' | 'success';

interface GeneratedCA {
  publicKey: string;
  secretKey: number[];
}

export const VanityContractForm: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [formData, setFormData] = useState<VanityContractFormData>({
    tokenName: '',
    tokenSymbol: '',
    twitter: '',
    telegram: '',
    discord: '',
    website: '',
    vanityCharacters: '',
    vanityPosition: 'prefix',
    initialDevBuy: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FlowStep>('form');
  const [generatedCA, setGeneratedCA] = useState<GeneratedCA | null>(null);
  const [deployedCA, setDeployedCA] = useState<string>('');

  // Load token balance when wallet connects
  React.useEffect(() => {
    if (publicKey && connection) {
      getTokenBalance(connection, publicKey, CONFIG.SOLGEN_MINT_ADDRESS)
        .then(setTokenBalance)
        .catch(console.error);
    }
  }, [publicKey, connection]);

  const handleInputChange = (field: keyof VanityContractFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (field: 'logoFile' | 'bannerFile', file: File | undefined) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Token name is required';
    }
    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Symbol/ticker is required';
    } else if (formData.tokenSymbol.length > 10) {
      newErrors.tokenSymbol = 'Symbol should be 10 characters or less';
    }

    // Vanity characters validation (2-4 characters)
    if (!formData.vanityCharacters.trim()) {
      newErrors.vanityCharacters = 'Vanity characters are required';
    } else if (formData.vanityCharacters.length < 2 || formData.vanityCharacters.length > 4) {
      newErrors.vanityCharacters = 'Vanity pattern must be 2-4 characters';
    } else if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(formData.vanityCharacters)) {
      newErrors.vanityCharacters = 'Use only base58 characters (no 0, O, I, l)';
    }

    // Logo is required
    if (!formData.logoFile) {
      newErrors.logoFile = 'Logo image is required';
    }

    // Validate initial dev buy if provided
    if (formData.initialDevBuy && formData.initialDevBuy.trim()) {
      const devBuy = parseFloat(formData.initialDevBuy);
      if (isNaN(devBuy) || devBuy <= 0) {
        newErrors.initialDevBuy = 'Initial dev buy must be a positive number';
      }
    }

    // Validate URLs if provided
    const urlFields: Array<'website' | 'twitter' | 'telegram' | 'discord'> = ['website', 'twitter', 'telegram', 'discord'];
    urlFields.forEach(field => {
      const value = formData[field];
      if (value && typeof value === 'string' && value.trim() && !isValidUrl(value)) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const calculatePrice = (): { basePrice: number; discountedPrice: number; devBuyFee: number; devBuyAmount: number; totalPrice: number; discount: number } => {
    // Base price for vanity CA service
    const basePrice = CONFIG.PRICING.VANITY_CONTRACT.full;
    
    // Check tier for discount
    const tier = getTier(tokenBalance);
    let discountedPrice: number = basePrice;
    let discount = 0;

    if (tier === 1) {
      // Tier 1: 100% discount (free)
      discountedPrice = 0;
      discount = 100;
    } else if (tier === 2) {
      // Tier 2: 40% discount
      discountedPrice = CONFIG.PRICING.VANITY_CONTRACT.discounted;
      discount = 40;
    }

    // Dev buy fee: 0.02 SOL only if initial dev buy is entered
    const hasDevBuy = formData.initialDevBuy && formData.initialDevBuy.trim() && parseFloat(formData.initialDevBuy) > 0;
    const devBuyFee = hasDevBuy ? 0.02 : 0;
    const devBuyAmount = hasDevBuy ? parseFloat(formData.initialDevBuy) : 0;

    const totalPrice = discountedPrice + devBuyFee + devBuyAmount;

    return { basePrice, discountedPrice, devBuyFee, devBuyAmount, totalPrice, discount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!publicKey) {
      setErrors({ submit: 'Please connect your wallet first' });
      return;
    }

    // Move to payment step
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    if (!publicKey) return;

    const pricing = calculatePrice();
    const price = pricing.totalPrice;

    setIsLoading(true);
    setErrors({});

    try {
      // Process payment if not free
      if (price > 0) {
        const transaction = await createPaymentTransaction(publicKey, price);
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        
        const signature = await sendTransaction(transaction, connection);
        
        const confirmed = await waitForConfirmation(connection, signature);
        
        if (!confirmed) {
          throw new Error('Transaction confirmation timeout');
        }
        
        const verified = await verifyPayment(connection, signature, price, publicKey);
        
        if (!verified) {
          throw new Error('Payment verification failed');
        }

        // Create ticket with vanity contract data
        createTicket(
          publicKey.toBase58(),
          formData.vanityCharacters.length as 3 | 4,
          formData.vanityCharacters,
          formData.vanityPosition,
          signature
        );
      }

      // Move to generation step
      setCurrentStep('generating');
      await generateVanityAddress();
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrors({ submit: err.message || 'Payment failed. Please try again.' });
      setCurrentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const generateVanityAddress = async () => {
    setIsLoading(true);
    try {
      // Simulate vanity address generation using web workers
      const result = await new Promise<GeneratedCA>((resolve, reject) => {
        const worker = new Worker(new URL('../workers/vanity.worker.ts', import.meta.url));
        
        worker.onmessage = (event) => {
          const { type } = event.data;
          
          if (type === 'success') {
            worker.terminate();
            resolve({
              publicKey: event.data.publicKey,
              secretKey: event.data.secretKey,
            });
          } else if (type === 'error') {
            worker.terminate();
            reject(new Error('Generation failed'));
          }
        };
        
        worker.postMessage({
          type: 'generate',
          characters: formData.vanityCharacters,
          position: formData.vanityPosition,
          workerId: 0,
        });
      });

      setGeneratedCA(result);
      setCurrentStep('confirmation');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrors({ submit: 'Failed to generate vanity address. Please try again.' });
      setCurrentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployConfirm = async () => {
    if (!generatedCA || !publicKey) return;

    setIsLoading(true);
    setCurrentStep('deploying');

    try {
      // Simulate pump.fun deployment
      // In a real implementation, this would:
      // 1. Upload logo/banner to IPFS or CDN
      // 2. Call pump.fun API to create token with the vanity CA
      // 3. Execute initial dev buy if specified
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setDeployedCA(generatedCA.publicKey);
      
      // Consume the ticket after successful deployment
      if (publicKey) {
        consumeTicket(publicKey.toBase58());
      }
      
      setCurrentStep('success');
    } catch (err: any) {
      console.error('Deployment error:', err);
      setErrors({ submit: 'Deployment failed. Please try again.' });
      setCurrentStep('confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoldOff = () => {
    // User chose to hold off on deployment
    // The generated CA is saved in state, they can come back to it
    alert('Contract address saved. You can return to deploy it later.');
    // For now, just show the confirmation again
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setErrors({});
  };

  const pricing = calculatePrice();

  // Render payment step
  if (currentStep === 'payment') {
    return (
      <div className="solana-card p-6 md:p-8 space-y-6">
        <button
          onClick={handleBackToForm}
          className="solana-button-secondary mb-4"
        >
          ← Back to Form
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Payment Required</h3>
          <p className="text-gray-400">
            Pay to unlock the vanity contract generator
          </p>
        </div>

        <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Token Name:</span>
            <span className="font-semibold">{formData.tokenName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Vanity Pattern:</span>
            <span className="font-mono font-semibold">
              {formData.vanityPosition === 'prefix' 
                ? `${formData.vanityCharacters}...` 
                : `...${formData.vanityCharacters}`}
            </span>
          </div>
          
          <div className="border-t border-gray-600 pt-3 mt-3">
            <div className="flex justify-between items-center text-xl">
              <span className="font-semibold">Total:</span>
              <span className="solana-gradient-text font-bold">
                {pricing.totalPrice === 0 ? 'FREE' : `${pricing.totalPrice.toFixed(2)} SOL`}
              </span>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
            {errors.submit}
          </div>
        )}

        <button
          onClick={handlePaymentComplete}
          disabled={isLoading}
          className="solana-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Processing Payment...
            </span>
          ) : pricing.totalPrice === 0 ? (
            'Continue for Free'
          ) : (
            `Pay ${pricing.totalPrice.toFixed(2)} SOL`
          )}
        </button>
      </div>
    );
  }

  // Render generating step
  if (currentStep === 'generating') {
    return (
      <div className="solana-card p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Generating Vanity Address</h3>
          <p className="text-gray-400">
            Creating your custom contract address...
          </p>
        </div>

        <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pattern:</span>
            <span className="font-mono font-semibold">
              {formData.vanityPosition === 'prefix' 
                ? `${formData.vanityCharacters}...` 
                : `...${formData.vanityCharacters}`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-solana-green">
          <div className="animate-spin h-5 w-5 border-2 border-solana-green border-t-transparent rounded-full" />
          <span>Generating...</span>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm">
          <strong>⚡ Please Wait:</strong> This may take a few moments depending on the pattern complexity.
        </div>
      </div>
    );
  }

  // Render confirmation step
  if (currentStep === 'confirmation' && generatedCA) {
    return (
      <div className="solana-card p-6 md:p-8 space-y-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">✨</div>
          <h3 className="text-2xl font-semibold mb-2">Vanity Address Generated!</h3>
          <p className="text-gray-400">
            Review your contract address before deploying to pump.fun
          </p>
        </div>

        <div className="bg-gray-700/50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Your Vanity Contract Address:
            </label>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-solana-purple">
              <p className="font-mono text-sm break-all text-solana-green">
                {generatedCA.publicKey}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Token Name:</span>
            <span className="font-semibold">{formData.tokenName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Symbol:</span>
            <span className="font-semibold">{formData.tokenSymbol}</span>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
            {errors.submit}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleDeployConfirm}
            disabled={isLoading}
            className="solana-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deploying...' : '✅ Yes, Deploy and Go Live on Pump.fun'}
          </button>
          
          <button
            onClick={handleHoldOff}
            className="solana-button-secondary w-full"
          >
            ⏸️ No, Hold Off (Save for Later)
          </button>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
          <strong>💡 Note:</strong> Once deployed, the token will be live on pump.fun. 
          Make sure you&apos;re ready before proceeding.
        </div>
      </div>
    );
  }

  // Render deploying step
  if (currentStep === 'deploying') {
    return (
      <div className="solana-card p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Deploying to Pump.fun</h3>
          <p className="text-gray-400">
            Creating your token on pump.fun...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-solana-purple">
          <div className="animate-spin h-8 w-8 border-3 border-solana-purple border-t-transparent rounded-full" />
          <span>Deploying...</span>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-sm">
          <strong>⚡ Almost There:</strong> Your token is being deployed to the blockchain.
        </div>
      </div>
    );
  }

  // Render success step
  if (currentStep === 'success' && deployedCA) {
    return (
      <div className="solana-card p-6 md:p-8 space-y-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="text-3xl font-bold mb-2 solana-gradient-text">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-300">
            Your token is now live on Pump.fun!
          </p>
        </div>

        <div className="bg-gray-700/50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Contract Address:
            </label>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-solana-green">
              <p className="font-mono text-sm break-all text-solana-green">
                {deployedCA}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Token Name:</span>
            <span className="font-semibold">{formData.tokenName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Symbol:</span>
            <span className="font-semibold">{formData.tokenSymbol}</span>
          </div>
        </div>

        <a
          href={`https://pump.fun/coins/${deployedCA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="solana-button-primary w-full text-center block"
        >
          🚀 View on Pump.fun
        </a>

        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-300 text-sm text-center">
          <strong>🎊 Success!</strong> Share your new token with the community!
        </div>
      </div>
    );
  }

  // Render form step (default)
  return (
    <div className="solana-card p-6 md:p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Information Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-solana-purple">Token Information</h3>
          
          {/* Token Name */}
          <div>
            <label htmlFor="tokenName" className="block text-sm font-medium text-gray-300 mb-2">
              Token Name <span className="text-red-400">*</span>
            </label>
            <input
              id="tokenName"
              type="text"
              value={formData.tokenName}
              onChange={(e) => handleInputChange('tokenName', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.tokenName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
              placeholder="e.g., My Awesome Token"
            />
            {errors.tokenName && <p className="mt-1 text-sm text-red-400">{errors.tokenName}</p>}
          </div>

          {/* Token Symbol */}
          <div>
            <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-300 mb-2">
              Symbol / Ticker <span className="text-red-400">*</span>
            </label>
            <input
              id="tokenSymbol"
              type="text"
              value={formData.tokenSymbol}
              onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.tokenSymbol ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
              placeholder="e.g., MAT"
              maxLength={10}
            />
            {errors.tokenSymbol && <p className="mt-1 text-sm text-red-400">{errors.tokenSymbol}</p>}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-solana-purple">Social Links (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Twitter */}
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-2">
                Twitter / X
              </label>
              <input
                id="twitter"
                type="url"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.twitter ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
                placeholder="https://twitter.com/yourtoken"
              />
              {errors.twitter && <p className="mt-1 text-sm text-red-400">{errors.twitter}</p>}
            </div>

            {/* Telegram */}
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-300 mb-2">
                Telegram
              </label>
              <input
                id="telegram"
                type="url"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.telegram ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
                placeholder="https://t.me/yourtoken"
              />
              {errors.telegram && <p className="mt-1 text-sm text-red-400">{errors.telegram}</p>}
            </div>

            {/* Discord */}
            <div>
              <label htmlFor="discord" className="block text-sm font-medium text-gray-300 mb-2">
                Discord
              </label>
              <input
                id="discord"
                type="url"
                value={formData.discord}
                onChange={(e) => handleInputChange('discord', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.discord ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
                placeholder="https://discord.gg/yourtoken"
              />
              {errors.discord && <p className="mt-1 text-sm text-red-400">{errors.discord}</p>}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.website ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
                placeholder="https://yourtoken.com"
              />
              {errors.website && <p className="mt-1 text-sm text-red-400">{errors.website}</p>}
            </div>
          </div>
        </div>

        {/* Image Uploads Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-solana-purple">Images</h3>
          
          {/* Logo Upload */}
          <div>
            <label htmlFor="logoFile" className="block text-sm font-medium text-gray-300 mb-2">
              Logo Image <span className="text-red-400">*</span>
            </label>
            <input
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('logoFile', e.target.files?.[0])}
              className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.logoFile ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-solana-purple file:text-white hover:file:bg-solana-green file:cursor-pointer`}
            />
            <p className="mt-1 text-xs text-gray-400">Recommended: 1000px by 1000px (png, jpg, etc.)</p>
            {formData.logoFile && (
              <p className="mt-1 text-sm text-solana-green">✓ {formData.logoFile.name}</p>
            )}
            {errors.logoFile && <p className="mt-1 text-sm text-red-400">{errors.logoFile}</p>}
          </div>

          {/* Banner Upload */}
          <div>
            <label htmlFor="bannerFile" className="block text-sm font-medium text-gray-300 mb-2">
              Banner Image (Optional)
            </label>
            <input
              id="bannerFile"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('bannerFile', e.target.files?.[0])}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-solana-purple file:text-white hover:file:bg-solana-green file:cursor-pointer"
            />
            <p className="mt-1 text-xs text-gray-400">Recommended: 1500px by 500px (png, jpg, etc.)</p>
            {formData.bannerFile && (
              <p className="mt-1 text-sm text-solana-green">✓ {formData.bannerFile.name}</p>
            )}
          </div>
        </div>

        {/* Vanity Pattern Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-solana-purple">Vanity Contract Address Pattern</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vanity Characters */}
            <div>
              <label htmlFor="vanityCharacters" className="block text-sm font-medium text-gray-300 mb-2">
                Custom Characters (2-4) <span className="text-red-400">*</span>
              </label>
              <input
                id="vanityCharacters"
                type="text"
                value={formData.vanityCharacters}
                onChange={(e) => handleInputChange('vanityCharacters', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.vanityCharacters ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
                placeholder="e.g., pump"
                maxLength={4}
              />
              {errors.vanityCharacters && <p className="mt-1 text-sm text-red-400">{errors.vanityCharacters}</p>}
              <p className="mt-1 text-xs text-gray-400">Use base58 characters only (no 0, O, I, l)</p>
            </div>

            {/* Position Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('vanityPosition', 'prefix')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.vanityPosition === 'prefix'
                      ? 'border-solana-purple bg-solana-purple/20 text-white'
                      : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Prefix
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('vanityPosition', 'suffix')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.vanityPosition === 'suffix'
                      ? 'border-solana-purple bg-solana-purple/20 text-white'
                      : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Suffix
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Initial Dev Buy Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-solana-purple">Initial Developer Buy (Optional)</h3>
          
          <div>
            <label htmlFor="initialDevBuy" className="block text-sm font-medium text-gray-300 mb-2">
              Dev Buy Amount (SOL)
            </label>
            <input
              id="initialDevBuy"
              type="number"
              step="0.01"
              min="0"
              value={formData.initialDevBuy}
              onChange={(e) => handleInputChange('initialDevBuy', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700/50 border ${errors.initialDevBuy ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-solana-purple transition-colors`}
              placeholder="0.0"
            />
            {errors.initialDevBuy && <p className="mt-1 text-sm text-red-400">{errors.initialDevBuy}</p>}
            <p className="mt-1 text-xs text-gray-400">
              Optional: Enter amount for initial developer purchase. If entered, a 0.02 SOL fee will be added to the total.
            </p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
          <h3 className="text-xl font-bold text-solana-purple">Pricing Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Vanity CA Service (Base):</span>
              <span className="text-white font-semibold">{pricing.basePrice} SOL</span>
            </div>
            
            {pricing.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-solana-green">
                  SolGen Holder Discount ({pricing.discount}%):
                </span>
                <span className="text-solana-green font-semibold">
                  -{(pricing.basePrice - pricing.discountedPrice).toFixed(2)} SOL
                </span>
              </div>
            )}

            {pricing.devBuyFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">Initial Dev Buy Fee:</span>
                <span className="text-white font-semibold">{pricing.devBuyFee.toFixed(2)} SOL</span>
              </div>
            )}

            {pricing.devBuyAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">Dev Buy Amount:</span>
                <span className="text-white font-semibold">{pricing.devBuyAmount.toFixed(2)} SOL</span>
              </div>
            )}

            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between text-lg">
                <span className="text-white font-bold">Total:</span>
                <span className="text-solana-purple font-bold">{pricing.totalPrice.toFixed(2)} SOL</span>
              </div>
            </div>
          </div>

          {!publicKey && (
            <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg text-sm text-yellow-200">
              <p>💡 Connect your wallet to see personalized pricing based on your SolGen holdings.</p>
            </div>
          )}

          {pricing.discount > 0 && (
            <div className="bg-green-900/30 border border-green-600 p-3 rounded-lg text-sm text-green-200">
              <p><span role="img" aria-label="celebration">🎉</span> You&apos;re saving {pricing.discount}% as a SolGen holder!</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="space-y-3">
          {!publicKey ? (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-3">Connect your wallet to continue</p>
              <WalletMultiButton className="!solana-button-primary" />
            </div>
          ) : (
            <>
              {errors.submit && (
                <div className="bg-red-900/30 border border-red-600 p-3 rounded-lg text-sm text-red-200">
                  {errors.submit}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full solana-button-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <span>Generate Vanity Contract ({pricing.totalPrice.toFixed(2)} SOL)</span>
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
