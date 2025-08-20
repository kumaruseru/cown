/**
 * Main App Manager - Integrates all lib components
 * Uses MTProto, AppManagers, and all features from tweb lib
 */

// Import core MTProto components
import MTProtoWorker from '../lib/mtproto/mtprotoworker';
import { ApiManager } from '../lib/mtproto/apiManager';
import { AppManagers } from '../lib/appManagers/createManagers';
import { rootScope } from '../lib/rootScope';
import { logger } from '../lib/logger';

// Import storage systems
import { LocalStorage } from '../lib/localStorage';
import { SessionStorage } from '../lib/sessionStorage';
import { StateStorage } from '../lib/stateStorage';

// Import crypto utilities
import CryptoMethods from '../lib/crypto/crypto_methods';
import { AesCTR } from '../lib/crypto/utils/aesCTR';
import { AesIGE } from '../lib/crypto/utils/aesIGE';

// Import file handling
import { FileStorage } from '../lib/files/fileStorage';
import { CacheStorage } from '../lib/files/cacheStorage';
import { DownloadStorage } from '../lib/files/downloadStorage';

// Import rich text processing
import RichTextProcessor from '../lib/richTextProcessor';

// Import media components
import MediaPlayer from '../lib/mediaPlayer';
import { RLottiePlayer } from '../lib/rlottie/rlottiePlayer';

// Import call system
import { CallsController } from '../lib/calls/callsController';
import { GroupCallsController } from '../lib/calls/groupCallsController';

// Import service worker
import { ServiceMessagePort } from '../lib/serviceWorker/serviceMessagePort';

class CosmicAppManager {
    constructor() {
        this.initialized = false;
        this.mtproto = null;
        this.apiManager = null;
        this.managers = null;
        this.logger = logger;
        this.crypto = CryptoMethods;
        this.storage = {
            local: LocalStorage,
            session: SessionStorage,
            state: StateStorage,
            files: FileStorage,
            cache: CacheStorage,
            download: DownloadStorage
        };
        this.richTextProcessor = RichTextProcessor;
        this.mediaPlayer = MediaPlayer;
        this.callsController = CallsController;
        this.serviceWorker = null;
    }

    /**
     * Initialize the complete app system
     */
    async initialize() {
        try {
            this.logger.log('🚀 Initializing Cosmic App Manager...');

            // 1. Initialize crypto system
            await this.initializeCrypto();

            // 2. Initialize storage systems
            await this.initializeStorage();

            // 3. Initialize MTProto
            await this.initializeMTProto();

            // 4. Initialize API Manager
            await this.initializeApiManager();

            // 5. Initialize App Managers
            await this.initializeAppManagers();

            // 6. Initialize media systems
            await this.initializeMediaSystems();

            // 7. Initialize communication systems
            await this.initializeCommunicationSystems();

            // 8. Initialize service worker
            await this.initializeServiceWorker();

            this.initialized = true;
            this.logger.log('✅ Cosmic App Manager initialized successfully');

            // Emit initialization complete event
            rootScope.dispatchEvent('app_initialized', this);

            return this;
        } catch (error) {
            this.logger.error('❌ Failed to initialize Cosmic App Manager:', error);
            throw error;
        }
    }

    /**
     * Initialize crypto system
     */
    async initializeCrypto() {
        this.logger.log('🔐 Initializing crypto system...');
        
        // Initialize crypto worker if available
        if (typeof Worker !== 'undefined') {
            this.crypto.worker = new Worker('../lib/crypto/crypto.worker.js');
        }

        // Test crypto functionality
        const testKey = await this.crypto.generateKey();
        const testData = 'Hello Cosmic World!';
        const encrypted = await AesIGE.encrypt(testData, testKey);
        const decrypted = await AesIGE.decrypt(encrypted, testKey);
        
        if (decrypted !== testData) {
            throw new Error('Crypto system test failed');
        }

        this.logger.log('✅ Crypto system initialized');
    }

    /**
     * Initialize storage systems
     */
    async initializeStorage() {
        this.logger.log('💾 Initializing storage systems...');

        // Initialize local storage
        await this.storage.local.initialize();

        // Initialize session storage
        await this.storage.session.initialize();

        // Initialize state storage
        await this.storage.state.initialize();

        // Initialize file storage
        await this.storage.files.initialize();

        // Initialize cache storage
        await this.storage.cache.initialize();

        // Initialize download storage
        await this.storage.download.initialize();

        this.logger.log('✅ Storage systems initialized');
    }

    /**
     * Initialize MTProto system
     */
    async initializeMTProto() {
        this.logger.log('🌐 Initializing MTProto...');

        // Create MTProto worker
        this.mtproto = new MTProtoWorker();

        // Configure MTProto
        await this.mtproto.configure({
            api_id: parseInt(process.env.MTPROTO_API_ID) || 94575,
            api_hash: process.env.MTPROTO_API_HASH || 'a3406de8d171bb422bb6ddf3bbd800e2',
            server: {
                dev: process.env.NODE_ENV !== 'production',
                useWSS: true,
                useTLS: true
            },
            storage: this.storage.local
        });

        // Initialize MTProto connection
        await this.mtproto.initialize();

        this.logger.log('✅ MTProto initialized');
    }

    /**
     * Initialize API Manager
     */
    async initializeApiManager() {
        this.logger.log('🔌 Initializing API Manager...');

        this.apiManager = new ApiManager({
            mtproto: this.mtproto,
            storage: this.storage,
            crypto: this.crypto
        });

        await this.apiManager.initialize();

        this.logger.log('✅ API Manager initialized');
    }

