/**
 * Friend Controller
 * Handles friend-related operations and social connections
 */

const FriendService = require('../services/friendService');
const { validationResult } = require('express-validator');

class FriendController {
  // Send friend request
  static async sendFriendRequest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const senderId = req.user.id;
      const { receiverId } = req.body;

      if (senderId === receiverId) {
        return res.status(400).json({ error: 'Cannot send friend request to yourself' });
      }

      const result = await FriendService.sendFriendRequest(senderId, receiverId);
      
      res.json({ 
        success: true, 
        message: 'Friend request sent successfully',
        data: result 
      });
    } catch (error) {
      console.error('Send friend request error:', error);
      if (error.message.includes('already exists') || error.message.includes('already friends')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Accept friend request
  static async acceptFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { requestId } = req.params;

      const result = await FriendService.acceptFriendRequest(requestId, userId);
      
      res.json({ 
        success: true, 
        message: 'Friend request accepted',
        data: result 
      });
    } catch (error) {
      console.error('Accept friend request error:', error);
      if (error.message.includes('not found') || error.message.includes('not authorized')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Decline friend request
  static async declineFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { requestId } = req.params;

      await FriendService.declineFriendRequest(requestId, userId);
      
      res.json({ 
        success: true, 
        message: 'Friend request declined' 
      });
    } catch (error) {
      console.error('Decline friend request error:', error);
      if (error.message.includes('not found') || error.message.includes('not authorized')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get friends list
  static async getFriendsList(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const friends = await FriendService.getFriendsList(userId, page, limit);
      
      res.json({ success: true, data: friends });
    } catch (error) {
      console.error('Get friends list error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get pending friend requests
  static async getPendingRequests(req, res) {
    try {
      const userId = req.user.id;
      const type = req.query.type || 'received'; // 'sent' or 'received'

      const requests = await FriendService.getPendingRequests(userId, type);
      
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Get pending requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remove friend
  static async removeFriend(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;

      await FriendService.removeFriend(userId, friendId);
      
      res.json({ 
        success: true, 
        message: 'Friend removed successfully' 
      });
    } catch (error) {
      console.error('Remove friend error:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Block user
  static async blockUser(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.body;

      if (userId === targetUserId) {
        return res.status(400).json({ error: 'Cannot block yourself' });
      }

      await FriendService.blockUser(userId, targetUserId);
      
      res.json({ 
        success: true, 
        message: 'User blocked successfully' 
      });
    } catch (error) {
      console.error('Block user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Unblock user
  static async unblockUser(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.params;

      await FriendService.unblockUser(userId, targetUserId);
      
      res.json({ 
        success: true, 
        message: 'User unblocked successfully' 
      });
    } catch (error) {
      console.error('Unblock user error:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get blocked users
  static async getBlockedUsers(req, res) {
    try {
      const userId = req.user.id;

      const blockedUsers = await FriendService.getBlockedUsers(userId);
      
      res.json({ success: true, data: blockedUsers });
    } catch (error) {
      console.error('Get blocked users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Check friendship status
  static async getFriendshipStatus(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.params;

      const status = await FriendService.getFriendshipStatus(userId, targetUserId);
      
      res.json({ success: true, data: { status } });
    } catch (error) {
      console.error('Get friendship status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search for friends
  static async searchFriends(req, res) {
    try {
      const userId = req.user.id;
      const { query } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const results = await FriendService.searchFriends(userId, query, limit);
      
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Search friends error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get mutual friends
  static async getMutualFriends(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.params;

      const mutualFriends = await FriendService.getMutualFriends(userId, targetUserId);
      
      res.json({ success: true, data: mutualFriends });
    } catch (error) {
      console.error('Get mutual friends error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get friend suggestions
  static async getFriendSuggestions(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const suggestions = await FriendService.getFriendSuggestions(userId, limit);
      
      res.json({ success: true, data: suggestions });
    } catch (error) {
      console.error('Get friend suggestions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get friendship statistics
  static async getFriendshipStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await FriendService.getFriendshipStats(userId);
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Get friendship stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Cancel sent friend request
  static async cancelFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { requestId } = req.params;

      await FriendService.cancelFriendRequest(requestId, userId);
      
      res.json({ 
        success: true, 
        message: 'Friend request cancelled' 
      });
    } catch (error) {
      console.error('Cancel friend request error:', error);
      if (error.message.includes('not found') || error.message.includes('not authorized')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update privacy settings
  static async updatePrivacySettings(req, res) {
    try {
      const userId = req.user.id;
      const { settings } = req.body;

      const updatedSettings = await FriendService.updatePrivacySettings(userId, settings);
      
      res.json({ 
        success: true, 
        message: 'Privacy settings updated',
        data: updatedSettings 
      });
    } catch (error) {
      console.error('Update privacy settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get privacy settings
  static async getPrivacySettings(req, res) {
    try {
      const userId = req.user.id;

      const settings = await FriendService.getPrivacySettings(userId);
      
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Get privacy settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FriendController;
