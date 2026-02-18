import express from 'express';
import { getChatMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:matchId', protect, getChatMessages);
router.post('/:matchId', protect, sendMessage);

export default router;
