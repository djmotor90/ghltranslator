# GHL Translator Integration - Marketplace Submission Guide

## Overview

GHL Translator is a marketplace integration for Go High Level that enables users to automatically translate the entire GHL interface and account content into Russian. This guide provides all information needed to install, configure, and use the integration.

## Features

✅ **Automatic Interface Translation** - Translates GHL dashboard, menus, and UI elements to Russian
✅ **Account-Level Settings** - Per-account language preferences
✅ **Webhook Integration** - Real-time synchronization with GHL events
✅ **Translation Management** - View, edit, and customize translations
✅ **Multi-Account Support** - Manage translations across multiple GHL accounts
✅ **Secure OAuth 2.0** - Industry-standard authentication
✅ **Dashboard** - User-friendly admin panel

## Installation

### Prerequisites
- Active Go High Level account
- Admin access to manage integrations

### Steps

1. **Install from Marketplace**
   - Navigate to GHL Marketplace
   - Search for "GHL Translator"
   - Click "Install"

2. **Authorize Access**
   - You'll be redirected to our authorization page
   - Click "Authorize" to grant required permissions
   - Permissions needed:
     - `users.read` - To read account and user information
     - `store/settings.write` - To save translation preferences and app settings

3. **Configure Translation Settings**
   - Select the GHL account to activate translations
   - Choose your preferred language (currently Russian)
   - Select which sections to translate:
     - Dashboard (recommended)
     - Emails
     - Reports

4. **Enable Translation**
   - Toggle "Enable Translation" to activate
   - The system will begin translating your account

## Usage

### Dashboard Access

After installation, access the translation management dashboard at:
```
https://ghl-translator.app/dashboard
```

#### Main Features

**Account Overview**
- View all connected GHL accounts
- Check translation status
- Monitor sync status

**Translation Settings**
- Toggle translation on/off per account
- Select which sections to translate
- Choose translation style (formal/informal)

**Custom Translations**
- Add custom translations for specific terms
- Override system translations
- Import/export translation files

**Statistics**
- Translation coverage percentage
- Number of translated elements
- Sync history

### API Endpoints

#### Authentication
```bash
GET /api/auth/login
# Initiates OAuth flow

GET /api/auth/callback?code=...
# OAuth callback handler

POST /api/auth/logout
# Logout user
```

#### Accounts
```bash
GET /api/accounts
# List all connected accounts

POST /api/accounts
# Add new account
Body: { ghlAccountId: "string", accountName?: "string" }

GET /api/accounts/:accountId
# Get account details

PUT /api/accounts/:accountId
# Update account settings
Body: { translationEnabled?: boolean, preferredLanguage?: "ru"|"en", settings?: {...} }

DELETE /api/accounts/:accountId
# Disconnect account

GET /api/accounts/:accountId/status
# Get account translation status
```

#### Translations
```bash
GET /api/translations/:accountId?category=ui
# Get translations (optionally filtered by category)

POST /api/translations/:accountId
# Add translation
Body: { key: "string", english: "string", russian: "string", category: "ui"|"email"|"report"|"notification"|"other" }

POST /api/translations/:accountId/import
# Bulk import translations
Body: { translations: [{key, english, russian, category}, ...] }

GET /api/translations/:accountId/stats
# Get translation statistics
```

### Configuration

#### Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3001
NODE_ENV=production
DOMAIN=https://ghl-translator.app

# GHL OAuth
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REDIRECT_URI=https://ghl-translator.app/api/auth/callback
GHL_API_BASE_URL=https://api.gohighlevel.com

# Database
MONGODB_URI=mongodb+srv://user:pass@host/db
MONGODB_NAME=ghl-translator

# Redis (for caching)
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRY=7d

