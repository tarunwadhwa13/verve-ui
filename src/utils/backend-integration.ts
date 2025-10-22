/**
 * Backend Integration Utilities
 * This file contains utilities and helpers for integrating with the backend API
 * It provides a centralized way to manage API calls and data transformations
 */

import { apiService } from '../services/ApiService';
import { APP_CONFIG } from '../config/config';

// Backend Integration Status
export interface BackendStatus {
  connected: boolean;
  authenticated: boolean;
  version?: string;
  latency?: number;
  lastChecked: Date;
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
  };
}

// Backend Integration Manager
export class BackendIntegration {
  private static instance: BackendIntegration;
  private status: BackendStatus = {
    connected: false,
    authenticated: false,
    lastChecked: new Date()
  };

  private constructor() {}

  static getInstance(): BackendIntegration {
    if (!BackendIntegration.instance) {
      BackendIntegration.instance = new BackendIntegration();
    }
    return BackendIntegration.instance;
  }

  // Check if backend is available
  async checkBackendHealth(): Promise<BackendStatus> {
    try {
      const startTime = Date.now();
      
      const response = await apiService.healthCheck();
      
      this.status = {
        connected: response.available,
        authenticated: !!apiService.getAuthToken(),
        version: response.version,
        latency: response.latency,
        lastChecked: new Date()
      };

      return this.status;
    } catch (error) {
      console.error('Backend health check failed:', error);
      
      this.status = {
        connected: false,
        authenticated: false,
        lastChecked: new Date()
      };

      return this.status;
    }
  }

  // Get current backend status
  getStatus(): BackendStatus {
    return { ...this.status };
  }

  // Check if should use mock data
  shouldUseMockData(): boolean {
    return APP_CONFIG.ENABLE_MOCK_DATA || !this.status.connected;
  }

  // Wrapper for API calls with fallback to mock data
  async apiCallWithFallback<T>(
    apiCall: () => Promise<T>,
    mockData: T,
    operationName: string
  ): Promise<T> {
    if (this.shouldUseMockData()) {
      console.log(`[BackendIntegration] Using mock data for ${operationName}`);
      // Simulate API delay for realistic testing
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData;
    }

    try {
      console.log(`[BackendIntegration] Making API call for ${operationName}`);
      return await apiCall();
    } catch (error) {
      console.warn(`[BackendIntegration] API call failed for ${operationName}, falling back to mock data:`, error);
      return mockData;
    }
  }

  // Format API response
  formatApiResponse<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Format error response
  formatErrorResponse(error: string, meta?: any): ApiResponse {
    return {
      success: false,
      error,
      meta: {
        ...meta,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Transform data for frontend consumption
  transformUserData(backendUser: any): any {
    // TODO: Add transformation logic when backend structure is known
    /*
    return {
      id: backendUser.user_id,
      name: backendUser.full_name,
      email: backendUser.email_address,
      avatar: backendUser.profile_image_url,
      balance: backendUser.coin_balance,
      role: backendUser.user_role,
      online: backendUser.is_online,
      department: backendUser.department_name,
      joinDate: backendUser.created_at,
      badges: backendUser.badges?.map(this.transformBadgeData) || []
    };
    */
    
    // For now, return as-is
    return backendUser;
  }

  transformTransactionData(backendTransaction: any): any {
    // TODO: Add transformation logic when backend structure is known
    /*
    return {
      id: backendTransaction.transaction_id,
      fromUserId: backendTransaction.sender_id,
      toUserId: backendTransaction.recipient_id,
      amount: backendTransaction.coin_amount,
      message: backendTransaction.transaction_message,
      timestamp: backendTransaction.created_at,
      type: backendTransaction.transaction_type
    };
    */
    
    // For now, return as-is
    return backendTransaction;
  }

  transformBadgeData(backendBadge: any): any {
    // TODO: Add transformation logic when backend structure is known
    /*
    return {
      id: backendBadge.badge_id,
      name: backendBadge.badge_name,
      description: backendBadge.badge_description,
      icon: backendBadge.badge_icon,
      category: backendBadge.badge_category,
      rarity: backendBadge.badge_rarity,
      earnedAt: backendBadge.earned_at
    };
    */
    
    // For now, return as-is
    return backendBadge;
  }

  // WebSocket connection management (for real-time features)
  private wsConnection: WebSocket | null = null;

  connectWebSocket(): void {
    if (this.shouldUseMockData()) {
      console.log('[BackendIntegration] WebSocket not available in mock mode');
      return;
    }

    // TODO: Uncomment when backend WebSocket is ready
    /*
    const wsUrl = getWebSocketUrl(APP_CONFIG.APP_ENV);
    
    try {
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('[BackendIntegration] WebSocket connected');
        // Send authentication token
        const token = apiService.getAuthToken();
        if (token) {
          this.wsConnection?.send(JSON.stringify({
            type: 'auth',
            token
          }));
        }
      };
      
      this.wsConnection.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      };
      
      this.wsConnection.onclose = () => {
        console.log('[BackendIntegration] WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connectWebSocket(), 5000);
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('[BackendIntegration] WebSocket error:', error);
      };
    } catch (error) {
      console.error('[BackendIntegration] Failed to connect WebSocket:', error);
    }
    */
  }

  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  private handleWebSocketMessage(message: any): void {
    // TODO: Handle real-time messages when backend is ready
    /*
    switch (message.type) {
      case 'transaction_created':
        window.dispatchEvent(new CustomEvent('realtime:transaction', { detail: message.data }));
        break;
      case 'notification_received':
        window.dispatchEvent(new CustomEvent('realtime:notification', { detail: message.data }));
        break;
      case 'user_online':
        window.dispatchEvent(new CustomEvent('realtime:user_online', { detail: message.data }));
        break;
      case 'user_offline':
        window.dispatchEvent(new CustomEvent('realtime:user_offline', { detail: message.data }));
        break;
      default:
        console.log('[BackendIntegration] Unknown WebSocket message type:', message.type);
    }
    */
    
    console.log('[BackendIntegration] WebSocket message received:', message);
  }

  // Cache invalidation
  invalidateCache(pattern?: string): void {
    // TODO: Implement cache invalidation when caching is implemented
    console.log(`[BackendIntegration] Cache invalidation requested: ${pattern || 'all'}`);
  }

  // Export/Import utilities
  async exportData(type: 'transactions' | 'users' | 'badges', filters?: any): Promise<Blob> {
    // TODO: Implement data export when backend supports it
    /*
    return apiService.get(`/export/${type}`, filters);
    */
    
    throw new Error('Export functionality not yet implemented');
  }

  // Monitoring and analytics
  trackApiCall(endpoint: string, duration: number, success: boolean): void {
    // TODO: Implement API call tracking for monitoring
    /*
    if (BACKEND_CONFIG.FEATURES.ANALYTICS) {
      console.log(`[BackendIntegration] API Call tracked: ${endpoint} - ${duration}ms - ${success ? 'success' : 'failed'}`);
    }
    */
  }
}

// Export singleton instance
export const backendIntegration = BackendIntegration.getInstance();

export const formatApiResponse = <T>(data: T, meta?: any): ApiResponse<T> => {
  return backendIntegration.formatApiResponse(data, meta);
};

export const formatErrorResponse = (error: string, meta?: any): ApiResponse => {
  return backendIntegration.formatErrorResponse(error, meta);
};

export default BackendIntegration;