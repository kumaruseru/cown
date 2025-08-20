/**
 * Authentication Service with MTProto Encryption
 * Handles user registration and login with cloud database integration
 */

const MTProtoAuth = require('../lib/mtproto/authorizer');
const cryptoMethods = require('../lib/crypto/crypto_methods');
const mysql = require('mysql2/promise');
const mongodb = require('mongodb');
const redis = require('redis');
const bcrypt = require('bcrypt');

class AuthService {
    constructor() {
        this.mtproto = null;
        this.mysql = null;
        this.mongodb = null;
        this.redis = null;
        this.initialized = false;
    }

    /**
     * Initialize all cloud database connections
     */
    async initialize() {
        try {
            // Initialize MTProto
            this.mtproto = new MTProtoAuth({
                api_id: process.env.MTPROTO_API_ID,
                api_hash: process.env.MTPROTO_API_HASH,
                server: {
                    dev: process.env.NODE_ENV !== 'production',
                    useWSS: true
                }
            });

            // Initialize MySQL connection
            this.mysql = await mysql.createConnection({
                uri: process.env.MYSQL_URI,
                ssl: { rejectUnauthorized: false }
            });

            // Initialize MongoDB connection
            this.mongodb = new mongodb.MongoClient(process.env.MONGODB_URI);
            await this.mongodb.connect();

            // Initialize Redis connection
            this.redis = redis.createClient({ url: process.env.REDIS_URI });
            await this.redis.connect();

            this.initialized = true;
            console.log('AuthService initialized with cloud databases');
        } catch (error) {
            console.error('Failed to initialize AuthService:', error);
            throw error;
        }
    }

    /**
     * Register new user with MTProto encryption
     */
    async register(userData) {
        if (!this.initialized) await this.initialize();

        try {
            // 1. Encrypt user data with MTProto
            const encryptedData = await this.encryptUserData(userData);

            // 2. Generate secure password hash
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            // 3. Create user session with MTProto
            const sessionData = await this.mtproto.createSession({
                phone_number: userData.phone || userData.email,
                password: hashedPassword
            });

            // 4. Store encrypted data in MySQL
            const userId = await this.storeUserInMySQL({
                ...encryptedData,
                password_hash: hashedPassword,
                session_id: sessionData.session_id,
                auth_key: sessionData.auth_key
            });

            // 5. Store additional data in MongoDB
            await this.storeUserProfileInMongoDB(userId, {
                preferences: encryptedData.preferences,
                metadata: {
                    registration_date: new Date(),
                    mtproto_session: sessionData.session_id,
                    encryption_version: '1.0'
                }
            });

            // 6. Cache session in Redis
            await this.cacheUserSession(userId, sessionData);

            return {
                success: true,
                userId: userId,
                sessionId: sessionData.session_id,
                message: 'User registered successfully with MTProto encryption'
            };

        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Failed to register user: ' + error.message);
        }
    }

    /**
     * Login user with MTProto decryption
     */
    async login(credentials) {
        if (!this.initialized) await this.initialize();

        try {
            // 1. Find user in MySQL by encrypted identifier
            const encryptedIdentifier = await this.encryptIdentifier(credentials.email);
            const user = await this.findUserInMySQL(encryptedIdentifier);

            if (!user) {
                throw new Error('User not found');
            }

            // 2. Verify password
            const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // 3. Restore MTProto session
            const sessionData = await this.mtproto.restoreSession({
                session_id: user.session_id,
                auth_key: user.auth_key
            });

            // 4. Decrypt user data
            const decryptedUserData = await this.decryptUserData(user);

            // 5. Update session in Redis
            await this.cacheUserSession(user.id, sessionData);

            // 6. Get user profile from MongoDB
            const userProfile = await this.getUserProfileFromMongoDB(user.id);

            return {
                success: true,
                user: {
                    id: user.id,
                    ...decryptedUserData,
                    profile: userProfile
                },
                sessionId: sessionData.session_id,
                token: sessionData.auth_key
            };

        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Failed to login: ' + error.message);
        }
    }

    /**
     * Encrypt user data using MTProto methods
     */
    async encryptUserData(userData) {
        const encryptionKey = await cryptoMethods.generateKey();
        
        return {
            email: await cryptoMethods.aesIGE.encrypt(userData.email, encryptionKey),
            first_name: await cryptoMethods.aesIGE.encrypt(userData.firstName, encryptionKey),
            last_name: await cryptoMethods.aesIGE.encrypt(userData.lastName, encryptionKey),
            phone: userData.phone ? await cryptoMethods.aesIGE.encrypt(userData.phone, encryptionKey) : null,
            encryption_key: encryptionKey.toString('hex'),
            preferences: {
                gender: userData.gender,
                birth_date: userData.birthDate,
                encrypted: true
            }
        };
    }

    /**
     * Decrypt user data using MTProto methods
     */
    async decryptUserData(encryptedUser) {
        const encryptionKey = Buffer.from(encryptedUser.encryption_key, 'hex');
        
        return {
            email: await cryptoMethods.aesIGE.decrypt(encryptedUser.email, encryptionKey),
            firstName: await cryptoMethods.aesIGE.decrypt(encryptedUser.first_name, encryptionKey),
            lastName: await cryptoMethods.aesIGE.decrypt(encryptedUser.last_name, encryptionKey),
            phone: encryptedUser.phone ? await cryptoMethods.aesIGE.decrypt(encryptedUser.phone, encryptionKey) : null
        };
    }

    /**
     * Store user in MySQL cloud database
     */
    async storeUserInMySQL(userData) {
        const query = `
            INSERT INTO users (
                email, first_name, last_name, phone, password_hash, 
                session_id, auth_key, encryption_key, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await this.mysql.execute(query, [
            userData.email,
            userData.first_name,
            userData.last_name,
            userData.phone,
            userData.password_hash,
            userData.session_id,
            userData.auth_key,
            userData.encryption_key
        ]);

        return result.insertId;
    }

    /**
     * Store user profile in MongoDB cloud database
     */
    async storeUserProfileInMongoDB(userId, profileData) {
        const db = this.mongodb.db('cown1');
        const collection = db.collection('user_profiles');
        
        await collection.insertOne({
            user_id: userId,
            ...profileData,
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    /**
     * Find user in MySQL by encrypted identifier
     */
    async findUserInMySQL(encryptedIdentifier) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await this.mysql.execute(query, [encryptedIdentifier]);
        return rows[0] || null;
    }

    /**
     * Get user profile from MongoDB
     */
    async getUserProfileFromMongoDB(userId) {
        const db = this.mongodb.db('cown1');
        const collection = db.collection('user_profiles');
        return await collection.findOne({ user_id: userId });
    }

    /**
     * Cache user session in Redis
     */
    async cacheUserSession(userId, sessionData) {
        const sessionKey = `session:${userId}`;
        await this.redis.setex(sessionKey, 86400, JSON.stringify(sessionData)); // 24 hours
    }

    /**
     * Encrypt identifier for database lookup
     */
    async encryptIdentifier(identifier) {
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        return await cryptoMethods.aesIGE.encrypt(identifier, key);
    }

    /**
     * Logout user and clean sessions
     */
    async logout(userId) {
        try {
            // Remove session from Redis
            await this.redis.del(`session:${userId}`);
            
            // Invalidate MTProto session
            await this.mtproto.destroySession(userId);
            
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to logout: ' + error.message);
        }
    }

    /**
     * Close all database connections
     */
    async close() {
        if (this.mysql) await this.mysql.end();
        if (this.mongodb) await this.mongodb.close();
        if (this.redis) await this.redis.quit();
    }
}

module.exports = new AuthService();
