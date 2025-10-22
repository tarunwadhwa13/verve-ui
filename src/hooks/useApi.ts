import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/ApiService';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = false, retryAttempts = 0, retryDelay = 1000 } = options;

  const execute = useCallback(async (retryCount = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiService.get<T>(endpoint);
      setState({ data, loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      
      if (retryCount < retryAttempts) {
        setTimeout(() => {
          execute(retryCount + 1);
        }, retryDelay * (retryCount + 1));
      } else {
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      }
    }
  }, [endpoint, retryAttempts, retryDelay]);

  const refetch = useCallback(() => execute(), [execute]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    refetch,
    reset,
  };
}

export function useApiMutation<TData, TVariables = any>(): {
  mutate: (endpoint: string, data?: TVariables) => Promise<TData>;
  loading: boolean;
  error: string | null;
  reset: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (endpoint: string, data?: TVariables): Promise<TData> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.post<TData>(endpoint, data);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
  };
}

export function useApiPaginatedQuery<T>(
  endpoint: string,
  pageSize: number = 20
): UseApiState<T[]> & {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  currentPage: number;
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<T[]>>({
    data: [],
    loading: false,
    error: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (page: number, append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiService.get<T[]>(endpoint, {
        offset: (page * pageSize).toString(),
        limit: pageSize.toString(),
      });

      setState(prev => ({
        data: append ? [...(prev.data || []), ...data] : data,
        loading: false,
        error: null,
      }));

      setHasMore(data.length === pageSize);
      setCurrentPage(page);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, [endpoint, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || state.loading) return;
    await fetchPage(currentPage + 1, true);
  }, [currentPage, hasMore, state.loading, fetchPage]);

  const refetch = useCallback(async () => {
    setCurrentPage(0);
    setHasMore(true);
    await fetchPage(0, false);
  }, [fetchPage]);

  const reset = useCallback(() => {
    setState({ data: [], loading: false, error: null });
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  return {
    ...state,
    loadMore,
    hasMore,
    currentPage,
    refetch,
    reset,
  };
}