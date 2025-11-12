# GHL Translator - App Functionality Overview

## What This App Does

**GHL Translator** is a marketplace integration that **translates the Go High Level (GHL) user interface to Russian**.

It translates only the **interface elements** (UI, buttons, labels, menus) - it does **NOT** modify or translate any user data (contacts, opportunities, campaigns, etc.).

## Key Features

### ✅ What IS Included

1. **Interface Translation**
   - Dashboard labels
   - Button text (Save, Cancel, Delete, Edit, Add, Import, Export)
   - Menu items (Contacts, Opportunities, Campaigns, Workflows, Calendar, Reporting, etc.)
   - Settings and configuration text
   - Error messages and notifications
   - Help text and tooltips

2. **User Preferences**
   - Store language preference (English/Russian) per account
   - Enable/disable translation toggle
   - Remember settings across sessions

3. **Translation Management**
   - View available translations
   - Add custom translations
   - Import/export translation files
   - Translation categories for organization

4. **Minimal Permissions**
   - `users.read` - Read account/user information
   - `store/settings.write` - Save user's language preference
   - **NO** access to contacts, opportunities, campaigns, workflows, or any business data

### ❌ What IS NOT Included

- ❌ Does NOT modify or translate contact records
- ❌ Does NOT modify or translate opportunities
- ❌ Does NOT modify or translate campaigns
- ❌ Does NOT modify or translate workflows
- ❌ Does NOT modify or translate calendar events
- ❌ Does NOT access or change any user business data
- ❌ Does NOT fetch custom fields from contacts
- ❌ Does NOT update any account data
- ❌ Does NOT have webhooks for real-time sync (future feature)

## How It Works

### User Journey

1. **Installation**
   - User installs "GHL Translator" from GHL Marketplace
   - Redirected to authorization page

2. **Authorization**
   - User authorizes with minimal scopes:
     - `users.read` - Verify account access
     - `store/settings.write` - Save preferences
   - **No** access to business data

3. **Configuration**
   - User selects their language preference (Russian)
   - Preference is saved to the Integration record in our database
   - Preference is also stored in GHL account settings

4. **Translation**
   - When user logs into GHL, interface loads with Russian text
   - Translation applied client-side or via script injection
   - User can toggle between English and Russian anytime

### Database Structure

**User Collection**
- Stores user profile information
- Links to GHL OAuth tokens

**Integration Collection** (per account)
- `userId` - Link to user
- `ghlAccountId` - GHL account identifier
- `translationEnabled` - Boolean toggle
- `language` - Selected language (en/ru)
- `createdAt` / `updatedAt` - Timestamps

**Translation Collection**
- `integrationId` - Which account
- `key` - Translation key (e.g., "dashboard", "settings")
- `english` - Original English text
- `russian` - Russian translation
- `category` - Organization category
- `custom` - Whether user added it

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/logout` - Logout user

### Accounts (`/api/accounts`)
- `GET /api/accounts` - List user's connected GHL accounts
- `POST /api/accounts/:accountId/enable` - Enable translation for account
- `POST /api/accounts/:accountId/disable` - Disable translation for account
- `PUT /api/accounts/:accountId` - Update account language preference

### Translations (`/api/translations`)
- `GET /api/translations/:accountId` - Get translations for account
- `POST /api/translations/:accountId` - Add/update translation
- `POST /api/translations/:accountId/import` - Bulk import translations
- `GET /api/translations/:accountId/export` - Export translations

## Scope Justification

### Why `users.read`?
- ✅ Needed to identify the user during OAuth callback
- ✅ Verify user has valid GHL account
- ✅ Retrieve user email for record keeping
- ❌ Does NOT read contact data or business information

### Why `store/settings.write`?
- ✅ Needed to save language preference to GHL account
- ✅ Makes preference persistent across sessions
- ✅ Allows GHL to remember user's translation setting
- ❌ Does NOT modify any business settings or data

### Why NOT Other Scopes?
- ❌ No `contacts.read/write` - Don't need to read/modify contacts
- ❌ No `opportunities.read/write` - Don't need to access opportunities
- ❌ No `campaigns.read/write` - Don't need to manage campaigns
- ❌ No `workflows.read/write` - Don't need to manage workflows
- ❌ No `calendar.write` - Don't need to modify calendar events

## Security & Privacy

### What We Store
- User email and GHL account ID
- Language preference (en/ru)
- Translation on/off toggle
- Custom translations (if user adds any)

### What We DON'T Store
- Contact information
- Business data
- Workflows or automations
- Calendar events
- Financial or personal user data

### Permissions Principle
- **Minimal Access** - Only request what's needed
- **Read-Only User Data** - Can only read account info, not modify
- **Settings Only** - Can only write language preferences
- **No Business Data Access** - Zero access to contacts, opportunities, campaigns

## Future Enhancements

The architecture supports adding these features without needing more scopes:

### Planned (No scope change needed)
- Custom UI theme translations
- More languages (Spanish, Portuguese, etc.)
- User-created translation packs
- Export translations as JSON

### Advanced (Would require additional scopes)
- Real-time webhook sync (requires webhook.write)
- Auto-translate contact custom field labels (requires contacts.read)
- Translate workflow names (requires workflows.read)

## Summary

**✅ Your app is INTERFACE-ONLY translation**

It achieves this by:
1. Using minimal OAuth scopes
2. Only storing language preferences
3. Never accessing or modifying user business data
4. Applying translations client-side
5. Respecting user privacy and security

This makes it a **safe, lightweight marketplace integration** that enhances the GHL user experience without touching any sensitive business data.
