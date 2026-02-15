import { PublicKey } from '@solana/web3.js';

// =========================================
// PAYMENT CONFIGURATION
// =========================================
// Update this address with your actual wallet address to receive payments
export const PAYMENT_DESTINATION_WALLET = '11111111111111111111111111111111';

export const CONFIG = {
  // Treasury wallet address for receiving payments
  // IMPORTANT: Update PAYMENT_DESTINATION_WALLET above before deploying
  TREASURY_ADDRESS: new PublicKey('g2kFrXkPHqoKwK4Q3RLemdHHPoYGFooHgFreZoH4DEV'),
  
  // SolGen SPL token mint address - PLACEHOLDER - Update with actual mint address
  SOLGEN_MINT_ADDRESS: new PublicKey('Ez28fsseNKQu7sLzLAfEz57q5iw1Uv1HtYGUFSvFpump'),
  
  // Pricing in SOL
  PRICING: {
    THREE_CHAR: {
      full: 0.2,
      discounted: 0.12,
    },
    FOUR_CHAR: {
      full: 0.4,
      discounted: 0.24,
    },
  },
  
  // Tier system thresholds
  TIER_1_BALANCE: 10000000, // 10M tokens - 100% off (VIP)
  TIER_2_BALANCE: 1000000,  // 1M tokens - 40% off
  
  // Legacy discount threshold - kept for backwards compatibility
  DISCOUNT_TOKEN_BALANCE: 20000000,
  
  // VIP wallet with free access to all services
  VIP_WALLET: 'g2kFrXkPHqoKwK4Q3RLemdHHPoYGFooHgFreZoH4DEV',
  
  // Solana RPC endpoint
  RPC_ENDPOINT: 'https://mainnet.helius-rpc.com/?api-key=0ceb03f8-5460-442d-96b8-ce479057917a',
  
  // Network
  NETWORK: 'mainnet-beta' as const,
} as const;

export type VanityLength = 3 | 4;
export type VanityPosition = 'prefix' | 'suffix';

export interface VanityOptions {
  length: VanityLength;
  position: VanityPosition;
  characters: string;
}
