# Vanity Contract Flow Documentation

## Overview
This document describes the complete flow for creating and deploying a custom vanity contract address token on pump.fun through the SolGen application.

## Flow Steps

### Step 1: Form Submission
**Component State:** `'form'`

The user fills out the token information form including:
- Token Name (required)
- Token Symbol/Ticker (required)
- Social Links (optional): Twitter, Telegram, Discord, Website
- Logo Image (required)
- Banner Image (optional)
- Vanity Characters (2-4 base58 characters, required)
- Position (prefix or suffix)
- Initial Dev Buy Amount (optional, in SOL)

**Pricing Calculation:**
- Base price: 0.4 SOL for vanity contract service
- Tier 1 holders (10M+ tokens): 100% discount (FREE)
- Tier 2 holders (1M+ tokens): 40% discount (0.24 SOL)
- Dev buy fee: 0.02 SOL (only if initial dev buy amount is specified)
- Total = discounted price + dev buy fee + dev buy amount

**User Action:** Click "Generate Vanity Contract" button
**Next Step:** Payment

---

### Step 2: Payment Processing
**Component State:** `'payment'`

Displays:
- Token name and vanity pattern summary
- Total price breakdown
- Payment button

**Process:**
1. If price > 0, create payment transaction to treasury wallet
2. Send transaction via connected wallet
3. Wait for transaction confirmation (up to 60 seconds)
4. Verify payment on-chain
5. Create ticket in localStorage for recovery

**User Action:** Click "Pay X SOL" button (or "Continue for Free" for VIP/Tier 1)
**Next Step:** Generation

---

### Step 3: Vanity Address Generation
**Component State:** `'generating'`

**Process:**
1. Spawn web worker(s) to generate vanity address
2. Worker searches for keypair matching the vanity pattern
3. Display progress indicator
4. When match found, save generated CA (publicKey + secretKey)

**Technical Details:**
- Uses `vanity.worker.ts` for generation
- Searches for base58 addresses matching the pattern
- Pattern can be at prefix or suffix position
- Generation time varies based on pattern complexity

**User Action:** Wait (automatic)
**Next Step:** Confirmation

---

### Step 4: Confirmation Dialog
**Component State:** `'confirmation'`

**Displays:**
- Full generated contract address
- Token name and symbol
- Two action buttons:
  - "✅ Yes, Deploy and Go Live on Pump.fun"
  - "⏸️ No, Hold Off (Save for Later)"

**"Deploy" Flow:**
- User confirms they're ready to deploy
- Proceeds to deployment step

**"Hold Off" Flow:**
- Saves complete state to localStorage:
  - Form data
  - Generated CA (publicKey + secretKey)
  - Timestamp
  - Wallet address
- User can disconnect and return later
- On reconnection with same wallet, app offers to resume

**User Action:** Choose Deploy or Hold Off
**Next Step:** Deploying (if Deploy chosen)

---

### Step 5: Deployment to Pump.fun
**Component State:** `'deploying'`

**Process:**
1. Create metadata object from form data
2. Upload metadata to IPFS/CDN (via `uploadMetadata()`)
3. Create mint keypair from generated vanity CA
4. Call pump.fun API to deploy token (via `deployToPumpFun()`)
5. Execute initial dev buy if specified
6. Mark ticket as consumed
7. Clear any saved pending deployment state

**Technical Implementation:**
- Uses utilities from `/src/utils/pumpfun.ts`
- Current implementation has placeholder API calls
- Ready to be replaced with actual pump.fun integration

**User Action:** Wait (automatic)
**Next Step:** Success

---

### Step 6: Success Screen
**Component State:** `'success'`

**Displays:**
- 🎉 Congratulations message
- Full contract address
- Token name and symbol
- "🚀 View on Pump.fun" button (links to `https://pump.fun/coins/{CA}`)
- Success notification

**User Action:** 
- Click link to view token on pump.fun
- Share contract address
- Start marketing!

---

## State Persistence

### Ticket System
Located in `/src/utils/ticket.ts`

**Purpose:** Track paid orders and prevent duplicate payments

**Storage:** localStorage key `'solgen_ticket'`

**Data Structure:**
```typescript
interface Ticket {
  walletAddress: string;
  vanityLength: VanityLength;
  vanityCharacters: string;
  vanityPosition: VanityPosition;
  createdAt: number;
  transactionSignature?: string;
}
```

**Lifecycle:**
- Created after successful payment
- Checked on component mount
- Consumed after successful deployment

---

### Pending Deployment State
**Purpose:** Allow users to hold off on deployment and return later

**Storage:** localStorage key `'solgen_pending_deployment'`

**Data Structure:**
```typescript
{
  formData: VanityContractFormData,
  generatedCA: {
    publicKey: string,
    secretKey: number[]
  },
  timestamp: number,
  walletAddress: string
}
```

**Lifecycle:**
- Created when user clicks "Hold Off"
- Checked on wallet connection
- Cleared after successful deployment

---

## Error Handling

### Payment Errors
- Transaction timeout (60 seconds)
- Verification failure
- Insufficient funds
- User rejection

**Recovery:** Return to form step with error message

### Generation Errors
- Worker failure
- Browser compatibility issues

**Recovery:** Return to form step with error message

### Deployment Errors
- API call failures
- Transaction failures
- Network issues

**Recovery:** Return to confirmation step, CA is preserved

---

## Integration Points

### Pump.fun API
File: `/src/utils/pumpfun.ts`

**Functions to implement:**
1. `uploadMetadata()` - Upload token metadata to IPFS/CDN
2. `deployToPumpFun()` - Create token on pump.fun with vanity CA
3. `executeInitialBuy()` - Execute initial dev purchase

**Current Status:** Placeholder implementations with simulated delays

### Payment Processing
File: `/src/utils/payment.ts`

**Functions:**
- `createPaymentTransaction()` - Create SOL transfer to treasury
- `verifyPayment()` - Verify on-chain transaction
- `waitForConfirmation()` - Poll for transaction confirmation

**Status:** ✅ Fully implemented

### Vanity Generation
File: `/src/workers/vanity.worker.ts`

**Status:** ✅ Fully implemented

---

## User Experience Enhancements

### Progressive Disclosure
- Show only relevant information at each step
- Clear navigation with back buttons
- Progress indication during long operations

### Error Messages
- Specific error messages for each failure type
- Actionable guidance for recovery
- Non-technical language

### Success Feedback
- Celebratory messaging
- Clear next steps
- Easy sharing options

### State Recovery
- Resume interrupted deployments
- Prevent duplicate payments
- Clear status indication

---

## Future Improvements

1. **Real Pump.fun Integration**
   - Implement actual API calls
   - Handle real token deployment
   - Execute real initial buys

2. **Image Upload to IPFS**
   - Upload logo and banner to decentralized storage
   - Generate proper metadata URIs
   - Handle upload progress

3. **Enhanced Progress Tracking**
   - Show generation statistics
   - Display deployment progress
   - Real-time status updates

4. **Transaction History**
   - Track all deployments
   - Show past tokens
   - Link to deployed tokens

5. **Social Sharing**
   - One-click social media sharing
   - Pre-formatted messages
   - Token promotion tools
