import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getTokenBalance, hasDiscount, getPrice } from '../utils/token';
import { createPaymentTransaction, verifyPayment, waitForConfirmation } from '../utils/payment';
import { formatSolAmount } from '../utils/format';
import { CONFIG, VanityLength } from '../config/constants';

interface PaymentGateProps {
  vanityLength: VanityLength;
  onPaymentSuccess: () => void;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ vanityLength, onPaymentSuccess }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [checkingBalance, setCheckingBalance] = useState(true);
  
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
  
  const discount = hasDiscount(tokenBalance);
  const price = getPrice(vanityLength, discount);
  
  const handlePayment = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
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
      
      onPaymentSuccess();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!publicKey) {
    return (
      <div className="solana-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-gray-400">
          Please connect your wallet to proceed with payment.
        </p>
      </div>
    );
  }
  
  return (
    <div className="solana-card p-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Payment Required</h3>
        <p className="text-gray-400">
          Pay to unlock the vanity address generator
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
            
            {discount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SolGen Token Holder:</span>
                <span className="text-solana-green font-semibold">✓ 50% Discount</span>
              </div>
            )}
            
            {!discount && tokenBalance === 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SolGen Tokens:</span>
                <span className="text-gray-500">None (no discount)</span>
              </div>
            )}
            
            <div className="border-t border-gray-600 pt-3 mt-3">
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold">Total:</span>
                <span className="solana-gradient-text font-bold">
                  {formatSolAmount(price)}
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
            ) : (
              `Pay ${formatSolAmount(price)}`
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Payment unlocks the generator for one vanity address generation.
          </p>
        </>
      )}
    </div>
  );
};
