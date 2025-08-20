const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friendController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get friends list
router.get('/', authMiddleware, FriendController.getFriends);

// Send friend request
router.post('/request', authMiddleware, FriendController.sendFriendRequest);

// Accept friend request
router.put('/request/:requestId/accept', authMiddleware, FriendController.acceptFriendRequest);

// Decline friend request
router.put('/request/:requestId/decline', authMiddleware, FriendController.declineFriendRequest);

// Get pending friend requests
router.get('/requests/pending', authMiddleware, FriendController.getPendingRequests);

// Get sent friend requests
router.get('/requests/sent', authMiddleware, FriendController.getSentRequests);

// Remove friend
router.delete('/:friendId', authMiddleware, FriendController.removeFriend);

// Get mutual friends
router.get('/:userId/mutual', authMiddleware, FriendController.getMutualFriends);

// Get friend suggestions
router.get('/suggestions', authMiddleware, FriendController.getFriendSuggestions);

// Get online friends
router.get('/online', authMiddleware, FriendController.getOnlineFriends);

module.exports = router;
