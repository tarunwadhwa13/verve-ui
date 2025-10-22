import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, Search, Filter, Calendar, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface TransactionHistoryProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
}

export function TransactionHistory({ user }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  const transactions = [
    {
      id: '1',
      type: 'received',
      person: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
      amount: 50,
      message: 'Great work on the presentation!',
      date: '2024-08-27',
      time: '14:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sent',
      person: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      amount: 25,
      message: 'Thanks for helping with the project',
      date: '2024-08-27',
      time: '09:15',
      status: 'completed'
    },
    {
      id: '3',
      type: 'received',
      person: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      amount: 100,
      message: 'Excellent debugging skills!',
      date: '2024-08-26',
      time: '16:45',
      status: 'completed'
    },
    {
      id: '4',
      type: 'sent',
      person: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      amount: 75,
      message: 'Great teamwork on the launch!',
      date: '2024-08-26',
      time: '11:20',
      status: 'completed'
    },
    {
      id: '5',
      type: 'received',
      person: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
      amount: 30,
      message: 'Thanks for the code review',
      date: '2024-08-25',
      time: '13:10',
      status: 'completed'
    },
    {
      id: '6',
      type: 'sent',
      person: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      amount: 40,
      message: 'Awesome presentation skills!',
      date: '2024-08-24',
      time: '15:30',
      status: 'pending'
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalReceived = transactions
    .filter(t => t.type === 'received' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSent = transactions
    .filter(t => t.type === 'sent' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
        <p className="text-gray-600">View and manage all your coin transactions</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
            <h3 className="font-semibold mb-2">Total Received</h3>
            <p className="text-2xl lg:text-3xl font-bold">{totalReceived.toLocaleString()} coins</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <h3 className="font-semibold mb-2">Total Sent</h3>
            <p className="text-2xl lg:text-3xl font-bold">{totalSent.toLocaleString()} coins</p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <h3 className="font-semibold mb-2">Net Balance</h3>
            <p className="text-2xl lg:text-3xl font-bold">{(totalReceived - totalSent).toLocaleString()} coins</p>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-4 lg:p-6 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg mb-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-wrap lg:gap-4 lg:items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === 'received' ? 'default' : 'outline'}
                onClick={() => setFilterType('received')}
                size="sm"
              >
                Received
              </Button>
              <Button
                variant={filterType === 'sent' ? 'default' : 'outline'}
                onClick={() => setFilterType('sent')}
                size="sm"
              >
                Sent
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="lg:ml-auto">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
              Transactions ({filteredTransactions.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="p-4 lg:p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <img src={transaction.avatar} alt={transaction.person} className="rounded-full" />
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">{transaction.person}</p>
                      <Badge 
                        className={`text-xs ${
                          transaction.type === 'received' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {transaction.type === 'received' ? 'Received' : 'Sent'}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-gray-100 text-gray-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{transaction.message}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.date} at {transaction.time}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm lg:text-lg ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">coins</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}