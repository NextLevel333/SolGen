# Wallet Adapter Configuration

## Overview

AlienTek uses the Solana Wallet Adapter library to provide secure wallet connections for Phantom and Solflare wallets.

## Current Configuration

### Wallet Providers
- **Phantom Wallet Adapter** - Primary wallet provider
- **Solflare Wallet Adapter** - Secondary wallet provider with network configuration

### RPC Endpoint
- **Provider**: Helius RPC
- **Network**: Mainnet Beta
- **Endpoint**: Configured in `src/config/constants.ts`

### Application Metadata

The application includes the following metadata to improve wallet identification:

```typescript
<meta name="application-name" content="AlienTek" />
<meta name="apple-mobile-web-app-title" content="AlienTek" />
<meta name="theme-color" content="#9945FF" />
```

## Wallet Security Warnings

### Why Warnings May Appear

Some wallet applications (particularly mobile wallets) may display security warnings when connecting to dApps. These warnings are **normal** and appear for several reasons:

1. **Wallet-Side Security Features**: Wallets like Phantom implement their own security checks that may flag any dApp connection request, regardless of the dApp's legitimacy.

2. **Domain Verification**: Some wallets check against known malicious domains. New domains or localhost development environments may trigger warnings.

3. **Transaction Simulation**: When processing payments, wallets simulate the transaction and may show warnings if they cannot verify all aspects of the transaction.

### What We've Implemented

To minimize warnings and improve security, AlienTek implements:

1. **Standard Wallet Adapter**: Uses the official Solana Wallet Adapter library
2. **Network Configuration**: Properly configured for Mainnet Beta
3. **App Metadata**: Includes application name and theme color for wallet identification
4. **Secure RPC**: Uses Helius RPC endpoint for reliable connectivity
5. **Transaction Verification**: All payments are verified on-chain before proceeding

### Best Practices for Users

When connecting your wallet to AlienTek:

1. ✅ Verify you're on the correct domain
2. ✅ Check that the connection request shows "AlienTek"
3. ✅ Review transaction details carefully before approving
4. ✅ Only approve what you understand

### Known Limitations

Some security warnings are **entirely wallet-side** and cannot be eliminated by the dApp:

- **Phantom Mobile** may show warnings for any dApp that's not on their verified list
- **Solflare** may flag new or recently updated dApps
- **Generic warnings** about "this site may be malicious" are often precautionary

### Technical Notes

The wallet adapter configuration is located in:
- `src/components/WalletContextProvider.tsx` - Main wallet provider setup
- `src/pages/_app.tsx` - Application metadata and title

### Future Improvements

Potential improvements to reduce warnings:

1. Apply for wallet provider verified lists (if available)
2. Implement WalletConnect protocol for additional compatibility
3. Add dApp metadata manifest file
4. Implement additional app identity verification methods as they become available

## Security Commitment

AlienTek is committed to security:

- ✅ 100% client-side key generation
- ✅ Zero server storage
- ✅ Open-source codebase
- ✅ Verified on-chain transactions
- ✅ Standard Solana protocols

All code is available on GitHub for audit and transparency.

## Support

If you experience persistent issues with wallet connections or unusual security warnings:

1. Verify you're using the latest version of your wallet
2. Check you're on the correct domain
3. Try a different wallet (Phantom or Solflare)
4. Contact support through the Contact page

---

**Last Updated**: February 2026
**Version**: 1.0.0
