import express from 'express';
import { 
  updateProfile, 
  updateBasicProfile, 
  updateSkills, 
  updateRequirements,
  getUserById,
  getAllUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (for explore) - must be before /:id
router.get('/all', protect, getAllUsers);

// Profile update routes
router.post('/profile', protect, updateProfile);
router.put('/profile/basic', protect, updateBasicProfile);
router.put('/profile/skills', protect, updateSkills);
router.put('/profile/requirements', protect, updateRequirements);

// Get user by ID
router.get('/:id', protect, getUserById);

export default router;
