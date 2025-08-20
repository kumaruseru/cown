// Global test setup
require('dotenv').config({ path: '.env.test' });

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Global test utilities
global.testUtils = {
  generateTestUser: () => ({
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test123!@#',
    displayName: 'Test User'
  }),
  
  generateTestMessage: (senderId, receiverId) => ({
    senderId,
    receiverId,
    content: `Test message ${Date.now()}`,
    type: 'text'
  }),
  
  generateTestFriendRequest: (senderId, receiverId) => ({
    senderId,
    receiverId,
    status: 'pending'
  })
};

// Setup test database connection helpers
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
