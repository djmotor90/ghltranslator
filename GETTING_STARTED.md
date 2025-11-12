# Getting Started - GHL Translator Integration

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- Redis instance (optional, for caching)
- GHL developer account with OAuth credentials

### 2. Installation

```bash
# Clone or navigate to project
cd /Users/kgurinov/Documents/Coding/ghl/translator

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Configure Environment

Edit `.env` file with your values:

```env
# Server
PORT=3001
NODE_ENV=development
DOMAIN=http://localhost:3001

# GHL OAuth - Get from https://app.gohighlevel.com/settings/api
GHL_CLIENT_ID=your_client_id_here
GHL_CLIENT_SECRET=your_client_secret_here
GHL_REDIRECT_URI=http://localhost:3001/api/auth/callback

# Database
MONGODB_URI=mongodb://localhost:27017/ghl-translator
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ghl-translator?retryWrites=true&w=majority

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production

# Webhooks
WEBHOOK_SECRET=your_webhook_secret
```

### 4. Start Development Server

```bash
npm run dev
```

You'll see output like:
```
[2025-11-12T...] [INFO] Database connected successfully
[2025-11-12T...] [INFO] Server running at http://localhost:3001
[2025-11-12T...] [INFO] Environment: development
```

### 5. Test the Server

```bash
# In another terminal
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T..."
}
```

## Development Workflow

### File Structure Overview

```
ghl-translator/
├── src/
│   ├── index.ts                    # Main app entry point
│   ├── config/
│   │   ├── env.ts                 # Configuration loader
│   │   └── database.ts            # MongoDB connection
│   ├── models/                    # Database schemas
│   │   ├── User.ts
│   │   ├── Integration.ts
│   │   └── Translation.ts
│   ├── controllers/               # Route handlers
│   │   ├── authController.ts
│   │   ├── accountController.ts
│   │   └── translationController.ts
│   ├── services/                  # Business logic
│   │   ├── authService.ts
│   │   ├── ghlService.ts
│   │   └── translationService.ts
│   ├── routes/                    # API routes
│   │   ├── auth.ts
│   │   ├── accounts.ts
│   │   └── translations.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── translations/
│   │   ├── en.json
│   │   └── ru.json
│   └── utils/
│       └── logger.ts
├── dist/                          # Compiled output (generated)
├── tests/                         # Test files
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Available Commands

```bash
# Development
npm run dev              # Start dev server with auto-reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production server
npm test                 # Run tests
npm run lint             # Check code style

# Docker
docker-compose up        # Start with MongoDB + Redis + App
docker-compose down      # Stop all containers
```

## API Usage Examples

### 1. Authenticate User

```bash
# Start OAuth flow
curl http://localhost:3001/api/auth/login

# Returns:
# {
#   "oauthUrl": "https://api.gohighlevel.com/oauth/authorize?...",
#   "state": "unique-state-code"
# }

# User visits oauthUrl, authorizes, and gets redirected to callback
# Callback returns JWT token
```

### 2. Add an Account

```bash
# Get your GHL account ID from https://app.gohighlevel.com/settings

curl -X POST http://localhost:3001/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ghlAccountId": "account-123abc",
    "accountName": "My Company"
  }'

# Returns:
# {
#   "_id": "507f1f77bcf86cd799439011",
#   "userId": "507f1f77bcf86cd799439012",
#   "ghlAccountId": "account-123abc",
#   "status": "active",
#   "translationEnabled": true,
#   "preferredLanguage": "ru",
#   ...
# }
```

### 3. Get Accounts

```bash
curl http://localhost:3001/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Add Translation

```bash
curl -X POST http://localhost:3001/api/translations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "dashboard.title",
    "english": "Dashboard",
    "russian": "Панель управления",
    "category": "ui"
  }'
```

### 5. Get Translations

```bash
curl "http://localhost:3001/api/translations/507f1f77bcf86cd799439011?category=ui" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Import Translations

```bash
curl -X POST http://localhost:3001/api/translations/507f1f77bcf86cd799439011/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {
        "key": "dashboard.title",
        "english": "Dashboard",
        "russian": "Панель управления",
        "category": "ui"
      },
      {
        "key": "dashboard.welcome",
        "english": "Welcome",
        "russian": "Добро пожаловать",
        "category": "ui"
      }
    ]
  }'
```

