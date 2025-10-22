import { apiService } from './ApiService';
import { APP_CONFIG } from '../config/config';

export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'badge' | 'system' | 'chat';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  type?: 'transaction' | 'badge' | 'system' | 'chat' | 'all';
  read?: boolean;
  limit?: number;
  offset?: number;
}

class NotificationService {
  async getUserNotifications(userId: string, filters: NotificationFilters = {}): Promise<Notification[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock notifications (ENABLE_MOCK_DATA = true)');
      return this.getMockNotifications(userId, filters);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      const params: Record<string, string> = {};
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.read !== undefined) params.read = filters.read.toString();
      if (filters.limit) params.limit = filters.limit.toString();
      if (filters.offset) params.offset = filters.offset.toString();

      return await apiService.get<Notification[]>(`/users/${userId}/notifications`, params);
      */
      
      // Fallback to mock for now
      return this.getMockNotifications(userId, filters);
    } catch (error) {
      console.warn('API not available, using mock notifications:', error);
      return this.getMockNotifications(userId, filters);
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock mark as read (ENABLE_MOCK_DATA = true)');
      return;
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      await apiService.patch(`/notifications/${notificationId}/read`);
      */
    } catch (error) {
      console.warn('API not available for marking notification as read:', error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock mark all as read (ENABLE_MOCK_DATA = true)');
      return;
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      await apiService.patch(`/users/${userId}/notifications/mark-all-read`);
      */
    } catch (error) {
      console.warn('API not available for marking all notifications as read:', error);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock notification deletion (ENABLE_MOCK_DATA = true)');
      return;
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      await apiService.delete(`/notifications/${notificationId}`);
      */
    } catch (error) {
      console.warn('API not available for deleting notification:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock unread count (ENABLE_MOCK_DATA = true)');
      return 3; // Mock unread count
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      const response = await apiService.get<{ count: number }>(`/users/${userId}/notifications/unread-count`);
      return response.count;
      */
      
      // Fallback to mock for now
      return 3;
    } catch (error) {
      console.warn('API not available, returning mock unread count:', error);
      return 3; // Mock unread count
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[NotificationService] Using mock notification creation (ENABLE_MOCK_DATA = true)');
      return {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.post<Notification>('/notifications', notification);
      */
      
      // Fallback to mock for now
      return {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('API not available for creating notification:', error);
      // Return mock created notification
      return {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Mock method for development
  private getMockNotifications(userId: string, filters: NotificationFilters): Notification[] {
    const mockNotifications: Notification[] = [
      {
        id: 'notif_001',
        userId,
        type: 'transaction',
        title: 'Coins Received!',
        message: 'Sarah Johnson sent you 100 coins with message: "Great job on the presentation!"',
        timestamp: '2024-08-31T14:30:00Z',
        read: false,
        data: { fromUserId: '2', amount: 100, transactionId: 'tx_001' }
      },
      {
        id: 'notif_002',
        userId,
        type: 'badge',
        title: 'New Badge Earned!',
        message: 'Congratulations! You earned the "Team Player" badge for collaborating with colleagues.',
        timestamp: '2024-08-31T12:15:00Z',
        read: false,
        data: { badgeId: 'team_player' }
      },
      {
        id: 'notif_003',
        userId,
        type: 'transaction',
        title: 'Coins Sent',
        message: 'You sent 75 coins to Mike Chen.',
        timestamp: '2024-08-31T10:45:00Z',
        read: true,
        data: { toUserId: '3', amount: 75, transactionId: 'tx_002' }
      },
      {
        id: 'notif_004',
        userId,
        type: 'chat',
        title: 'New Message',
        message: 'You have a new message from Emma Wilson.',
        timestamp: '2024-08-30T16:20:00Z',
        read: true,
        data: { fromUserId: '4', chatId: 'chat_001' }
      },
      {
        id: 'notif_005',
        userId,
        type: 'system',
        title: 'Welcome to Verve!',
        message: 'Your account has been successfully created. Start recognizing your colleagues today!',
        timestamp: '2024-08-30T09:00:00Z',
        read: true,
        data: {}
      },
      {
        id: 'notif_006',
        userId,
        type: 'transaction',
        title: 'Coins Received!',
        message: 'David Kim sent you 50 coins with message: "Thanks for helping with the project setup."',
        timestamp: '2024-08-29T13:30:00Z',
        read: false,
        data: { fromUserId: '5', amount: 50, transactionId: 'tx_003' }
      }
    ];

    let filtered = mockNotifications;

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(notif => notif.type === filters.type);
    }

    if (filters.read !== undefined) {
      filtered = filtered.filter(notif => notif.read === filters.read);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || filtered.length;
    
    return filtered.slice(offset, offset + limit);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();