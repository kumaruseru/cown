const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Get current user profile
router.get('/profile', authMiddleware, UserController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, UserController.updateProfile);

// Upload profile avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), UserController.uploadAvatar);

// Get user by ID
router.get('/:userId', authMiddleware, UserController.getUserById);

// Search users
router.get('/search/:query', authMiddleware, UserController.searchUsers);

// Get user settings
router.get('/settings/preferences', authMiddleware, UserController.getPreferences);

// Update user settings
router.put('/settings/preferences', authMiddleware, UserController.updatePreferences);

// Block/Unblock user
router.post('/:userId/block', authMiddleware, UserController.blockUser);
router.delete('/:userId/block', authMiddleware, UserController.unblockUser);

// Get blocked users
router.get('/blocked/list', authMiddleware, UserController.getBlockedUsers);

// Update user status
router.put('/status', authMiddleware, UserController.updateStatus);

// Get user activity
router.get('/activity/recent', authMiddleware, UserController.getRecentActivity);

module.exports = router;
