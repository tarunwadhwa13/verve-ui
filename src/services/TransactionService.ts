import { apiService } from './ApiService';
import { Transaction } from '../types/user';
import { APP_CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../config/api-endpoints';

const { ENABLE_DEBUG_LOGS, DEFAULT_PAGE_SIZE } = APP_CONFIG;

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

export interface SendCoinsRequest {
  toUserId: string;
  amount: number;
  message: string;
}

export interface TransactionFilters {
  type?: 'sent' | 'received' | 'all';
  startDate?: string;
  endDate?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

class TransactionService {
  private log(message: string, ...args: any[]): void {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[TransactionService] ${message}`, ...args);
    }
  }

  private logError(message: string, error: any): void {
    console.error(`[TransactionService] ${message}`, error);
  }

  async sendCoins(request: SendCoinsRequest): Promise<Transaction> {
    try {
      this.log('Sending coins:', { toUserId: request.toUserId, amount: request.amount });
      
      // TODO: Remove mock transaction when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction (ENABLE_MOCK_DATA = true)');
        const transaction = this.createMockTransaction(request);
        
        // Emit transaction created event
        window.dispatchEvent(new CustomEvent('transaction:created', { 
          detail: transaction 
        }));
        
        return transaction;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const transaction = await apiService.post<Transaction>(API_ENDPOINTS.transactions.create, {
        toUserId: request.toUserId,
        amount: request.amount,
        message: request.message
      });
      
      this.log('Coins sent successfully:', transaction.id);
      
      // Emit transaction created event
      window.dispatchEvent(new CustomEvent('transaction:created', { 
        detail: transaction 
      }));
      
      return transaction;
      */
      
      // Fallback to mock for now
      const transaction = this.createMockTransaction(request);
      
      // Emit transaction created event
      window.dispatchEvent(new CustomEvent('transaction:created', { 
        detail: transaction 
      }));
      
      return transaction;
      
    } catch (error) {
      this.logError('Failed to send coins:', error);
      
      // Return mock transaction for development
      if (error.code === 'NETWORK_ERROR') {
        this.log('API not available, creating mock transaction');
        return this.createMockTransaction(request);
      }
      
      throw error;
    }
  }

  async getUserTransactions(userId: string, filters: TransactionFilters = {}): Promise<Transaction[]> {
    try {
      this.log('Fetching user transactions:', { userId, filters });
      
      const params = this.buildTransactionParams(filters);
      const endpoint = buildUrl(API_ENDPOINTS.users.transactions(userId), params);
      
      const transactions = await apiService.get<Transaction[]>(endpoint);
      
      this.log(`Fetched ${transactions.length} transactions for user ${userId}`);
      
      return transactions;
      
    } catch (error) {
      this.logError('Failed to fetch user transactions:', error);
      throw error;
    }
  }

  async getAllTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    try {
      this.log('Fetching all transactions:', filters);

      const params = this.buildTransactionParams(filters);
      const endpoint = buildUrl(API_ENDPOINTS.transactions.list, params);
      
      const transactions = await apiService.get<Transaction[]>(endpoint);
      
      this.log(`Fetched ${transactions.length} transactions`);
      
      return transactions;
      
    } catch (error) {
      this.logError('Failed to fetch transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      this.log('Fetching transaction by ID:', id);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction lookup (ENABLE_MOCK_DATA = true)');
        const mockTransactions = this.getMockTransactions('1', {});
        return mockTransactions.find(tx => tx.id === id) || null;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const transaction = await apiService.get<Transaction>(API_ENDPOINTS.transactions.byId(id));
      
      this.log('Transaction fetched successfully:', transaction.id);
      
      return transaction;
      */
      
      // Fallback to mock for now
      const mockTransactions = this.getMockTransactions('1', {});
      return mockTransactions.find(tx => tx.id === id) || null;
      
    } catch (error) {
      this.logError('Failed to fetch transaction:', error);
      
      if (error.status === 404) {
        return null;
      }
      
      if (error.code === 'NETWORK_ERROR') {
        this.log('API not available');
        return null;
      }
      
      throw error;
    }
  }

  async getTransactionStats(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    transactionCount: number;
    averageAmount: number;
    monthlyData?: Array<{ month: string; sent: number; received: number }>;
  }> {
    try {
      this.log('Fetching transaction stats for user:', userId);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction stats (ENABLE_MOCK_DATA = true)');
        return this.getMockStats();
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const stats = await apiService.get(API_ENDPOINTS.users.transactionStats(userId));
      
      this.log('Transaction stats fetched successfully');
      
      return stats;
      */
      
      // Fallback to mock for now
      return this.getMockStats();
      
    } catch (error) {
      this.logError('Failed to fetch transaction stats:', error);
      
      if (error.code === 'NETWORK_ERROR') {
        this.log('API not available, using mock stats');
        return this.getMockStats();
      }
      
      throw error;
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      this.log('Updating transaction:', id);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction update (ENABLE_MOCK_DATA = true)');
        const mockTransactions = this.getMockTransactions('1', {});
        const transaction = mockTransactions.find(tx => tx.id === id);
        
        if (!transaction) {
          throw new Error('Transaction not found');
        }
        
        const updatedTransaction = { ...transaction, ...updates };
        
        // Emit transaction updated event
        window.dispatchEvent(new CustomEvent('transaction:updated', { 
          detail: updatedTransaction 
        }));
        
        return updatedTransaction;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const transaction = await apiService.put<Transaction>(
        API_ENDPOINTS.transactions.update(id), 
        updates
      );
      
      this.log('Transaction updated successfully');
      
      // Emit transaction updated event
      window.dispatchEvent(new CustomEvent('transaction:updated', { 
        detail: transaction 
      }));
      
      return transaction;
      */
      
      // Fallback to mock for now
      const mockTransactions = this.getMockTransactions('1', {});
      const transaction = mockTransactions.find(tx => tx.id === id);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      const updatedTransaction = { ...transaction, ...updates };
      
      // Emit transaction updated event
      window.dispatchEvent(new CustomEvent('transaction:updated', { 
        detail: updatedTransaction 
      }));
      
      return updatedTransaction;
      
    } catch (error) {
      this.logError('Failed to update transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      this.log('Deleting transaction:', id);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction deletion (ENABLE_MOCK_DATA = true)');
        
        // Emit transaction deleted event
        window.dispatchEvent(new CustomEvent('transaction:deleted', { 
          detail: { id } 
        }));
        
        return;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      await apiService.delete(API_ENDPOINTS.transactions.delete(id));
      
      this.log('Transaction deleted successfully');
      
      // Emit transaction deleted event
      window.dispatchEvent(new CustomEvent('transaction:deleted', { 
        detail: { id } 
      }));
      */
      
      // Fallback to mock for now
      // Emit transaction deleted event
      window.dispatchEvent(new CustomEvent('transaction:deleted', { 
        detail: { id } 
      }));
      
    } catch (error) {
      this.logError('Failed to delete transaction:', error);
      throw error;
    }
  }

  async exportTransactions(filters: TransactionFilters = {}): Promise<Blob> {
    try {
      this.log('Exporting transactions:', filters);
      
      // TODO: Remove mock data when backend is ready
      if (APP_CONFIG.ENABLE_MOCK_DATA) {
        this.log('Using mock transaction export (ENABLE_MOCK_DATA = true)');
        
        // Create a mock CSV blob
        const transactions = this.getMockTransactions('1', filters);
        const csvContent = this.createMockCSV(transactions);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        return blob;
      }
      
      // Backend integration code (uncomment when backend is ready):
      /*
      const params = this.buildTransactionParams(filters);
      const endpoint = buildUrl(API_ENDPOINTS.transactions.export, params);
      
      const blob = await apiService.get<Blob>(endpoint);
      
      this.log('Transactions exported successfully');
      
      return blob;
      */
      
      // Fallback to mock for now
      const transactions = this.getMockTransactions('1', filters);
      const csvContent = this.createMockCSV(transactions);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      return blob;
      
    } catch (error) {
      this.logError('Failed to export transactions:', error);
      throw error;
    }
  }

  private createMockCSV(transactions: Transaction[]): string {
    const headers = ['ID', 'From User ID', 'To User ID', 'Amount', 'Message', 'Timestamp', 'Type'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.fromUserId,
      tx.toUserId,
      tx.amount.toString(),
      `"${tx.message.replace(/"/g, '""')}"`,
      tx.timestamp,
      tx.type
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private buildTransactionParams(filters: TransactionFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.userId) params.userId = filters.userId;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;
    
    // Set default limit if not specified
    if (!params.limit) {
      params.limit = DEFAULT_PAGE_SIZE;
    }
    
    return params;
  }

  private getMockStats(): {
    totalSent: number;
    totalReceived: number;
    transactionCount: number;
    averageAmount: number;
    monthlyData: Array<{ month: string; sent: number; received: number }>;
  } {
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

  // Mock methods for development
  private createMockTransaction(request: SendCoinsRequest): Transaction {
    return {
      id: `tx_${Date.now()}`,
      fromUserId: '1', // Current user
      toUserId: request.toUserId,
      amount: request.amount,
      message: request.message,
      timestamp: new Date().toISOString(),
      type: 'sent'
    };
  }

  private getMockTransactions(userId: string, filters: TransactionFilters): Transaction[] {
    const mockTransactions: Transaction[] = [
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
        toUserId: userId,
        amount: 75,
        message: 'Great presentation yesterday',
        timestamp: '2024-08-30T15:20:00Z',
        type: 'received'
      },
      {
        id: 'tx_003',
        fromUserId: userId,
        toUserId: '4',
        amount: 50,
        message: 'Welcome to the team!',
        timestamp: '2024-08-29T09:15:00Z',
        type: 'sent'
      },
      {
        id: 'tx_004',
        fromUserId: '5',
        toUserId: userId,
        amount: 120,
        message: 'Excellent code review',
        timestamp: '2024-08-28T14:45:00Z',
        type: 'received'
      },
      {
        id: 'tx_005',
        fromUserId: userId,
        toUserId: '6',
        amount: 80,
        message: 'Thanks for the mentoring session',
        timestamp: '2024-08-27T11:30:00Z',
        type: 'sent'
      }
    ];

    let filtered = mockTransactions;

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(tx => new Date(tx.timestamp) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(tx => new Date(tx.timestamp) <= endDate);
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
export const transactionService = new TransactionService();