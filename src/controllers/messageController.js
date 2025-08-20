const MessageService = require('../services/messageService');
const { validationResult } = require('express-validator');

class MessageController {
  // Get conversations list
  static async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const conversations = await MessageService.getConversations(userId, page, limit);
      
      res.json({ success: true, data: conversations });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get messages in a conversation
  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      
      const messages = await MessageService.getMessages(conversationId, userId, page, limit);
      
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send a message
  static async sendMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { recipientId, content, messageType = 'text' } = req.body;
      
      const message = await MessageService.sendMessage({
        senderId: userId,
        recipientId,
        content,
        messageType
      });
      
      res.json({ 
        success: true, 
        message: 'Message sent successfully',
        data: message 
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send message with file attachment
  static async sendMessageWithAttachment(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.id;
      const { recipientId } = req.body;
      
      const message = await MessageService.sendMessageWithAttachment({
        senderId: userId,
        recipientId,
        file: req.file
      });
      
      res.json({ 
        success: true, 
        message: 'Message with attachment sent successfully',
        data: message 
      });
    } catch (error) {
      console.error('Send message with attachment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Mark message as read
  static async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;
      
      await MessageService.markAsRead(messageId, userId);
      
      res.json({ 
        success: true, 
        message: 'Message marked as read' 
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete message
  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;
      
      await MessageService.deleteMessage(messageId, userId);
      
      res.json({ 
        success: true, 
        message: 'Message deleted successfully' 
      });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Edit message
  static async editMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;
      
      const updatedMessage = await MessageService.editMessage(messageId, userId, content);
      
      res.json({ 
        success: true, 
        message: 'Message updated successfully',
        data: updatedMessage 
      });
    } catch (error) {
      console.error('Edit message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search messages
  static async searchMessages(req, res) {
    try {
      const { query } = req.params;
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const results = await MessageService.searchMessages(query, userId, page, limit);
      
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Search messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get unread messages count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await MessageService.getUnreadCount(userId);
      
      res.json({ success: true, data: { count } });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create group conversation
  static async createGroupConversation(req, res) {
    try {
      const userId = req.user.id;
      const { name, description, memberIds } = req.body;
      
      const group = await MessageService.createGroupConversation({
        creatorId: userId,
        name,
        description,
        memberIds
      });
      
      res.json({ 
        success: true, 
        message: 'Group created successfully',
        data: group 
      });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Add member to group
  static async addGroupMember(req, res) {
    try {
      const { conversationId } = req.params;
      const { userId: newMemberId } = req.body;
      const userId = req.user.id;
      
      await MessageService.addGroupMember(conversationId, userId, newMemberId);
      
      res.json({ 
        success: true, 
        message: 'Member added to group successfully' 
      });
    } catch (error) {
      console.error('Add group member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remove member from group
  static async removeGroupMember(req, res) {
    try {
      const { conversationId, userId: memberId } = req.params;
      const userId = req.user.id;
      
      await MessageService.removeGroupMember(conversationId, userId, memberId);
      
      res.json({ 
        success: true, 
        message: 'Member removed from group successfully' 
      });
    } catch (error) {
      console.error('Remove group member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Leave group
  static async leaveGroup(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;
      
      await MessageService.leaveGroup(conversationId, userId);
      
      res.json({ 
        success: true, 
        message: 'Left group successfully' 
      });
    } catch (error) {
      console.error('Leave group error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get message history
  static async getMessageHistory(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      
      const history = await MessageService.getMessageHistory(conversationId, userId, page, limit);
      
      res.json({ success: true, data: history });
    } catch (error) {
      console.error('Get message history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = MessageController;
