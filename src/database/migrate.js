const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const neo4j = require('neo4j-driver');
require('dotenv').config();

class DatabaseMigrator {
  constructor() {
    this.mysqlConnection = null;
    this.mongoClient = null;
    this.redisClient = null;
    this.neo4jDriver = null;
  }

  async connect() {
    try {
      console.log('🔄 Connecting to databases...');

      // MySQL connection
      this.mysqlConnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'cown1'
      });

      // MongoDB connection
      this.mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
      await this.mongoClient.connect();

      // Redis connection
      this.redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      await this.redisClient.connect();

      // Neo4j connection
      this.neo4jDriver = neo4j.driver(
        process.env.NEO4J_URI || 'bolt://localhost:7687',
        neo4j.auth.basic(
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password'
        )
      );

      console.log('✅ All databases connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async createMySQLTables() {
    console.log('🔄 Creating MySQL tables...');

    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        bio TEXT,
        avatar_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )`,

      // Messages table
      `CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        message_type ENUM('text', 'image', 'file', 'audio', 'video') DEFAULT 'text',
        file_url VARCHAR(255),
        file_size INT,
        is_read BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        reply_to_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL,
        INDEX idx_sender_id (sender_id),
        INDEX idx_receiver_id (receiver_id),
        INDEX idx_created_at (created_at),
        INDEX idx_conversation (sender_id, receiver_id, created_at)
      )`,

      // Friend requests table
      `CREATE TABLE IF NOT EXISTS friend_requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected', 'blocked') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_friendship (sender_id, receiver_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_receiver_id (receiver_id),
        INDEX idx_status (status)
      )`,

      // Sessions table
      `CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(128) PRIMARY KEY,
        user_id INT NOT NULL,
        session_data TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      )`,

      // File uploads table
      `CREATE TABLE IF NOT EXISTS file_uploads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        upload_type ENUM('avatar', 'message_attachment', 'other') DEFAULT 'other',
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_upload_type (upload_type),
        INDEX idx_created_at (created_at)
      )`
    ];

    for (const table of tables) {
      await this.mysqlConnection.execute(table);
    }

    console.log('✅ MySQL tables created successfully');
  }

  async createMongoCollections() {
    console.log('🔄 Creating MongoDB collections...');

    const db = this.mongoClient.db(process.env.MONGODB_DATABASE || 'cown1');

    // User profiles collection
    await db.createCollection('user_profiles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId'],
          properties: {
            userId: { bsonType: 'int', description: 'User ID is required' },
            preferences: {
              bsonType: 'object',
              properties: {
                theme: { bsonType: 'string', enum: ['light', 'dark', 'auto'] },
                language: { bsonType: 'string' },
                notifications: { bsonType: 'bool' }
              }
            },
            metadata: { bsonType: 'object' }
          }
        }
      }
    });

    // Create indexes
    await db.collection('user_profiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('user_profiles').createIndex({ 'preferences.theme': 1 });

    console.log('✅ MongoDB collections created successfully');
  }

  async setupRedisStructure() {
    console.log('🔄 Setting up Redis structure...');

    // Set up Redis key prefixes and structures
    await this.redisClient.set('cown1:system:initialized', '1');
    await this.redisClient.expire('cown1:system:initialized', 86400); // 24 hours

    console.log('✅ Redis structure setup completed');
  }

  async createNeo4jConstraints() {
    console.log('🔄 Creating Neo4j constraints and indexes...');

    const session = this.neo4jDriver.session();

    try {
      // Create constraints
      const constraints = [
        'CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE',
        'CREATE CONSTRAINT user_username_unique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE',
        'CREATE INDEX user_created_at IF NOT EXISTS FOR (u:User) ON (u.created_at)'
      ];

      for (const constraint of constraints) {
        await session.run(constraint);
      }

      console.log('✅ Neo4j constraints created successfully');
    } finally {
      await session.close();
    }
  }

  async migrate() {
    try {
      await this.connect();
      
      await this.createMySQLTables();
      await this.createMongoCollections();
      await this.setupRedisStructure();
      await this.createNeo4jConstraints();

      console.log('🎉 Database migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async disconnect() {
    console.log('🔄 Disconnecting from databases...');

    if (this.mysqlConnection) {
      await this.mysqlConnection.end();
    }

    if (this.mongoClient) {
      await this.mongoClient.close();
    }

    if (this.redisClient) {
      await this.redisClient.quit();
    }

    if (this.neo4jDriver) {
      await this.neo4jDriver.close();
    }

    console.log('✅ All database connections closed');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseMigrator;
