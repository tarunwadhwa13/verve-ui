import { apiService } from './ApiService';
import { APP_CONFIG } from '../config/config';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'transaction' | 'system';
  data?: Record<string, any>;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

class ChatService {
  private validateChatEnabled() {
    if (!APP_CONFIG.CHAT_ENABLED) {
      throw new Error('Chat feature is disabled in the application configuration');
    }
  }

  async getUserChats(userId: string): Promise<ChatRoom[]> {
    this.validateChatEnabled();

    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock chats (ENABLE_MOCK_DATA = true)');
      return this.getMockChats(userId);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<ChatRoom[]>(`/users/${userId}/chats`);
      */
      
      // Fallback to mock for now
      return this.getMockChats(userId);
    } catch (error) {
      console.warn('API not available, using mock chats:', error);
      return this.getMockChats(userId);
    }
  }

  async getChatMessages(chatId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock messages (ENABLE_MOCK_DATA = true)');
      return this.getMockMessages(chatId);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<ChatMessage[]>(`/chats/${chatId}/messages`, {
        limit: limit.toString(),
        offset: offset.toString()
      });
      */
      
      // Fallback to mock for now
      return this.getMockMessages(chatId);
    } catch (error) {
      console.warn('API not available, using mock messages:', error);
      return this.getMockMessages(chatId);
    }
  }

  async sendMessage(chatId: string, message: string, type: 'text' | 'transaction' = 'text', data?: Record<string, any>): Promise<ChatMessage> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock message creation (ENABLE_MOCK_DATA = true)');
      return this.createMockMessage(chatId, message, type, data);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.post<ChatMessage>(`/chats/${chatId}/messages`, {
        message,
        type,
        data
      });
      */
      
      // Fallback to mock for now
      return this.createMockMessage(chatId, message, type, data);
    } catch (error) {
      console.warn('API not available, creating mock message:', error);
      return this.createMockMessage(chatId, message, type, data);
    }
  }

  async createOrGetChat(userId1: string, userId2: string): Promise<ChatRoom> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock chat creation (ENABLE_MOCK_DATA = true)');
      return this.createMockChat(userId1, userId2);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.post<ChatRoom>('/chats', {
        participants: [userId1, userId2]
      });
      */
      
      // Fallback to mock for now
      return this.createMockChat(userId1, userId2);
    } catch (error) {
      console.warn('API not available, creating mock chat:', error);
      return this.createMockChat(userId1, userId2);
    }
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock mark as read (ENABLE_MOCK_DATA = true)');
      return;
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      await apiService.patch(`/chats/${chatId}/mark-read`, { userId });
      */
    } catch (error) {
      console.warn('API not available for marking messages as read:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[ChatService] Using mock unread count (ENABLE_MOCK_DATA = true)');
      return 5; // Mock unread count
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      const response = await apiService.get<{ count: number }>(`/users/${userId}/chats/unread-count`);
      return response.count;
      */
      
      // Fallback to mock for now
      return 5;
    } catch (error) {
      console.warn('API not available, returning mock unread count:', error);
      return 5; // Mock unread count
    }
  }

  // Mock methods for development
  private getMockChats(userId: string): ChatRoom[] {
    return [
      {
        id: 'chat_001',
        participants: [userId, '2'],
        lastMessage: {
          id: 'msg_001',
          chatId: 'chat_001',
          senderId: '2',
          receiverId: userId,
          message: 'Thanks for the coins! 🎉',
          timestamp: '2024-08-31T14:30:00Z',
          read: false,
          type: 'text'
        },
        unreadCount: 2,
        createdAt: '2024-08-25T09:00:00Z',
        updatedAt: '2024-08-31T14:30:00Z'
      },
      {
        id: 'chat_002',
        participants: [userId, '3'],
        lastMessage: {
          id: 'msg_002',
          chatId: 'chat_002',
          senderId: '3',
          receiverId: userId,
          message: 'The project went great!',
          timestamp: '2024-08-30T11:45:00Z',
          read: true,
          type: 'text'
        },
        unreadCount: 0,
        createdAt: '2024-08-20T10:15:00Z',
        updatedAt: '2024-08-30T11:45:00Z'
      },
      {
        id: 'chat_003',
        participants: [userId, '4'],
        lastMessage: {
          id: 'msg_003',
          chatId: 'chat_003',
          senderId: '4',
          receiverId: userId,
          message: 'Really appreciate the recognition',
          timestamp: '2024-08-29T16:20:00Z',
          read: true,
          type: 'text'
        },
        unreadCount: 1,
        createdAt: '2024-08-18T14:30:00Z',
        updatedAt: '2024-08-29T16:20:00Z'
      }
    ];
  }

  private getMockMessages(chatId: string): ChatMessage[] {
    const messagesByChat: Record<string, ChatMessage[]> = {
      'chat_001': [
        {
          id: 'msg_001',
          chatId: 'chat_001',
          senderId: '1',
          receiverId: '2',
          message: 'Hey Sarah! Thanks for your help with the presentation. Here are some coins as a token of appreciation.',
          timestamp: '2024-08-31T13:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg_002',
          chatId: 'chat_001',
          senderId: '1',
          receiverId: '2',
          message: 'Sent 100 coins',
          timestamp: '2024-08-31T13:01:00Z',
          read: true,
          type: 'transaction',
          data: { amount: 100, transactionId: 'tx_001' }
        },
        {
          id: 'msg_003',
          chatId: 'chat_001',
          senderId: '2',
          receiverId: '1',
          message: 'Thanks for the coins! 🎉 Really appreciate it!',
          timestamp: '2024-08-31T14:30:00Z',
          read: false,
          type: 'text'
        }
      ],
      'chat_002': [
        {
          id: 'msg_004',
          chatId: 'chat_002',
          senderId: '3',
          receiverId: '1',
          message: 'The project went great! Your contributions were invaluable.',
          timestamp: '2024-08-30T11:45:00Z',
          read: true,
          type: 'text'
        }
      ],
      'chat_003': [
        {
          id: 'msg_005',
          chatId: 'chat_003',
          senderId: '4',
          receiverId: '1',
          message: 'Really appreciate the recognition. It means a lot!',
          timestamp: '2024-08-29T16:20:00Z',
          read: true,
          type: 'text'
        }
      ]
    };

    return messagesByChat[chatId] || [];
  }

  private createMockMessage(chatId: string, message: string, type: 'text' | 'transaction', data?: Record<string, any>): ChatMessage {
    return {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: '1', // Current user
      receiverId: 'other_user', // Would be determined from chat participants
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      data
    };
  }

  private createMockChat(userId1: string, userId2: string): ChatRoom {
    return {
      id: `chat_${Date.now()}`,
      participants: [userId1, userId2],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const chatService = new ChatService();