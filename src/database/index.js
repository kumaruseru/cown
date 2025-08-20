const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const neo4j = require('neo4j-driver');
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.mysqlPool = null;
    this.mongoClient = null;
    this.redisClient = null;
    this.neo4jDriver = null;
  }

  // Initialize all database connections
  async initialize() {
    try {
      await this.initMySQL();
      await this.initMongoDB();
      await this.initRedis();
      await this.initNeo4j();
      console.log('✅ All databases connected successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // MySQL Connection
  async initMySQL() {
    try {
      this.mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: process.env.MYSQL_MAX_CONNECTIONS || 20,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      });

      // Test connection
      const connection = await this.mysqlPool.getConnection();
      await connection.ping();
      connection.release();
      
      console.log('✅ MySQL connected');
    } catch (error) {
      console.error('❌ MySQL connection failed:', error);
      throw error;
    }
  }

  // MongoDB Connection
  async initMongoDB() {
    try {
      this.mongoClient = new MongoClient(process.env.MONGODB_URI, {
        maxPoolSize: process.env.MONGODB_MAX_POOL_SIZE || 50,
        serverSelectionTimeoutMS: process.env.MONGODB_TIMEOUT || 10000,
        socketTimeoutMS: 45000,
      });

      await this.mongoClient.connect();
      await this.mongoClient.db().admin().ping();
      
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  // Redis Connection
  async initRedis() {
    try {
      this.redisClient = redis.createClient({
        url: process.env.REDIS_URI,
        socket: {
          connectTimeout: 5000,
          lazyConnect: true
        }
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis connected');
      });

      await this.redisClient.connect();
      await this.redisClient.ping();
      
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  // Neo4j Connection
  async initNeo4j() {
    try {
      this.neo4jDriver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
        {
          maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
        }
      );

      // Test connection
      const session = this.neo4jDriver.session();
      await session.run('RETURN 1');
      await session.close();
      
      console.log('✅ Neo4j connected');
    } catch (error) {
      console.error('❌ Neo4j connection failed:', error);
      throw error;
    }
  }

  // Get MySQL connection
  async getMySQL() {
    if (!this.mysqlPool) {
      await this.initMySQL();
    }
    return this.mysqlPool;
  }

  // Get MongoDB database
  getMongoDB(dbName = 'cown1_profiles') {
    if (!this.mongoClient) {
      throw new Error('MongoDB not initialized');
    }
    return this.mongoClient.db(dbName);
  }

  // Get Redis client
  getRedis() {
    if (!this.redisClient) {
      throw new Error('Redis not initialized');
    }
    return this.redisClient;
  }

  // Get Neo4j session
  getNeo4jSession() {
    if (!this.neo4jDriver) {
      throw new Error('Neo4j not initialized');
    }
    return this.neo4jDriver.session();
  }

  // Close all connections
  async closeAll() {
    try {
      if (this.mysqlPool) {
        await this.mysqlPool.end();
        console.log('MySQL pool closed');
      }

      if (this.mongoClient) {
        await this.mongoClient.close();
        console.log('MongoDB connection closed');
      }

      if (this.redisClient) {
        await this.redisClient.quit();
        console.log('Redis connection closed');
      }

      if (this.neo4jDriver) {
        await this.neo4jDriver.close();
        console.log('Neo4j connection closed');
      }

      console.log('✅ All database connections closed');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
    }
  }

  // Health check for all databases
  async healthCheck() {
    const health = {
      mysql: false,
      mongodb: false,
      redis: false,
      neo4j: false
    };

    try {
      // MySQL health check
      if (this.mysqlPool) {
        const connection = await this.mysqlPool.getConnection();
        await connection.ping();
        connection.release();
        health.mysql = true;
      }
    } catch (error) {
      console.error('MySQL health check failed:', error);
    }

    try {
      // MongoDB health check
      if (this.mongoClient) {
        await this.mongoClient.db().admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      console.error('MongoDB health check failed:', error);
    }

    try {
      // Redis health check
      if (this.redisClient) {
        await this.redisClient.ping();
        health.redis = true;
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    try {
      // Neo4j health check
      if (this.neo4jDriver) {
        const session = this.neo4jDriver.session();
        await session.run('RETURN 1');
        await session.close();
        health.neo4j = true;
      }
    } catch (error) {
      console.error('Neo4j health check failed:', error);
    }

    return health;
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager;
