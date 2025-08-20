const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  const requestLog = {
    timestamp,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  };

  console.log(`${timestamp} - ${req.method} ${req.url} - ${req.ip}`);

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    
    const responseLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    console.log(`${responseLog.timestamp} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);

    // Write to log file
    const logEntry = {
      request: requestLog,
      response: responseLog
    };

    const logFile = path.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    return originalJson.call(this, body);
  };

  next();
};

module.exports = logger;
