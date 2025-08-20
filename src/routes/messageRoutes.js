const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { single } = require('../middlewares/uploadMiddleware');

// Get conversations list
router.get('/conversations', requireAuth, MessageController.getConversations);

// Get messages in a conversation
router.get('/conversations/:conversationId', requireAuth, MessageController.getMessages);

// Send a message
router.post('/send', requireAuth, MessageController.sendMessage);

// Send message with file attachment
router.post('/send/attachment', requireAuth, single('file'), MessageController.sendMessageWithAttachment);

// Mark message as read
router.put('/:messageId/read', requireAuth, MessageController.markAsRead);

// Delete message
router.delete('/:messageId', requireAuth, MessageController.deleteMessage);

// Edit message
router.put('/:messageId', requireAuth, MessageController.editMessage);

// Search messages
router.get('/search/:query', requireAuth, MessageController.searchMessages);

// Get unread messages count
router.get('/unread/count', requireAuth, MessageController.getUnreadCount);

// Create group conversation
router.post('/group/create', requireAuth, MessageController.createGroupConversation);

// Add member to group
router.post('/group/:conversationId/members', requireAuth, MessageController.addGroupMember);

// Remove member from group
router.delete('/group/:conversationId/members/:userId', requireAuth, MessageController.removeGroupMember);

// Leave group
router.post('/group/:conversationId/leave', requireAuth, MessageController.leaveGroup);

// Get message history
router.get('/history/:conversationId', requireAuth, MessageController.getMessageHistory);

module.exports = router;
