import { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import { APP_CONFIG } from '../config/config';

interface AppSettings {
  apiHealthy: boolean;
  mockDataEnabled: boolean;
  lastHealthCheck: Date | null;
  environment: string;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    apiHealthy: false,
    lastHealthCheck: null,
    environment: config.APP_ENV,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth();
    
    // Check API health every 5 minutes
    const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      setLoading(true);
      const isHealthy = await apiService.healthCheck();
      
      setSettings(prev => ({
        ...prev,
        apiHealthy: isHealthy,
        lastHealthCheck: new Date()
      }));
    } catch (error) {
      console.warn('API health check failed:', error);
      setSettings(prev => ({
        ...prev,
        apiHealthy: false,
        lastHealthCheck: new Date(),
        mockDataEnabled: true,
      }));
    } finally {
      setLoading(false);
    }
  };

  const refreshApiHealth = () => {
    checkApiHealth();
  };

  return {
    settings,
    loading,
    refreshApiHealth,
  };
}