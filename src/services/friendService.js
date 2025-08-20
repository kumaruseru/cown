/**
 * Friend Service
 * Handles friendship management and social connections
 */

const FriendRepository = require('../repositories/friendRepository');
const UserRepository = require('../repositories/userRepository');
const NotificationService = require('./notificationService');

class FriendService {
  // Send friend request
  async sendFriendRequest(senderId, receiverId) {
    // Check if users exist
    const sender = await UserRepository.findById(senderId);
    const receiver = await UserRepository.findById(receiverId);
    
    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    // Check if friendship already exists
    const existingFriendship = await FriendRepository.getFriendship(senderId, receiverId);
    if (existingFriendship) {
      if (existingFriendship.status === 'friends') {
        throw new Error('Users are already friends');
      }
      if (existingFriendship.status === 'pending') {
        throw new Error('Friend request already exists');
      }
      if (existingFriendship.status === 'blocked') {
        throw new Error('Cannot send friend request to blocked user');
      }
    }

    // Create friend request
    const friendRequest = await FriendRepository.createFriendRequest(senderId, receiverId);
    
    // Send notification
    await NotificationService.notifySystem(
      receiverId,
      'New Friend Request',
      `${sender.display_name || sender.username} sent you a friend request`,
      {
        type: 'friend_request',
        senderId,
        requestId: friendRequest.id
      }
    );

    return friendRequest;
  }

  // Accept friend request
  async acceptFriendRequest(requestId, userId) {
    const friendRequest = await FriendRepository.findRequestById(requestId);
    
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }
    
    if (friendRequest.receiver_id !== userId) {
      throw new Error('Not authorized to accept this request');
    }

    if (friendRequest.status !== 'pending') {
      throw new Error('Friend request is not pending');
    }

    // Accept the request
    const friendship = await FriendRepository.acceptFriendRequest(requestId);
    
    // Get sender info for notification
    const sender = await UserRepository.findById(friendRequest.sender_id);
    const receiver = await UserRepository.findById(userId);
    
    // Notify sender that request was accepted
    await NotificationService.notifySystem(
      friendRequest.sender_id,
      'Friend Request Accepted',
      `${receiver.display_name || receiver.username} accepted your friend request`,
      {
        type: 'friend_request_accepted',
        friendId: userId
      }
    );

