# SolGen - Solana Vanity Wallet Generator

A privacy-first, client-side Solana vanity wallet generator with token-gated pricing.

![Landing Page](https://github.com/user-attachments/assets/5f271d85-ce30-4375-8802-9d6854849c62)

## ✨ Features

- **🔒 100% Client-Side**: All key generation happens in your browser using Web Workers
- **🚫 Zero Server Storage**: Your private keys never leave your browser
- **👛 Wallet Support**: Connect with Phantom or Solflare
- **💎 Token-Gated Discount**: 50% off for SolGen token holders
- **⚡ High Performance**: Multi-threaded generation with real-time progress tracking
- **🎯 Secure**: Generate vanity addresses with 3 or 4 custom characters (prefix or suffix)
- **📊 Progress Tracking**: Real-time attempts, rate, and ETA with pause/resume controls

## 💰 Pricing

| Length | Standard Price | Discounted Price (SolGen Holders) |
|--------|---------------|-----------------------------------|
| 3 Characters | 0.15 SOL | 0.075 SOL (50% off) |
| 4 Characters | 0.40 SOL | 0.20 SOL (50% off) |

## 🔒 Security & Protection

- **Critical Files Validation**: Automated checks prevent deployment if essential files are missing
- **Client-Side Key Generation**: All private keys are generated in your browser
- **Zero Server Storage**: No sensitive data is ever sent to or stored on servers
- **Token-Based Access Control**: Payment verification before generation

For details on critical file protection, see [docs/CRITICAL_FILES_PROTECTION.md](docs/CRITICAL_FILES_PROTECTION.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Phantom or Solflare wallet browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/NextLevel333/SolGen.git
cd SolGen

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## ⚙️ Configuration

**Required before production deployment:**

Update the following constants in `src/config/constants.ts`:

```typescript
// Replace placeholders with actual values
export const CONFIG = {
  TREASURY_ADDRESS: new PublicKey('YOUR_ACTUAL_TREASURY_WALLET_ADDRESS'),
  SOLGEN_MINT_ADDRESS: new PublicKey('YOUR_ACTUAL_TOKEN_MINT_ADDRESS'),
  // ... other config
}
```

### Configuration Options

- **TREASURY_ADDRESS**: Your Solana wallet address for receiving payments
- **SOLGEN_MINT_ADDRESS**: Your SolGen SPL token mint address  
- **RPC_ENDPOINT**: Solana RPC endpoint (default: mainnet-beta)
- **PRICING**: Pricing structure for 3 and 4 character vanity addresses

## 📖 How It Works

1. **Connect Wallet**: Connect your Phantom or Solflare wallet
2. **Choose Length**: Select 3 or 4 character vanity pattern
3. **Configure Pattern**: Choose prefix or suffix and enter desired characters
4. **Pay Fee**: Submit payment (automatically discounted for SolGen token holders)
5. **Generate**: Wait for client-side generation to complete
6. **Save Keys**: Securely download and backup your new wallet keys

## 🏗️ Technology Stack

- **Framework**: Next.js 15.5.12 with TypeScript
- **Styling**: Tailwind CSS with custom Solana theme
- **Blockchain**: Solana Web3.js 1.87.6, Wallet Adapter
- **SPL Tokens**: @solana/spl-token 0.3.9
- **Generation**: Web Workers for parallel processing
- **Crypto**: tweetnacl 1.0.3 for keypair generation

## 🔒 Security

✅ **Production Ready** - All security vulnerabilities addressed

- All keypair generation happens client-side
- Private keys are never transmitted or stored on any server
- Next.js updated from 14.0.4 to 15.5.12 (37 CVEs patched)
- CodeQL scan: 0 vulnerabilities
- Code review: All issues resolved
- Always backup your private keys securely
- Never share your private keys with anyone

For detailed security information, see [SECURITY.md](SECURITY.md).

## 📚 Documentation

- **[TESTING.md](TESTING.md)** - Testing procedures and checklist
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Technical implementation details
- **[SECURITY.md](SECURITY.md)** - Security audit and compliance

## 💎 About SolGen Token

SolGen is the native utility token offering 50% discount on all vanity address generation fees.

- **Status**: Launched on pump.fun with LP
- **Contract Address**: To be updated
- **Discount**: Any wallet holding SolGen tokens automatically qualifies

## 🎨 UI/UX

- **Theme**: Dark mode with Solana gradient accents (purple to green)
- **Responsive**: Mobile-friendly design
- **Intuitive**: Step-by-step guided flow
- **Accessible**: Clear instructions and security warnings
- **Performance**: Optimized bundle size (215 kB first load)

## 🔧 Development

### Project Structure

```
src/
├── components/       # React components
├── config/          # Configuration constants
├── pages/           # Next.js pages
├── styles/          # Global styles
├── utils/           # Utility functions
└── workers/         # Web Workers for generation
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

Supports multiple deployment options:

- **Vercel** (recommended) - One-click deployment
- **Netlify** - Static site deployment
- **Self-hosted** - Docker or traditional hosting
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style
2. All tests pass
3. Security best practices followed
4. Documentation updated

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This tool is provided as-is without warranty. Always verify you've securely saved your keys before transferring any funds to generated addresses. The developers are not responsible for lost funds due to misuse or loss of private keys.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/NextLevel333/SolGen/issues)
- **Documentation**: See docs folder
- **Security**: See [SECURITY.md](SECURITY.md) for security policies

---

**Built with ❤️ for the Solana ecosystem**
