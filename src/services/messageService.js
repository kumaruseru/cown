const MessageRepository = require('../repositories/messageRepository');
const UserRepository = require('../repositories/userRepository');
const FileService = require('./fileService');
const NotificationService = require('./notificationService');

class MessageService {
  // Get conversations for a user
  static async getConversations(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const conversations = await MessageRepository.getConversations(userId, limit, offset);
      
      return {
        conversations,
        page,
        limit,
        total: conversations.length
      };
    } catch (error) {
      console.error('MessageService.getConversations error:', error);
      throw error;
    }
  }

  // Get messages in a conversation
  static async getMessages(conversationId, userId, page = 1, limit = 50) {
    try {
      // Check if user has access to this conversation
      const hasAccess = await MessageRepository.checkConversationAccess(conversationId, userId);
      if (!hasAccess) {
        throw new Error('Access denied to this conversation');
      }

      const offset = (page - 1) * limit;
      const messages = await MessageRepository.getMessagesByConversation(conversationId, limit, offset);
      
      return {
        messages,
        page,
        limit,
        total: messages.length
      };
    } catch (error) {
      console.error('MessageService.getMessages error:', error);
      throw error;
    }
  }

  // Send a text message
  static async sendMessage(messageData) {
    try {
      const { senderId, recipientId, content, messageType = 'text' } = messageData;

      // Check if sender is blocked by recipient
      const isBlocked = await UserRepository.isBlocked(recipientId, senderId);
      if (isBlocked) {
        throw new Error('Cannot send message to this user');
      }

      // Create message
      const message = await MessageRepository.create({
        senderId,
        recipientId,
        content,
        messageType,
        createdAt: new Date(),
        isRead: false
      });

      // Send notification
      await NotificationService.sendMessageNotification(recipientId, senderId, content);

      return message;
    } catch (error) {
      console.error('MessageService.sendMessage error:', error);
      throw error;
    }
  }

  // Send message with file attachment
  static async sendMessageWithAttachment(messageData) {
    try {
      const { senderId, recipientId, file } = messageData;

      // Check if sender is blocked by recipient
      const isBlocked = await UserRepository.isBlocked(recipientId, senderId);
      if (isBlocked) {
        throw new Error('Cannot send message to this user');
      }

      // Upload file
      const fileUrl = await FileService.uploadFile(file, 'messages');
      
      // Determine message type based on file
      let messageType = 'file';
      if (file.mimetype.startsWith('image/')) {
        messageType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        messageType = 'video';
      } else if (file.mimetype.startsWith('audio/')) {
        messageType = 'audio';
      }

      // Create message
      const message = await MessageRepository.create({
        senderId,
        recipientId,
        content: file.originalname,
        messageType,
        fileUrl,
        fileSize: file.size,
        fileName: file.originalname,
        createdAt: new Date(),
        isRead: false
      });

      // Send notification
      await NotificationService.sendMessageNotification(recipientId, senderId, `Sent a ${messageType}`);

      return message;
    } catch (error) {
      console.error('MessageService.sendMessageWithAttachment error:', error);
      throw error;
    }
  }

  // Mark message as read
  static async markAsRead(messageId, userId) {
    try {
      const message = await MessageRepository.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Only recipient can mark message as read
      if (message.recipientId !== userId) {
        throw new Error('Unauthorized to mark this message as read');
      }

      await MessageRepository.update(messageId, { 
        isRead: true,
        readAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('MessageService.markAsRead error:', error);
      throw error;
    }
  }

  // Delete message
  static async deleteMessage(messageId, userId) {
    try {
      const message = await MessageRepository.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender can delete message
      if (message.senderId !== userId) {
        throw new Error('Unauthorized to delete this message');
      }

      await MessageRepository.delete(messageId);
      return true;
    } catch (error) {
      console.error('MessageService.deleteMessage error:', error);
      throw error;
    }
  }

  // Edit message
  static async editMessage(messageId, userId, newContent) {
    try {
      const message = await MessageRepository.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender can edit message and only text messages
      if (message.senderId !== userId) {
        throw new Error('Unauthorized to edit this message');
      }

      if (message.messageType !== 'text') {
        throw new Error('Can only edit text messages');
      }

      const updatedMessage = await MessageRepository.update(messageId, { 
        content: newContent,
        editedAt: new Date(),
        isEdited: true
      });

      return updatedMessage;
    } catch (error) {
      console.error('MessageService.editMessage error:', error);
      throw error;
    }
  }

  // Search messages
  static async searchMessages(query, userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const results = await MessageRepository.searchMessages(query, userId, limit, offset);
      
      return {
        messages: results,
        page,
        limit,
        total: results.length
      };
    } catch (error) {
      console.error('MessageService.searchMessages error:', error);
      throw error;
    }
  }

  // Get unread messages count
  static async getUnreadCount(userId) {
    try {
      const count = await MessageRepository.getUnreadCount(userId);
      return count;
    } catch (error) {
      console.error('MessageService.getUnreadCount error:', error);
      throw error;
    }
  }

  // Create group conversation
  static async createGroupConversation(groupData) {
    try {
      const { creatorId, name, description, memberIds } = groupData;

      // Create group conversation
      const group = await MessageRepository.createGroupConversation({
        creatorId,
        name,
        description,
        isGroup: true,
        createdAt: new Date()
      });

      // Add creator and members
      const allMemberIds = [creatorId, ...memberIds];
      await MessageRepository.addGroupMembers(group.id, allMemberIds);

      return group;
    } catch (error) {
      console.error('MessageService.createGroupConversation error:', error);
      throw error;
    }
  }

  // Add member to group
  static async addGroupMember(conversationId, adminId, newMemberId) {
    try {
      // Check if admin has permission
      const isAdmin = await MessageRepository.isGroupAdmin(conversationId, adminId);
      if (!isAdmin) {
        throw new Error('Only group admins can add members');
      }

      await MessageRepository.addGroupMember(conversationId, newMemberId);
      return true;
    } catch (error) {
      console.error('MessageService.addGroupMember error:', error);
      throw error;
    }
  }

  // Remove member from group
  static async removeGroupMember(conversationId, adminId, memberId) {
    try {
      // Check if admin has permission
      const isAdmin = await MessageRepository.isGroupAdmin(conversationId, adminId);
      if (!isAdmin) {
        throw new Error('Only group admins can remove members');
      }

      await MessageRepository.removeGroupMember(conversationId, memberId);
      return true;
    } catch (error) {
      console.error('MessageService.removeGroupMember error:', error);
      throw error;
    }
  }

  // Leave group
  static async leaveGroup(conversationId, userId) {
    try {
      await MessageRepository.removeGroupMember(conversationId, userId);
      return true;
    } catch (error) {
      console.error('MessageService.leaveGroup error:', error);
      throw error;
    }
  }

  // Get message history
  static async getMessageHistory(conversationId, userId, page = 1, limit = 100) {
    try {
      // Check access
      const hasAccess = await MessageRepository.checkConversationAccess(conversationId, userId);
      if (!hasAccess) {
        throw new Error('Access denied to this conversation');
      }

      const offset = (page - 1) * limit;
      const messages = await MessageRepository.getMessageHistory(conversationId, limit, offset);
      
      return {
        messages,
        page,
        limit,
        total: messages.length
      };
    } catch (error) {
      console.error('MessageService.getMessageHistory error:', error);
      throw error;
    }
  }
}

module.exports = MessageService;
