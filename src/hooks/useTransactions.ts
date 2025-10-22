import { useState, useEffect } from 'react';
import { Transaction } from '../types/user';
import { transactionService, TransactionFilters } from '../services/TransactionService';

export function useTransactions(userId: string, filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [userId, JSON.stringify(filters)]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getUserTransactions(userId, filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const sendCoins = async (toUserId: string, amount: number, message: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const transaction = await transactionService.sendCoins({ toUserId, amount, message });
      
      // Add the new transaction to the list
      setTransactions(prev => [transaction, ...prev]);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to send coins' 
      };
    }
  };

  return {
    transactions,
    loading,
    error,
    sendCoins,
    refreshTransactions: loadTransactions
  };
}

export function useTransactionStats(userId: string) {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    transactionCount: 0,
    averageAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactionStats(userId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transaction stats');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
}