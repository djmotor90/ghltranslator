import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Integration } from '../models/Integration.js';
import translationService from '../services/translationService.js';
import logger from '../utils/logger.js';

export const translationController = {
  // Get translations for an account
  async getTranslations(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;
      const { category } = req.query;

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const translations = await translationService.getTranslations(
        accountId,
        category as string | undefined
      );

      res.json(translations);
    } catch (error) {
      logger.error('Error fetching translations:', error);
      res.status(500).json({ error: 'Failed to fetch translations' });
    }
  },

  // Add or update translation
  async addTranslation(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;
      const { key, english, russian, category } = req.body;

      if (!key || !english || !russian || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const translation = await translationService.addTranslation(
        accountId,
        key,
        english,
        russian,
        category,
        req.user?.userId
      );

      res.status(201).json(translation);
    } catch (error) {
      logger.error('Error adding translation:', error);
      res.status(500).json({ error: 'Failed to add translation' });
    }
  },

  // Bulk import translations
  async importTranslations(req: AuthRequest, res: Response) {
    try {
      const { accountId } = req.params;
      const { translations } = req.body;

      if (!Array.isArray(translations) || translations.length === 0) {
        return res.status(400).json({ error: 'Translations array is required' });
      }

      const account = await Integration.findById(accountId);

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Check authorization
      if (account.userId.toString() !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const imported = await translationService.importTranslations(accountId, translations);

      res.json({
        message: 'Translations imported successfully',
        count: imported.length,
      });
    } catch (error) {
      logger.error('Error importing translations:', error);
      res.status(500).json({ error: 'Failed to import translations' });
    }
  },

  // Get translation statistics
  async getStats(req: AuthRequest, res: Response) {
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

      const translations = await translationService.getTranslations(accountId);

      const stats = {
        total: translations.length,
        byCategory: {} as Record<string, number>,
        approved: translations.filter((t) => t.approved).length,
        pending: translations.filter((t) => !t.approved).length,
      };

      translations.forEach((t) => {
        stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + 1;
      });

      res.json(stats);
    } catch (error) {
      logger.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  },
};