# Webhooks
WEBHOOK_SECRET=your_webhook_secret
```

### Translation Categories

Translations are organized into categories:

- **UI** - Dashboard, menus, buttons, form labels
- **Email** - Email templates, subject lines
- **Report** - Report titles, column headers
- **Notification** - System notifications, alerts
- **Other** - Miscellaneous content

## Integration with GHL Account

### How Translations Are Applied

1. **User enables translation** in account settings
2. **Integration registers webhooks** with GHL to monitor events
3. **GHL sends events** when UI elements are rendered
4. **Our service translates** content on-the-fly
5. **Translations are cached** for performance
6. **User sees translated interface** in real-time

### Webhook Events Monitored

- `contact.created` / `contact.updated` - Contact field translations
- `opportunity.created` / `opportunity.updated` - Opportunity stage translations
- `campaign.*` - Campaign name and description translations
- `workflow.*` - Workflow name translations
- `calendar.*` - Calendar event translations

### Performance & Caching

- Translations are cached in Redis
- Cache invalidates on updates
- Average response time: < 100ms
- Supports up to 50,000 translations per account

## Troubleshooting

### Translation Not Appearing

1. **Check if translation is enabled**
   - Go to Account Settings → Translation Settings
   - Verify "Enable Translation" is toggled ON

2. **Verify account is authorized**
   - Check OAuth tokens are valid
   - Re-authorize if necessary

3. **Clear browser cache**
   - Some browsers cache API responses
   - Try in incognito mode

4. **Check translation coverage**
   - Not all GHL elements may be translated yet
   - Submit missing translations through the dashboard

### Sync Issues

1. **Manual sync**
   - Click "Sync Now" in dashboard
   - Wait 2-3 minutes for completion

2. **Check webhook status**
   - Verify webhooks are active in dashboard
   - Look for error messages in logs

3. **Contact support**
   - If issues persist, reach out to support@ghl-translator.app

## Security & Privacy

### Data Protection
- All data encrypted in transit (HTTPS/TLS)
- Passwords stored with bcrypt hashing
- OAuth tokens stored securely
- No personal data shared with third parties

### Permissions
The integration requires these GHL scopes:
- `contacts.write` - Manage translation data
- `calendar.write` - Translate calendar items
- `opportunities.write` - Translate opportunity stages
- `workflows.write` - Translate workflow names

### Access Control
- Users can only access their own accounts
- Webhook signatures verified for authenticity
- API tokens expire automatically

## Pricing

**Free Tier**
- Up to 5 accounts
- Up to 5,000 translations per account
- Community support

**Pro Tier** ($29/month)
- Unlimited accounts
- Unlimited translations
- Priority support
- Custom translation rules
- Advanced analytics

**Enterprise** (Custom pricing)
- Custom features
- Dedicated support
- SLA guarantee
- Advanced integrations

## Support

### Getting Help

**Email**: support@ghl-translator.app
**Documentation**: https://ghl-translator.app/docs
**Community Forum**: https://community.ghl-translator.app
**GitHub Issues**: https://github.com/ghl-translator/issues

### Common Questions

**Q: Can I use this for other languages besides Russian?**
A: Currently, we support Russian. English is the base language. Other languages coming soon!

**Q: Does translation affect GHL performance?**
A: No, translations are cached and optimized for minimal impact. Most requests return in < 100ms.

**Q: Can I revert translations?**
A: Yes, you can toggle translation off at any time. All original English content will return.

**Q: Is my data backed up?**
A: Yes, all translations are backed up daily. You can export them as JSON anytime.

**Q: What if GHL updates their interface?**
A: We monitor GHL updates and refresh translations automatically. You'll be notified of major changes.

## Development

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/ghl-translator/integration.git
cd ghl-translator

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start dev server
npm run dev

# Server will start at http://localhost:3001
```

### Building for Production

```bash
# Build TypeScript
npm run build

# Run production server
npm start

# Build Docker image
docker build -t ghl-translator .
docker run -d -p 3001:3001 --env-file .env ghl-translator
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Integration tests
npm run test:integration
```

## License

MIT License - See LICENSE file for details

## Changelog

### v1.0.0 (2025-11-12)
- Initial release
- Russian language support
- OAuth 2.0 authentication
- REST API
- Dashboard UI
- Multi-account support
- Translation management
- Webhook integration

---

**Last Updated**: November 12, 2025
**Status**: Ready for Marketplace Submission

For more information, visit: https://ghl-translator.app
