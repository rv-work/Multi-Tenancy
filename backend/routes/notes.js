import express from 'express';
import { 
  createNote, 
  getNotes, 
  getNote, 
  updateNote, 
  deleteNote 
} from '../controllers/noteController.js';
import { authenticateToken } from '../middleware/auth.js';
import { ensureTenantIsolation } from '../middleware/tenant.js';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken);
router.use(ensureTenantIsolation);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
