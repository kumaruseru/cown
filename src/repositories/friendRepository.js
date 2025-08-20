/**
 * Friend Repository
 * Handles database operations for friendships and social connections
 */

const mysql = require('mysql2/promise');

class FriendRepository {
  constructor() {
    this.db = null;
  }

  async initialize() {
    if (!this.db) {
      this.db = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'cown1'
      });
    }
  }

  async createFriendRequest(senderId, receiverId) {
    await this.initialize();
    const requestId = this.generateRequestId();
    const timestamp = new Date();

    await this.db.execute(
      `INSERT INTO friend_requests (id, sender_id, receiver_id, status, created_at) 
       VALUES (?, ?, ?, 'pending', ?)`,
      [requestId, senderId, receiverId, timestamp]
    );

    return { id: requestId, senderId, receiverId, status: 'pending', createdAt: timestamp };
  }

  async findRequestById(requestId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT fr.*, 
              s.username as sender_username, s.display_name as sender_display_name,
              r.username as receiver_username, r.display_name as receiver_display_name
       FROM friend_requests fr
       LEFT JOIN users s ON fr.sender_id = s.id
       LEFT JOIN users r ON fr.receiver_id = r.id
       WHERE fr.id = ?`,
      [requestId]
    );
    return rows[0] || null;
  }

  async acceptFriendRequest(requestId) {
    await this.initialize();
    const friendRequest = await this.findRequestById(requestId);
    
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    // Start transaction
    await this.db.beginTransaction();
    
    try {
      // Update friend request status
      await this.db.execute(
        'UPDATE friend_requests SET status = "accepted", updated_at = NOW() WHERE id = ?',
        [requestId]
      );

      // Create friendship (bidirectional)
      const friendshipId1 = this.generateFriendshipId();
      const friendshipId2 = this.generateFriendshipId();
      const timestamp = new Date();

      await this.db.execute(
        `INSERT INTO friendships (id, user_id, friend_id, status, created_at) 
         VALUES (?, ?, ?, 'friends', ?)`,
        [friendshipId1, friendRequest.sender_id, friendRequest.receiver_id, timestamp]
      );

      await this.db.execute(
        `INSERT INTO friendships (id, user_id, friend_id, status, created_at) 
         VALUES (?, ?, ?, 'friends', ?)`,
        [friendshipId2, friendRequest.receiver_id, friendRequest.sender_id, timestamp]
      );

      await this.db.commit();
      
      return {
        id: friendshipId1,
        userId: friendRequest.sender_id,
        friendId: friendRequest.receiver_id,
        status: 'friends',
        createdAt: timestamp
      };
    } catch (error) {
      await this.db.rollback();
      throw error;
    }
  }

  async declineFriendRequest(requestId) {
    await this.initialize();
    await this.db.execute(
      'UPDATE friend_requests SET status = "declined", updated_at = NOW() WHERE id = ?',
      [requestId]
    );
  }

  async cancelFriendRequest(requestId) {
    await this.initialize();
    await this.db.execute(
      'DELETE FROM friend_requests WHERE id = ?',
      [requestId]
    );
  }

  async getFriendship(userId1, userId2) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT * FROM friendships WHERE user_id = ? AND friend_id = ?',
      [userId1, userId2]
    );
    return rows[0] || null;
  }

  async getFriends(userId, page = 1, limit = 20) {
    await this.initialize();
    const offset = (page - 1) * limit;
    
    const [rows] = await this.db.execute(
      `SELECT f.*, u.username, u.display_name, u.avatar_url, u.last_login
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ? AND f.status = 'friends'
       ORDER BY u.display_name ASC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    return rows;
  }

  async getSentRequests(userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT fr.*, u.username, u.display_name, u.avatar_url
       FROM friend_requests fr
       JOIN users u ON fr.receiver_id = u.id
       WHERE fr.sender_id = ? AND fr.status = 'pending'
       ORDER BY fr.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async getReceivedRequests(userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT fr.*, u.username, u.display_name, u.avatar_url
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id = ? AND fr.status = 'pending'
       ORDER BY fr.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async removeFriendship(userId, friendId) {
    await this.initialize();
    
    // Start transaction to remove both sides of friendship
    await this.db.beginTransaction();
    
    try {
      await this.db.execute(
        'DELETE FROM friendships WHERE user_id = ? AND friend_id = ?',
        [userId, friendId]
      );
      
      await this.db.execute(
        'DELETE FROM friendships WHERE user_id = ? AND friend_id = ?',
        [friendId, userId]
      );
      
      await this.db.commit();
    } catch (error) {
      await this.db.rollback();
      throw error;
    }
  }

  async blockUser(userId, targetUserId) {
    await this.initialize();
    const blockId = this.generateBlockId();
    
    await this.db.execute(
      `INSERT INTO user_blocks (id, blocker_id, blocked_id, created_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE created_at = NOW()`,
      [blockId, userId, targetUserId]
    );
  }

  async unblockUser(userId, targetUserId) {
    await this.initialize();
    await this.db.execute(
      'DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?',
      [userId, targetUserId]
    );
  }

  async isBlocked(userId, targetUserId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT COUNT(*) as count FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?',
      [userId, targetUserId]
    );
    return rows[0].count > 0;
  }

  async getBlockedUsers(userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT ub.*, u.username, u.display_name, u.avatar_url
       FROM user_blocks ub
       JOIN users u ON ub.blocked_id = u.id
       WHERE ub.blocker_id = ?
       ORDER BY ub.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async searchFriends(userId, query, limit = 10) {
    await this.initialize();
    const searchTerm = `%${query}%`;
    
    const [rows] = await this.db.execute(
      `SELECT f.*, u.username, u.display_name, u.avatar_url
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ? AND f.status = 'friends'
       AND (u.username LIKE ? OR u.display_name LIKE ?)
       ORDER BY u.display_name ASC
       LIMIT ?`,
      [userId, searchTerm, searchTerm, limit]
    );
    
    return rows;
  }

  async getMutualFriends(userId, targetUserId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT DISTINCT u.id, u.username, u.display_name, u.avatar_url
       FROM friendships f1
       JOIN friendships f2 ON f1.friend_id = f2.friend_id
       JOIN users u ON f1.friend_id = u.id
       WHERE f1.user_id = ? AND f2.user_id = ?
       AND f1.status = 'friends' AND f2.status = 'friends'
       ORDER BY u.display_name ASC`,
      [userId, targetUserId]
    );
    return rows;
  }

  async getFriendSuggestions(userId, limit = 10) {
    await this.initialize();
    
    // Get users who are friends with user's friends but not friends with user
    const [rows] = await this.db.execute(
      `SELECT DISTINCT u.id, u.username, u.display_name, u.avatar_url,
              COUNT(DISTINCT f2.user_id) as mutual_count
       FROM users u
       JOIN friendships f2 ON u.id = f2.friend_id
       JOIN friendships f1 ON f2.user_id = f1.friend_id
       LEFT JOIN friendships existing ON u.id = existing.friend_id AND existing.user_id = ?
       LEFT JOIN user_blocks ub ON u.id = ub.blocked_id AND ub.blocker_id = ?
       LEFT JOIN user_blocks ub2 ON u.id = ub2.blocker_id AND ub2.blocked_id = ?
       WHERE f1.user_id = ? AND f1.status = 'friends' AND f2.status = 'friends'
       AND u.id != ? AND existing.id IS NULL
       AND ub.id IS NULL AND ub2.id IS NULL
       GROUP BY u.id, u.username, u.display_name, u.avatar_url
       ORDER BY mutual_count DESC, u.created_at DESC
       LIMIT ?`,
      [userId, userId, userId, userId, userId, limit]
    );
    
    return rows;
  }

  async getFriendshipStats(userId) {
    await this.initialize();
    
    const [friendsCount] = await this.db.execute(
      'SELECT COUNT(*) as count FROM friendships WHERE user_id = ? AND status = "friends"',
      [userId]
    );
    
    const [sentRequestsCount] = await this.db.execute(
      'SELECT COUNT(*) as count FROM friend_requests WHERE sender_id = ? AND status = "pending"',
      [userId]
    );
    
    const [receivedRequestsCount] = await this.db.execute(
      'SELECT COUNT(*) as count FROM friend_requests WHERE receiver_id = ? AND status = "pending"',
      [userId]
    );
    
    const [blockedUsersCount] = await this.db.execute(
      'SELECT COUNT(*) as count FROM user_blocks WHERE blocker_id = ?',
      [userId]
    );
    
    return {
      friendsCount: friendsCount[0].count,
      sentRequestsCount: sentRequestsCount[0].count,
      receivedRequestsCount: receivedRequestsCount[0].count,
      blockedUsersCount: blockedUsersCount[0].count
    };
  }

  async updatePrivacySettings(userId, settings) {
    await this.initialize();
    
    // Store privacy settings in a separate table or user profile
    const settingsJson = JSON.stringify(settings);
    
    await this.db.execute(
      `INSERT INTO user_privacy_settings (user_id, settings, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE settings = ?, updated_at = NOW()`,
      [userId, settingsJson, settingsJson]
    );
    
    return settings;
  }

  async getPrivacySettings(userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT settings FROM user_privacy_settings WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length > 0) {
      return JSON.parse(rows[0].settings);
    }
    
    return null;
  }

  async getFriendActivity(userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT f.friend_id, u.username, u.display_name, u.last_login, u.is_online
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ? AND f.status = 'friends'
       ORDER BY u.last_login DESC`,
      [userId]
    );
    return rows;
  }

  async getRecentFriends(userId, limit = 5) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT f.*, u.username, u.display_name, u.avatar_url
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ? AND f.status = 'friends'
       ORDER BY f.created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  generateRequestId() {
    return 'freq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateFriendshipId() {
    return 'friendship_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateBlockId() {
    return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async close() {
    if (this.db) {
      await this.db.end();
    }
  }
}

module.exports = new FriendRepository();