    /**
     * Initialize App Managers
     */
    async initializeAppManagers() {
        this.logger.log('👥 Initializing App Managers...');

        this.managers = await AppManagers.create({
            apiManager: this.apiManager,
            storage: this.storage,
            crypto: this.crypto
        });

        // Initialize core managers
        await this.managers.appUsersManager.initialize();
        await this.managers.appChatsManager.initialize();
        await this.managers.appMessagesManager.initialize();
        await this.managers.appDialogsManager.initialize();
        await this.managers.appPeersManager.initialize();
        await this.managers.appProfileManager.initialize();
        await this.managers.appPhotosManager.initialize();
        await this.managers.appDocsManager.initialize();
        await this.managers.appStickersManager.initialize();
        await this.managers.appNotificationsManager.initialize();
        await this.managers.appCallsManager.initialize();

        this.logger.log('✅ App Managers initialized');
    }

    /**
     * Initialize media systems
     */
    async initializeMediaSystems() {
        this.logger.log('🎵 Initializing media systems...');

        // Initialize media player
        this.mediaPlayer = new MediaPlayer({
            storage: this.storage.files,
            crypto: this.crypto
        });

        // Initialize RLottie player
        this.rlottiePlayer = new RLottiePlayer({
            storage: this.storage.cache
        });

        this.logger.log('✅ Media systems initialized');
    }

    /**
     * Initialize communication systems
     */
    async initializeCommunicationSystems() {
        this.logger.log('📞 Initializing communication systems...');

        // Initialize calls controller
        this.callsController = new CallsController({
            apiManager: this.apiManager,
            managers: this.managers,
            storage: this.storage
        });

        // Initialize group calls controller
        this.groupCallsController = new GroupCallsController({
            apiManager: this.apiManager,
            managers: this.managers,
            callsController: this.callsController
        });

        await this.callsController.initialize();
        await this.groupCallsController.initialize();

        this.logger.log('✅ Communication systems initialized');
    }

    /**
     * Initialize service worker
     */
    async initializeServiceWorker() {
        this.logger.log('⚙️ Initializing service worker...');

        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                this.serviceWorker = new ServiceMessagePort({
                    registration,
                    managers: this.managers,
                    storage: this.storage
                });

                await this.serviceWorker.initialize();

                this.logger.log('✅ Service worker initialized');
            } catch (error) {
                this.logger.warn('Service worker initialization failed:', error);
            }
        }
    }

    /**
     * Get user manager
     */
    getUserManager() {
        return this.managers?.appUsersManager;
    }

    /**
     * Get chat manager
     */
    getChatManager() {
        return this.managers?.appChatsManager;
    }

    /**
     * Get message manager
     */
    getMessageManager() {
        return this.managers?.appMessagesManager;
    }

    /**
     * Get dialog manager
     */
    getDialogManager() {
        return this.managers?.appDialogsManager;
    }

    /**
     * Get profile manager
     */
    getProfileManager() {
        return this.managers?.appProfileManager;
    }

    /**
     * Get notifications manager
     */
    getNotificationsManager() {
        return this.managers?.appNotificationsManager;
    }

    /**
     * Get calls manager
     */
    getCallsManager() {
        return this.managers?.appCallsManager;
    }

    /**
     * Send encrypted message
     */
    async sendMessage(peerId, message, options = {}) {
        if (!this.initialized) {
            throw new Error('App manager not initialized');
        }

        return await this.managers.appMessagesManager.sendText(peerId, message, options);
    }

    /**
     * Get user info
     */
    async getUserInfo(userId) {
        if (!this.initialized) {
            throw new Error('App manager not initialized');
        }

        return await this.managers.appUsersManager.getUser(userId);
    }

    /**
     * Get chat info
     */
    async getChatInfo(chatId) {
        if (!this.initialized) {
            throw new Error('App manager not initialized');
        }

        return await this.managers.appChatsManager.getChat(chatId);
    }

    /**
     * Upload file with encryption
     */
    async uploadFile(file, options = {}) {
        if (!this.initialized) {
            throw new Error('App manager not initialized');
        }

        return await this.managers.appDocsManager.uploadFile(file, options);
    }

    /**
     * Start voice/video call
     */
    async startCall(userId, isVideo = false) {
        if (!this.initialized) {
            throw new Error('App manager not initialized');
        }

        return await this.callsController.startCall(userId, isVideo);
    }

    /**
     * Process rich text
     */
    processRichText(text, options = {}) {
        return this.richTextProcessor.wrapRichText(text, options);
    }

    /**
     * Cleanup and destroy
     */
    async destroy() {
        this.logger.log('🧹 Destroying Cosmic App Manager...');

        if (this.serviceWorker) {
            await this.serviceWorker.destroy();
        }

        if (this.callsController) {
            await this.callsController.destroy();
        }

        if (this.groupCallsController) {
            await this.groupCallsController.destroy();
        }

        if (this.managers) {
            await this.managers.destroy();
        }

        if (this.apiManager) {
            await this.apiManager.destroy();
        }

        if (this.mtproto) {
            await this.mtproto.destroy();
        }

        this.initialized = false;
        this.logger.log('✅ Cosmic App Manager destroyed');
    }

    /**
     * Get app state
     */
    getState() {
        return {
            initialized: this.initialized,
            mtproto: !!this.mtproto,
            apiManager: !!this.apiManager,
            managers: !!this.managers,
            mediaPlayer: !!this.mediaPlayer,
            callsController: !!this.callsController,
            serviceWorker: !!this.serviceWorker
        };
    }
}

// Create global instance
const cosmicApp = new CosmicAppManager();

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    window.CosmicApp = cosmicApp;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            cosmicApp.initialize().catch(console.error);
        });
    } else {
        cosmicApp.initialize().catch(console.error);
    }
}

export default cosmicApp;
