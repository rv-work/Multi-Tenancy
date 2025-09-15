import express from 'express';
import { upgradeTenant, getTenantInfo } from '../controllers/tenantController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateTenantAccess } from '../middleware/tenant.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/info', getTenantInfo);
router.post('/:slug/upgrade', requireRole('admin'), validateTenantAccess, upgradeTenant);

export default router;
