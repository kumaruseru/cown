/**
 * Notification Service
 * Handles push notifications, email notifications, and real-time alerts
 */

const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.pushClients = new Map(); // Store push notification clients
    this.emailQueue = []; // Simple email queue (in production, use proper queue system)
    this.notificationTypes = {
      MESSAGE: 'message',
      MENTION: 'mention',
      CALL: 'call',
      GROUP_INVITE: 'group_invite',
      SYSTEM: 'system'
    };
  }

  // Send push notification
  async sendPushNotification(userId, notification) {
    try {
      const { title, body, data, type = this.notificationTypes.MESSAGE } = notification;
      
      // Store notification in database (for offline users)
      await this.storeNotification(userId, {
        title,
        body,
        data,
        type,
        timestamp: new Date()
      });

      // If user is online, send real-time notification
      if (this.pushClients.has(userId)) {
        const client = this.pushClients.get(userId);
        client.send(JSON.stringify({
          type: 'notification',
          data: { title, body, data, type }
        }));
      }

      // Emit event for other services to listen
      this.emit('notification:sent', { userId, notification });

      return { success: true, message: 'Notification sent' };
    } catch (error) {
      console.error('Push notification error:', error);
      throw new Error('Failed to send push notification');
    }
  }

  // Send message notification
  async notifyNewMessage(receiverId, message, sender) {
    const notification = {
      title: sender.display_name || sender.username,
      body: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
      data: {
        messageId: message.id,
        chatId: message.chat_id,
        senderId: sender.id,
        messageType: message.message_type
      },
      type: this.notificationTypes.MESSAGE
    };

    return this.sendPushNotification(receiverId, notification);
  }

  // Send mention notification
  async notifyMention(userId, message, mentioner, chat) {
    const notification = {
      title: `${mentioner.display_name || mentioner.username} mentioned you`,
      body: `in ${chat.name}: ${message.content.substring(0, 80)}...`,
      data: {
        messageId: message.id,
        chatId: message.chat_id,
        mentionerId: mentioner.id,
        chatName: chat.name
      },
      type: this.notificationTypes.MENTION
    };

    return this.sendPushNotification(userId, notification);
  }

  // Send call notification
  async notifyIncomingCall(userId, caller, callType = 'voice') {
    const notification = {
      title: 'Incoming Call',
      body: `${caller.display_name || caller.username} is calling you`,
      data: {
        callerId: caller.id,
        callerName: caller.display_name || caller.username,
        callType,
        timestamp: new Date().toISOString()
      },
      type: this.notificationTypes.CALL
    };

    return this.sendPushNotification(userId, notification);
  }

  // Send group invite notification
  async notifyGroupInvite(userId, inviter, groupName, groupId) {
    const notification = {
      title: 'Group Invitation',
      body: `${inviter.display_name || inviter.username} invited you to ${groupName}`,
      data: {
        inviterId: inviter.id,
        groupId,
        groupName,
        inviterName: inviter.display_name || inviter.username
      },
      type: this.notificationTypes.GROUP_INVITE
    };

    return this.sendPushNotification(userId, notification);
  }

  // Send system notification
  async notifySystem(userId, title, body, data = {}) {
    const notification = {
      title,
      body,
      data,
      type: this.notificationTypes.SYSTEM
    };

    return this.sendPushNotification(userId, notification);
  }

  // Register push client (WebSocket/SSE connection)
  registerPushClient(userId, client) {
    this.pushClients.set(userId, client);
    
    // Clean up on disconnect
    client.on('close', () => {
      this.pushClients.delete(userId);
    });

    console.log(`Push client registered for user ${userId}`);
  }

  // Unregister push client
  unregisterPushClient(userId) {
    this.pushClients.delete(userId);
    console.log(`Push client unregistered for user ${userId}`);
  }

  // Store notification in database for offline users
  async storeNotification(userId, notification) {
    // TODO: Implement database storage
    // This would typically store in a notifications table
    console.log(`Storing notification for user ${userId}:`, notification);
    return Promise.resolve();
  }

  // Get unread notifications for user
  async getUnreadNotifications(userId, limit = 20) {
    // TODO: Implement database retrieval
    // This would fetch unread notifications from database
    console.log(`Getting unread notifications for user ${userId}`);
    return [];
  }

  // Mark notification as read
  async markAsRead(userId, notificationId) {
    // TODO: Implement database update
    console.log(`Marking notification ${notificationId} as read for user ${userId}`);
    return Promise.resolve();
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    // TODO: Implement database update
    console.log(`Marking all notifications as read for user ${userId}`);
    return Promise.resolve();
  }

  // Send email notification
  async sendEmailNotification(email, subject, body, data = {}) {
    // Add to email queue
    this.emailQueue.push({
      email,
      subject,
      body,
      data,
      timestamp: new Date()
    });

    // Process email queue (in production, use proper email service)
    this.processEmailQueue();

    return { success: true, message: 'Email queued for sending' };
  }

  // Process email queue (simplified implementation)
  async processEmailQueue() {
    while (this.emailQueue.length > 0) {
      const emailData = this.emailQueue.shift();
      
      try {
        // TODO: Implement actual email sending (using nodemailer, sendgrid, etc.)
        console.log('Sending email:', emailData);
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Email sending failed:', error);
        // Re-queue failed emails or handle appropriately
      }
    }
  }

  // Get notification settings for user
  async getNotificationSettings(userId) {
    // TODO: Implement database retrieval
    return {
      pushEnabled: true,
      emailEnabled: true,
      messageNotifications: true,
      mentionNotifications: true,
      callNotifications: true,
      groupNotifications: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
  }

  // Update notification settings
  async updateNotificationSettings(userId, settings) {
    // TODO: Implement database update
    console.log(`Updating notification settings for user ${userId}:`, settings);
    return settings;
  }

  // Check if user should receive notification based on settings and quiet hours
  async shouldNotifyUser(userId, notificationType) {
    const settings = await this.getNotificationSettings(userId);
    
    // Check if notifications are enabled for this type
    const typeKey = `${notificationType}Notifications`;
    if (settings[typeKey] === false) {
      return false;
    }

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(settings.quietHours.start.replace(':', ''));
      const endTime = parseInt(settings.quietHours.end.replace(':', ''));
      
      if (startTime > endTime) {
        // Quiet hours span midnight
        if (currentTime >= startTime || currentTime <= endTime) {
          return false;
        }
      } else {
        // Normal quiet hours
        if (currentTime >= startTime && currentTime <= endTime) {
          return false;
        }
      }
    }

    return true;
  }

  // Broadcast notification to multiple users
  async broadcast(userIds, notification) {
    const results = [];
    
    for (const userId of userIds) {
      try {
        const shouldNotify = await this.shouldNotifyUser(userId, notification.type);
        if (shouldNotify) {
          const result = await this.sendPushNotification(userId, notification);
          results.push({ userId, success: true, result });
        } else {
          results.push({ userId, success: false, reason: 'User settings or quiet hours' });
        }
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Get notification statistics
  getStats() {
    return {
      activeConnections: this.pushClients.size,
      queuedEmails: this.emailQueue.length,
      supportedTypes: Object.values(this.notificationTypes)
    };
  }
}

module.exports = new NotificationService();
