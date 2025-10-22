import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Users, Award, Heart, Search, LogOut, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
  onNavigate: (page: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Header({ user, onNavigate, isCollapsed = false, onToggleCollapse }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, isAdmin } = useAuth();

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'received',
      title: 'Coins Received!',
      message: 'Sarah sent you 50 coins for great teamwork',
      time: '2 minutes ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces'
    },
    {
      id: '2',
      type: 'badge',
      title: 'New Badge Unlocked!',
      message: 'You earned the "Team Player" badge',
      time: '1 hour ago',
      unread: true,
      icon: '🤝'
    },
    {
      id: '3',
      type: 'sent',
      title: 'Coins Sent Successfully',
      message: 'Your 25 coins were delivered to Mike Chen',
      time: '3 hours ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
    },
    {
      id: '4',
      type: 'system',
      title: 'Weekly Summary Ready',
      message: 'Your activity report is now available',
      time: '1 day ago',
      unread: false,
      icon: '📊'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'received': return <Users className="w-4 h-4 text-green-600" />;
      case 'sent': return <Heart className="w-4 h-4 text-blue-600" />;
      case 'badge': return <Award className="w-4 h-4 text-yellow-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'received': return 'bg-green-50 border-green-200';
      case 'sent': return 'bg-blue-50 border-blue-200';
      case 'badge': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
    >
      {/* Mobile collapse toggle */}
      {onToggleCollapse && (
        <div className="lg:hidden flex justify-center py-1 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full max-w-xs rounded-none h-6 flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3 h-3" />
                <span className="text-xs">Show Header</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3 h-3" />
                <span className="text-xs">Hide Header</span>
              </>
            )}
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 lg:px-8 py-3"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center relative">
                  <Users className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Award className="w-1.5 h-1.5 text-white" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold text-gray-800">Verve</h1>
                  <p className="text-xs text-gray-600">Recognition Reimagined</p>
                </div>
              </div>

              {/* Center - Current Balance (Desktop Only) */}
              <div className="hidden lg:flex items-center gap-4">
                <Card className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Balance</p>
                      <p className="font-bold text-blue-700">{user.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Side - Notifications & Profile */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-5 h-5 text-gray-600" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onNavigate('notifications')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 4).map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notification.avatar ? (
                              <Avatar className="w-8 h-8">
                                <img src={notification.avatar} alt="" className="rounded-full" />
                              </Avatar>
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationBg(notification.type)} border`}>
                                {notification.icon ? (
                                  <span className="text-sm">{notification.icon}</span>
                                ) : (
                                  getNotificationIcon(notification.type)
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm text-gray-800 truncate">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {notifications.length === 0 && (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Profile Avatar */}
                <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1"
                    >
                      <Avatar className="w-8 h-8">
                        <img src={user.avatar} alt={user.username} className="rounded-full" />
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="end">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <img src={user.avatar} alt={user.username} className="rounded-full" />
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">{user.username}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          {isAdmin() && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </button>
                      
                      {isAdmin() && (
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Admin Panel
                        </button>
                      )}
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state - minimal header */}
      {isCollapsed && onToggleCollapse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden px-4 py-2 flex items-center justify-between"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-md flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="w-4 h-4 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
            <Avatar className="w-6 h-6">
              <img src={user.avatar} alt={user.username} className="rounded-full" />
            </Avatar>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}