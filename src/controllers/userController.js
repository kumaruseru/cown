const UserService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserService.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const updateData = req.body;
      
      const updatedProfile = await UserService.updateProfile(userId, updateData);
      
      res.json({ 
        success: true, 
        message: 'Profile updated successfully',
        data: updatedProfile 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Upload profile avatar
  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.id;
      const avatarUrl = await UserService.uploadAvatar(userId, req.file);
      
      res.json({ 
        success: true, 
        message: 'Avatar uploaded successfully',
        data: { avatarUrl } 
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search users
  static async searchUsers(req, res) {
    try {
      const { query } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const results = await UserService.searchUsers(query, page, limit);
      
      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user preferences
  static async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await UserService.getPreferences(userId);
      
      res.json({ success: true, data: preferences });
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user preferences
  static async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;
      
      const updatedPreferences = await UserService.updatePreferences(userId, preferences);
      
      res.json({ 
        success: true, 
        message: 'Preferences updated successfully',
        data: updatedPreferences 
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Block user
  static async blockUser(req, res) {
    try {
      const userId = req.user.id;
      const { userId: targetUserId } = req.params;
      
      await UserService.blockUser(userId, targetUserId);
      
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
      const { userId: targetUserId } = req.params;
      
      await UserService.unblockUser(userId, targetUserId);
      
      res.json({ 
        success: true, 
        message: 'User unblocked successfully' 
      });
    } catch (error) {
      console.error('Unblock user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get blocked users
  static async getBlockedUsers(req, res) {
    try {
      const userId = req.user.id;
      const blockedUsers = await UserService.getBlockedUsers(userId);
      
      res.json({ success: true, data: blockedUsers });
    } catch (error) {
      console.error('Get blocked users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user status
  static async updateStatus(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.body;
      
      await UserService.updateStatus(userId, status);
      
      res.json({ 
        success: true, 
        message: 'Status updated successfully' 
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const userId = req.user.id;
      const activity = await UserService.getRecentActivity(userId);
      
      res.json({ success: true, data: activity });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
