# LemonSqueezy Setup Guide for CompileStrength

This guide will help you complete the LemonSqueezy integration setup.

## What's Been Implemented

✅ **Database Schema**

- Plans table (synced from LemonSqueezy)
- Subscriptions table (tracks user subscriptions)
- WebhookEvents table (logs all webhook events)
- UsageTracking table (tracks weekly usage limits)

✅ **Route Structure**

- `/` - Public landing page
- `/tools/*` - Public fitness calculators (FFMI calculator)
- `/(dashboard)/*` - Protected dashboard (requires auth)
- `/billing` - Subscription management portal
- `/api/webhooks/lemonsqueezy` - Webhook endpoint

✅ **Billing Features**

- Plan selection and checkout
- Subscription management (pause, cancel, change plans)
- Usage tracking (1 compile/week, 5 edits, 50 messages)
- Trial support (7 days)
- Upgrade prompts for expired/cancelled users

## Required Setup Steps

### 1. Set Environment Variables

Add these to your `.env` file:

```bash
# LemonSqueezy Credentials
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Optional - for webhook testing
LEMONSQUEEZY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/lemonsqueezy
```

### 2. Get LemonSqueezy Credentials

1. **API Key**:
   - Go to
     [LemonSqueezy Settings → API](https://app.lemonsqueezy.com/settings/api)
   - Click "Create API Key"
   - Copy the key and add to `.env`

2. **Store ID**:
   - Go to
     [LemonSqueezy Settings → Stores](https://app.lemonsqueezy.com/settings/stores)
   - Find your store ID (numeric ID in the URL or settings)
   - Add to `.env`

3. **Webhook Secret**:
   - Generate a random string (min 32 characters)
   - You can use: `openssl rand -base64 32`
   - Add to `.env`

### 3. Create Products in LemonSqueezy

1. Go to [Products](https://app.lemonsqueezy.com/products)
2. Create a new product (e.g., "CompileStrength Pro")
3. Add variants/pricing:
   - Set as subscription
   - Configure interval (monthly/yearly)
   - Set trial period: 7 days
4. Note your variant ID from the URL

### 4. Set Up Webhook

1. Go to [Settings → Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
2. Click "+" to create a new webhook
3. Configure:
   - **URL**: `https://yourdomain.com/api/webhooks/lemonsqueezy`
   - **Signing Secret**: Use the same secret from your `.env`
   - **Events to send**: Select these events:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_resumed`
     - `subscription_paused`
     - `subscription_unpaused`
     - `subscription_expired`

For local development, use [ngrok](https://ngrok.com/) or
[LocalCan](https://www.localcan.com/):

```bash
# Example with ngrok
ngrok http 3000
# Then use: https://your-ngrok-url.ngrok.io/api/webhooks/lemonsqueezy
```

### 5. Sync Plans to Database

Once your environment variables are set:

1. Start your development server: `bun dev` (or `npm run dev`)
2. Navigate to `http://localhost:3000/billing`
3. Plans will automatically sync from LemonSqueezy on first page load

Alternatively, you can manually trigger sync by visiting the billing page or
calling the `syncPlans()` action.

### 6. Test the Flow

1. **Create Account**: Go to `/signup` and create a test account
2. **View Plans**: Navigate to `/billing` to see synced plans
3. **Subscribe**: Click "Subscribe" on a plan
   - You'll be redirected to LemonSqueezy checkout
   - Use test mode card: `4242 4242 4242 4242`
4. **Verify Subscription**: Check `/billing` to see your active subscription
5. **Test Webhook**: Modify subscription in LemonSqueezy dashboard
   - Check `WebhookEvents` table in database to verify events are received

### 7. Production Deployment

For Cloudflare Workers:

1. Set secrets using wrangler:

```bash
npx wrangler secret put LEMONSQUEEZY_API_KEY
npx wrangler secret put LEMONSQUEEZY_STORE_ID
npx wrangler secret put LEMONSQUEEZY_WEBHOOK_SECRET
```

2. Update `wrangler.jsonc` with public variables if needed

3. Update webhook URL in LemonSqueezy to your production domain

4. Deploy: `npm run deploy` (or `bun run deploy`)

## Usage Tracking Integration

To integrate usage tracking in your features:

### For AI Compiler:

```typescript
import {
  canCompile,
  incrementCompileUsage,
} from "@/app/actions/usage-tracking";

// Before allowing compile
const { allowed, used, limit } = await canCompile();

if (!allowed) {
  return { error: `Compile limit reached (${used}/${limit})` };
}

// After successful compile
await incrementCompileUsage();
```

### For Routine Edits:

```typescript
import {
  canEditRoutine,
  incrementRoutineEditUsage,
} from "@/app/actions/usage-tracking";

const { allowed, used, limit } = await canEditRoutine();

if (!allowed) {
  return { error: `Edit limit reached (${used}/${limit})` };
}

await incrementRoutineEditUsage();
```

### For AI Messages:

```typescript
import {
  canSendMessage,
  incrementMessageUsage,
} from "@/app/actions/usage-tracking";

const { allowed, used, limit } = await canSendMessage();

if (!allowed) {
  return { error: `Message limit reached (${used}/${limit})` };
}

await incrementMessageUsage();
```

## Displaying Usage

Add the usage display component to your dashboard:

```typescript
import { UsageDisplay } from "@/components/billing/usage-display";

// In your dashboard page:
<Suspense fallback={<div>Loading usage...</div>}>
  <UsageDisplay />
</Suspense>;
```

## Subscription Status Checking

The `SubscriptionBanner` component automatically shows:

- Trial status and expiration
- Upgrade prompts for expired subscriptions
- Warning for paused subscriptions

It's already integrated in the dashboard layout.

## Troubleshooting

### Webhooks not working?

- Check webhook signature matches your `.env` secret
- Verify webhook URL is publicly accessible
- Check `WebhookEvents` table for processing errors

### Plans not syncing?

- Verify `LEMONSQUEEZY_STORE_ID` is correct
- Check API key has correct permissions
- Ensure products are published (not draft)

### Subscription not updating?

- Check webhook events are being received
- Look at `processingError` field in `WebhookEvents` table
- Verify user_id is being passed in checkout custom data

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create products in LemonSqueezy
3. ✅ Configure webhooks
4. ✅ Test complete flow
5. 🔄 Integrate usage tracking in compiler
6. 🔄 Add usage tracking to routine edits
7. 🔄 Add usage tracking to AI chat
8. 🔄 Test trial period expiration
9. 🔄 Test subscription cancellation
10. 🔄 Deploy to production

## Support

For issues with:

- **LemonSqueezy**: Contact LemonSqueezy support or check their
  [docs](https://docs.lemonsqueezy.com)
- **Integration Code**: Refer to [CLAUDE.md](./CLAUDE.md) for architecture
  details
- **Database**: Use `bunx drizzle-kit studio` to inspect tables

## Reference Links

- [LemonSqueezy Dashboard](https://app.lemonsqueezy.com)
- [LemonSqueezy API Docs](https://docs.lemonsqueezy.com/api)
- [LemonSqueezy Webhooks Guide](https://docs.lemonsqueezy.com/guides/developer-guide/webhooks)
- [Next.js Billing Tutorial](https://docs.lemonsqueezy.com/guides/tutorials/nextjs-billing)
