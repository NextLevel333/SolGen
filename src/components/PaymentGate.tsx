import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getTokenBalance, getPrice, getTier, getDiscountPercentage } from '../utils/token';
import { createPaymentTransaction, verifyPayment, waitForConfirmation } from '../utils/payment';
import { formatSolAmount } from '../utils/format';
import { CONFIG, VanityLength } from '../config/constants';

interface PaymentGateProps {
  vanityLength: VanityLength;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ vanityLength, onPaymentSuccess, onBack }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [checkingBalance, setCheckingBalance] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  useEffect(() => {
    async function checkBalance() {
      if (!publicKey) {
        setCheckingBalance(false);
        return;
      }
      
      try {
        const balance = await getTokenBalance(
          connection,
          publicKey,
          CONFIG.SOLGEN_MINT_ADDRESS
        );
        setTokenBalance(balance);
      } catch (err) {
        console.error('Error checking token balance:', err);
      } finally {
        setCheckingBalance(false);
      }
    }
    
    checkBalance();
  }, [publicKey, connection]);
  
  // Check if this wallet has VIP access
  const isVipWallet = publicKey && publicKey.toBase58() === CONFIG.VIP_WALLET;
  const tier = getTier(tokenBalance);
  const discountPercentage = getDiscountPercentage(tokenBalance);
  const price = isVipWallet ? 0 : getPrice(vanityLength, tokenBalance);
  
  const handlePayment = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    // Skip payment for VIP wallet or free tier
    if (price === 0) {
      setPaymentConfirmed(true);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
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
      
      // Payment successful - show confirmation
      setPaymentConfirmed(true);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBeginGeneration = () => {
    onPaymentSuccess();
  };
  
  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
        <button
          onClick={onBack}
          className="solana-button-secondary"
        >
          ← Back
        </button>
        <div className="solana-card p-8 text-center space-y-6">
          <h3 className="text-2xl font-semibold mb-4">Connect Your Wallet</h3>
          <p className="text-gray-400 mb-6">
            Connect your Solana wallet to proceed with payment.
          </p>
          
          <div className="bg-gray-700/50 p-6 rounded-lg space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vanity Length:</span>
              <span className="font-semibold">{vanityLength} characters</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="font-semibold">Payment Required:</span>
              <span className="solana-gradient-text font-bold">
                {formatSolAmount(getPrice(vanityLength, 0))}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Tier 2 holders (1M+ tokens): 40% discount
            </p>
            <p className="text-xs text-gray-500">
              * Tier 1 holders (10M+ tokens): 100% free VIP access
            </p>
          </div>

          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-solana-purple !to-solana-green hover:!shadow-lg hover:!shadow-solana-purple/50 !transition-all !duration-200" />
          </div>
        </div>
      </div>
    );
  }
  
  // Show payment confirmation and device charging tip
  if (paymentConfirmed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
        <div className="solana-card p-8 space-y-6">
          <div className="text-center">
            <div className="mb-4 text-6xl">✅</div>
            <h3 className="text-2xl font-semibold mb-2">Payment Confirmed!</h3>
            <p className="text-gray-400">
              Your transaction has been successfully verified on-chain.
            </p>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Important Tip</h4>
                <p className="text-sm text-yellow-200">
                  Make sure your device is charged before starting generation. 
                  The generation process can take several minutes depending on the pattern complexity, 
                  and interruptions could cause you to lose progress.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleBeginGeneration}
            className="solana-button-primary w-full text-lg"
          >
            Begin Address Generation
          </button>
        </div>
      </div>
    );
  }
  
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
        <h3 className="text-2xl font-semibold mb-2">Payment Required</h3>
        <p className="text-gray-400">
          {isVipWallet ? 'VIP Access - Free Generation' : 'Pay to unlock the vanity address generator'}
        </p>
      </div>
      
      {checkingBalance ? (
        <div className="text-center text-gray-400">
          Checking token balance...
        </div>
      ) : (
        <>
          <div className="bg-gray-700/50 p-6 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vanity Length:</span>
              <span className="font-semibold">{vanityLength} characters</span>
            </div>
            
            {isVipWallet && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <span className="text-solana-green font-semibold text-lg">🌟 VIP Wallet - Free Access</span>
              </div>
            )}
            
            {!isVipWallet && tier === 1 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tier 1 Holder (10M+ tokens):</span>
                <span className="text-solana-green font-semibold">✓ 100% Free - VIP Access</span>
              </div>
            )}
            
            {!isVipWallet && tier === 2 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tier 2 Holder (1M+ tokens):</span>
                <span className="text-solana-green font-semibold">✓ 40% Discount</span>
              </div>
            )}
            
            {!isVipWallet && tier === 0 && tokenBalance > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SolGen Tokens:</span>
                <span className="text-gray-400">{tokenBalance.toLocaleString()} (need 1M+ for discount)</span>
              </div>
            )}
            
            {!isVipWallet && tier === 0 && tokenBalance === 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SolGen Tokens:</span>
                <span className="text-gray-500">None (no discount)</span>
              </div>
            )}
            
            <div className="border-t border-gray-600 pt-3 mt-3">
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold">Total:</span>
                <span className="solana-gradient-text font-bold">
                  {price === 0 ? 'FREE' : formatSolAmount(price)}
                </span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}
          
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="solana-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Processing Payment...
              </span>
            ) : price === 0 ? (
              'Continue for Free'
            ) : (
              `Pay ${formatSolAmount(price)}`
            )}
          </button>
          
          {price > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Payment unlocks the generator for one vanity address generation.
            </p>
          )}
        </>
      )}
    </div>
    </div>
  );
};
