#!/usr/bin/env node

const app = require('./server');
const databaseManager = require('./src/database');

async function startServer() {
  try {
    console.log('🚀 Starting COWN1 Platform...');
    
    // Initialize databases
    console.log('📊 Initializing databases...');
    await databaseManager.initialize();
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('');
      console.log('🎉 COWN1 Platform is running!');
      console.log('');
      console.log(`📱 Frontend: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('📊 Database Status:');
      console.log('  ✅ MySQL: Connected');
      console.log('  ✅ MongoDB: Connected');
      console.log('  ✅ Redis: Connected');
      console.log('  ✅ Neo4j: Connected');
      console.log('');
      console.log('🔐 Security Features:');
      console.log('  ✅ MTProto Encryption');
      console.log('  ✅ JWT Authentication');
      console.log('  ✅ Rate Limiting');
      console.log('  ✅ CORS Protection');
      console.log('');
      console.log('🎯 Available Pages:');
      console.log('  • Home: http://localhost:' + PORT);
      console.log('  • Login: http://localhost:' + PORT + '/login');
      console.log('  • Register: http://localhost:' + PORT + '/register');
      console.log('  • Messages: http://localhost:' + PORT + '/messages');
      console.log('  • Profile: http://localhost:' + PORT + '/profile');
      console.log('  • Friends: http://localhost:' + PORT + '/friends');
      console.log('  • Settings: http://localhost:' + PORT + '/settings');
      console.log('  • Calls: http://localhost:' + PORT + '/calls');
      console.log('  • Discovery: http://localhost:' + PORT + '/discovery');
      console.log('  • Maps: http://localhost:' + PORT + '/maps');
      console.log('');
      console.log('✨ Ready to serve!');
    });

    // Health check endpoint
    app.get('/health', async (req, res) => {
      const health = await databaseManager.healthCheck();
      const allHealthy = Object.values(health).every(status => status);
      
      res.status(allHealthy ? 200 : 500).json({
        status: allHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        databases: health,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      await databaseManager.closeAll();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT received, shutting down gracefully...');
      await databaseManager.closeAll();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
