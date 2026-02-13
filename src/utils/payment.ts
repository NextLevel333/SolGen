import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CONFIG } from '../config/constants';

// Payment verification tolerance to account for minor rounding differences
const PAYMENT_TOLERANCE_SOL = 0.0001;

export async function createPaymentTransaction(
  fromPubkey: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey: CONFIG.TREASURY_ADDRESS,
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    })
  );
  
  return transaction;
}

export async function verifyPayment(
  connection: Connection,
  signature: string,
  expectedAmount: number,
  fromAddress: PublicKey
): Promise<boolean> {
  try {
    const result = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    
    if (!result || !result.meta) {
      return false;
    }
    
    // Check if transaction was successful
    if (result.meta.err) {
      return false;
    }
    
    // Find the transfer instruction
    const instructions = result.transaction.message.instructions;
    for (const instruction of instructions) {
      if ('parsed' in instruction && instruction.parsed.type === 'transfer') {
        const { info } = instruction.parsed;
        const amount = info.lamports / LAMPORTS_PER_SOL;
        const destination = new PublicKey(info.destination);
        const source = new PublicKey(info.source);
        
        // Verify amount, destination, and source
        if (
          Math.abs(amount - expectedAmount) < PAYMENT_TOLERANCE_SOL &&
          destination.equals(CONFIG.TREASURY_ADDRESS) &&
          source.equals(fromAddress)
        ) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

export async function waitForConfirmation(
  connection: Connection,
  signature: string,
  timeout: number = 60000
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const status = await connection.getSignatureStatus(signature);
      
      if (status?.value?.confirmationStatus === 'confirmed' || 
          status?.value?.confirmationStatus === 'finalized') {
        return true;
      }
      
      if (status?.value?.err) {
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error checking confirmation:', error);
    }
  }
  
  return false;
}