    return friendship;
  }

  // Decline friend request
  async declineFriendRequest(requestId, userId) {
    const friendRequest = await FriendRepository.findRequestById(requestId);
    
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }
    
    if (friendRequest.receiver_id !== userId) {
      throw new Error('Not authorized to decline this request');
    }

    await FriendRepository.declineFriendRequest(requestId);
  }

  // Cancel sent friend request
  async cancelFriendRequest(requestId, userId) {
    const friendRequest = await FriendRepository.findRequestById(requestId);
    
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }
    
    if (friendRequest.sender_id !== userId) {
      throw new Error('Not authorized to cancel this request');
    }

    await FriendRepository.cancelFriendRequest(requestId);
  }

  // Get friends list
  async getFriendsList(userId, page = 1, limit = 20) {
    return await FriendRepository.getFriends(userId, page, limit);
  }

  // Get pending friend requests
  async getPendingRequests(userId, type = 'received') {
    if (type === 'sent') {
      return await FriendRepository.getSentRequests(userId);
    } else {
      return await FriendRepository.getReceivedRequests(userId);
    }
  }

  // Remove friend
  async removeFriend(userId, friendId) {
    const friendship = await FriendRepository.getFriendship(userId, friendId);
    
    if (!friendship || friendship.status !== 'friends') {
      throw new Error('Friendship not found');
    }

    await FriendRepository.removeFriendship(userId, friendId);
  }

  // Block user
  async blockUser(userId, targetUserId) {
    // Remove existing friendship if exists
    await FriendRepository.removeFriendship(userId, targetUserId);
    
    // Create block relationship
    await FriendRepository.blockUser(userId, targetUserId);
  }

  // Unblock user
  async unblockUser(userId, targetUserId) {
    const blocked = await FriendRepository.isBlocked(userId, targetUserId);
    
    if (!blocked) {
      throw new Error('User is not blocked');
    }

    await FriendRepository.unblockUser(userId, targetUserId);
  }

  // Get blocked users
  async getBlockedUsers(userId) {
    return await FriendRepository.getBlockedUsers(userId);
  }

  // Get friendship status
  async getFriendshipStatus(userId, targetUserId) {
    if (userId === targetUserId) {
      return 'self';
    }

    const friendship = await FriendRepository.getFriendship(userId, targetUserId);
    
    if (!friendship) {
      return 'none';
    }

    // Check if blocked
    const isBlocked = await FriendRepository.isBlocked(userId, targetUserId);
    const isBlockedBy = await FriendRepository.isBlocked(targetUserId, userId);
    
    if (isBlocked) {
      return 'blocked';
    }
    
    if (isBlockedBy) {
      return 'blocked_by';
    }

    return friendship.status;
  }

  // Search friends
  async searchFriends(userId, query, limit = 10) {
    return await FriendRepository.searchFriends(userId, query, limit);
  }

  // Get mutual friends
  async getMutualFriends(userId, targetUserId) {
    return await FriendRepository.getMutualFriends(userId, targetUserId);
  }

  // Get friend suggestions based on mutual friends
  async getFriendSuggestions(userId, limit = 10) {
    const suggestions = await FriendRepository.getFriendSuggestions(userId, limit);
    
    // Add mutual friend count to each suggestion
    for (const suggestion of suggestions) {
      const mutualFriends = await this.getMutualFriends(userId, suggestion.id);
      suggestion.mutualFriendsCount = mutualFriends.length;
    }

    return suggestions;
  }

  // Get friendship statistics
  async getFriendshipStats(userId) {
    const stats = await FriendRepository.getFriendshipStats(userId);
    
    return {
      totalFriends: stats.friendsCount || 0,
      pendingRequestsSent: stats.sentRequestsCount || 0,
      pendingRequestsReceived: stats.receivedRequestsCount || 0,
      blockedUsers: stats.blockedUsersCount || 0
    };
  }

  // Update privacy settings
  async updatePrivacySettings(userId, settings) {
    const allowedSettings = [
      'allowFriendRequests',
      'showMutualFriends',
      'showFriendsList',
      'allowContactByEmail',
      'allowContactByPhone'
    ];

    const filteredSettings = {};
    for (const key of allowedSettings) {
      if (settings[key] !== undefined) {
        filteredSettings[key] = settings[key];
      }
    }

    return await FriendRepository.updatePrivacySettings(userId, filteredSettings);
  }

  // Get privacy settings
  async getPrivacySettings(userId) {
    const settings = await FriendRepository.getPrivacySettings(userId);
    
    // Return default settings if none exist
    return settings || {
      allowFriendRequests: true,
      showMutualFriends: true,
      showFriendsList: true,
      allowContactByEmail: false,
      allowContactByPhone: false
    };
  }

  // Check if users are friends
  async areFriends(userId1, userId2) {
    const friendship = await FriendRepository.getFriendship(userId1, userId2);
    return friendship && friendship.status === 'friends';
  }

  // Get friend activity (last seen, online status)
  async getFriendActivity(userId) {
    return await FriendRepository.getFriendActivity(userId);
  }

  // Get recently added friends
  async getRecentFriends(userId, limit = 5) {
    return await FriendRepository.getRecentFriends(userId, limit);
  }

  // Bulk operations for managing multiple friends
  async bulkRemoveFriends(userId, friendIds) {
    const results = [];
    
    for (const friendId of friendIds) {
      try {
        await this.removeFriend(userId, friendId);
        results.push({ friendId, success: true });
      } catch (error) {
        results.push({ friendId, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Get friend recommendations based on various factors
  async getAdvancedFriendSuggestions(userId, limit = 10) {
    const suggestions = [];
    
    // Get suggestions based on mutual friends
    const mutualFriendSuggestions = await this.getFriendSuggestions(userId, limit);
    suggestions.push(...mutualFriendSuggestions);
    
    // TODO: Add more suggestion algorithms:
    // - Common interests
    // - Location-based suggestions
    // - Imported contacts
    // - Activity-based suggestions
    
    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions.filter((suggestion, index, array) => 
      array.findIndex(s => s.id === suggestion.id) === index
    );
    
    return uniqueSuggestions.slice(0, limit);
  }
}

module.exports = new FriendService();
