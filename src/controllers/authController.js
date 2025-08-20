/**
 * Authentication Controller with MTProto Integration
 * Handles HTTP requests for user authentication
 */

const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

class AuthController {
    /**
     * Rate limiting for authentication endpoints
     */
    static rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        message: 'Too many authentication attempts, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });

    /**
     * Register new user with MTProto encryption
     */
    static async register(req, res) {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { firstName, lastName, email, password, phone, gender, birthDate } = req.body;

            // Validate required fields
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Register user with encrypted data
            const result = await authService.register({
                firstName,
                lastName,
                email,
                password,
                phone,
                gender,
                birthDate
            });

            // Set secure session cookie
            req.session.userId = result.userId;
            req.session.sessionId = result.sessionId;

            res.status(201).json({
                success: true,
                message: 'User registered successfully with MTProto encryption',
                data: {
                    userId: result.userId,
                    sessionId: result.sessionId
                }
            });

        } catch (error) {
            console.error('Registration controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    /**
     * Login user with MTProto decryption
     */
    static async login(req, res) {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password, rememberMe } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Authenticate user
            const result = await authService.login({
                email,
                password
            });

            // Set session with appropriate duration
            const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
            req.session.userId = result.user.id;
            req.session.sessionId = result.sessionId;
            req.session.maxAge = sessionDuration;
            
            console.log('Login: Set session userId:', req.session.userId, 'sessionId:', req.session.sessionId);

            // Force session save
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                } else {
                    console.log('Session saved successfully');
                }
                
                res.json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            id: result.user.id,
                            firstName: result.user.firstName,
                            lastName: result.user.lastName,
                            email: result.user.email,
                            profile: result.user.profile
                        },
                        sessionId: result.sessionId
                    }
                });
            });

        } catch (error) {
            console.error('Login controller error:', error);
            
            if (error.message.includes('User not found') || error.message.includes('Invalid credentials')) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    /**
     * Logout user and clean sessions
     */
    static async logout(req, res) {
        try {
            const userId = req.session.userId;

            if (userId) {
                await authService.logout(userId);
            }

            // Destroy session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                }
            });

            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    /**
     * Check authentication status
     */
    static async checkAuth(req, res) {
        try {
            const userId = req.session.userId;
            const sessionId = req.session.sessionId;

            if (!userId || !sessionId) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authenticated'
                });
            }

            // Verify session in Redis (optional additional check)
            // const sessionData = await authService.getSession(userId);

            res.json({
                success: true,
                authenticated: true,
                userId: userId,
                sessionId: sessionId
            });

        } catch (error) {
            console.error('Auth check error:', error);
            res.status(500).json({
                success: false,
                message: 'Auth check failed'
            });
        }
    }

    /**
     * Refresh session
     */
    static async refreshSession(req, res) {
        try {
            const userId = req.session.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'No active session'
                });
            }

            // Extend session
            req.session.touch();

            res.json({
                success: true,
                message: 'Session refreshed'
            });

        } catch (error) {
            console.error('Session refresh error:', error);
            res.status(500).json({
                success: false,
                message: 'Session refresh failed'
            });
        }
    }

    /**
     * Get user profile (protected route)
     */
    static async getProfile(req, res) {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authenticated'
                });
            }

            // Get user profile from service
            const profile = await authService.getUserProfile(userId);

            res.json({
                success: true,
                data: profile
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile'
            });
        }
    }

    /**
     * Update user profile
     */
    static async updateProfile(req, res) {
        try {
            const userId = req.session.userId;
            const updateData = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authenticated'
                });
            }

            // Update profile with encryption
            const result = await authService.updateProfile(userId, updateData);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: result
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile'
            });
        }
    }
}

module.exports = AuthController;
