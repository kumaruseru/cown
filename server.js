const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const friendRoutes = require('./src/routes/friendRoutes');

// Import middleware
const authMiddleware = require('./src/middlewares/authMiddleware');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client for sessions
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Logging middleware
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, 'src/assets')));
app.use('/images', express.static(path.join(__dirname, 'src/assets/images')));
app.use('/css', express.static(path.join(__dirname, 'src/assets/css')));
app.use('/js', express.static(path.join(__dirname, 'src/assets/js')));
app.use('/fonts', express.static(path.join(__dirname, 'src/assets/fonts')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/friends', authMiddleware, friendRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/register.html'));
});

app.get('/messages', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/messages.html'));
});

app.get('/profile', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/profile.html'));
});

app.get('/friends', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/friends-profile.html'));
});

app.get('/settings', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/settings.html'));
});

app.get('/calls', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/calls.html'));
});

app.get('/discovery', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/discovery.html'));
});

app.get('/maps', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/maps.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/forgot-password.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/reset-password.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 COWN1 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  redisClient.quit();
  process.exit(0);
});

module.exports = app;
