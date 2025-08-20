/**
 * Authentication Routes with MTProto Integration
 */

const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { 
    requireAuth, 
    requireGuest, 
    validateMTProtoSession,
    logAuthEvents,
    handleMTProtoHeaders 
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply MTProto headers middleware to all auth routes
router.use(handleMTProtoHeaders);

// Validation rules
const registerValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
    body('birthDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid birth date')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Public routes (guest only)
router.post('/register', 
    requireGuest,
    AuthController.rateLimiter,
    registerValidation,
    logAuthEvents('REGISTER_ATTEMPT'),
    AuthController.register
);

router.post('/login',
    requireGuest,
    AuthController.rateLimiter,
    loginValidation,
    logAuthEvents('LOGIN_ATTEMPT'),
    AuthController.login
);

// Protected routes (authentication required)
router.post('/logout',
    requireAuth,
    logAuthEvents('LOGOUT'),
    AuthController.logout
);

router.get('/profile',
    requireAuth,
    validateMTProtoSession,
    AuthController.getProfile
);

router.put('/profile',
    requireAuth,
    validateMTProtoSession,
    [
        body('firstName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        body('lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        body('phone')
            .optional()
            .isMobilePhone()
            .withMessage('Please provide a valid phone number')
    ],
    logAuthEvents('PROFILE_UPDATE'),
    AuthController.updateProfile
);

router.get('/check',
    AuthController.checkAuth
);

router.post('/refresh',
    requireAuth,
    AuthController.refreshSession
);

// MTProto specific routes
router.post('/mtproto/init',
    requireAuth,
    async (req, res) => {
        try {
            // Initialize MTProto session for authenticated user
            const userId = req.userId;
            const initData = await authService.initializeMTProtoSession(userId);
            
            res.json({
                success: true,
                data: initData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to initialize MTProto session'
            });
        }
    }
);

router.post('/mtproto/verify',
    requireAuth,
    validateMTProtoSession,
    async (req, res) => {
        try {
            const sessionId = req.sessionId;
            const isValid = await authService.verifyMTProtoSession(sessionId);
            
            res.json({
                success: true,
                valid: isValid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to verify MTProto session'
            });
        }
    }
);

// Password reset routes (future implementation)
router.post('/forgot-password',
    requireGuest,
    AuthController.rateLimiter,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email')
    ],
    async (req, res) => {
        // TODO: Implement password reset with MTProto
        res.json({
            success: true,
            message: 'Password reset functionality will be implemented'
        });
    }
);

router.post('/reset-password',
    requireGuest,
    AuthController.rateLimiter,
    [
        body('token').notEmpty().withMessage('Reset token is required'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    ],
    async (req, res) => {
        // TODO: Implement password reset with MTProto
        res.json({
            success: true,
            message: 'Password reset functionality will be implemented'
        });
    }
);

// Error handling middleware for auth routes
router.use((error, req, res, next) => {
    console.error('Auth route error:', error);
    
    res.status(500).json({
        success: false,
        message: 'Authentication service error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
});

module.exports = router;
