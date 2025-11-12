<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Status
✅ Project Scaffolding Complete
✅ Dependencies Installed
✅ TypeScript Configuration Complete
✅ Core Services Implemented
✅ Database Models Created
✅ API Routes Configured
✅ Authentication System Set Up
✅ Project Builds Successfully

## Project Overview
**GHL Translator Integration** - A marketplace integration for Go High Level that enables Russian language support for user accounts.

### Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Redis (caching)
- **Authentication**: OAuth 2.0 (GHL) + JWT
- **API**: RESTful with 11 endpoints
- **Language**: TypeScript 5.3
- **Runtime**: ES2020

### Key Features Implemented
1. **OAuth 2.0 Authentication** - Secure GHL account integration
2. **Translation Service** - Caching and translation management
3. **Account Management** - Multi-account support with per-account settings
4. **Translation API** - Import, export, and manage translations
5. **Admin Dashboard** - User-friendly interface (ready for frontend)
6. **Database Models** - User, Integration, Translation schemas

## Development Guidelines

### Running the Project
```bash
npm run dev          # Start development server with hot-reload
npm run build        # Compile TypeScript
npm start            # Run production server
```

### Adding New Features
1. Create controller in `src/controllers/`
2. Add service logic in `src/services/`
3. Create/update database model in `src/models/`
4. Add API routes in `src/routes/`
5. Update middleware if needed
6. Test with `npm test`

### File Structure
- `src/config/` - Configuration and connections
- `src/controllers/` - Request handlers
- `src/models/` - MongoDB schemas
- `src/services/` - Business logic
- `src/middleware/` - Express middleware
- `src/routes/` - API route definitions
- `src/translations/` - Language files (en.json, ru.json)
- `src/utils/` - Utility functions (logger, helpers)

### Next Steps
1. Create React dashboard (`src/dashboard/` or separate repo)
2. Implement webhook handlers for GHL events
3. Add data export/import functionality
4. Set up Docker configuration
5. Configure CI/CD pipeline
6. Submit to GHL Marketplace

### Environment Variables Required
- `GHL_CLIENT_ID` - GHL OAuth client ID
- `GHL_CLIENT_SECRET` - GHL OAuth secret
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- See `.env.example` for all variables

### API Documentation
See `MARKETPLACE.md` for complete API documentation and usage examples.

### Notes for Contributors
- Use TypeScript strict mode
- Follow Express middleware patterns
- Write async/await code (no callbacks)
- Use logger utility for all logging
- Validate inputs in controllers
- Handle errors gracefully
- Document API endpoints in MARKETPLACE.md
