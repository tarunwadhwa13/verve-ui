import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/AuthService';
import { User } from '../types/user';
import { validateSSOConfig, getSSOLoginURL } from '../config/sso-config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithSSO: (provider: 'okta' | 'google' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (username: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token might be expired, clear auth
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.login({ username, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const loginWithSSO = async (provider: 'okta' | 'google' | 'microsoft'): Promise<{ success: boolean; error?: string }> => {
    try {
      // Open the SSO provider's login page in a popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      // Validate SSO configuration before proceeding
      const validation = validateSSOConfig(provider);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const loginUrl = getSSOLoginURL(provider);
      const popup = window.open(
        loginUrl,
        'sso-popup',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Failed to open SSO login window. Please allow popups for this site.');
      }

      // Listen for the SSO callback
      const result = await new Promise<{ token: string }>((resolve, reject) => {
        window.addEventListener('message', function onMessage(event) {
          // Verify origin
          if (event.origin !== window.location.origin) return;
          
          if (event.data?.type === 'sso-success') {
            window.removeEventListener('message', onMessage);
            resolve({ token: event.data.token });
          } else if (event.data?.type === 'sso-error') {
            window.removeEventListener('message', onMessage);
            reject(new Error(event.data.error));
          }
        });
      });

      // Complete SSO login with the token
      const loginResult = await authService.loginWithSSO({ provider, token: result.token });
      
      if (loginResult.success && loginResult.user) {
        setUser(loginResult.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: loginResult.error || 'SSO login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'SSO login failed' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithSSO,
    logout,
    resetPassword,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}