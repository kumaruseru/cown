/**
 * Message Repository
 * Handles database operations for messages with MTProto integration
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');

class MessageRepository {
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

  async create(messageData) {
    await this.initialize();
    const {
      chatId,
      senderId,
      content,
      messageType,
      mediaUrl,
      replyToId,
      isEncrypted,
      encryptionKey
    } = messageData;

    const messageId = this.generateMessageId();
    const timestamp = new Date();

    const [result] = await this.db.execute(
      `INSERT INTO messages 
       (id, chat_id, sender_id, content, message_type, media_url, reply_to_id, 
        is_encrypted, encryption_key, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        messageId, chatId, senderId, content, messageType, mediaUrl, 
        replyToId, isEncrypted, encryptionKey, timestamp, timestamp
      ]
    );

    return this.findById(messageId);
  }

  async findById(messageId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT m.*, u.username as sender_username, u.display_name as sender_display_name
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [messageId]
    );
    return rows[0] || null;
  }

  async findByChatId(chatId, limit = 50, offset = 0) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT m.*, u.username as sender_username, u.display_name as sender_display_name
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ? AND m.is_deleted = 0
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [chatId, limit, offset]
    );
    return rows.reverse(); // Return in chronological order
  }

  async findByUserId(userId, limit = 50, offset = 0) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT m.*, c.name as chat_name, c.type as chat_type
       FROM messages m
       LEFT JOIN chats c ON m.chat_id = c.id
       WHERE m.sender_id = ? AND m.is_deleted = 0
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  async update(messageId, updateData) {
    await this.initialize();
    const {
      content,
      isEdited = true,
      editedAt = new Date()
    } = updateData;

    await this.db.execute(
      `UPDATE messages 
       SET content = ?, is_edited = ?, edited_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [content, isEdited, editedAt, messageId]
    );

    return this.findById(messageId);
  }

  async delete(messageId, userId) {
    await this.initialize();
    await this.db.execute(
      `UPDATE messages 
       SET is_deleted = 1, deleted_at = NOW(), updated_at = NOW()
       WHERE id = ? AND sender_id = ?`,
      [messageId, userId]
    );
  }

  async markAsRead(messageId, userId) {
    await this.initialize();
    await this.db.execute(
      `INSERT INTO message_reads (message_id, user_id, read_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE read_at = NOW()`,
      [messageId, userId]
    );
  }

  async getUnreadCount(chatId, userId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT COUNT(*) as unread_count
       FROM messages m
       LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
       WHERE m.chat_id = ? AND m.sender_id != ? AND mr.message_id IS NULL
       AND m.is_deleted = 0`,
      [userId, chatId, userId]
    );
    return rows[0].unread_count;
  }

  async search(query, chatId = null, limit = 20) {
    await this.initialize();
    let sql = `
      SELECT m.*, u.username as sender_username, u.display_name as sender_display_name,
             c.name as chat_name
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN chats c ON m.chat_id = c.id
      WHERE m.content LIKE ? AND m.is_deleted = 0
    `;
    const params = [`%${query}%`];

    if (chatId) {
      sql += ' AND m.chat_id = ?';
      params.push(chatId);
    }

    sql += ' ORDER BY m.created_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await this.db.execute(sql, params);
    return rows;
  }

  async getMessageThread(replyToId) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT m.*, u.username as sender_username, u.display_name as sender_display_name
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.reply_to_id = ? AND m.is_deleted = 0
       ORDER BY m.created_at ASC`,
      [replyToId]
    );
    return rows;
  }

  async getMediaMessages(chatId, mediaType = 'image', limit = 20) {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT m.*, u.username as sender_username
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ? AND m.message_type = ? AND m.media_url IS NOT NULL
       AND m.is_deleted = 0
       ORDER BY m.created_at DESC
       LIMIT ?`,
      [chatId, mediaType, limit]
    );
    return rows;
  }

  async bulkMarkAsRead(messageIds, userId) {
    await this.initialize();
    if (messageIds.length === 0) return;

    const placeholders = messageIds.map(() => '(?, ?, NOW())').join(', ');
    const values = messageIds.flatMap(id => [id, userId]);

    await this.db.execute(
      `INSERT INTO message_reads (message_id, user_id, read_at)
       VALUES ${placeholders}
       ON DUPLICATE KEY UPDATE read_at = NOW()`,
      values
    );
  }

  async getMessageStats(chatId, timeframe = '24 HOUR') {
    await this.initialize();
    const [rows] = await this.db.execute(
      `SELECT 
         COUNT(*) as total_messages,
         COUNT(DISTINCT sender_id) as active_users,
         AVG(CHAR_LENGTH(content)) as avg_message_length
       FROM messages
       WHERE chat_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${timeframe})
       AND is_deleted = 0`,
      [chatId]
    );
    return rows[0];
  }

  generateMessageId() {
    // Generate a unique message ID similar to Telegram's format
    return crypto.randomBytes(8).toString('hex');
  }

  async close() {
    if (this.db) {
      await this.db.end();
    }
  }
}

module.exports = new MessageRepository();
