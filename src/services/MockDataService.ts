/**
 * Mock Data Service
 * Provides mock data for development and testing when backend is not available
 * This service simulates backend responses with realistic data
 */

import { User, Transaction, Badge, Notification } from '../types/user';

export class MockDataService {
  // Mock Users
  static getMockUsers(): User[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
        balance: 2450,
        role: 'admin',
        online: true,
        department: 'Engineering',
        joinDate: '2023-01-15',
        badges: [
          {
            id: 'first_send',
            name: 'First Send',
            description: 'Sent your first coins',
            icon: '🚀',
            category: 'achievement',
            rarity: 'common',
            earnedAt: '2024-08-25'
          }
        ]
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
        balance: 1850,
        role: 'user',
        online: true,
        department: 'Design',
        joinDate: '2023-02-10',
        badges: []
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        balance: 3200,
        role: 'user',
        online: false,
        department: 'Product',
        joinDate: '2022-11-05',
        badges: [
          {
            id: 'mentor',
            name: 'Mentor',
            description: 'Helped onboard new team members',
            icon: '👨‍🏫',
            category: 'recognition',
            rarity: 'rare',
            earnedAt: '2024-01-30'
          }
        ]
      },
      {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
        balance: 2800,
        role: 'user',
        online: true,
        department: 'Marketing',
        joinDate: '2023-06-20',
        badges: [
          {
            id: 'creative_genius',
            name: 'Creative Genius',
            description: 'Outstanding creative contributions',
            icon: '🎨',
            category: 'achievement',
            rarity: 'epic',
            earnedAt: '2024-02-10'
          }
        ]
      },
      {
        id: '5',
        name: 'Alex Torres',
        email: 'alex.torres@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
        balance: 1650,
        role: 'user',
        online: true,
        department: 'Engineering',
        joinDate: '2023-03-14',
        badges: []
      },
      {
        id: '6',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
        balance: 2200,
        role: 'user',
        online: false,
        department: 'HR',
        joinDate: '2022-08-10',
        badges: [
          {
            id: 'culture_champion',
            name: 'Culture Champion',
            description: 'Promoted positive company culture',
            icon: '🏆',
            category: 'special',
            rarity: 'legendary',
            earnedAt: '2024-01-10'
          }
        ]
      }
    ];
  }

  // Mock Transactions
  static getMockTransactions(userId?: string): Transaction[] {
    const baseTransactions: Transaction[] = [
      {
        id: 'tx_001',
        fromUserId: '1',
        toUserId: '2',
        amount: 100,
        message: 'Thanks for your help with the project!',
        timestamp: '2024-08-31T10:30:00Z',
        type: 'sent'
      },
      {
        id: 'tx_002',
        fromUserId: '3',
        toUserId: '1',
        amount: 75,
        message: 'Great presentation yesterday',
        timestamp: '2024-08-30T15:20:00Z',
        type: 'received'
      },
      {
        id: 'tx_003',
        fromUserId: '1',
        toUserId: '4',
        amount: 50,
        message: 'Welcome to the team!',
        timestamp: '2024-08-29T09:15:00Z',
        type: 'sent'
      },
      {
        id: 'tx_004',
        fromUserId: '5',
        toUserId: '1',
        amount: 120,
        message: 'Excellent code review',
        timestamp: '2024-08-28T14:45:00Z',
        type: 'received'
      },
      {
        id: 'tx_005',
        fromUserId: '1',
        toUserId: '6',
        amount: 80,
        message: 'Thanks for the mentoring session',
        timestamp: '2024-08-27T11:30:00Z',
        type: 'sent'
      }
    ];

    if (userId) {
      return baseTransactions.filter(tx => 
        tx.fromUserId === userId || tx.toUserId === userId
      );
    }

    return baseTransactions;
  }

  // Mock Badges
  static getMockBadges(): Badge[] {
    return [
      {
        id: 'first_send',
        name: 'First Send',
        description: 'Sent your first coins',
        icon: '🚀',
        category: 'achievement',
        rarity: 'common'
      },
      {
        id: 'generous_giver',
        name: 'Generous Giver',
        description: 'Sent over 1000 coins total',
        icon: '💝',
        category: 'achievement',
        rarity: 'rare'
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Recognized for excellent collaboration',
        icon: '🤝',
        category: 'recognition',
        rarity: 'common'
      },
      {
        id: 'mentor',
        name: 'Mentor',
        description: 'Helped onboard new team members',
        icon: '👨‍🏫',
        category: 'recognition',
        rarity: 'rare'
      },
      {
        id: 'creative_genius',
        name: 'Creative Genius',
        description: 'Outstanding creative contributions',
        icon: '🎨',
        category: 'achievement',
        rarity: 'epic'
      },
      {
        id: 'culture_champion',
        name: 'Culture Champion',
        description: 'Promoted positive company culture',
        icon: '🏆',
        category: 'special',
        rarity: 'legendary'
      }
    ];
  }

  // Mock Notifications
  static getMockNotifications(userId: string): Notification[] {
    return [
      {
        id: 'notif_001',
        userId,
        type: 'transaction_received',
        title: 'Coins Received!',
        message: 'You received 100 coins from John Doe',
        read: false,
        timestamp: '2024-08-31T10:30:00Z',
        data: {
          transactionId: 'tx_001',
          amount: 100,
          fromUser: 'John Doe'
        }
      },
      {
        id: 'notif_002',
        userId,
        type: 'badge_earned',
        title: 'New Badge Earned!',
        message: 'You earned the "Team Player" badge',
        read: false,
        timestamp: '2024-08-30T15:20:00Z',
        data: {
          badgeId: 'team_player',
          badgeName: 'Team Player'
        }
      },
      {
        id: 'notif_003',
        userId,
        type: 'system',
        title: 'Welcome to Verve!',
        message: 'Start recognizing your colleagues today',
        read: true,
        timestamp: '2024-08-29T09:15:00Z',
        data: {}
      }
    ];
  }

  // Mock Transaction Stats
  static getMockTransactionStats() {
    return {
      totalSent: 1250,
      totalReceived: 950,
      transactionCount: 24,
      averageAmount: 91.7,
      monthlyData: [
        { month: 'Jan', sent: 200, received: 150 },
        { month: 'Feb', sent: 180, received: 200 },
        { month: 'Mar', sent: 220, received: 175 },
        { month: 'Apr', sent: 250, received: 180 },
        { month: 'May', sent: 190, received: 195 },
        { month: 'Jun', sent: 210, received: 150 },
      ]
    };
  }

  // Mock Chat Messages
  static getMockChatMessages(conversationId: string) {
    const baseMessages = [
      {
        id: 'msg_001',
        conversationId,
        senderId: '2',
        content: 'Thanks for the coins! Really appreciate the recognition 🎉',
        timestamp: '2024-08-31T10:30:00Z',
        read: true
      },
      {
        id: 'msg_002',
        conversationId,
        senderId: '1',
        content: 'You deserved it! Your work on the project was fantastic.',
        timestamp: '2024-08-31T10:32:00Z',
        read: true
      },
      {
        id: 'msg_003',
        conversationId,
        senderId: '2',
        content: 'Looking forward to our next collaboration!',
        timestamp: '2024-08-31T10:35:00Z',
        read: false
      }
    ];

    return baseMessages;
  }

  // Simulate API delay
  static async simulateApiDelay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create mock transaction
  static createMockTransaction(fromUserId: string, toUserId: string, amount: number, message: string): Transaction {
    return {
      id: `tx_${Date.now()}`,
      fromUserId,
      toUserId,
      amount,
      message,
      timestamp: new Date().toISOString(),
      type: 'sent'
    };
  }

  // Create mock user
  static createMockUser(userData: Partial<User>): User {
    return {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@company.com',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      balance: userData.balance || 1000,
      role: userData.role || 'user',
      online: userData.online ?? true,
      department: userData.department || 'General',
      joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
      badges: userData.badges || []
    };
  }

  // Generate random mock data
  static generateRandomTransaction(): Transaction {
    const users = this.getMockUsers();
    const fromUser = users[Math.floor(Math.random() * users.length)];
    const toUser = users[Math.floor(Math.random() * users.length)];
    
    if (fromUser.id === toUser.id) {
      return this.generateRandomTransaction(); // Try again if same user
    }

    const amounts = [25, 50, 75, 100, 125, 150, 200];
    const messages = [
      'Great work on the project!',
      'Thanks for your help!',
      'Excellent presentation!',
      'Keep up the good work!',
      'Thanks for the mentoring!',
      'Outstanding contribution!'
    ];

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toISOString(),
      type: 'sent'
    };
  }
}

export default MockDataService;