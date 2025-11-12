import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  domain: process.env.DOMAIN || 'http://localhost:3001',

  // GHL OAuth
  ghl: {
    clientId: process.env.GHL_CLIENT_ID || '',
    clientSecret: process.env.GHL_CLIENT_SECRET || '',
    redirectUri: process.env.GHL_REDIRECT_URI || 'http://localhost:3001/api/auth/callback',
    apiBaseUrl: process.env.GHL_API_BASE_URL || 'https://api.gohighlevel.com',
  },

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ghl-translator',
    name: process.env.MONGODB_NAME || 'ghl-translator',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this',
    expiry: process.env.JWT_EXPIRY || '7d',
  },

  // Webhooks
  webhook: {
    secret: process.env.WEBHOOK_SECRET || '',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Feature flags
  features: {
    enableTranslation: process.env.ENABLE_TRANSLATION !== 'false',
    enableWebhooks: process.env.ENABLE_WEBHOOKS !== 'false',
  },
};

// Validate required config
export function validateConfig() {
  const required = ['GHL_CLIENT_ID', 'GHL_CLIENT_SECRET', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
