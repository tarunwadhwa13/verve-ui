import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Coins, Users, Award, Gift } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { useTransactions, useTransactionStats } from '../hooks/useTransactions';
import { useUsers } from '../hooks/useUsers';

interface WalletProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
}

export function Wallet({ user }: WalletProps) {
  const { transactions, loading: transactionsLoading } = useTransactions(user.id, { limit: 5 });
  const { stats, loading: statsLoading } = useTransactionStats(user.id);
  const { users } = useUsers();

  const unlockedBadges = user.badges?.length || 0;
  
  // Format transaction data for display
  const formatTransactionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  const recentTransactions = transactions.map(tx => {
    const otherUserId = tx.type === 'sent' ? tx.toUserId : tx.fromUserId;
    const otherUser = users.find(u => u.id === otherUserId);
    
    return {
      id: tx.id,
      type: tx.type,
      from: tx.type === 'received' ? (otherUser?.name || 'Unknown User') : undefined,
      to: tx.type === 'sent' ? (otherUser?.name || 'Unknown User') : undefined,
      avatar: otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=6366f1&color=fff`,
      amount: tx.amount,
      message: tx.message || 'No message',
      time: formatTransactionTime(tx.timestamp)
    };
  });

  const dashboardStats = [
    { 
      label: 'Total Received', 
      value: statsLoading ? '...' : stats.totalReceived.toLocaleString(), 
      icon: TrendingUp, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Total Sent', 
      value: statsLoading ? '...' : stats.totalSent.toLocaleString(), 
      icon: TrendingDown, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Badges Earned', 
      value: unlockedBadges.toString(), 
      icon: Award, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50' 
    },
    { 
      label: 'Colleagues', 
      value: users.length.toString(), 
      icon: Users, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
  ];

  const recentBadges = user.badges?.slice(0, 3) || [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center relative">
            <Coins className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Award className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Your Dashboard</h1>
            <p className="text-gray-600">Track your recognition journey and celebrate achievements</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-700">
            <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <Gift className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium">Welcome to your recognition dashboard! Here's your impact overview.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 lg:p-6 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-2 lg:mb-0">
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl ${stat.bg} flex items-center justify-center self-end lg:self-auto`}>
                  <stat.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Badges - Mobile & Desktop */}
      {recentBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 shadow-lg">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Recent Achievement Badges
            </h2>
            <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2">
              {recentBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex-shrink-0 text-center bg-white/80 rounded-xl p-3 lg:p-4 shadow-sm min-w-[100px] lg:min-w-[120px]"
                >
                  <div className="text-2xl lg:text-3xl mb-2">{badge.icon}</div>
                  <p className="text-xs lg:text-sm font-semibold text-gray-800 mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.unlockedAt}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Recent Recognition</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.hash = '#history'}
              className="flex items-center gap-2 text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              View All History
            </Button>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-3 lg:space-y-4">
              {transactionsLoading && (
                <p className="text-sm text-gray-600">Loading transactions...</p>
              )}
              {!transactionsLoading && recentTransactions.length === 0 && (
                <p className="text text-gray-600 items-center">No recent transactions</p>
              )}
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
                >
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <img src={transaction.avatar} alt="" className="rounded-full" />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">
                        {transaction.type === 'received' ? transaction.from : transaction.to}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        transaction.type === 'received' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {transaction.type === 'received' ? 'Received' : 'Sent'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{transaction.message}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm lg:text-base ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">coins</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}