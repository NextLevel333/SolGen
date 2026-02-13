# SolGen - Solana Vanity Wallet Generator

A privacy-first, client-side Solana vanity wallet generator with token-gated pricing.

## Features

- **100% Client-Side**: All key generation happens in your browser using Web Workers
- **Zero Server Storage**: Your private keys never leave your browser
- **Wallet Support**: Connect with Phantom or Solflare
- **Token-Gated Discount**: 50% off for SolGen token holders
- **High Performance**: Multi-threaded generation with real-time progress tracking
- **Secure**: Generate vanity addresses with 3 or 4 custom characters (prefix or suffix)

## Pricing

- **3-Character Vanity**: 0.15 SOL (0.075 SOL with SolGen tokens)
- **4-Character Vanity**: 0.40 SOL (0.20 SOL with SolGen tokens)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Configuration

Update the following constants in `src/config/constants.ts`:

- `TREASURY_ADDRESS`: Your Solana wallet address for receiving payments
- `SOLGEN_MINT_ADDRESS`: Your SolGen SPL token mint address

## How It Works

1. **Connect Wallet**: Connect your Phantom or Solflare wallet
2. **Choose Pattern**: Select 3 or 4 character vanity address
3. **Pay Fee**: Submit payment (discounted for SolGen token holders)
4. **Generate**: Wait for the client-side generation to complete
5. **Save Keys**: Securely download and backup your new wallet keys

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with Solana theme
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Generation**: Web Workers for parallel processing
- **Crypto**: tweetnacl for keypair generation

## Security

- All keypair generation happens client-side
- Private keys are never transmitted or stored on any server
- Always backup your private keys securely
- Never share your private keys with anyone

## About SolGen Token

SolGen is the native utility token offering 50% discount on all vanity address generation fees.

- **Status**: Launched on pump.fun/LP
- **Contract**: To be updated

## License

MIT

## Disclaimer

This tool is provided as-is without warranty. Always verify you've securely saved your keys before transferring any funds to generated addresses.
