/**
 * Authentication Middleware with MTProto Session Validation
 */

const authService = require('../services/authService');

/**
 * Middleware to check if user is authenticated for HTML pages
 * Redirects to login page if not authenticated
 */
const requireAuthHTML = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const sessionId = req.session.sessionId;
        
        console.log('AuthMiddleware: Check session userId:', userId, 'sessionId:', sessionId);

        if (!userId || !sessionId) {
            console.log('AuthMiddleware: No session, redirecting to login');
            return res.redirect('/login');
        }

        // Verify session exists in Redis cache
        const sessionExists = await authService.verifySession(userId, sessionId);
        console.log('AuthMiddleware: Session verified:', sessionExists);
        
        if (!sessionExists) {
            // Clear invalid session
            console.log('AuthMiddleware: Invalid session, destroying and redirecting');
            req.session.destroy();
            return res.redirect('/login');
        }

        // Add user info to request object
        req.user = { id: userId };
        req.userId = userId;
        req.sessionId = sessionId;
        
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.redirect('/login');
    }
};

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const sessionId = req.session.sessionId;

        if (!userId || !sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        // Verify session exists in Redis cache
        const sessionExists = await authService.verifySession(userId, sessionId);
        
        if (!sessionExists) {
            // Clear invalid session
            req.session.destroy();
            
            return res.status(401).json({
                success: false,
                message: 'Session expired or invalid',
                code: 'SESSION_INVALID'
            });
        }

        // Add user info to request object
        req.user = { id: userId };
        req.userId = userId;
        req.sessionId = sessionId;
        
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Authentication verification failed',
            code: 'AUTH_ERROR'
        });
    }
};

/**
 * Middleware to check if user is NOT authenticated (for login/register pages)
 */
const requireGuest = (req, res, next) => {
    const userId = req.session.userId;

    if (userId) {
        return res.redirect('/messages'); // Redirect to messages page instead of dashboard
    }

    next();
};

/**
 * Middleware to validate MTProto session
 */
const validateMTProtoSession = async (req, res, next) => {
    try {
        const sessionId = req.session.sessionId;
        
        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'MTProto session required',
                code: 'MTPROTO_SESSION_REQUIRED'
            });
        }

        // Verify MTProto session is valid
        const isValid = await authService.validateMTProtoSession(sessionId);
        
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid MTProto session',
                code: 'MTPROTO_SESSION_INVALID'
            });
        }

        next();

    } catch (error) {
        console.error('MTProto session validation error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'MTProto session validation failed',
            code: 'MTPROTO_VALIDATION_ERROR'
        });
    }
};

/**
 * Middleware for role-based access control
 */
const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required for role check',
                    code: 'AUTH_REQUIRED'
                });
            }

            // Get user role from database
            const userRole = await authService.getUserRole(userId);
            
            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions',
                    code: 'INSUFFICIENT_PERMISSIONS',
                    required: roles,
                    current: userRole
                });
            }

            req.userRole = userRole;
            next();

        } catch (error) {
            console.error('Role validation error:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Role validation failed',
                code: 'ROLE_VALIDATION_ERROR'
            });
        }
    };
};

/**
 * Middleware to refresh session on activity
 */
const refreshSessionOnActivity = (req, res, next) => {
    if (req.session.userId) {
        req.session.touch(); // Refresh session expiry
    }
    next();
};

/**
 * Middleware to log authentication events
 */
const logAuthEvents = (event) => {
    return (req, res, next) => {
        const userId = req.userId || req.session.userId;
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        console.log(`Auth Event: ${event}`, {
            userId,
            ip,
            userAgent,
            timestamp: new Date().toISOString(),
            sessionId: req.session.sessionId
        });

        next();
    };
};

/**
 * Middleware to handle MTProto encryption headers
 */
const handleMTProtoHeaders = (req, res, next) => {
    // Set MTProto-specific headers
    res.setHeader('X-MTProto-Version', '2.0');
    res.setHeader('X-Encryption-Method', 'AES-256-IGE');
    
    // Handle encrypted requests
    if (req.headers['x-mtproto-encrypted'] === 'true') {
        req.isEncrypted = true;
    }

    next();
};

module.exports = {
    requireAuth,
    requireAuthHTML,
    requireGuest,
    validateMTProtoSession,
    requireRole,
    refreshSessionOnActivity,
    logAuthEvents,
    handleMTProtoHeaders
};
