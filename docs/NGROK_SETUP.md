# Ngrok Setup for Webhook Testing

This guide explains how to use ngrok for testing LemonSqueezy webhooks locally.

## What is Ngrok?

Ngrok creates a secure tunnel from a public URL to your local development server, allowing external services (like LemonSqueezy) to send webhooks to your local machine.

## Setup Steps

### 1. Install Ngrok

If you haven't already, install ngrok:
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### 2. Get Your Ngrok Domain

1. Sign up at [ngrok.com](https://ngrok.com)
2. Go to [Cloud Edge > Domains](https://dashboard.ngrok.com/cloud-edge/domains)
3. Create or note your static domain (e.g., `your-subdomain.ngrok-free.app`)

### 3. Configure Environment Variable

Add your ngrok domain to your `.env` file:

```bash
# .env
NGROK_DOMAIN=your-subdomain.ngrok-free.app
```

**Important**: Replace `your-subdomain.ngrok-free.app` with your actual ngrok domain.

### 4. Run Ngrok

Start your Next.js development server:
```bash
npm run dev
```

In a separate terminal, start ngrok:
```bash
npm run ngrok
```

This will create a tunnel from `https://your-subdomain.ngrok-free.app` to `localhost:3000`.

### 5. Configure LemonSqueezy Webhook

1. Go to [LemonSqueezy Settings > Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
2. Create a new webhook endpoint
3. Set the URL to: `https://your-subdomain.ngrok-free.app/api/webhooks/lemonsqueezy`
4. Copy the signing secret and add it to your `.env`:
   ```bash
   LEMONSQUEEZY_WEBHOOK_SECRET=your-signing-secret
   ```
5. Enable these events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_paused`
   - `subscription_unpaused`
   - `subscription_expired`

## Testing Webhooks

1. Make sure both your dev server and ngrok are running
2. Create a test subscription in LemonSqueezy
3. Check your server logs to see the webhook being received
4. Verify the data is being saved to your database

## Troubleshooting

### Webhook Not Received

- Verify ngrok is running and shows the correct domain
- Check that `LEMONSQUEEZY_WEBHOOK_SECRET` matches your LemonSqueezy setting
- Look for errors in your Next.js server console
- Check the webhook logs in LemonSqueezy dashboard

### Signature Verification Failed

- Make sure `LEMONSQUEEZY_WEBHOOK_SECRET` is correctly set in `.env`
- Verify you copied the complete signing secret from LemonSqueezy
- Restart your dev server after updating the `.env` file

### Domain Not Working

- Ensure you're using the free static domain from your ngrok account
- For free accounts, use the format: `your-subdomain.ngrok-free.app`
- Paid accounts can use custom domains

## Production Deployment

In production, you don't need ngrok. Configure your LemonSqueezy webhook to point directly to your production URL:

```
https://yourdomain.com/api/webhooks/lemonsqueezy
```

Make sure to update `LEMONSQUEEZY_WEBHOOK_SECRET` in your production environment variables.
