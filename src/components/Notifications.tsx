import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Check, X, Trash2, MarkAsUnread } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface NotificationsProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
  };
}

export function Notifications({ user }: NotificationsProps) {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'received',
      from: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
      amount: 50,
      message: 'Great work on the presentation!',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'sent_confirmed',
      to: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      amount: 25,
      message: 'Your coins were successfully sent',
      time: '3 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'received',
      from: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      amount: 100,
      message: 'Excellent debugging skills!',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Milestone Reached!',
      message: 'You have received 1000+ coins this month',
      time: '2 days ago',
      read: false
    },
    {
      id: '5',
      type: 'received',
      from: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      amount: 75,
      message: 'Thanks for the code review!',
      time: '3 days ago',
      read: true
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'received':
        return '💰';
      case 'sent_confirmed':
        return '✅';
      case 'achievement':
        return '🏆';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'received':
        return 'from-green-500 to-green-600';
      case 'sent_confirmed':
        return 'from-blue-500 to-blue-600';
      case 'achievement':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">Stay updated with your coin transactions and achievements</p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 transition-all duration-300 ${
                notification.read 
                  ? 'bg-white/40 backdrop-blur-sm border-white/20' 
                  : 'bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg ring-2 ring-blue-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Notification Icon/Avatar */}
                <div className="flex-shrink-0">
                  {notification.type === 'achievement' ? (
                    <div className={`w-12 h-12 bg-gradient-to-r ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-2xl`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  ) : (
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <img 
                          src={notification.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'} 
                          alt="" 
                          className="rounded-full" 
                        />
                      </Avatar>
                      <div className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-sm`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {notification.type === 'received' && (
                        <p className="font-semibold text-gray-800 mb-1">
                          <span className="text-green-600">+{notification.amount} coins</span> from {notification.from}
                        </p>
                      )}
                      {notification.type === 'sent_confirmed' && (
                        <p className="font-semibold text-gray-800 mb-1">
                          <span className="text-blue-600">-{notification.amount} coins</span> sent to {notification.to}
                        </p>
                      )}
                      {notification.type === 'achievement' && (
                        <p className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          <span className="text-purple-600">{notification.title}</span>
                        </p>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-2">"{notification.message}"</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}