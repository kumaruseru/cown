/**
 * User Repository
 * Handles database operations for users
 */

const mysql = require('mysql2/promise');

class UserRepository {
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

  async findById(id) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT id, username, email, display_name, bio, avatar_url, is_active, is_verified, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  async findByUsername(username) {
    await this.initialize();
    const [rows] = await this.db.execute(
      'SELECT id, username, email, display_name, bio, avatar_url, is_active, is_verified, created_at FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  async create(userData) {
    await this.initialize();
    const {
      username,
      email,
      password_hash,
      display_name,
      bio
    } = userData;

    const [result] = await this.db.execute(
      'INSERT INTO users (username, email, password_hash, display_name, bio, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [username, email, password_hash, display_name, bio]
    );

    return this.findById(result.insertId);
  }

  async update(id, updateData) {
    await this.initialize();
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'password_hash') {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await this.db.execute(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async updateLastLogin(id) {
    await this.initialize();
    await this.db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [id]
    );
  }

  async search(query, limit = 10) {
    await this.initialize();
    const searchTerm = `%${query}%`;
    const [rows] = await this.db.execute(
      `SELECT id, username, email, display_name, bio, avatar_url, is_verified 
       FROM users 
       WHERE (username LIKE ? OR display_name LIKE ? OR email LIKE ?) 
       AND is_active = 1 
       LIMIT ?`,
      [searchTerm, searchTerm, searchTerm, limit]
    );
    return rows;
  }

  async delete(id) {
    await this.initialize();
    await this.db.execute(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
  }

  async close() {
    if (this.db) {
      await this.db.end();
    }
  }
}

module.exports = new UserRepository();
