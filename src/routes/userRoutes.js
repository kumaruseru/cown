const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { single } = require('../middlewares/uploadMiddleware');

// Get current user profile
router.get('/profile', requireAuth, UserController.getProfile);

// Update user profile
router.put('/profile', requireAuth, UserController.updateProfile);

// Upload profile avatar
router.post('/avatar', requireAuth, single('avatar'), UserController.uploadAvatar);

// Get user by ID
router.get('/:userId', requireAuth, UserController.getUserById);

// Search users
router.get('/search/:query', requireAuth, UserController.searchUsers);

// Get user settings
router.get('/settings/preferences', requireAuth, UserController.getPreferences);

// Update user settings
router.put('/settings/preferences', requireAuth, UserController.updatePreferences);

// Block/Unblock user
router.post('/:userId/block', requireAuth, UserController.blockUser);
router.delete('/:userId/block', requireAuth, UserController.unblockUser);

// Get blocked users
router.get('/blocked/list', requireAuth, UserController.getBlockedUsers);

// Update user status
router.put('/status', requireAuth, UserController.updateStatus);

// Get user activity
router.get('/activity/recent', requireAuth, UserController.getRecentActivity);

module.exports = router;
