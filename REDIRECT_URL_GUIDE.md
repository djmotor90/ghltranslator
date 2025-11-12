# Redirect URL Quick Reference

## TL;DR

**Redirect URL** = Where GHL sends users after they authorize your app with the auth code.

### What to do:

1. **Go to GHL Marketplace settings** for your app
2. **Add Redirect URL field** with:
   - Development: `http://localhost:3001/api/auth/callback`
   - Production: `https://your-domain.com/api/auth/callback`
3. **Update your `.env`** to match:
   ```
   GHL_REDIRECT_URI=https://your-domain.com/api/auth/callback
   ```
4. **Test the OAuth flow** by visiting:
   ```
   http://localhost:3001/api/auth/login
   ```

---

## Complete Deployment Redirect URLs

Choose based on where you're deploying:

### Option 1: Railway (Recommended - $5/month)
```
https://ghl-translator-production.up.railway.app/api/auth/callback
```

### Option 2: Render
```
https://ghl-translator.onrender.com/api/auth/callback
```

### Option 3: Fly.io
```
https://ghl-translator.fly.dev/api/auth/callback
```

### Option 4: Custom Domain
```
https://translator.yourdomain.com/api/auth/callback
```

### Option 5: Multiple URLs (for staging + production)
Add both in GHL Marketplace settings:
```
https://staging.ghl-translator.com/api/auth/callback
https://ghl-translator.com/api/auth/callback
```

---

## How OAuth Flow Works

```
User installs app → GHL redirects to our login 
→ User clicks authorize 
→ GHL sends auth code to our REDIRECT_URI 
→ We exchange code for access token 
→ We create JWT for user session 
→ User can now use app
```

---

## Common Mistakes

❌ **Typo in redirect URL** - Won't match, OAuth fails
❌ **Using HTTP in production** - Must be HTTPS
❌ **Trailing slash mismatch** - `/callback` ≠ `/callback/`
❌ **Not registering in GHL** - Must add to GHL Marketplace settings
❌ **Using localhost on production** - Won't work, needs real domain
❌ **Forgetting trailing slash consistency** - Be exact!

---

## Verification Checklist

Before submitting to GHL Marketplace:

- [ ] Redirect URL added to GHL Marketplace settings
- [ ] Redirect URL uses HTTPS in production
- [ ] `GHL_REDIRECT_URI` in `.env` matches exactly
- [ ] OAuth flow tested end-to-end
- [ ] User is redirected after authorization
- [ ] JWT token is created successfully
- [ ] Error handling shows user-friendly messages

---

## Your Current Setup

**Development:**
- Redirect URI: `http://localhost:3001/api/auth/callback`
- Status: ✅ Ready for local testing

**Production:**
- Redirect URI: `https://your-production-domain.com/api/auth/callback`
- Status: ⏳ Need to:
  1. Choose hosting provider (Railway recommended)
  2. Deploy app
  3. Add production URL to GHL Marketplace
  4. Update `.env` with production values

---

## Next: Deploy to Production

Ready to deploy? See `DEPLOYMENT.md` for step-by-step Railway setup.
