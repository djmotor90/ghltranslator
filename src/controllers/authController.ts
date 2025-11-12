import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import authService from '../services/authService.js';
import { GHLService } from '../services/ghlService.js';
import { Integration } from '../models/Integration.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const authController = {
  // Initiate OAuth flow
  async login(req: AuthRequest, res: Response) {
    try {
      const state = uuidv4();
      const oauthUrl = await authService.getOAuthUrl(state);

      // Store state in session (in production, use secure session storage)
      res.json({ oauthUrl, state });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  // OAuth callback handler
  async callback(req: AuthRequest, res: Response) {
    try {
      const { code, state } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
      }

      // Exchange code for tokens
      const tokens = await authService.exchangeCodeForToken(code as string);

      // Get account info from GHL
      const ghlService = new GHLService(tokens.accessToken);
      const accountInfo = await ghlService.getAccount();

      // Create/update user
      const user = await authService.createOrUpdateUser(
        accountInfo.email,
        accountInfo.id,
        tokens.accessToken,
        tokens.refreshToken
      );

      // Create JWT token
      const jwtToken = jwt.sign(
        {
          userId: user._id,
          ghlId: user.ghlId,
          email: user.email,
        } as any,
        config.jwt.secret as string,
        { expiresIn: config.jwt.expiry } as jwt.SignOptions
      );

      res.json({
        token: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          ghlId: user.ghlId,
        },
      });
    } catch (error: any) {
      logger.error('Callback error:', error);
      
      // Check if it's an auth code expired error
      if (error.response?.status === 404) {
        return res.status(401).json({ 
          error: 'Authentication failed',
          reason: 'Auth code expired or invalid. Please try the authorization flow again.',
          hint: 'Auth codes expire after 10 minutes. Get a fresh one from /api/auth/login'
        });
      }
      
      if (error.response?.status === 400) {
        return res.status(401).json({ 
          error: 'Authentication failed',
          reason: error.response?.data?.error || 'Invalid authorization code',
          hint: 'Please start the OAuth flow again from /api/auth/login'
        });
      }
      
      res.status(401).json({ error: 'Authentication failed' });
    }
  },

  // Logout
  async logout(req: AuthRequest, res: Response) {
    try {
      // In production, invalidate token in blacklist/cache
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  },

  // Get current user
  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      res.json({
        user: {
          id: req.user?.userId,
          ghlId: req.user?.ghlId,
          email: req.user?.email,
        },
      });
    } catch (error) {
      logger.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },
};
