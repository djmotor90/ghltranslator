import { Router } from 'express';
import { accountController } from '../controllers/accountController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Account management
router.get('/', accountController.getAccounts);
router.post('/', accountController.createAccount);
router.get('/:accountId', accountController.getAccount);
router.put('/:accountId', accountController.updateAccount);
router.delete('/:accountId', accountController.deleteAccount);
router.get('/:accountId/status', accountController.getAccountStatus);

export default router;
