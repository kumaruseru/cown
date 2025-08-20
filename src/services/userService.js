const UserRepository = require('../repositories/userRepository');
const FileService = require('./fileService');
const path = require('path');

class UserService {
  // Get user profile
  static async getProfile(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive information
      const { password, ...profile } = user;
      return profile;
    } catch (error) {
      console.error('UserService.getProfile error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = [
        'firstName', 'lastName', 'bio', 'dateOfBirth', 
        'location', 'website', 'phoneNumber'
      ];

      const filteredData = {};
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      filteredData.updatedAt = new Date();

      const updatedUser = await UserRepository.update(userId, filteredData);
      const { password, ...profile } = updatedUser;
      
      return profile;
    } catch (error) {
      console.error('UserService.updateProfile error:', error);
      throw error;
    }
  }

  // Upload user avatar
  static async uploadAvatar(userId, file) {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      }

      // Upload file
      const avatarUrl = await FileService.uploadImage(file, 'avatars');

      // Update user record
      await UserRepository.update(userId, { 
        avatarUrl,
        updatedAt: new Date()
      });

      return avatarUrl;
    } catch (error) {
      console.error('UserService.uploadAvatar error:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return null;
      }

      // Remove sensitive information
      const { password, email, ...publicProfile } = user;
      return publicProfile;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(query, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const results = await UserRepository.search(query, limit, offset);
      
      // Remove sensitive information from all users
      const sanitizedResults = results.map(user => {
        const { password, email, ...publicProfile } = user;
        return publicProfile;
      });

      return {
        users: sanitizedResults,
        page,
        limit,
        total: sanitizedResults.length
      };
    } catch (error) {
      console.error('UserService.searchUsers error:', error);
      throw error;
    }
  }

  // Get user preferences
  static async getPreferences(userId) {
    try {
      const preferences = await UserRepository.getPreferences(userId);
      return preferences || {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sound: true
        },
        privacy: {
          profileVisibility: 'friends',
          messageRequests: true,
          readReceipts: true
        }
      };
    } catch (error) {
      console.error('UserService.getPreferences error:', error);
      throw error;
    }
  }

  // Update user preferences
  static async updatePreferences(userId, preferences) {
    try {
      const updatedPreferences = await UserRepository.updatePreferences(userId, preferences);
      return updatedPreferences;
    } catch (error) {
      console.error('UserService.updatePreferences error:', error);
      throw error;
    }
  }

  // Block user
  static async blockUser(userId, targetUserId) {
    try {
      if (userId === targetUserId) {
        throw new Error('Cannot block yourself');
      }

      await UserRepository.blockUser(userId, targetUserId);
      return true;
    } catch (error) {
      console.error('UserService.blockUser error:', error);
      throw error;
    }
  }

  // Unblock user
  static async unblockUser(userId, targetUserId) {
    try {
      await UserRepository.unblockUser(userId, targetUserId);
      return true;
    } catch (error) {
      console.error('UserService.unblockUser error:', error);
      throw error;
    }
  }

  // Get blocked users
  static async getBlockedUsers(userId) {
    try {
      const blockedUsers = await UserRepository.getBlockedUsers(userId);
      return blockedUsers;
    } catch (error) {
      console.error('UserService.getBlockedUsers error:', error);
      throw error;
    }
  }

  // Update user status
  static async updateStatus(userId, status) {
    try {
      const validStatuses = ['online', 'away', 'busy', 'offline'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      await UserRepository.update(userId, { 
        status,
        lastSeen: new Date(),
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('UserService.updateStatus error:', error);
      throw error;
    }
  }

  // Get recent activity
  static async getRecentActivity(userId) {
    try {
      const activity = await UserRepository.getRecentActivity(userId);
      return activity;
    } catch (error) {
      console.error('UserService.getRecentActivity error:', error);
      throw error;
    }
  }

  // Check if users are friends
  static async areFriends(userId1, userId2) {
    try {
      const friendship = await UserRepository.checkFriendship(userId1, userId2);
      return !!friendship;
    } catch (error) {
      console.error('UserService.areFriends error:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const stats = await UserRepository.getUserStats(userId);
      return stats;
    } catch (error) {
      console.error('UserService.getUserStats error:', error);
      throw error;
    }
  }
}

module.exports = UserService;
