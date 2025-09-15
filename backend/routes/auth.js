import express from 'express';
import { login, logout, getProfile, inviteUser } from '../controllers/authController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);
router.post('/invite', authenticateToken, requireRole('admin'), inviteUser);

export default router;
