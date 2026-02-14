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

### Option 1: GitHub Pages

**Current Setup**: This repository is configured to deploy to GitHub Pages automatically.

The site is available at: **https://nextlevel333.github.io/SolGen/**

#### How it works:

1. Every push to the `main` branch triggers the GitHub Actions workflow
2. The workflow builds the Next.js app as a static export
3. Static files are deployed to GitHub Pages
4. The site is served at `https://nextlevel333.github.io/SolGen/`

#### Key Configuration:

The following settings in `next.config.js` are required for GitHub Pages:

```javascript
{
  output: 'export',           // Static export
  basePath: '/SolGen',        // Project path on GitHub Pages
  assetPrefix: '/SolGen',     // Asset path prefix
  trailingSlash: true,        // Required for GitHub Pages routing
}
```

#### Manual Deployment:

To manually deploy to GitHub Pages:

```bash
# Build the application
npm run build

# The static export will be in the 'out' directory
# Upload the contents of 'out' to GitHub Pages
```

**Note**: The `.nojekyll` file is automatically copied to prevent Jekyll processing.

### Option 2: Vercel (Alternative)

1. Push code to GitHub repository
2. Import project to Vercel
3. Set build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Deploy

**Note**: For Vercel, you may need to remove or adjust the `basePath` and `assetPrefix` settings in `next.config.js` since Vercel doesn't require them.

### Option 3: Netlify

1. Push code to GitHub repository
2. Create new site from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
4. The `output: 'export'` is already configured in `next.config.js`

**Note**: For Netlify, you may need to remove or adjust the `basePath` and `assetPrefix` settings in `next.config.js`.

### Option 4: Self-Hosted

```bash
# Build the application
npm run build

# Start with PM2 (process manager)
pm2 start npm --name "solgen" -- start

# Or use systemd service
sudo systemctl start solgen
```

### Option 5: Docker

**Note**: Docker deployment requires a server to serve the static files. For GitHub Pages deployment, Docker is not needed.

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

### Cloudflare Security Headers (Recommended)

If you're using a custom domain with Cloudflare CDN, you can add security headers to improve reputation and security:

#### Option 1: Cloudflare Transform Rules (Recommended)

1. Log into your Cloudflare dashboard
2. Go to Rules > Transform Rules > Modify Response Header
3. Create a new rule with these headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

#### Option 2: Cloudflare Workers (Advanced)

Create a Cloudflare Worker to add security headers:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // Security Headers
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy (adjust as needed for your RPC endpoints)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js and Web Workers
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind and dynamic styles
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.solana.com https://*.helius-rpc.com https://*.quicknode.pro wss://*.solana.com", // Add your RPC endpoints
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  newResponse.headers.set('Content-Security-Policy', csp)
  
  return newResponse
}
```

#### Option 3: Netlify Headers

If deploying to Netlify, create a `_headers` file in the `public` directory:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.solana.com https://*.helius-rpc.com wss://*.solana.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

#### GitHub Pages Limitations

**Note**: GitHub Pages does not support custom security headers. For production deployments requiring security headers, consider:
- Using Cloudflare in front of GitHub Pages
- Deploying to Vercel or Netlify instead
- Self-hosting with nginx or Apache

### CSP Header Explanation

The Content Security Policy (CSP) header helps prevent XSS attacks and other injection attacks:

- `default-src 'self'`: Only allow resources from your own domain by default
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'`: Required for Next.js and Web Workers (client-side generation)
- `style-src 'self' 'unsafe-inline'`: Required for Tailwind CSS and dynamic styles
- `connect-src`: Whitelist your Solana RPC endpoints
- `frame-ancestors 'none'`: Prevent clickjacking by disallowing iframe embedding

**Important**: Update the `connect-src` directive with your actual RPC endpoints.

### HSTS Header Explanation

HTTP Strict Transport Security (HSTS) forces browsers to only connect via HTTPS:

- `max-age=31536000`: Enforce HTTPS for 1 year
- `includeSubDomains`: Also enforce on all subdomains
- `preload`: Submit your domain to HSTS preload list (optional, requires meeting additional criteria)

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
