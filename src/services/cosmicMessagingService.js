/**
 * Cosmic Messaging Service - Full MTProto Integration
 * Uses AppMessagesManager, AppDialogsManager, and all messaging features
 */

import { AppMessagesManager } from '../lib/appManagers/appMessagesManager';
import { AppDialogsManager } from '../lib/appManagers/appDialogsManager';
import { AppUsersManager } from '../lib/appManagers/appUsersManager';
import { AppChatsManager } from '../lib/appManagers/appChatsManager';
import { AppPeersManager } from '../lib/appManagers/appPeersManager';
import RichTextProcessor from '../lib/richTextProcessor';
import { logger } from '../lib/logger';
import { rootScope } from '../lib/rootScope';

class CosmicMessagingService {
    constructor(cosmicApp) {
        this.app = cosmicApp;
        this.messagesManager = null;
        this.dialogsManager = null;
        this.usersManager = null;
        this.chatsManager = null;
        this.peersManager = null;
        this.richTextProcessor = RichTextProcessor;
        this.logger = logger;
        this.initialized = false;
        
        // Message cache
        this.messageCache = new Map();
        this.dialogCache = new Map();
        
        // Event listeners
        this.eventListeners = new Map();
    }

    /**
     * Initialize messaging service
     */
    async initialize() {
        try {
            this.logger.log('💬 Initializing Cosmic Messaging Service...');

            // Wait for app to be initialized
            if (!this.app.initialized) {
                await this.app.initialize();
            }

            // Get managers from app
            this.messagesManager = this.app.getMessageManager();
            this.dialogsManager = this.app.getDialogManager();
            this.usersManager = this.app.getUserManager();
            this.chatsManager = this.app.getChatManager();
            this.peersManager = this.app.managers?.appPeersManager;

            // Setup event listeners
            this.setupEventListeners();

            // Load initial dialogs
            await this.loadDialogs();

            this.initialized = true;
            this.logger.log('✅ Cosmic Messaging Service initialized');

            return this;
        } catch (error) {
            this.logger.error('❌ Failed to initialize messaging service:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners for real-time updates
     */
    setupEventListeners() {
        // Listen for new messages
        rootScope.addEventListener('new_message', (message) => {
            this.handleNewMessage(message);
        });

        // Listen for message updates
        rootScope.addEventListener('message_edit', (message) => {
            this.handleMessageEdit(message);
        });

        // Listen for dialog updates
        rootScope.addEventListener('dialog_notify_settings', (dialog) => {
            this.handleDialogUpdate(dialog);
        });

        // Listen for user updates
        rootScope.addEventListener('user_update', (user) => {
            this.handleUserUpdate(user);
        });

        // Listen for chat updates
        rootScope.addEventListener('chat_update', (chat) => {
            this.handleChatUpdate(chat);
        });
    }

    /**
     * Load dialogs with pagination
     */
    async loadDialogs(offsetIndex = 0, limit = 20) {
        try {
            const dialogs = await this.dialogsManager.getDialogs({
                offsetIndex,
                limit,
                query: ''
            });

            // Cache dialogs
            dialogs.forEach(dialog => {
                this.dialogCache.set(dialog.peerId, dialog);
            });

            return dialogs;
        } catch (error) {
            this.logger.error('Failed to load dialogs:', error);
            throw error;
        }
    }

    /**
     * Get dialog by peer ID
     */
    async getDialog(peerId) {
        try {
            // Check cache first
            if (this.dialogCache.has(peerId)) {
                return this.dialogCache.get(peerId);
            }

            // Load from manager
            const dialog = await this.dialogsManager.getDialogById(peerId);
            
            if (dialog) {
                this.dialogCache.set(peerId, dialog);
            }

            return dialog;
        } catch (error) {
            this.logger.error('Failed to get dialog:', error);
            return null;
        }
    }

    /**
     * Get messages for a dialog
     */
    async getMessages(peerId, offsetId = 0, limit = 20) {
        try {
            const messages = await this.messagesManager.getHistory(peerId, {
                offsetId,
                limit,
                addOffset: 0
            });

            // Cache messages
            messages.forEach(message => {
                this.messageCache.set(message.id, message);
            });

            return messages;
        } catch (error) {
            this.logger.error('Failed to get messages:', error);
            throw error;
        }
    }

    /**
     * Send text message with rich text support
     */
    async sendTextMessage(peerId, text, options = {}) {
        try {
            // Process rich text
            const entities = this.richTextProcessor.parseEntities(text);
            
            const messageOptions = {
                entities,
                replyToMsgId: options.replyToMsgId,
                clearDraft: true,
                scheduleDate: options.scheduleDate,
                silent: options.silent,
                ...options
            };

            const message = await this.messagesManager.sendText(peerId, text, messageOptions);
            
            // Cache the message
            this.messageCache.set(message.id, message);

            // Emit event
            this.emit('message_sent', { message, peerId });

            return message;
        } catch (error) {
            this.logger.error('Failed to send text message:', error);
            throw error;
        }
    }

    /**
     * Send media message (photo, video, document)
     */
    async sendMediaMessage(peerId, file, options = {}) {
        try {
            const messageOptions = {
                caption: options.caption,
                entities: options.caption ? this.richTextProcessor.parseEntities(options.caption) : [],
                replyToMsgId: options.replyToMsgId,
                scheduleDate: options.scheduleDate,
                silent: options.silent,
                ...options
            };

            let message;

            if (file.type.startsWith('image/')) {
                message = await this.messagesManager.sendPhoto(peerId, file, messageOptions);
            } else if (file.type.startsWith('video/')) {
                message = await this.messagesManager.sendVideo(peerId, file, messageOptions);
            } else if (file.type.startsWith('audio/')) {
                message = await this.messagesManager.sendAudio(peerId, file, messageOptions);
            } else {
                message = await this.messagesManager.sendDocument(peerId, file, messageOptions);
            }

            // Cache the message
            this.messageCache.set(message.id, message);

            // Emit event
            this.emit('media_sent', { message, peerId, file });

            return message;
        } catch (error) {
            this.logger.error('Failed to send media message:', error);
            throw error;
        }
    }

    /**
     * Send sticker
     */
    async sendSticker(peerId, sticker, options = {}) {
        try {
            const message = await this.messagesManager.sendSticker(peerId, sticker, {
                replyToMsgId: options.replyToMsgId,
                scheduleDate: options.scheduleDate,
                silent: options.silent
            });

            this.messageCache.set(message.id, message);
            this.emit('sticker_sent', { message, peerId, sticker });

            return message;
        } catch (error) {
            this.logger.error('Failed to send sticker:', error);
            throw error;
        }
    }

    /**
     * Forward messages
     */
    async forwardMessages(fromPeerId, toPeerId, messageIds, options = {}) {
        try {
            const messages = await this.messagesManager.forwardMessages(
                fromPeerId, 
                toPeerId, 
                messageIds, 
                {
                    dropAuthor: options.dropAuthor,
                    dropCaption: options.dropCaption,
                    scheduleDate: options.scheduleDate,
                    silent: options.silent
                }
            );

            // Cache forwarded messages
            messages.forEach(message => {
                this.messageCache.set(message.id, message);
            });

            this.emit('messages_forwarded', { messages, fromPeerId, toPeerId });

            return messages;
        } catch (error) {
            this.logger.error('Failed to forward messages:', error);
            throw error;
        }
    }

    /**
     * Edit message
     */
    async editMessage(peerId, messageId, text, options = {}) {
        try {
            const entities = this.richTextProcessor.parseEntities(text);
            
            const message = await this.messagesManager.editMessage(
                peerId,
                messageId,
                text,
                {
                    entities,
                    media: options.media,
                    replyMarkup: options.replyMarkup
                }
            );

            // Update cache
            this.messageCache.set(message.id, message);

            this.emit('message_edited', { message, peerId });

            return message;
        } catch (error) {
            this.logger.error('Failed to edit message:', error);
            throw error;
        }
    }

    /**
     * Delete messages
     */
    async deleteMessages(peerId, messageIds, revoke = false) {
        try {
            await this.messagesManager.deleteMessages(peerId, messageIds, revoke);

            // Remove from cache
            messageIds.forEach(id => {
                this.messageCache.delete(id);
            });

            this.emit('messages_deleted', { peerId, messageIds, revoke });

            return true;
        } catch (error) {
            this.logger.error('Failed to delete messages:', error);
            throw error;
        }
    }

    /**
     * Mark messages as read
     */
    async markAsRead(peerId, messageIds) {
        try {
            await this.messagesManager.readMessages(peerId, messageIds);
            
            this.emit('messages_read', { peerId, messageIds });

            return true;
        } catch (error) {
            this.logger.error('Failed to mark messages as read:', error);
            throw error;
        }
    }

    /**
     * Search messages
     */
    async searchMessages(query, options = {}) {
        try {
            const results = await this.messagesManager.search({
                query,
                peerId: options.peerId,
                filter: options.filter,
                minDate: options.minDate,
                maxDate: options.maxDate,
                offsetId: options.offsetId,
                limit: options.limit || 20
            });

            return results;
        } catch (error) {
            this.logger.error('Failed to search messages:', error);
            throw error;
        }
    }

    /**
     * Get peer info (user or chat)
     */
    async getPeerInfo(peerId) {
        try {
            const peer = await this.peersManager.getPeer(peerId);
            
            if (this.peersManager.isUser(peerId)) {
                return await this.usersManager.getUser(peerId);
            } else {
                return await this.chatsManager.getChat(Math.abs(peerId));
            }
        } catch (error) {
            this.logger.error('Failed to get peer info:', error);
            return null;
        }
    }

    /**
     * Handle new message event
     */
    handleNewMessage(message) {
        this.messageCache.set(message.id, message);
        this.emit('new_message', message);
    }

    /**
     * Handle message edit event
     */
    handleMessageEdit(message) {
        this.messageCache.set(message.id, message);
        this.emit('message_edited', message);
    }

    /**
     * Handle dialog update event
     */
    handleDialogUpdate(dialog) {
        this.dialogCache.set(dialog.peerId, dialog);
        this.emit('dialog_updated', dialog);
    }

    /**
     * Handle user update event
     */
    handleUserUpdate(user) {
        this.emit('user_updated', user);
    }

    /**
     * Handle chat update event
     */
    handleChatUpdate(chat) {
        this.emit('chat_updated', chat);
    }

    /**
     * Event emitter methods
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.logger.error('Event listener error:', error);
                }
            });
        }
    }

    /**
     * Get cached message
     */
    getCachedMessage(messageId) {
        return this.messageCache.get(messageId);
    }

    /**
     * Get cached dialog
     */
    getCachedDialog(peerId) {
        return this.dialogCache.get(peerId);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.messageCache.clear();
        this.dialogCache.clear();
    }

    /**
     * Destroy service
     */
    destroy() {
        this.clearCache();
        this.eventListeners.clear();
        this.initialized = false;
    }
}

export default CosmicMessagingService;
