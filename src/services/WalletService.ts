import { apiService } from './ApiService';
import { APP_CONFIG } from '../config/config';
import { API_ENDPOINTS } from '../config/api-endpoints';

const { ENABLE_DEBUG_LOGS } = APP_CONFIG;

interface Wallet {
  userId: string;
  balance: number;
  lastUpdated: string;
}

class WalletService {
  private log(message: string, ...args: any[]): void {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[WalletService] ${message}`, ...args);
    }
  }

  private logError(message: string, error: any): void {
    console.error(`[WalletService] ${message}`, error);
  }

  async getWallet(): Promise<Wallet> {
    try {
      this.log('Fetching wallet information');
      
      const wallet = await apiService.get<Wallet>(API_ENDPOINTS.wallets.get);
      
      this.log('Wallet fetched successfully:', { balance: wallet.balance });
      
      return wallet;
      
    } catch (error) {
      this.logError('Failed to fetch wallet:', error);
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    try {
      const wallet = await this.getWallet();
      return wallet.balance;
    } catch (error) {
      this.logError('Failed to get balance:', error);
      return 0;
    }
  }

  private getMockWallet(): Wallet {
    return {
      userId: '1',
      balance: 2450,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const walletService = new WalletService();