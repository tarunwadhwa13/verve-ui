import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Send, 
  History, 
  Bell, 
  MessageCircle, 
  Award,
  Settings
} from 'lucide-react';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface MobileNavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges: any[];
  };
  showHistoryAndNotifications?: boolean;
}

export function MobileNavigation({ currentPage, setCurrentPage, user, showHistoryAndNotifications = true }: MobileNavigationProps) {
  const { isAdmin } = useAuth();
  
  const baseMenuItems = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: 2 },
  ];

  const additionalMenuItems = [
    { id: 'history', label: 'History', icon: History },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: 3 },
  ];

  const adminMenuItems = isAdmin() ? [
    { id: 'admin', label: 'Admin', icon: Settings }
  ] : [];

  let menuItems = showHistoryAndNotifications 
    ? [...baseMenuItems.slice(0, 2), ...additionalMenuItems, ...baseMenuItems.slice(2)]
    : baseMenuItems;

  // Add admin item but ensure we don't exceed mobile navigation limits
  if (adminMenuItems.length > 0) {
    menuItems = [...menuItems.slice(0, 4), ...adminMenuItems].slice(0, 5);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-white/20 shadow-2xl z-50">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="flex flex-col items-center gap-1 p-2 relative"
            whileTap={{ scale: 0.95 }}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-gray-600'
            }`}>
              <item.icon className="w-5 h-5" />
              {item.badge && currentPage !== item.id && (
                <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className={`text-xs ${
              currentPage === item.id ? 'text-purple-600 font-semibold' : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}