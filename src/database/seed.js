const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const neo4j = require('neo4j-driver');
const bcrypt = require('bcryptjs');
require('dotenv').config();

class DatabaseSeeder {
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

  async seedUsers() {
    console.log('🔄 Seeding users...');

    const users = [
      {
        username: 'admin',
        email: 'admin@cown1.com',
        password: 'Admin123!@#',
        display_name: 'System Administrator',
        bio: 'COWN1 Platform Administrator',
        is_verified: true
      },
      {
        username: 'alice',
        email: 'alice@example.com',
        password: 'Alice123!@#',
        display_name: 'Alice Johnson',
        bio: 'Software developer and tech enthusiast',
        is_verified: true
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: 'Bob123!@#',
        display_name: 'Bob Smith',
        bio: 'Digital artist and designer',
        is_verified: false
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'Charlie123!@#',
        display_name: 'Charlie Brown',
        bio: 'Music producer and sound engineer',
        is_verified: true
      }
    ];

    const userIds = [];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      
      const [result] = await this.mysqlConnection.execute(
        `INSERT INTO users (username, email, password_hash, display_name, bio, is_verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.username, user.email, hashedPassword, user.display_name, user.bio, user.is_verified]
      );

      userIds.push(result.insertId);
      console.log(`✅ Created user: ${user.username} (ID: ${result.insertId})`);
    }

    console.log(`✅ ${users.length} users seeded successfully`);
    return userIds;
  }

  async seedUserProfiles(userIds) {
    console.log('🔄 Seeding user profiles...');

    const db = this.mongoClient.db(process.env.MONGODB_DATABASE || 'cown1');
    const profiles = [
      {
        userId: userIds[0],
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          privacy: 'public'
        },
        metadata: {
          loginCount: 1,
          lastLoginDevice: 'desktop',
          preferredContactMethod: 'email'
        }
      },
      {
        userId: userIds[1],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
          privacy: 'friends'
        },
        metadata: {
          loginCount: 5,
          lastLoginDevice: 'mobile',
          preferredContactMethod: 'chat'
        }
      },
      {
        userId: userIds[2],
        preferences: {
          theme: 'auto',
          language: 'en',
          notifications: false,
          privacy: 'private'
        },
        metadata: {
          loginCount: 2,
          lastLoginDevice: 'tablet',
          preferredContactMethod: 'email'
        }
      },
      {
        userId: userIds[3],
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          privacy: 'public'
        },
        metadata: {
          loginCount: 10,
          lastLoginDevice: 'mobile',
          preferredContactMethod: 'chat'
        }
      }
    ];

    await db.collection('user_profiles').insertMany(profiles);
    console.log(`✅ ${profiles.length} user profiles seeded successfully`);
  }

  async seedFriendships(userIds) {
    console.log('🔄 Seeding friendships...');

    const friendships = [
      { sender_id: userIds[1], receiver_id: userIds[2], status: 'accepted' },
      { sender_id: userIds[1], receiver_id: userIds[3], status: 'accepted' },
      { sender_id: userIds[2], receiver_id: userIds[3], status: 'pending' },
      { sender_id: userIds[0], receiver_id: userIds[1], status: 'accepted' }
    ];

    for (const friendship of friendships) {
      await this.mysqlConnection.execute(
        `INSERT INTO friend_requests (sender_id, receiver_id, status)
         VALUES (?, ?, ?)`,
        [friendship.sender_id, friendship.receiver_id, friendship.status]
      );
    }

    console.log(`✅ ${friendships.length} friendships seeded successfully`);
  }

  async seedMessages(userIds) {
    console.log('🔄 Seeding messages...');

    const messages = [
      {
        sender_id: userIds[1],
        receiver_id: userIds[2],
        content: 'Hey Bob! How are you doing?',
        message_type: 'text'
      },
      {
        sender_id: userIds[2],
        receiver_id: userIds[1],
        content: 'Hi Alice! I\'m doing great, thanks for asking!',
        message_type: 'text'
      },
      {
        sender_id: userIds[1],
        receiver_id: userIds[2],
        content: 'That\'s awesome! Want to grab coffee sometime?',
        message_type: 'text'
      },
      {
        sender_id: userIds[3],
        receiver_id: userIds[1],
        content: 'Check out this new track I\'m working on!',
        message_type: 'text'
      },
      {
        sender_id: userIds[1],
        receiver_id: userIds[3],
        content: 'Wow, that sounds amazing! Can\'t wait to hear it.',
        message_type: 'text'
      }
    ];

    for (const message of messages) {
      await this.mysqlConnection.execute(
        `INSERT INTO messages (sender_id, receiver_id, content, message_type)
         VALUES (?, ?, ?, ?)`,
        [message.sender_id, message.receiver_id, message.content, message.message_type]
      );
    }

    console.log(`✅ ${messages.length} messages seeded successfully`);
  }

  async seedNeo4jRelationships(userIds) {
    console.log('🔄 Seeding Neo4j relationships...');

    const session = this.neo4jDriver.session();

    try {
      // Create user nodes
      for (let i = 0; i < userIds.length; i++) {
        await session.run(
          'CREATE (u:User {id: $id, username: $username, created_at: datetime()})',
          { 
            id: userIds[i], 
            username: ['admin', 'alice', 'bob', 'charlie'][i] 
          }
        );
      }

      // Create friendship relationships
      const relationships = [
        { from: userIds[1], to: userIds[2], type: 'FRIENDS_WITH' },
        { from: userIds[1], to: userIds[3], type: 'FRIENDS_WITH' },
        { from: userIds[0], to: userIds[1], type: 'FRIENDS_WITH' }
      ];

      for (const rel of relationships) {
        await session.run(
          `MATCH (a:User {id: $fromId}), (b:User {id: $toId})
           CREATE (a)-[:${rel.type} {created_at: datetime()}]->(b)`,
          { fromId: rel.from, toId: rel.to }
        );
      }

      console.log('✅ Neo4j relationships seeded successfully');
    } finally {
      await session.close();
    }
  }

  async seedRedisCache() {
    console.log('🔄 Seeding Redis cache...');

    // Set some initial cache values
    await this.redisClient.setEx('cown1:stats:total_users', 3600, '4');
    await this.redisClient.setEx('cown1:stats:total_messages', 3600, '5');
    await this.redisClient.setEx('cown1:stats:active_users_today', 3600, '2');

    // Set some session examples
    await this.redisClient.setEx('cown1:session:example', 7200, JSON.stringify({
      userId: 1,
      username: 'admin',
      loginTime: new Date().toISOString()
    }));

    console.log('✅ Redis cache seeded successfully');
  }

  async seed() {
    try {
      await this.connect();
      
      console.log('🌱 Starting database seeding...');
      
      const userIds = await this.seedUsers();
      await this.seedUserProfiles(userIds);
      await this.seedFriendships(userIds);
      await this.seedMessages(userIds);
      await this.seedNeo4jRelationships(userIds);
      await this.seedRedisCache();

      console.log('🎉 Database seeding completed successfully!');
      console.log('\n📊 Seeded data summary:');
      console.log('  - 4 users created');
      console.log('  - 4 user profiles created');
      console.log('  - 4 friendships created');
      console.log('  - 5 messages created');
      console.log('  - Neo4j relationships established');
      console.log('  - Redis cache populated');
      
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
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

// Run seeding if this file is executed directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.seed()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseSeeder;
