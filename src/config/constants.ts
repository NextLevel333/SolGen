import { PublicKey } from '@solana/web3.js';

// =========================================
// PAYMENT CONFIGURATION
// =========================================
// Update this address with your actual wallet address to receive payments
export const PAYMENT_DESTINATION_WALLET = '11111111111111111111111111111111';

export const CONFIG = {
  // Treasury wallet address for receiving payments
  // IMPORTANT: Update PAYMENT_DESTINATION_WALLET above before deploying
  TREASURY_ADDRESS: new PublicKey(PAYMENT_DESTINATION_WALLET),
  
  // SolGen SPL token mint address - PLACEHOLDER - Update with actual mint address
  SOLGEN_MINT_ADDRESS: new PublicKey('11111111111111111111111111111111'),
  
  // Pricing in SOL
  PRICING: {
    THREE_CHAR: {
      full: 0.15,
      discounted: 0.075,
    },
    FOUR_CHAR: {
      full: 0.40,
      discounted: 0.20,
    },
  },
  
  // Discount threshold
  DISCOUNT_TOKEN_BALANCE: 0, // Any balance > 0 qualifies for discount
  
  // Solana RPC endpoint
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  
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
