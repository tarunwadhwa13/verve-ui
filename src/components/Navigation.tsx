import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Send, 
  History, 
  Bell, 
  MessageCircle, 
  Users,
  User,
  Award,
  Heart,
  Gift,
  Settings
} from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
  showHistoryAndNotifications?: boolean;
}

export function Navigation({ currentPage, setCurrentPage, user, showHistoryAndNotifications = true }: NavigationProps) {
  const unlockedBadges = user.badges?.filter(b => b.unlocked).length || 0;
  const { isAdmin } = useAuth();
  
  const baseMenuItems = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'send', label: 'Send Coins', icon: Send },
    { id: 'badges', label: 'Badges', icon: Award, badge: unlockedBadges },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: 2 },
  ];

  const additionalMenuItems = [
    { id: 'history', label: 'History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  ];

  const adminMenuItems = isAdmin() ? [
    { id: 'admin', label: 'Admin Panel', icon: Settings }
  ] : [];

  const menuItems = showHistoryAndNotifications 
    ? [...baseMenuItems.slice(0, 2), ...additionalMenuItems, ...baseMenuItems.slice(2), ...adminMenuItems]
    : [...baseMenuItems, ...adminMenuItems];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            {/* Main logo container */}
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              
              {/* Main icon - Users connected */}
              <Users className="w-6 h-6 text-white z-10" />
              
              {/* Award accent - top right */}
              <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                <Award className="w-3 h-3 text-white" />
              </div>
              
              {/* Heart accent - bottom left */}
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
                <Heart className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Verve
            </h1>
            <p className="text-sm text-gray-600 font-medium">Recognition Reimagined</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-2xl p-4 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="w-10 h-10 ring-2 ring-white/30">
              <img src={user.avatar} alt={user.username} className="rounded-full" />
            </Avatar>
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-white/80">{user.email}</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-xs text-white/80">Current Balance</p>
            <p className="text-2xl font-bold">{user.balance.toLocaleString()} coins</p>
          </div>
          {unlockedBadges > 0 && (
            <div className="text-center mt-2">
              <p className="text-xs text-white/80">Badges Earned</p>
              <p className="text-lg font-semibold flex items-center justify-center gap-1">
                <Award className="w-4 h-4" />
                {unlockedBadges}
              </p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-rose-50 hover:via-purple-50 hover:to-indigo-50 hover:text-purple-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge className={`text-white text-xs px-2 py-1 ${
                  item.id === 'badges' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  {item.badge}
                </Badge>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Motivational Quote */}
        <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-amber-700 font-medium italic">
              "Every act of recognition creates a ripple of positivity"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}