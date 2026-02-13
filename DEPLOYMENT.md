# Deployment Guide

## Prerequisites

1. Node.js 18 or higher
2. npm or yarn package manager
3. Solana wallet for treasury
4. SolGen SPL token mint address (optional, for discount feature)

## Configuration

### Step 1: Update Treasury Address

Edit `src/config/constants.ts` and update the treasury address:

```typescript
TREASURY_ADDRESS: new PublicKey('YOUR_ACTUAL_TREASURY_WALLET_ADDRESS'),
```

### Step 2: Update SolGen Token Mint Address

Edit `src/config/constants.ts` and update the token mint address:

```typescript
SOLGEN_MINT_ADDRESS: new PublicKey('YOUR_ACTUAL_TOKEN_MINT_ADDRESS'),
```

### Step 3: Update RPC Endpoint (Optional)

For production, consider using a dedicated RPC provider:

```typescript
RPC_ENDPOINT: 'https://your-rpc-provider.com/api/key',
```

Recommended providers:
- Helius
- QuickNode  
- Alchemy (Solana)
- Triton

## Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test production build locally
npm start
```

The application will be available at `http://localhost:3000`

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub repository
2. Import project to Vercel
3. Set build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Deploy

### Option 2: Netlify

1. Push code to GitHub repository
2. Create new site from Git
3. Build settings:
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`
4. Add `next.config.js` export configuration:

```javascript
module.exports = {
  ...nextConfig,
  output: 'export',
}
```

### Option 3: Self-Hosted

```bash
# Build the application
npm run build

# Start with PM2 (process manager)
pm2 start npm --name "solgen" -- start

# Or use systemd service
sudo systemctl start solgen
```

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t solgen .
docker run -p 3000:3000 solgen
```

## Environment Variables

For production, consider using environment variables for sensitive configuration:

Create `.env.local`:

```
NEXT_PUBLIC_TREASURY_ADDRESS=your_treasury_address
NEXT_PUBLIC_TOKEN_MINT_ADDRESS=your_token_mint_address
NEXT_PUBLIC_RPC_ENDPOINT=your_rpc_endpoint
```

Update `src/config/constants.ts` to use environment variables:

```typescript
TREASURY_ADDRESS: new PublicKey(
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '11111111111111111111111111111111'
),
```

## Post-Deployment Checklist

- [ ] Verify treasury address is correct
- [ ] Test wallet connection with Phantom
- [ ] Test wallet connection with Solflare
- [ ] Verify token balance detection works
- [ ] Test payment flow with small amount
- [ ] Verify payment arrives at treasury
- [ ] Test vanity generation with 3-character pattern
- [ ] Verify generated keys are valid Solana keypairs
- [ ] Test key download functionality
- [ ] Monitor for console errors
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Check page load performance
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up monitoring/analytics (optional)

## Security Considerations

1. **HTTPS Only**: Always deploy with HTTPS enabled
2. **Content Security Policy**: Consider adding CSP headers
3. **Rate Limiting**: Implement rate limiting on RPC calls if using custom backend
4. **Treasury Security**: Use a secure wallet for treasury
5. **Monitor Transactions**: Set up alerts for treasury wallet activity

## Monitoring

Consider setting up:
- Error tracking (e.g., Sentry)
- Analytics (e.g., Google Analytics, Plausible)
- Uptime monitoring
- RPC endpoint monitoring
- Treasury wallet balance monitoring

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Backup

Regularly backup:
- Source code (Git repository)
- Configuration files
- Treasury wallet private keys (secure offline storage)

## Support

For issues or questions:
- GitHub Issues: [Repository URL]
- Documentation: [Docs URL]
- Community: [Discord/Telegram URL]
