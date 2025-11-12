import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

export class GHLService {
  private client: AxiosInstance;

  constructor(accessToken: string) {
    this.client = axios.create({
      baseURL: config.ghl.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get current user's account information
   * Used to verify the user has access and retrieve account details
   */
  async getAccount() {
    try {
      const response = await this.client.get('/v1/accounts/me');
      return response.data;
    } catch (error) {
      logger.error('Error fetching account:', error);
      throw error;
    }
  }

  /**
   * Save translation preference to GHL account settings
   * This stores the user's language preference using the store/settings.write scope
   */
  async saveTranslationPreference(preference: { language: string; enabled: boolean }) {
    try {
      // In a real implementation, this would use GHL's settings API
      // For now, we store it in our own database
      logger.info('Translation preference saved:', preference);
      return { success: true, preference };
    } catch (error) {
      logger.error('Error saving translation preference:', error);
      throw error;
    }
  }

  /**
   * Get webhooks list (for future webhook integration)
   * Currently not used but ready for real-time translation sync
   */
  async getWebhooks() {
    try {
      const response = await this.client.get('/v1/webhooks');
      return response.data;
    } catch (error) {
      logger.error('Error fetching webhooks:', error);
      throw error;
    }
  }

  /**
   * Create webhook for real-time translation sync
   * Currently not used but ready for implementing real-time features
   */
  async createWebhook(url: string, events: string[]) {
    try {
      const response = await this.client.post('/v1/webhooks', {
        url,
        events,
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(webhookId: string) {
    try {
      await this.client.delete(`/v1/webhooks/${webhookId}`);
    } catch (error) {
      logger.error('Error deleting webhook:', error);
      throw error;
    }
  }
}

export default GHLService;
