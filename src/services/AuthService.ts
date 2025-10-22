import { apiService } from './ApiService';
import { User } from '../types/user';
import { APP_CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../config/api-endpoints';

const {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
  ENABLE_DEBUG_LOGS,
  SESSION_TIMEOUT
} = APP_CONFIG;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SSOCredentials {
  provider: 'okta' | 'google' | 'microsoft';
  token: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  department?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  newPassword: string;
}

class AuthService {
  private currentUser: User | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  
  constructor() {
    // Check for stored user on initialization
    this.loadStoredUser();
    this.setupSessionManagement();
  }

  private log(message: string, ...args: any[]): void {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[AuthService] ${message}`, ...args);
    }
  }

  private logError(message: string, error: any): void {
    console.error(`[AuthService] ${message}`, error);
  }

  private loadStoredUser(): void {
    try {
      const storedUser = localStorage.getItem(USER_DATA_KEY);
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const sessionExpiry = localStorage.getItem('session_expiry');
      
      if (storedUser && storedToken) {
        // Check if session is still valid
        if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
          this.log('Session expired, clearing auth data');
          this.clearStoredAuth();
          return;
        }
        
        this.currentUser = JSON.parse(storedUser);
        apiService.setAuthToken(storedToken);
        this.log('User loaded from storage:', this.currentUser.username);
        
        // Setup session expiry timer
        this.setupSessionExpiry();
      }
    } catch (error) {
      this.logError('Failed to load stored user:', error);
      this.clearStoredAuth();
    }
  }

  private storeAuth(user: User, token: string, refreshToken: string): void {
    try {
      const sessionExpiry = Date.now() + SESSION_TIMEOUT;

      console.log(user);
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem('session_expiry', sessionExpiry.toString());
      localStorage.setItem('last_activity', Date.now().toString());
      
      apiService.setAuthToken(token);
      this.currentUser = user;
      
      this.setupSessionExpiry();
      
      this.log('Auth data stored for user:', user.username);
    } catch (error) {
      this.logError('Failed to store auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  private clearStoredAuth(): void {
    try {
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('session_expiry');
      localStorage.removeItem('last_activity');
      
      apiService.clearAuthData();
      this.currentUser = null;
      
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer);
        this.sessionTimer = null;
      }
      
      this.log('Auth data cleared');
    } catch (error) {
      this.logError('Failed to clear auth data:', error);
    }
  }

  private setupSessionManagement(): void {
    // Update last activity on user interaction
    const updateActivity = () => {
      if (this.isAuthenticated()) {
        localStorage.setItem('last_activity', Date.now().toString());
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check for session expiry every minute
    setInterval(() => {
      this.checkSessionValidity();
    }, 60000);
  }

  private setupSessionExpiry(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    const sessionExpiry = localStorage.getItem('session_expiry');
    if (sessionExpiry) {
      const timeUntilExpiry = parseInt(sessionExpiry) - Date.now();
      if (timeUntilExpiry > 0) {
        this.sessionTimer = setTimeout(() => {
          this.log('Session expired');
          this.logout();
        }, timeUntilExpiry);
      }
    }
  }

  private checkSessionValidity(): void {
    const sessionExpiry = localStorage.getItem('session_expiry');
    const lastActivity = localStorage.getItem('last_activity');
    
    if (!sessionExpiry || !lastActivity || !this.isAuthenticated()) {
      return;
    }

    const now = Date.now();
    const expiry = parseInt(sessionExpiry);
    const activity = parseInt(lastActivity);

    // Check if session has expired
    if (now > expiry) {
      this.log('Session expired due to timeout');
      this.logout();
      return;
    }

    // Check if user has been inactive for too long
    const inactivityLimit = 30 * 60 * 1000; // 30 minutes
    if (now - activity > inactivityLimit) {
      this.log('Session expired due to inactivity');
      this.logout();
      return;
    }
  }

  async loginWithSSO(credentials: SSOCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      this.log('Attempting SSO login with provider:', credentials.provider);
      
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.sso, credentials);
      
      this.storeAuth(response.user, response.token, response.refreshToken);
      this.log('SSO Login successful for user:', response.user.username);
      
      return { success: true, user: response.user };
    } catch (error: any) {
      this.logError('SSO Login failed:', error);
      return {
        success: false,
        error: error.data?.message || error.message || 'SSO Login failed'
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      this.log('Attempting login for:', credentials.email);
      
      // Backend integration code (uncomment when backend is ready):
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
      
      this.log("------")
      this.log(JSON.stringify(response));
      this.log("------")
      
      this.storeAuth(response.user, response.token, response.refreshToken);
      this.log('Login successful for user:', response.user.username);
      
      return { success: true, user: response.user };
      
    } catch (error: any) {
      this.logError('Login failed:', error);
      
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Login failed' 
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      this.log('Attempting registration for:', credentials.email);
      
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, credentials);
      
      this.storeAuth(response.user, response.token, response.refreshToken);
      this.log('Registration successful for user:', response.user.username);
      
      return { success: true, user: response.user };
      
    } catch (error: any) {
      this.logError('Registration failed:', error);
      
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Registration failed' 
      };
    }
  }

  async logout(): Promise<void> {
    try {
      this.log('Logging out user');

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await apiService.post(API_ENDPOINTS.auth.logout, { refreshToken });
      }
    } catch (error) {
      this.logError('Logout request failed:', error);
    } finally {
      this.clearStoredAuth();
      this.log('Logout completed');
      
      // Redirect to login page or emit logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.log('Requesting password reset for:', email);
      
      await apiService.post(API_ENDPOINTS.auth.resetPassword, { email });
      this.log('Password reset request sent successfully');
      
      return { success: true };
    } catch (error: any) {
      this.logError('Password reset failed:', error);
      
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Password reset failed' 
      };
    }
  }

  async confirmResetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.log('Confirming password reset');
      
      await apiService.post(API_ENDPOINTS.auth.confirmResetPassword, { token, newPassword });
      this.log('Password reset confirmed successfully');
      
      return { success: true };
    } catch (error: any) {
      this.logError('Password reset confirmation failed:', error);
      
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Password reset confirmation failed' 
      };
    }
  }

  async refreshToken(): Promise<{ success: boolean; error?: string }> {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      this.log('Refreshing authentication token');
      
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.refresh, { refreshToken });
      
      this.storeAuth(response.user, response.token, response.refreshToken);
      this.log('Token refreshed successfully');
      
      return { success: true };
    } catch (error: any) {
      this.logError('Token refresh failed:', error);
      this.clearStoredAuth();
      
      // Emit token refresh failed event
      window.dispatchEvent(new CustomEvent('auth:token-refresh-failed'));
      
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Token refresh failed' 
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      this.log('Fetching current user from API');
      
      // TODO: Remove mock user when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        // Return stored user for mock mode
        const storedUser = localStorage.getItem(USER_DATA_KEY);
        if (storedUser) {
          this.currentUser = JSON.parse(storedUser);
          return this.currentUser;
        }
        return null;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const user = await apiService.get<User>(API_ENDPOINTS.auth.me);
      this.currentUser = user;
      
      // Update stored user data
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      
      return user;
      */
      
      // Fallback for mock mode
      const storedUser = localStorage.getItem(USER_DATA_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      }
      return null;
      
    } catch (error) {
      this.logError('Failed to get current user:', error);
      this.clearStoredAuth();
      return null;
    }
  }

  async verifyPin(pin: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.log('Verifying PIN');
      
      await apiService.post(API_ENDPOINTS.auth.verifyPin, { pin });
      this.log('PIN verified successfully');
      
      return { success: true };
    } catch (error: any) {
      this.logError('PIN verification failed:', error);
      
      return {
        success: false,
        error: error.data?.message || error.message || 'PIN verification failed'
      };
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Mock authentication for development
  private async mockLogin(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock users for development
    const mockUsers: User[] = [
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
      }
    ];

    const foundUser = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (credentials.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Mock tokens
    const mockToken = `mock_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_token_${Date.now()}`;

    this.storeAuth(foundUser, mockToken, mockRefreshToken);

    return { success: true, user: foundUser };
  }

  // Mock registration for development
  private async mockRegister(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists in mock users
    const mockUsers = this.getMockUsers();
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    if (credentials.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Create new mock user
    const newUser: User = {
      id: `mock_user_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces`,
      balance: 1000, // Starting balance
      role: 'user',
      online: true,
      department: credentials.department || 'General',
      joinDate: new Date().toISOString().split('T')[0],
      badges: []
    };

    // Mock tokens
    const mockToken = `mock_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_token_${Date.now()}`;

    this.storeAuth(newUser, mockToken, mockRefreshToken);

    return { success: true, user: newUser };
  }

  private getMockUsers(): User[] {
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
      }
    ];
  }
}

// Export singleton instance
export const authService = new AuthService();