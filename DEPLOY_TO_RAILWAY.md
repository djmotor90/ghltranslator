# Deploy to Railway in 5 Minutes

## Why Railway?
- ✅ $5/month (cheapest option)
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ HTTPS included
- ✅ MongoDB can be added
- ✅ No credit card needed (if using free tier first)

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" or "Get Started"
3. Sign up with GitHub (easiest)
4. Allow Railway to access your GitHub account

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Connect your GitHub repo `ghl-translator`
4. Select the main/master branch

## Step 3: Configure Environment Variables
Railway will ask for environment variables. Add these:

```
PORT=3001
NODE_ENV=production
DOMAIN=https://YOUR_RAILWAY_DOMAIN.railway.app

GHL_CLIENT_ID=6913f9e200420376b9e0cb78-mhvfn5eg
GHL_CLIENT_SECRET=3e192050-4c5f-4aa7-8f5e-3f089ab34434
GHL_REDIRECT_URI=https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/callback
GHL_API_BASE_URL=https://api.gohighlevel.com

MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
MONGODB_NAME=ghl-translator

REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

Note: Railway will give you YOUR_RAILWAY_DOMAIN - it looks like: `ghl-translator-production.up.railway.app`

## Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Once deployed, you'll see your domain

## Step 5: Update GHL Marketplace Settings
1. Go to https://marketplace.gohighlevel.com
2. Edit your "GHL Translator" app
3. Update Redirect URL to:
   ```
   https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/callback
   ```
4. Save

## Step 6: Test OAuth Flow
1. Visit: `https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/login`
2. Copy the OAuth URL
3. Open in browser
4. Click "Authorize"
5. Should redirect successfully to your Railway app ✓

## Alternative: Use ngrok for Local Testing (Faster for Dev)

If you want to test WITHOUT deploying:

```bash
# 1. Install ngrok
brew install ngrok

# 2. Start ngrok tunnel
ngrok http 3001
# You'll see: Forwarding: https://abc123.ngrok.io -> http://localhost:3001

# 3. Update .env
GHL_REDIRECT_URI=https://abc123.ngrok.io/api/auth/callback
DOMAIN=https://abc123.ngrok.io

# 4. Restart server
docker-compose restart

# 5. Go to GHL Marketplace settings
# Add Redirect URL: https://abc123.ngrok.io/api/auth/callback

# 6. Test OAuth flow
# Visit: https://abc123.ngrok.io/api/auth/login
```

Note: ngrok URLs change when you restart, so you'd need to update GHL settings each time.

## Troubleshooting

### "Redirect URL doesn't match"
- Make sure Railway domain matches exactly in GHL Marketplace
- No typos, case-sensitive
- Include the full URL with `/api/auth/callback`

### "Connection timeout"
- Make sure app is deployed and running on Railway
- Check Railway dashboard for any errors

### "SSL certificate error"
- Railway includes free HTTPS
- Should work automatically
- If issues, check Railway logs

## Cost Breakdown
- **Railway**: $5/month
- **MongoDB Atlas**: Free tier (512MB)
- **Redis**: Included in Railway ($5 covers both)
- **Total**: ~$5/month

## After Deployment
1. Test OAuth flow works on production domain
2. Set NODE_ENV=production in Railway
3. Monitor logs in Railway dashboard
4. When ready, submit app to GHL Marketplace

## Need Help?
- Railway Docs: https://docs.railway.app
- GHL Marketplace: https://docs.gohighlevel.com
- Check logs: Railway Dashboard → Your Project → Deployments → Logs
