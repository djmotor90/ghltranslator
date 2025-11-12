import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Integration } from '../models/Integration.js';
import translationService from '../services/translationService.js';
import { GHLService } from '../services/ghlService.js';
import logger from '../utils/logger.js';

export const accountController = {
  // Get all integrated accounts
  async getAccounts(req: AuthRequest, res: Response) {
    try {
      const accounts = await Integration.find({ userId: req.user?.userId });
      res.json(accounts);
    } catch (error) {
      logger.error('Error fetching accounts:', error);
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  },

  // Get specific account
  async getAccount(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;
      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(account);
    } catch (error) {
      logger.error('Error fetching account:', error);
      res.status(500).json({ error: 'Failed to fetch account' });
    }
  },

  // Create new integrated account
  async createAccount(req: AuthRequest, res: Response) {
    try {
      const { ghlAccountId, accountName } = req.body;

      if (!ghlAccountId) {
        return res.status(400).json({ error: 'GHL Account ID is required' });
      }

      const integration = await Integration.create({
        userId: req.user?.userId,
        ghlAccountId,
        accountName: accountName || ghlAccountId,
        status: 'active',
        preferredLanguage: 'ru',
      });

      // Cache translations for this account
      await translationService.cacheTranslations((integration._id as any).toString());

      res.status(201).json(integration);
    } catch (error) {
      logger.error('Error creating account:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  },

  // Update account settings
  async updateAccount(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;
      const { translationEnabled, preferredLanguage, settings } = req.body;

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Update fields
      if (translationEnabled !== undefined) {
        account.translationEnabled = translationEnabled;
      }
      if (preferredLanguage) {
        account.preferredLanguage = preferredLanguage;
      }
      if (settings) {
        account.settings = { ...account.settings, ...settings };
      }

      await account.save();
      res.json(account);
    } catch (error) {
      logger.error('Error updating account:', error);
      res.status(500).json({ error: 'Failed to update account' });
    }
  },

  // Delete/disconnect account
  async deleteAccount(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Integration.deleteOne({ _id: accountId });
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      logger.error('Error deleting account:', error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  },

  // Get account status
  async getAccountStatus(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        accountId: account._id,
        status: account.status,
        translationEnabled: account.translationEnabled,
        lastSyncedAt: account.lastSyncedAt,
        translationCount: await translationService.getTranslations(
          (account._id as any).toString()
        ).then((t) => t.length),
      });
    } catch (error) {
      logger.error('Error fetching account status:', error);
      res.status(500).json({ error: 'Failed to fetch status' });
    }
  },
};
