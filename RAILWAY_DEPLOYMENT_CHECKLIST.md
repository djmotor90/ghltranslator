# Railway Deployment Checklist

## Before Deployment (5 minutes to prepare)

### Step 1: Gather Information
- [ ] Have your GitHub account ready
- [ ] Have your GHL credentials:
  - Client ID: `6913f9e200420376b9e0cb78-mhvfn5eg`
  - Client Secret: `3e192050-4c5f-4aa7-8f5e-3f089ab34434`
- [ ] Have MongoDB Atlas connection string ready (or create new)
  - Current: `mongodb+srv://kgurinov_db_user:Kkq7SwT9lD1Ml31e@cluster0.x65o87h.mongodb.net/ghl-translator`

### Step 2: Prepare Railway Account
- [ ] Go to https://railway.app
- [ ] Sign up / Login with GitHub
- [ ] Authorize Railway to access GitHub

---

## Deployment Steps (5 minutes to deploy)

### Step 1: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Select your `ghl-translator` repository
4. Select **main** or **master** branch
5. Wait for Railway to scan the project

### Step 2: Configure Environment Variables
Railway will detect `Dockerfile`. Add these env vars in Railway dashboard:

```
PORT=3001
NODE_ENV=production
DOMAIN=https://YOUR_RAILWAY_DOMAIN.railway.app

GHL_CLIENT_ID=6913f9e200420376b9e0cb78-mhvfn5eg
GHL_CLIENT_SECRET=3e192050-4c5f-4aa7-8f5e-3f089ab34434
GHL_REDIRECT_URI=https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/callback
GHL_API_BASE_URL=https://api.gohighlevel.com

MONGODB_URI=mongodb+srv://kgurinov_db_user:Kkq7SwT9lD1Ml31e@cluster0.x65o87h.mongodb.net/ghl-translator
MONGODB_NAME=ghl-translator

REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
LOG_LEVEL=info
```

**Note:** Replace `YOUR_RAILWAY_DOMAIN` with the actual domain Railway gives you (looks like `ghl-translator-production.up.railway.app`)

### Step 3: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Once green ✓, note your domain from Railway dashboard

### Step 4: Verify Deployment
```bash
# Check if app is running
curl https://YOUR_RAILWAY_DOMAIN.railway.app/health

# Should respond with:
# {"status":"ok","timestamp":"..."}
```

---

## After Deployment (5 minutes to configure)

### Step 1: Get Your Railway Domain
- Go to Railway dashboard
- Find your deployment
- Copy the public domain URL

Example: `ghl-translator-production.up.railway.app`

### Step 2: Update GHL Marketplace Settings
1. Go to https://marketplace.gohighlevel.com
2. Edit your "GHL Translator" app
3. Find **OAuth Settings** or **App Credentials**
4. Update **Redirect URL** to:
   ```
   https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/callback
   ```
5. **Save** the changes

### Step 3: Test OAuth Flow
1. Visit: `https://YOUR_RAILWAY_DOMAIN.railway.app/api/auth/login`
2. You should see an OAuth URL with your production domain
3. Copy the OAuth URL
4. Open in a browser
5. Click **Authorize**
6. Should be redirected to callback and authenticated ✓

### Step 4: Check Logs
If something goes wrong:
1. Go to Railway dashboard
2. Click your deployment
3. Go to **Logs** tab
4. Look for errors
5. Share errors for debugging

---

## Troubleshooting

### "Build Failed"
- Check Railway logs for error details
- Make sure all dependencies are in package.json
- Verify Dockerfile exists
- Ensure .gitignore doesn't exclude necessary files

### "App Crashed"
- Check Railway logs
- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure PORT=3001 is set

### "OAuth Redirect Doesn't Work"
- Verify GHL Marketplace redirect URL matches exactly
- Check no typos in the URL
- Ensure HTTPS is used (not HTTP)
- Wait a minute for GHL settings to sync

### "Can't connect to MongoDB"
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas includes Railway IPs
- Try: `mongodb://localhost:6379` for local testing
- Add `0.0.0.0/0` to MongoDB Atlas whitelist

### "SSL Certificate Error"
- Railway handles HTTPS automatically
- Should work without manual configuration
- If issue persists, check Railway certificate in dashboard

---

## Quick Reference

| Item | Value |
|------|-------|
| Railway URL | https://railway.app |
| Project | ghl-translator |
| Port | 3001 |
| Cost | $5/month (minimum) |
| Build Time | 2-3 minutes |
| Redeploy Time | ~1 minute (automatic on git push) |

---

## After Everything Works

Once OAuth succeeds on production:

1. **Test All Endpoints**
   ```bash
   # List accounts
   curl https://YOUR_RAILWAY_DOMAIN.railway.app/api/accounts \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Monitor Logs**
   - Check Railway logs regularly
   - Set up monitoring/alerts

3. **Next Steps**
   - Build React dashboard
   - Test complete user flow
   - Prepare for GHL Marketplace submission

---

## Success Indicators ✅

- [ ] Deployment succeeds in Railway
- [ ] App is running (green ✓ in Railway)
- [ ] Health check returns 200
- [ ] OAuth redirect URL updated in GHL
- [ ] OAuth flow completes without errors
- [ ] User created in MongoDB
- [ ] JWT token generated

---

**Ready? Let's deploy! 🚀**

Go to https://railway.app and create a new project!
