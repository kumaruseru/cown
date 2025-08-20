const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
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
const { requireAuth, requireAuthHTML } = require('./src/middlewares/authMiddleware');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client for sessions (optional)
let redisClient = null;

// Try to initialize Redis if available
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', () => {
    // Silently ignore Redis errors
  });
} catch (error) {
  // Redis not available
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'",
        "https://cdn.tailwindcss.com",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],
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

// Session configuration (use memory store for simplicity)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'cown1.sid', // Custom session name
  cookie: {
    secure: false, // Set to false for development (HTTP)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow cookies in same-site requests
  }
}));

// Logging middleware
app.use(logger);

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'src/assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
app.use(express.static(path.join(__dirname, 'src/assets')));
app.use('/images', express.static(path.join(__dirname, 'src/assets/images')));
app.use('/css', express.static(path.join(__dirname, 'src/assets/css')));
app.use('/js', express.static(path.join(__dirname, 'src/assets/js')));
app.use('/fonts', express.static(path.join(__dirname, 'src/assets/fonts')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/messages', requireAuth, messageRoutes);
app.use('/api/friends', requireAuth, friendRoutes);

// Serve HTML pages
// Redirect HTTPS to HTTP for development
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') === 'https') {
    res.redirect('http://' + req.header('host') + req.url);
  } else {
    next();
  }
});

// Welcome/Landing page for non-authenticated users
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/welcome.html'));
});

// Home page - redirect to login if not authenticated, otherwise show dashboard
app.get('/', requireAuthHTML, (req, res) => {
  // If authenticated (passed middleware), show home page
  res.sendFile(path.join(__dirname, 'src/views/pages/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/register.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/register.html'));
});

app.get('/messages', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/messages.html'));
});

app.get('/profile', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/profile.html'));
});

app.get('/friends', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/friends-profile.html'));
});

app.get('/settings', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/settings.html'));
});

app.get('/calls', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/calls.html'));
});

app.get('/discovery', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/discovery.html'));
});

app.get('/maps', requireAuthHTML, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/maps.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/forgot-password.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/pages/reset-password.html'));
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('./package.json').version
  });
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
