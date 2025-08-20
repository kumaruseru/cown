const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Get conversations list
router.get('/conversations', authMiddleware, MessageController.getConversations);

// Get messages in a conversation
router.get('/conversations/:conversationId', authMiddleware, MessageController.getMessages);

// Send a message
router.post('/send', authMiddleware, MessageController.sendMessage);

// Send message with file attachment
router.post('/send/attachment', authMiddleware, upload.single('file'), MessageController.sendMessageWithAttachment);

// Mark message as read
router.put('/:messageId/read', authMiddleware, MessageController.markAsRead);

// Delete message
router.delete('/:messageId', authMiddleware, MessageController.deleteMessage);

// Edit message
router.put('/:messageId', authMiddleware, MessageController.editMessage);

// Search messages
router.get('/search/:query', authMiddleware, MessageController.searchMessages);

// Get unread messages count
router.get('/unread/count', authMiddleware, MessageController.getUnreadCount);

// Create group conversation
router.post('/group/create', authMiddleware, MessageController.createGroupConversation);

// Add member to group
router.post('/group/:conversationId/members', authMiddleware, MessageController.addGroupMember);

// Remove member from group
router.delete('/group/:conversationId/members/:userId', authMiddleware, MessageController.removeGroupMember);

// Leave group
router.post('/group/:conversationId/leave', authMiddleware, MessageController.leaveGroup);

// Get message history
router.get('/history/:conversationId', authMiddleware, MessageController.getMessageHistory);

module.exports = router;