## Connecting to GHL

### Get OAuth Credentials

1. Go to https://app.gohighlevel.com/settings/api
2. Create new OAuth app:
   - **Name**: GHL Translator
   - **Redirect URI**: http://localhost:3001/api/auth/callback
   - **Scopes**: 
     - contacts.write
     - calendar.write
     - opportunities.write
     - workflows.write

3. Copy Client ID and Client Secret into `.env`

### Test OAuth Integration

```bash
# 1. Get OAuth URL
curl http://localhost:3001/api/auth/login

# 2. Visit the URL in browser
# 3. Authorize access
# 4. Get redirected back with token
```

## Database Setup

### Local MongoDB

```bash
# Using Homebrew (macOS)
brew install mongodb-community
brew services start mongodb-community

# Using Docker
docker run -d -p 27017:27017 mongo:7.0

# Using Docker Compose
docker-compose up mongodb
```

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ghl-translator?retryWrites=true&w=majority
   ```

### Check Database Connection

```bash
# MongoDB compass GUI - Download from mongodb.com/products/compass
# Or use mongo shell
mongosh "mongodb://localhost:27017/ghl-translator"

# List databases
show databases

# Select database
use ghl-translator

# List collections
show collections

# Check users
db.users.find()
```

## Debugging

### Enable Debug Logging

```bash
# In .env
LOG_LEVEL=debug

# Or set environment variable
LOG_LEVEL=debug npm run dev
```

### Check Logs

All logs go to console. Look for:
- `[INFO]` - Important events
- `[WARN]` - Warnings
- `[ERROR]` - Errors
- `[DEBUG]` - Detailed debugging (dev only)

### Common Issues

**Port 3001 Already in Use**
```bash
# Find process using port
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

**MongoDB Connection Failed**
- Check MongoDB is running: `mongosh`
- Check connection string in `.env`
- Check credentials if using Atlas

**JWT Token Invalid**
- Token expires after 7 days (JWT_EXPIRY in .env)
- Re-authenticate to get new token
- Check JWT_SECRET is consistent

## Production Deployment

### Using Docker

```bash
# Build image
docker build -t ghl-translator .

# Run container
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  ghl-translator
```

### Using Docker Compose

```bash
# Copy .env to production values
cp .env.example .env.production
# Edit .env.production with production values

# Start all services
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production

Key differences from development:

```env
NODE_ENV=production
DOMAIN=https://ghl-translator.app  # Your production domain

# Use strong secrets
JWT_SECRET=<generate-strong-secret>
WEBHOOK_SECRET=<generate-strong-secret>

# Use production MongoDB
MONGODB_URI=<production-mongodb-uri>

# Use production Redis
REDIS_URL=<production-redis-url>
```

### Health Checks

Application includes health endpoint:

```bash
# Health check
curl http://localhost:3001/health

# Response:
# { "status": "ok", "timestamp": "2025-11-12T..." }
```

## Next Steps

1. **Build Dashboard** - Create React frontend for UI
   - Account management
   - Translation editor
   - Analytics
   
2. **Add More Languages** - Extend translation support
   - Spanish, French, German, etc.
   - Community contributions

3. **Implement Webhooks** - Real-time sync with GHL
   - Listen for account events
   - Auto-translate new content
   
4. **Setup CI/CD** - GitHub Actions pipeline
   - Automated testing
   - Docker builds
   - Deployment automation

5. **Marketplace Submission** - Publish to GHL Marketplace
   - Complete MARKETPLACE.md requirements
   - Test thoroughly
   - Submit to GHL

## Support & Help

- **Documentation**: See README.md for full docs
- **API Docs**: See MARKETPLACE.md for API reference
- **Issues**: Check GitHub issues
- **Questions**: Post in community forum

## Tips & Best Practices

✅ **Always validate user input** - Use middleware and schemas
✅ **Use error handling** - Never let unhandled rejections occur
✅ **Log important events** - Use logger utility
✅ **Cache aggressively** - Use Redis for translations
✅ **Secure tokens** - Use strong JWT_SECRET in production
✅ **Monitor performance** - Check response times
✅ **Backup database** - Especially before updates
✅ **Test thoroughly** - Write tests for new features

---

**Happy coding! 🚀**

For more help, see README.md and MARKETPLACE.md
