import { Router } from 'express';
import { translationController } from '../controllers/translationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Translation management
router.get('/:accountId', translationController.getTranslations);
router.post('/:accountId', translationController.addTranslation);
router.post('/:accountId/import', translationController.importTranslations);
router.get('/:accountId/stats', translationController.getStats);

export default router;
