const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  console.log('Setting up test environment...');
  
  // Setup in-memory MongoDB for testing
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.BCRYPT_ROUNDS = '4'; // Lower rounds for faster tests
  
  // Set test database URLs
  process.env.MYSQL_HOST = 'localhost';
  process.env.MYSQL_USER = 'test';
  process.env.MYSQL_PASSWORD = 'test';
  process.env.MYSQL_DATABASE = 'cown1_test';
  
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  process.env.NEO4J_URI = 'bolt://localhost:7687';
  process.env.NEO4J_USER = 'neo4j';
  process.env.NEO4J_PASSWORD = 'test';
  
  console.log('Test environment setup complete');
};
