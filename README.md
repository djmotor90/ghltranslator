# GHL Translator Integration

A GHL Marketplace integration that enables Russian language support for Go High Level accounts.

## Features

- 🌐 **Language Translation**: Automatically translate GHL interface elements to Russian
- 🔐 **Secure OAuth 2.0**: Secure authentication with GHL accounts
- ⚙️ **Easy Installation**: Install directly from GHL Marketplace
- 🎛️ **Admin Dashboard**: Manage translation settings and preferences
- 📱 **Multi-Account Support**: Support for multiple GHL accounts
- 🔄 **Webhook Integration**: Real-time synchronization with GHL events

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Redis
- **Authentication**: OAuth 2.0 (GHL)
- **API**: RESTful with JWT tokens
- **Frontend**: (Dashboard) React + Vite

## Project Structure

```
ghl-translator/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/                  # Configuration files
│   │   ├── env.ts              # Environment variables
│   │   ├── database.ts          # MongoDB connection
│   │   └── redis.ts             # Redis connection
│   ├── models/                  # Database models
│   │   ├── User.ts             # User model
│   │   ├── Integration.ts       # Integration/Account model
│   │   └── Translation.ts       # Translation cache model
│   ├── controllers/             # Route controllers
│   │   ├── authController.ts   # OAuth & authentication
│   │   ├── accountController.ts # Account management
│   │   └── translationController.ts # Translation management
│   ├── services/               # Business logic
│   │   ├── ghlService.ts       # GHL API interactions
│   │   ├── translationService.ts # Translation engine
│   │   └── webhookService.ts   # Webhook handling
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts             # JWT verification
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/                 # API routes
│   │   ├── auth.ts             # Authentication routes
│   │   ├── accounts.ts         # Account management routes
│   │   └── webhooks.ts         # Webhook routes
│   ├── translations/           # Language files
│   │   ├── en.json            # English strings
│   │   ├── ru.json            # Russian translations
│   │   └── index.ts            # i18n configuration
│   └── utils/                  # Utility functions
│       ├── logger.ts           # Logging utility
│       └── helpers.ts          # Helper functions
├── public/                      # Static files
├── tests/                       # Test files
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Redis instance (optional, for caching)
- GHL Developer Account (for OAuth credentials)

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/kgurinov/Documents/Coding/ghl/translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your GHL API credentials and database URLs

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/logout` - Logout user

### Accounts
- `GET /api/accounts` - List user's integrated accounts
- `GET /api/accounts/:id` - Get account details
- `POST /api/accounts/:id/settings` - Update account settings
- `DELETE /api/accounts/:id` - Disconnect account

### Translations
- `GET /api/translations/:accountId` - Get translation settings
- `PUT /api/translations/:accountId` - Update translations
- `GET /api/translations/status/:accountId` - Get translation status

### Webhooks
- `POST /api/webhooks/ghl` - GHL webhook receiver

## Environment Setup

Create a `.env` file with:

```env
PORT=3001
NODE_ENV=development
DOMAIN=http://localhost:3001

GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REDIRECT_URI=http://localhost:3001/api/auth/callback

MONGODB_URI=mongodb://localhost:27017/ghl-translator
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret
WEBHOOK_SECRET=your_webhook_secret
```

## Development

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Lint
```bash
npm run lint
```

## Marketplace Submission

To publish to GHL Marketplace:

1. Ensure all tests pass
2. Build production bundle
3. Create marketplace listing with required metadata
4. Submit for GHL approval

## Translation Management

The integration supports:
- **Static Translations**: Pre-translated GHL UI elements
- **Dynamic Translations**: User-generated translations
- **Fallback**: Defaults to English if translation unavailable

Russian translations are stored in `src/translations/ru.json`

## Security

- OAuth 2.0 for secure authentication
- JWT tokens for API requests
- Webhook signature verification
- CORS protection
- Helmet for security headers

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.
