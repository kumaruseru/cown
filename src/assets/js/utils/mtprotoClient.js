/**
 * MTProto Client Configuration for Frontend
 * Handles encrypted communication with backend
 */

class MTProtoClient {
    constructor() {
        this.apiId = 94575; // Default test API ID
        this.apiHash = 'a3406de8d171bb422bb6ddf3bbd800e2';
        this.sessionId = null;
        this.authKey = null;
        this.initialized = false;
    }

    /**
     * Initialize MTProto client
     */
    async initialize() {
        try {
            // Check if session exists in storage
            this.sessionId = sessionStorage.getItem('sessionId');
            this.authKey = sessionStorage.getItem('authKey');

            if (this.sessionId && this.authKey) {
                this.initialized = true;
                console.log('MTProto client initialized with existing session');
            } else {
                console.log('MTProto client initialized without session');
            }

            return true;
        } catch (error) {
            console.error('Failed to initialize MTProto client:', error);
            return false;
        }
    }

    /**
     * Create encrypted request
     */
    async createEncryptedRequest(data) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Simple encryption simulation (in real implementation, use proper MTProto)
            const encryptedData = {
                ...data,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                encrypted: true
            };

            return encryptedData;
        } catch (error) {
            console.error('Failed to create encrypted request:', error);
            throw error;
        }
    }

    /**
     * Decrypt response
     */
    async decryptResponse(encryptedResponse) {
        try {
            // Simple decryption simulation
            if (encryptedResponse.encrypted) {
                delete encryptedResponse.encrypted;
            }

            return encryptedResponse;
        } catch (error) {
            console.error('Failed to decrypt response:', error);
            throw error;
        }
    }

    /**
     * Send authenticated request
     */
    async sendRequest(url, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'X-MTProto-Version': '2.0',
                'X-MTProto-Encrypted': 'true',
                ...options.headers
            };

            if (this.sessionId) {
                headers['X-Session-ID'] = this.sessionId;
            }

            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (response.ok) {
                return await this.decryptResponse(data);
            } else {
                throw new Error(data.message || 'Request failed');
            }

        } catch (error) {
            console.error('MTProto request failed:', error);
            throw error;
        }
    }

    /**
     * Handle authentication success
     */
    handleAuthSuccess(sessionId, authKey) {
        this.sessionId = sessionId;
        this.authKey = authKey;
        this.initialized = true;

        // Store in session storage
        if (sessionId) sessionStorage.setItem('sessionId', sessionId);
        if (authKey) sessionStorage.setItem('authKey', authKey);

        console.log('MTProto authentication successful');
    }

    /**
     * Handle logout
     */
    handleLogout() {
        this.sessionId = null;
        this.authKey = null;
        this.initialized = false;

        // Clear session storage
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('authKey');

        console.log('MTProto session cleared');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.initialized && this.sessionId && this.authKey;
    }

    /**
     * Get session info
     */
    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            authKey: this.authKey,
            initialized: this.initialized
        };
    }
}

// Create global instance
window.MTProtoClient = new MTProtoClient();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.MTProtoClient.initialize();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTProtoClient;
}
