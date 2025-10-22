import { User, Badge, ChatUser, Transaction } from '../types/user';
import { apiService } from './ApiService';
import { APP_CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { logger } from '../utils/simple-logger';
import { errorHandler, ErrorCode } from '../utils/simple-error-handler';

const { ENABLE_DEBUG_LOGS, DEFAULT_PAGE_SIZE, MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } = APP_CONFIG;

// Simple URL builder function
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export interface UserSearchFilters {
  query?: string;
  department?: string;
  role?: string;
  online?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  department?: string;
  avatar?: string;
}

class UserService {
  private users: User[] = [];
  private initialized = false;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeUsers();
  }

  private log(message: string, ...args: any[]): void {
    if (ENABLE_DEBUG_LOGS) {
      logger.debug(message, 'UserService', ...args);
    }
  }

  private logError(message: string, error: any): void {
    logger.error(message, error, 'UserService');
  }

  private async initializeUsers(): Promise<void> {
    if (this.initialized) return;
    
    this.log('Initializing users');
    
    // TODO: Remove mock data when backend is ready
    // if (APP_CONFIG.ENABLE_MOCK_DATA) {
    //   this.log('Using mock users (ENABLE_MOCK_DATA = true)');
    //   this.users = this.getHardcodedUsers();
    //   this.initialized = true;
    //   this.log(`Initialized ${this.users.length} mock users`);
    //   return;
    // }
    
    // Backend integration code (uncomment when backend is ready):
  
    const users = await apiService.get<User[]>(API_ENDPOINTS.users.list);
    this.users = users;
    this.initialized = true;
    
    this.log(`Initialized ${users.length} users from API`);
    
    
    // Fallback to mock for now
    // this.users = this.getHardcodedUsers();
    this.initialized = true;
    this.log(`Initialized ${this.users.length} users`);
  }

  private setCache(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private getHardcodedUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
        balance: 2450,
        role: 'user',
        online: true,
        department: 'Engineering',
        joinDate: '2023-01-15',
        badges: [
          {
            id: 'team-player',
            name: 'Team Player',
            description: 'Recognized for excellent collaboration',
            icon: '🤝',
            category: 'recognition',
            rarity: 'common',
            earnedAt: '2024-01-15'
          },
          {
            id: 'innovation-star',
            name: 'Innovation Star',
            description: 'Contributed innovative solutions',
            icon: '🌟',
            category: 'achievement',
            rarity: 'rare',
            earnedAt: '2024-02-20'
          }
        ]
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        balance: 1890,
        role: 'user',
        online: false,
        department: 'Product',
        joinDate: '2023-03-10',
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
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
        balance: 3200,
        role: 'user',
        online: true,
        department: 'Design',
        joinDate: '2022-11-05',
        badges: [
          {
            id: 'creative-genius',
            name: 'Creative Genius',
            description: 'Outstanding design contributions',
            icon: '🎨',
            category: 'achievement',
            rarity: 'epic',
            earnedAt: '2024-02-10'
          },
          {
            id: 'problem-solver',
            name: 'Problem Solver',
            description: 'Solved complex technical challenges',
            icon: '🧩',
            category: 'achievement',
            rarity: 'rare',
            earnedAt: '2024-01-25'
          }
        ]
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
        balance: 1650,
        role: 'user',
        online: false,
        department: 'Marketing',
        joinDate: '2023-06-20',
        badges: [
          {
            id: 'leader',
            name: 'Leader',
            description: 'Demonstrated excellent leadership',
            icon: '👑',
            category: 'recognition',
            rarity: 'epic',
            earnedAt: '2024-02-05'
          }
        ]
      },
      {
        id: '5',
        name: 'Alex Torres',
        email: 'alex.torres@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
        balance: 2800,
        role: 'user',
        online: true,
        department: 'Engineering',
        joinDate: '2023-02-14',
        badges: [
          {
            id: 'code-master',
            name: 'Code Master',
            description: 'Written exceptional code',
            icon: '💻',
            category: 'achievement',
            rarity: 'rare',
            earnedAt: '2024-01-20'
          }
        ]
      },
      {
        id: '6',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
        balance: 2200,
        role: 'admin',
        online: true,
        department: 'HR',
        joinDate: '2022-08-10',
        badges: [
          {
            id: 'culture-champion',
            name: 'Culture Champion',
            description: 'Promoted positive company culture',
            icon: '🏆',
            category: 'special',
            rarity: 'legendary',
            earnedAt: '2024-01-10'
          },
          {
            id: 'team-builder',
            name: 'Team Builder',
            description: 'Built strong team relationships',
            icon: '🏗️',
            category: 'recognition',
            rarity: 'rare',
            earnedAt: '2024-02-15'
          }
        ]
      }
    ];
  }

  async getAllUsers(refresh: boolean = false): Promise<User[]> {
    const cacheKey = 'all_users';
    
    if (!refresh) {
      const cached = this.getCache<User[]>(cacheKey);
      if (cached) {
        this.log('Returning cached users');
        return cached;
      }
    }

    try {
      this.log('Fetching all users');
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock users (ENABLE_MOCK_DATA = true)');
        await this.initializeUsers();
        this.setCache(cacheKey, this.users);
        return [...this.users];
      }
      
      // Backend integration code (uncomment when backend is ready):
      
      const users = await apiService.get<User[]>(API_ENDPOINTS.users.list);
      this.users = users;
      this.setCache(cacheKey, users);
      
      this.log(`Fetched ${users.length} users from API`);
      
      return users;
      
      
      // Fallback to mock for now
      // await this.initializeUsers();
      // this.setCache(cacheKey, this.users);
      // return [...this.users];
      
    } catch (error) {
      this.logError('Failed to fetch users from API:', error);
      
      if (error.code === ErrorCode.NETWORK_ERROR) {
        this.log('Using cached/hardcoded data');
        await this.initializeUsers();
        return [...this.users];
      }
      
      throw errorHandler.handleError(error as Error, 'getAllUsers');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    const cacheKey = `user_${id}`;
    const cached = this.getCache<User>(cacheKey);
    if (cached) {
      this.log('Returning cached user:', id);
      return cached;
    }

    try {
      this.log('Fetching user by ID:', id);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock user lookup (ENABLE_MOCK_DATA = true)');
        await this.initializeUsers();
        const user = this.users.find(user => user.id === id) || null;
        if (user) {
          this.setCache(cacheKey, user);
        }
        return user;
      }
      
      const user = await apiService.get<User>(API_ENDPOINTS.users.byId(id));
      this.setCache(cacheKey, user);
      
      this.log('User fetched successfully:', user.email);
      
      return user;
      
      
      // Fallback to mock for now
      // await this.initializeUsers();
      // const user = this.users.find(user => user.id === id) || null;
      // if (user) {
      //   this.setCache(cacheKey, user);
      // }
      // return user;
      
    } catch (error) {
      this.logError('Failed to fetch user:', error);
      
      if (error.status === 404) {
        return null;
      }
      
      if (error.code === ErrorCode.NETWORK_ERROR) {
        this.log('Using cached data for user:', id);
        await this.initializeUsers();
        return this.users.find(user => user.id === id) || null;
      }
      
      throw errorHandler.handleError(error as Error, 'getUserById');
    }
  }

  async getUsersForChat(): Promise<ChatUser[]> {
    const cacheKey = 'chat_users';
    const cached = this.getCache<ChatUser[]>(cacheKey);
    if (cached) {
      this.log('Returning cached chat users');
      return cached;
    }

    try {
      this.log('Fetching chat users');
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock chat users (ENABLE_MOCK_DATA = true)');
        await this.initializeUsers();
        
        // Add chat-specific data to users
        const chatUsers: ChatUser[] = this.users.map(user => ({
          ...user,
          lastMessage: this.getLastMessageForUser(user.id),
          lastMessageTime: this.getLastMessageTimeForUser(user.id),
          unread: this.getUnreadCountForUser(user.id),
          transactionId: `tx_${user.id.padStart(3, '0')}`
        }));

        this.setCache(cacheKey, chatUsers);
        return chatUsers.filter(user => user.id !== 'current-user');
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const chatUsers = await apiService.get<ChatUser[]>(`${API_ENDPOINTS.users.list}/chat`);
      this.setCache(cacheKey, chatUsers);
      
      this.log(`Fetched ${chatUsers.length} chat users`);
      
      return chatUsers;
      */
      
      // Fallback to mock for now
      await this.initializeUsers();
      
      // Add chat-specific data to users
      const chatUsers: ChatUser[] = this.users.map(user => ({
        ...user,
        lastMessage: this.getLastMessageForUser(user.id),
        lastMessageTime: this.getLastMessageTimeForUser(user.id),
        unread: this.getUnreadCountForUser(user.id),
        transactionId: `tx_${user.id.padStart(3, '0')}`
      }));

      this.setCache(cacheKey, chatUsers);
      return chatUsers.filter(user => user.id !== 'current-user');
      
    } catch (error) {
      this.logError('Failed to fetch chat users:', error);
      
      if (error.code === ErrorCode.NETWORK_ERROR) {
        this.log('Using cached data for chat users');
        await this.initializeUsers();
        
        // Add chat-specific data to users
        const chatUsers: ChatUser[] = this.users.map(user => ({
          ...user,
          lastMessage: this.getLastMessageForUser(user.id),
          lastMessageTime: this.getLastMessageTimeForUser(user.id),
          unread: this.getUnreadCountForUser(user.id),
          transactionId: `tx_${user.id.padStart(3, '0')}`
        }));

        return chatUsers.filter(user => user.id !== 'current-user');
      }
      
      throw errorHandler.handleError(error as Error, 'getUsersForChat');
    }
  }

  async searchUsers(filters: UserSearchFilters): Promise<User[]> {
    const { query, department, role, online, limit = DEFAULT_PAGE_SIZE, offset = 0 } = filters;
    
    const cacheKey = `search_users_${JSON.stringify(filters)}`;
    const cached = this.getCache<User[]>(cacheKey);
    if (cached) {
      this.log('Returning cached search results');
      return cached;
    }

    try {
      this.log('Searching users with filters:', filters);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock user search (ENABLE_MOCK_DATA = true)');
        await this.initializeUsers();
        
        let filtered = [...this.users];
        
        if (query) {
          const lowercaseQuery = query.toLowerCase();
          filtered = filtered.filter(user => 
            user.username.toLowerCase().includes(lowercaseQuery) ||
            user.email.toLowerCase().includes(lowercaseQuery) ||
            user.department?.toLowerCase().includes(lowercaseQuery)
          );
        }
        
        if (department) {
          filtered = filtered.filter(user => user.department === department);
        }
        
        if (role) {
          filtered = filtered.filter(user => user.role === role);
        }
        
        if (online !== undefined) {
          filtered = filtered.filter(user => user.online === online);
        }
        
        const result = filtered.slice(offset, offset + limit);
        this.setCache(cacheKey, result, 2 * 60 * 1000);
        
        return result;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const params: Record<string, any> = { limit, offset };
      if (query) params.q = query;
      if (department) params.department = department;
      if (role) params.role = role;
      if (online !== undefined) params.online = online;
      
      const endpoint = buildUrl(API_ENDPOINTS.users.search, params);
      const users = await apiService.get<User[]>(endpoint);
      
      this.setCache(cacheKey, users, 2 * 60 * 1000); // 2 minute cache for search
      
      this.log(`Found ${users.length} users matching filters`);
      
      return users;
      */
      
      // Fallback to mock for now
      await this.initializeUsers();
      
      let filtered = [...this.users];
      
      if (query) {
        const lowercaseQuery = query.toLowerCase();
        filtered = filtered.filter(user => 
          user.username.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.department?.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      if (department) {
        filtered = filtered.filter(user => user.department === department);
      }
      
      if (role) {
        filtered = filtered.filter(user => user.role === role);
      }
      
      if (online !== undefined) {
        filtered = filtered.filter(user => user.online === online);
      }
      
      const result = filtered.slice(offset, offset + limit);
      this.setCache(cacheKey, result, 2 * 60 * 1000);
      
      return result;
      
    } catch (error) {
      this.logError('Failed to search users:', error);
      
      if (error.code === ErrorCode.NETWORK_ERROR && query) {
        this.log('Using cached data for search');
        await this.initializeUsers();
        
        const lowercaseQuery = query.toLowerCase();
        let filtered = this.users.filter(user => 
          user.username.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.department?.toLowerCase().includes(lowercaseQuery)
        );
        
        if (department) {
          filtered = filtered.filter(user => user.department === department);
        }
        
        if (role) {
          filtered = filtered.filter(user => user.role === role);
        }
        
        if (online !== undefined) {
          filtered = filtered.filter(user => user.online === online);
        }
        
        return filtered.slice(offset, offset + limit);
      }
      
      throw errorHandler.handleError(error as Error, 'searchUsers');
    }
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    if (!department) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'Department is required');
    }

    return this.searchUsers({ department });
  }

  async getOnlineUsers(): Promise<User[]> {
    return this.searchUsers({ online: true });
  }

  // Mock functions for chat data - in real app this would come from messages/transactions
  private getLastMessageForUser(userId: string): string {
    const messages: { [key: string]: string } = {
      '1': 'Thanks for the coins! 🎉',
      '2': 'The project went great!',
      '3': 'Really appreciate the recognition',
      '4': 'Looking forward to collaborating more!',
      '5': 'Great work everyone!',
      '6': 'Team meeting at 3 PM today'
    };
    return messages[userId] || 'No messages yet';
  }

  private getLastMessageTimeForUser(userId: string): string {
    const times: { [key: string]: string } = {
      '1': '2:30 PM',
      '2': '11:45 AM',
      '3': 'Yesterday',
      '4': '3 days ago',
      '5': '1 hour ago',
      '6': '30 min ago'
    };
    return times[userId] || 'Never';
  }

  private getUnreadCountForUser(userId: string): number {
    const unreadCounts: { [key: string]: number } = {
      '1': 2,
      '2': 0,
      '3': 1,
      '4': 0,
      '5': 3,
      '6': 1
    };
    return unreadCounts[userId] || 0;
  }

  // User management operations
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      this.log('Creating new user:', userData.email);
      
      // Validate user data
      this.validateUserData(userData);
      
      const user = await apiService.post<User>(API_ENDPOINTS.users.create, userData);
      
      // Clear relevant caches
      this.clearCache('users');
      
      this.log('User created successfully:', user.id);
      
      // Emit user created event
      window.dispatchEvent(new CustomEvent('user:created', { detail: user }));
      
      return user;
    } catch (error) {
      this.logError('Failed to create user:', error);
      throw errorHandler.handleError(error as Error, 'createUser');
    }
  }

  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    try {
      this.log('Updating user:', id);
      
      // Validate update data
      this.validateUserUpdateData(userData);
      
      const user = await apiService.put<User>(API_ENDPOINTS.users.update(id), userData);
      
      // Update cache
      this.setCache(`user_${id}`, user);
      this.clearCache('users');
      
      this.log('User updated successfully:', id);
      
      // Emit user updated event
      window.dispatchEvent(new CustomEvent('user:updated', { detail: user }));
      
      return user;
    } catch (error) {
      this.logError('Failed to update user:', error);
      throw errorHandler.handleError(error as Error, 'updateUser');
    }
  }

  async updateUserProfile(id: string, profileData: UserUpdateData): Promise<User> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    try {
      this.log('Updating user profile:', id);
      
      const user = await apiService.put<User>(API_ENDPOINTS.users.updateProfile(id), profileData);
      
      // Update cache
      this.setCache(`user_${id}`, user);
      this.clearCache('users');
      
      this.log('User profile updated successfully');
      
      return user;
    } catch (error) {
      this.logError('Failed to update user profile:', error);
      throw errorHandler.handleError(error as Error, 'updateUserProfile');
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    try {
      this.log('Deleting user:', id);
      
      await apiService.delete(API_ENDPOINTS.users.delete(id));
      
      // Clear caches
      this.cache.delete(`user_${id}`);
      this.clearCache('users');
      
      this.log('User deleted successfully:', id);
      
      // Emit user deleted event
      window.dispatchEvent(new CustomEvent('user:deleted', { detail: { id } }));
    } catch (error) {
      this.logError('Failed to delete user:', error);
      throw errorHandler.handleError(error as Error, 'deleteUser');
    }
  }

  async uploadUserAvatar(id: string, file: File): Promise<{ avatarUrl: string }> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    if (!file) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'File is required');
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw errorHandler.createError(
        ErrorCode.VALIDATION_ERROR,
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      throw errorHandler.createError(
        ErrorCode.VALIDATION_ERROR,
        'File must be a valid image type (JPEG, PNG, WebP, or GIF)'
      );
    }

    try {
      this.log('Uploading user avatar:', { userId: id, fileName: file.name, fileSize: file.size });
      
      const result = await apiService.uploadFile(
        API_ENDPOINTS.users.uploadAvatar(id),
        file,
        (progress) => {
          // Emit progress event
          window.dispatchEvent(new CustomEvent('avatar:upload-progress', { 
            detail: { userId: id, progress } 
          }));
        }
      );
      
      // Clear user cache to force refresh
      this.cache.delete(`user_${id}`);
      
      this.log('Avatar uploaded successfully:', result.avatarUrl);
      
      // Emit avatar uploaded event
      window.dispatchEvent(new CustomEvent('avatar:uploaded', { 
        detail: { userId: id, avatarUrl: result.avatarUrl } 
      }));
      
      return result;
    } catch (error) {
      this.logError('Failed to upload avatar:', error);
      throw errorHandler.handleError(error as Error, 'uploadUserAvatar');
    }
  }

  async getUserSettings(id: string): Promise<any> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    try {
      this.log('Fetching user settings:', id);
      
      const settings = await apiService.get(API_ENDPOINTS.users.settings(id));
      
      this.log('User settings fetched successfully');
      
      return settings;
    } catch (error) {
      this.logError('Failed to fetch user settings:', error);
      throw errorHandler.handleError(error as Error, 'getUserSettings');
    }
  }

  async updateUserSettings(id: string, settings: any): Promise<any> {
    if (!id) {
      throw errorHandler.createError(ErrorCode.VALIDATION_ERROR, 'User ID is required');
    }

    try {
      this.log('Updating user settings:', id);
      
      const updatedSettings = await apiService.put(API_ENDPOINTS.users.settings(id), settings);
      
      this.log('User settings updated successfully');
      
      return updatedSettings;
    } catch (error) {
      this.logError('Failed to update user settings:', error);
      throw errorHandler.handleError(error as Error, 'updateUserSettings');
    }
  }

  // Validation methods
  private validateUserData(userData: Omit<User, 'id'>): void {
    const errors: string[] = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email address is required');
    }

    if (userData.department && userData.department.trim().length < 2) {
      errors.push('Department must be at least 2 characters long');
    }

    if (errors.length > 0) {
      throw errorHandler.createError(
        ErrorCode.VALIDATION_ERROR,
        `User validation failed: ${errors.join(', ')}`,
        'UserValidation',
        { errors }
      );
    }
  }

  private validateUserUpdateData(userData: UserUpdateData): void {
    const errors: string[] = [];

    if (userData.name !== undefined && userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (userData.email !== undefined && !this.isValidEmail(userData.email)) {
      errors.push('Valid email address is required');
    }

    if (userData.department !== undefined && userData.department.trim().length < 2) {
      errors.push('Department must be at least 2 characters long');
    }

    if (errors.length > 0) {
      throw errorHandler.createError(
        ErrorCode.VALIDATION_ERROR,
        `User update validation failed: ${errors.join(', ')}`,
        'UserValidation',
        { errors }
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export a singleton instance
export const userService = new UserService();