import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { CONFIG } from '../config/constants';

// Note: This assumes the token has 9 decimals (standard for SPL tokens)
// If your token uses different decimals, update the divisor accordingly
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
    // Assuming 9 decimals (standard for most SPL tokens)
    return Number(account.amount) / 1e9;
  } catch (error) {
    // Token account doesn't exist or other error
    return 0;
  }
}

export function getTier(tokenBalance: number): 0 | 1 | 2 | 3 {
  if (tokenBalance >= CONFIG.TIER_1_BALANCE) {
    return 1; // Tier 1 VIP - 100% off (10M+)
  } else if (tokenBalance >= CONFIG.TIER_2_BALANCE) {
    return 2; // Tier 2 - 80% off (5M+)
  } else if (tokenBalance >= CONFIG.TIER_3_BALANCE) {
    return 3; // Tier 3 - 40% off (1M+)
  }
  return 0; // No discount
}

export function hasDiscount(tokenBalance: number): boolean {
  return tokenBalance >= CONFIG.TIER_3_BALANCE;
}

export function getPrice(length: 3 | 4, tokenBalance: number): number {
  const pricing = length === 3 ? CONFIG.PRICING.THREE_CHAR : CONFIG.PRICING.FOUR_CHAR;
  const tier = getTier(tokenBalance);
  
  if (tier === 1) {
    return 0; // Tier 1 VIP - Free (10M+)
  } else if (tier === 2) {
    // Tier 2 - 80% off (5M+)
    return Number((pricing.full * 0.2).toFixed(2));
  } else if (tier === 3) {
    // Tier 3 - 40% off (1M+)
    return Number((pricing.full * 0.6).toFixed(2));
  }
  
  return pricing.full;
}

export function getDiscountPercentage(tokenBalance: number): number {
  const tier = getTier(tokenBalance);
  if (tier === 1) return 100; // Tier 1: 10M+ tokens
  if (tier === 2) return 80;  // Tier 2: 5M+ tokens
  if (tier === 3) return 40;  // Tier 3: 1M+ tokens
  return 0;
}

export function getContractPrice(tokenBalance: number): number {
  const pricing = CONFIG.PRICING.VANITY_CONTRACT;
  const tier = getTier(tokenBalance);
  
  if (tier === 1) {
    return 0; // Tier 1 VIP - Free (10M+)
  } else if (tier === 2) {
    // Tier 2 - 80% off (5M+)
    return Number((pricing.full * 0.2).toFixed(2));
  } else if (tier === 3) {
    // Tier 3 - 40% off (1M+)
    return Number((pricing.full * 0.6).toFixed(2));
  }
  
  return pricing.full;
}
