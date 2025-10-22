import { APP_CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../config/api-endpoints';

const {
  API_BASE_URL,
  API_TIMEOUT,
  RETRY_ATTEMPTS,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  API_RATE_LIMIT,
  RATE_LIMIT_WINDOW,
  ENABLE_DEBUG_LOGS
} = APP_CONFIG;
// API_ENDPOINTS already imported above

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
  rateLimit: number;
  rateLimitWindow: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers?: Headers;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  code?: string;
  timestamp?: string;
}

interface RateLimitInfo {
  count: number;
  windowStart: number;
}

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

class ApiService {
  private config: ApiConfig;
  private authToken: string | null = null;
  private rateLimitInfo: RateLimitInfo = { count: 0, windowStart: Date.now() };
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: API_BASE_URL,
      timeout: API_TIMEOUT,
      retryAttempts: RETRY_ATTEMPTS,
      rateLimit: API_RATE_LIMIT,
      rateLimitWindow: RATE_LIMIT_WINDOW,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    };

    // Load auth token from storage on initialization
    this.loadAuthToken();
  }

  private loadAuthToken(): void {
    try {
      this.authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      this.log('Failed to load auth token from storage:', error);
    }
  }

  private log(message: string, ...args: any[]): void {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[ApiService] ${message}`, ...args);
    }
  }

  private logError(message: string, error: any): void {
    console.error(`[ApiService] ${message}`, error);
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch (error) {
      this.logError('Failed to store auth token:', error);
    }
  }

  getAuthToken(): string | null {
    return this.authToken || localStorage.getItem(AUTH_TOKEN_KEY);
  }

  clearAuthData(): void {
    this.authToken = null;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      this.logError('Failed to clear auth data:', error);
    }
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    
    // Reset window if needed
    if (now - this.rateLimitInfo.windowStart >= this.config.rateLimitWindow) {
      this.rateLimitInfo = { count: 0, windowStart: now };
    }
    
    return this.rateLimitInfo.count >= this.config.rateLimit;
  }

  private incrementRateLimit(): void {
    const now = Date.now();
    
    // Reset window if needed
    if (now - this.rateLimitInfo.windowStart >= this.config.rateLimitWindow) {
      this.rateLimitInfo = { count: 1, windowStart: now };
    } else {
      this.rateLimitInfo.count++;
    }
  }

  private calculateRetryDelay(attempt: number, baseDelay = 1000, maxDelay = 10000, backoffFactor = 2): number {
    const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
    // Add jitter to avoid thundering herd
    return delay + Math.random() * 1000;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0 && !this.isRateLimited()) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          this.logError('Queued request failed:', error);
        }
      }
    }
    
    this.isProcessingQueue = false;
    
    // Schedule next processing if queue is not empty
    if (this.requestQueue.length > 0) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  private createApiError(
    message: string, 
    status?: number, 
    statusText?: string, 
    data?: any,
    code?: string
  ): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.statusText = statusText;
    error.data = data;
    error.code = code;
    error.timestamp = new Date().toISOString();
    return error;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {

    // Rate limiting check
    if (this.isRateLimited()) {
      this.log('Rate limit exceeded, queueing request:', endpoint);
      return new Promise((resolve, reject) => {
        this.requestQueue.push(() => this.makeRequest<T>(endpoint, options, retryCount)
          .then(resolve)
          .catch(reject));
        this.processQueue();
      });
    }

    this.incrementRateLimit();
    
    const url = `${this.config.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      ...this.config.headers,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      this.log(`Request timeout for ${endpoint} after ${this.config.timeout}ms`);
    }, this.config.timeout);

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
      credentials: 'same-origin',
    };

    const startTime = Date.now();

    try {
      this.log(`Making ${options.method || 'GET'} request to ${endpoint}`);
      
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
      
      const duration = Date.now() - startTime;
      this.log(`Request completed in ${duration}ms with status ${response.status}`);
      
      // Handle different response types
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text() as unknown as T;
      } else {
        data = await response.blob() as unknown as T;
      }
      
      if (!response.ok) {
        const errorMessage = (data as any)?.message || response.statusText || 'Request failed';
        const errorCode = (data as any)?.code || `HTTP_${response.status}`;
        
        const error = this.createApiError(
          errorMessage,
          response.status,
          response.statusText,
          data,
          errorCode
        );
        
        // Handle specific error cases
        if (response.status === 401) {
          this.log('Unauthorized request, clearing auth data');
          this.clearAuthData();
          // Attempt token refresh if refresh token exists
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (refreshToken && endpoint !== API_ENDPOINTS.auth.refresh) {
            this.log('Attempting token refresh...');
            try {
              await this.refreshAuthToken();
              // Retry the original request with new token
              return this.makeRequest<T>(endpoint, options, retryCount);
            } catch (refreshError) {
              this.logError('Token refresh failed:', refreshError);
            }
          }
        }
        
        throw error;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle timeout and network errors with exponential backoff
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          this.logError(`Request aborted: ${endpoint}`);
          if (retryCount < this.config.retryAttempts) {
            const delay = this.calculateRetryDelay(retryCount);
            this.log(`Retrying request ${endpoint} in ${delay}ms (attempt ${retryCount + 1})`);
            await this.delay(delay);
            return this.makeRequest<T>(endpoint, options, retryCount + 1);
          }
          throw this.createApiError('Request timeout', 408, 'Request Timeout', null, 'TIMEOUT');
        }
        
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          this.logError(`Network error for ${endpoint}:`, error);
          
          if (retryCount < this.config.retryAttempts) {
            const delay = this.calculateRetryDelay(retryCount);
            this.log(`Retrying network request ${endpoint} in ${delay}ms (attempt ${retryCount + 1})`);
            await this.delay(delay);
            return this.makeRequest<T>(endpoint, options, retryCount + 1);
          }
          
          throw this.createApiError(
            'Network connection failed',
            0,
            'Network Error',
            null,
            'NETWORK_ERROR'
          );
        }
      }
      
      throw error;
    }
  }

  private async refreshAuthToken(): Promise<void> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.makeRequest<{ token: string; refreshToken: string }>(
        API_ENDPOINTS.auth.refresh,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        }
      );

      this.setAuthToken(response.data.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
      
      this.log('Token refreshed successfully');
    } catch (error) {
      this.logError('Token refresh failed:', error);
      this.clearAuthData();
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let queryString = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      queryString = `?${searchParams.toString()}`;
    }
    
    const response = await this.makeRequest<T>(endpoint + queryString);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.makeRequest<T>(endpoint, {
      method: 'DELETE'
    });
    return response.data;
  }

  // Enhanced utility methods
  async healthCheck(): Promise<{ available: boolean; latency?: number; version?: string }> {
    const startTime = Date.now();
    try {
      const response = await this.get<{ status: string; version?: string }>(API_ENDPOINTS.system.health);
      const latency = Date.now() - startTime;
      return {
        available: true,
        latency,
        version: response.version
      };
    } catch (error) {
      this.logError('Health check failed:', error);
      return { available: false };
    }
  }

  async getSystemStatus(): Promise<{
    api: boolean;
    database: boolean;
    cache: boolean;
    storage: boolean;
  }> {
    try {
      return await this.get<{
        api: boolean;
        database: boolean;
        cache: boolean;
        storage: boolean;
      }>(API_ENDPOINTS.system.status);
    } catch (error) {
      this.logError('System status check failed:', error);
      return {
        api: false,
        database: false,
        cache: false,
        storage: false
      };
    }
  }

  // Request interceptors
  setRequestInterceptor(interceptor: (config: RequestInit) => RequestInit): void {
    // Implementation for request interceptors if needed
    this.log('Request interceptor set');
  }

  setResponseInterceptor(interceptor: (response: Response) => Response): void {
    // Implementation for response interceptors if needed
    this.log('Response interceptor set');
  }

  // Batch requests
  async batchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    try {
      const results = await Promise.allSettled(requests.map(req => req()));
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          this.logError(`Batch request ${index} failed:`, result.reason);
          throw result.reason;
        }
      });
    } catch (error) {
      this.logError('Batch requests failed:', error);
      throw error;
    }
  }

  // Upload file with progress
  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('POST', `${this.config.baseUrl}${endpoint}`);
      
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService;