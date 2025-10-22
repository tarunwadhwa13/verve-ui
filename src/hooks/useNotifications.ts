import { useState, useEffect } from 'react';
import { notificationService, Notification, NotificationFilters } from '../services/NotificationService';

export function useNotifications(userId: string, filters: NotificationFilters = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId, JSON.stringify(filters)]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getUserNotifications(userId, filters);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications
  };
}

export function useUnreadNotificationCount(userId: string) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUnreadCount();
      
      // Refresh count every minute
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    unreadCount,
    loading,
    refreshUnreadCount: loadUnreadCount
  };
}