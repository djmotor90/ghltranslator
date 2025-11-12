# GHL Marketplace Setup Guide

## Step 1: Create Your App in GHL Marketplace

1. Go to [GHL Developer Dashboard](https://marketplace.gohighlevel.com/app-builder)
2. Click **"Create New App"**
3. Fill in basic information:
   - **App Name**: `GHL Translator`
   - **Description**: `Translate GHL interface to Russian`
   - **Category**: `Localization` or `Utilities`

## Step 2: Configure OAuth Settings

### OAuth Scopes
In the GHL Marketplace app settings, under **OAuth Scopes**, add:
```
users.read
store/settings.write
```

**Why these scopes?**
- `users.read` - Read user/account information to verify access
- `store/settings.write` - Save the user's language preference to their account

### Redirect URLs ⚠️ CRITICAL
You **MUST** add at least one Redirect URL where GHL will send users after authorization.

#### For Development
```
http://localhost:3001/api/auth/callback
```

#### For Production
When you deploy, add your production URL:
```
https://your-app-domain.com/api/auth/callback
```

**Examples for different hosting:**

**Railway.app**
```
https://ghl-translator-production.up.railway.app/api/auth/callback
```

**Vercel**
```
https://ghl-translator.vercel.app/api/auth/callback
```

**Custom Domain**
```
https://translator.yourdomain.com/api/auth/callback
```

### Important Notes on Redirect URLs
- ✅ **Must use HTTPS** in production (localhost HTTP is OK for dev)
- ✅ **Must match exactly** - typos will break OAuth
- ✅ **Can add multiple URLs** - useful for staging/production
- ❌ **Trailing slash matters** - `/callback` ≠ `/callback/`
- ❌ **Cannot use wildcards** - Must be exact URLs

## Step 3: Configure Your App Environment

### Local Development
Your `.env` file should have:
```bash
GHL_CLIENT_ID=your_ghl_client_id
GHL_CLIENT_SECRET=your_ghl_client_secret
GHL_REDIRECT_URI=http://localhost:3001/api/auth/callback
DOMAIN=http://localhost:3001
```

### Production Deployment
Update `.env` with your production values:
```bash
GHL_CLIENT_ID=your_ghl_client_id
GHL_CLIENT_SECRET=your_ghl_client_secret
GHL_REDIRECT_URI=https://your-production-domain.com/api/auth/callback
DOMAIN=https://your-production-domain.com
NODE_ENV=production
```

## Step 4: Test the OAuth Flow Locally

1. Start your development server:
   ```bash
   npm run dev
   # or
   docker-compose up -d
   ```

2. Navigate to the login endpoint:
   ```
   http://localhost:3001/api/auth/login
   ```

3. You should see the OAuth URL with your client ID and redirect URI:
   ```
   https://api.gohighlevel.com/oauth/authorize?client_id=YOUR_ID&...&scope=users.read+store%2Fsettings.write
   ```

4. The callback will be received at:
   ```
   http://localhost:3001/api/auth/callback?code=...&state=...
   ```

## Step 5: Get Your Credentials

After creating your app in GHL Marketplace, you'll receive:

1. **Client ID** - Unique identifier for your app
2. **Client Secret** - Secret key (keep this private!)
3. **Webhook Secret** - For webhook verification (optional for now)

Save these securely and add to your `.env`:
```bash
GHL_CLIENT_ID=<paste_your_client_id>
GHL_CLIENT_SECRET=<paste_your_client_secret>
```

## Step 6: Before Going Public

Before submitting to GHL Marketplace, verify:

- ✅ Redirect URL is added to GHL settings
- ✅ Client ID and Secret are correct
- ✅ OAuth flow works end-to-end
- ✅ User data is not being modified
- ✅ Only using required scopes
- ✅ Error handling works properly
- ✅ App is deployed to production domain
- ✅ HTTPS is enabled on production

## OAuth Flow Diagram

```
1. User clicks "Install" on GHL Marketplace
   ↓
2. Redirected to: https://api.gohighlevel.com/oauth/authorize?
   client_id=YOUR_ID&
   redirect_uri=YOUR_REDIRECT_URL&
   scope=users.read+store/settings.write
   ↓
3. User logs in and authorizes
   ↓
4. GHL redirects back to YOUR Redirect URL with: 
   YOUR_REDIRECT_URL?code=AUTH_CODE&state=STATE
   ↓
5. Your app exchanges code for token
   ↓
6. Your app stores user info and token
   ↓
7. User can now use the translator app
```

## Troubleshooting

### "Invalid Redirect URI"
- Check spelling and case sensitivity
- Verify no trailing slashes mismatch
- Ensure it's registered in GHL Marketplace settings
- Clear browser cache and try again

### "OAuth callback not working"
- Verify `GHL_REDIRECT_URI` matches GHL Marketplace setting
- Check if your domain is accessible from internet (not localhost)
- Ensure HTTPS in production

### "Client ID/Secret not working"
- Verify you're using the correct credentials
- Check they're not expired in GHL dashboard
- Regenerate if needed

## Next Steps

1. **Get credentials** from GHL Marketplace
2. **Add redirect URL** to GHL settings
3. **Test locally** with `npm run dev`
4. **Deploy to production** (Railway recommended)
5. **Update .env** with production credentials
6. **Submit to marketplace** for approval

## Additional Resources

- [GHL Marketplace Documentation](https://docs.gohighlevel.com/marketplace)
- [OAuth 2.0 Standard](https://tools.ietf.org/html/rfc6749)
- Your app's auth callback handler: `src/controllers/authController.ts`
