export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  balance: number;
  badges?: Badge[];
  role?: 'admin' | 'user';
  online?: boolean;
  department?: string;
  joinDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: 'recognition' | 'achievement' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChatUser extends User {
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
  transactionId?: string;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
}