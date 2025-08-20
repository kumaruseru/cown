const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friendController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Get friends list
router.get('/', requireAuth, FriendController.getFriendsList);

// Send friend request
router.post('/request', requireAuth, FriendController.sendFriendRequest);

// Accept friend request
router.put('/request/:requestId/accept', requireAuth, FriendController.acceptFriendRequest);

// Decline friend request
router.put('/request/:requestId/decline', requireAuth, FriendController.declineFriendRequest);

// Get pending friend requests
router.get('/requests/pending', requireAuth, FriendController.getPendingRequests);

// Get sent friend requests (handled by getPendingRequests with query parameter)
router.get('/requests/sent', requireAuth, FriendController.getPendingRequests);

// Remove friend
router.delete('/:friendId', requireAuth, FriendController.removeFriend);

// Get mutual friends
router.get('/:userId/mutual', requireAuth, FriendController.getMutualFriends);

// Get friend suggestions
router.get('/suggestions', requireAuth, FriendController.getFriendSuggestions);

// Get friend statistics (instead of online friends)
router.get('/stats', requireAuth, FriendController.getFriendshipStats);

module.exports = router;
