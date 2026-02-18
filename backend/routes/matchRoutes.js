import express from 'express';
import {
  findPotentialMatches,
  connectWithUser,
  passOnUser,
  getMyMatches,
  getPendingRequests,
  getSentRequests,
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/find', protect, findPotentialMatches);
router.post('/connect', protect, connectWithUser);
router.post('/pass', protect, passOnUser);
router.get('/my', protect, getMyMatches);
router.get('/requests', protect, getPendingRequests);
router.get('/sent', protect, getSentRequests);

export default router;
