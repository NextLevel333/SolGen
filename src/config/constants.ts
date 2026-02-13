import { PublicKey } from '@solana/web3.js';

export const CONFIG = {
  // Treasury wallet address - PLACEHOLDER - Update with actual address
  TREASURY_ADDRESS: new PublicKey('11111111111111111111111111111111'),
  
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
