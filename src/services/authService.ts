import { User } from '../models/User.js';
import axios from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

export class AuthService {
  async getOAuthUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.ghl.clientId,
      redirect_uri: config.ghl.redirectUri,
      response_type: 'code',
      scope: 'users.read store/settings.write',
      state,
    });

    return `${config.ghl.apiBaseUrl}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    try {
      const response = await axios.post(`${config.ghl.apiBaseUrl}/oauth/token`, {
        client_id: config.ghl.clientId,
        client_secret: config.ghl.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.ghl.redirectUri,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      logger.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const response = await axios.post(`${config.ghl.apiBaseUrl}/oauth/token`, {
        client_id: config.ghl.clientId,
        client_secret: config.ghl.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      throw error;
    }
  }

  async createOrUpdateUser(email: string, ghlId: string, accessToken: string, refreshToken?: string) {
    try {
      const user = await User.findOneAndUpdate(
        { ghlId },
        {
          email,
          ghlId,
          accessToken,
          refreshToken: refreshToken || undefined,
        },
        { upsert: true, new: true }
      );

      return user;
    } catch (error) {
      logger.error('Error creating/updating user:', error);
      throw error;
    }
  }

  async getUserByGHLId(ghlId: string) {
    try {
      return await User.findOne({ ghlId });
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw error;
    }
  }
}

export default new AuthService();
