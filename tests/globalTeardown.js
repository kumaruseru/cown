const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  console.log('Tearing down test environment...');
  
  // Close MongoDB memory server
  const mongoServer = await MongoMemoryServer.create();
  await mongoServer.stop();
  
  console.log('Test environment teardown complete');
};
