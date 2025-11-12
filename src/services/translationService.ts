import { Translation } from '../models/Translation.js';
import logger from '../utils/logger.js';

interface TranslationEntry {
  key: string;
  english: string;
  russian: string;
  category: string;
}

export class TranslationService {
  private translationCache = new Map<string, Record<string, string>>();

  async cacheTranslations(integrationId: string) {
    try {
      const translations = await Translation.find({ integrationId });
      const cache: Record<string, string> = {};

      translations.forEach((t) => {
        cache[t.key] = t.russian;
      });

      this.translationCache.set(integrationId.toString(), cache);
      return cache;
    } catch (error) {
      logger.error('Error caching translations:', error);
      throw error;
    }
  }

  getTranslation(integrationId: string, key: string): string | undefined {
    const cache = this.translationCache.get(integrationId.toString());
    return cache?.[key];
  }

  async addTranslation(
    integrationId: string,
    key: string,
    english: string,
    russian: string,
    category: string,
    userId?: string
  ) {
    try {
      const translation = await Translation.findOneAndUpdate(
        { integrationId, key },
        {
          integrationId,
          key,
          english,
          russian,
          category,
          lastUpdatedBy: userId,
        },
        { upsert: true, new: true }
      );

      // Update cache
      const cache = this.translationCache.get(integrationId.toString()) || {};
      cache[key] = russian;
      this.translationCache.set(integrationId.toString(), cache);

      return translation;
    } catch (error) {
      logger.error('Error adding translation:', error);
      throw error;
    }
  }

  async getTranslations(integrationId: string, category?: string) {
    try {
      const query: Record<string, unknown> = { integrationId };
      if (category) {
        query.category = category;
      }

      return await Translation.find(query);
    } catch (error) {
      logger.error('Error fetching translations:', error);
      throw error;
    }
  }

  translateObject(obj: Record<string, unknown>, integrationId: string): Record<string, unknown> {
    const translated: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = this.getTranslation(integrationId, key) || value;
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = this.translateObject(value as Record<string, unknown>, integrationId);
      } else {
        translated[key] = value;
      }
    }

    return translated;
  }

  async importTranslations(integrationId: string, translations: TranslationEntry[]) {
    try {
      const results = [];

      for (const t of translations) {
        const translation = await Translation.findOneAndUpdate(
          { integrationId, key: t.key },
          {
            integrationId,
            key: t.key,
            english: t.english,
            russian: t.russian,
            category: t.category,
            source: 'system',
            approved: true,
          },
          { upsert: true, new: true }
        );
        results.push(translation);
      }

      // Refresh cache
      await this.cacheTranslations(integrationId);

      return results;
    } catch (error) {
      logger.error('Error importing translations:', error);
      throw error;
    }
  }
}

export default new TranslationService();
