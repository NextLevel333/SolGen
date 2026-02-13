import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { CONFIG } from '../config/constants';

export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  mintAddress: PublicKey
): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      walletAddress
    );
    
    const account = await getAccount(connection, tokenAccount);
    return Number(account.amount) / 1e9; // Assuming 9 decimals
  } catch (error) {
    // Token account doesn't exist or other error
    return 0;
  }
}

export function hasDiscount(tokenBalance: number): boolean {
  return tokenBalance > CONFIG.DISCOUNT_TOKEN_BALANCE;
}

export function getPrice(length: 3 | 4, hasDiscount: boolean): number {
  const pricing = length === 3 ? CONFIG.PRICING.THREE_CHAR : CONFIG.PRICING.FOUR_CHAR;
  return hasDiscount ? pricing.discounted : pricing.full;
}
