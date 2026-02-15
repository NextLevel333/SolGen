# SolGen - Testing Guide

## Manual Testing Checklist

### 1. Landing Page
- [x] Page loads successfully
- [x] Solana gradient theme applied correctly
- [x] All feature cards visible
- [x] Pricing information displayed
- [x] Security notice shown
- [x] "Connect Wallet to Start" button works
- [x] Shows alert when wallet not connected

### 2. Wallet Connection
- [ ] "Select Wallet" button in header
- [ ] Phantom wallet option available
- [ ] Solflare wallet option available
- [ ] Successful wallet connection
- [ ] Wallet address displayed after connection

### 3. Length Selection Screen
- [ ] 3-character option card displayed with correct price
- [ ] 4-character option card displayed with correct price
- [ ] Discount pricing shown (with SolGen tokens)
- [ ] Back button to landing page works
- [ ] Clicking option proceeds to payment

### 4. Payment Gate
- [ ] Price displayed correctly based on selection
- [ ] Token balance check occurs automatically
- [ ] Discount applied if token balance > 0
- [ ] Payment button creates transaction
- [ ] Transaction confirmation works
- [ ] Payment verification succeeds
- [ ] Generator unlocks after successful payment

### 5. Vanity Generator

#### Performance Mode Selection
- [ ] Performance mode selector displays before generation
- [ ] Three modes available: Eco, Balanced, Performance
- [ ] Each mode shows description and worker count
- [ ] Balanced mode marked as recommended
- [ ] Performance tip displayed about closing other apps
- [ ] Start Generation button works

#### Generation Process
- [ ] Character input field works
- [ ] Invalid characters (0, O, I, l) are filtered
- [ ] Position selection (prefix/suffix) works
- [ ] Multiple workers start based on selected mode
- [ ] Worker count displayed in UI matches expected:
  - Eco: 1 worker
  - Balanced: 2 workers
  - Performance: up to 4 workers (respects hardwareConcurrency-1)
- [ ] Progress updates display (attempts, rate, elapsed)
- [ ] Progress aggregates from all workers correctly
- [ ] ETA calculation works
- [ ] Pause/Resume functionality works across all workers
- [ ] Cancel functionality terminates all workers
- [ ] Generation completes successfully
- [ ] First worker to find match wins
- [ ] All workers terminated after success

### 6. Result Display
- [ ] Success message shown
- [ ] Generated public key displayed
- [ ] Private key displayed (hidden by default)
- [ ] Show/hide private key toggle works
- [ ] Copy buttons work for public and private keys
- [ ] Download keys button creates JSON file
- [ ] Security warning displayed
- [ ] Generate Another button resets flow

### 7. Security & Privacy
- [x] No server-side key generation
- [x] Web Worker runs client-side
- [x] Keys never transmitted over network
- [x] Payment verification is on-chain
- [x] Token balance check uses read-only operations

### 8. Build & Deployment
- [x] npm install completes successfully
- [x] npm run build completes without errors
- [x] npm run dev starts development server
- [x] Production build is optimized
- [x] No TypeScript errors
- [x] ESLint passes
- [x] CodeQL security scan passes (0 vulnerabilities)

## Configuration Required Before Production

1. Update `src/config/constants.ts`:
   - Replace `TREASURY_ADDRESS` placeholder with actual treasury wallet
   - Replace `SOLGEN_MINT_ADDRESS` placeholder with actual token mint address

2. Update `README.md`:
   - Add actual SolGen token contract address once available

3. Update `src/components/LandingContent.tsx`:
   - Replace "To be updated" with actual contract address once available

## Performance Notes

### Safe Defaults
- Worker count is automatically capped for device safety:
  - Maximum 4 workers
  - Never exceeds `navigator.hardwareConcurrency - 1`
  - Falls back to 4 if hardware concurrency unavailable
- Performance modes use different worker counts:
  - Eco: 1 worker (battery-friendly)
  - Balanced: 2 workers (recommended)
  - Performance: 4 workers (device-dependent)

### Generation Performance
- Each worker generates 10,000-50,000 keys/second on modern hardware
- Total rate scales with worker count
- Time-based progress updates reduce main thread overhead
- Adaptive yielding keeps UI responsive

### Device Compatibility
- Works on all modern browsers with Web Worker support
- Mobile devices: Eco/Balanced modes recommended for better battery life
- Desktop devices: Performance mode provides fastest generation
- Tab must remain active for optimal performance

## Known Limitations

1. **Wallet Adapter**: Requires browser extension (Phantom or Solflare) to be installed
2. **Generation Time**: 
   - 3-character: Usually seconds to minutes
   - 4-character: Can take several minutes to hours depending on pattern
3. **Payment Verification**: Requires transaction to be confirmed on-chain (2-3 seconds)
4. **Token Balance**: Assumes 9 decimal places (standard for SPL tokens)
5. **Background Generation**: Generation slows down when tab is in background (browser limitation)

## Browser Compatibility

- Modern browsers with Web Worker support
- JavaScript enabled
- Local storage enabled
- Solana wallet extension installed

## Performance Notes

- Web Worker utilizes single CPU core
- Generation rate depends on device CPU performance
- Expected rate: 10,000-50,000 keys/second on modern hardware
- 3-char average: ~100,000 attempts
- 4-char average: ~5,800,000 attempts
