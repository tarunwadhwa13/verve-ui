import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send, Search, Coins, MoreVertical, ChevronLeft, Users, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { APP_CONFIG } from '../config/config';

import { User } from '../types/user';

interface ChatUser extends Omit<User, 'role' | 'online' | 'department' | 'joinDate' | 'badges'> {
  // Additional chat-specific properties can be added here if needed
}

interface ChatProps {
  user: ChatUser;
  onNavigate?: (page: string) => void;
}

export function Chat({ user, onNavigate }: ChatProps) {
  // Check if chat is enabled
  if (!APP_CONFIG.CHAT_ENABLED) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 text-center">
          <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chat is Disabled</h3>
          <p className="text-gray-500">The chat feature is currently disabled in this environment.</p>
        </Card>
      </div>
    );
  }

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Apply chat configuration
  const maxMessageLength = APP_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH;
  const showTypingIndicator = APP_CONFIG.CHAT_CONFIG.ENABLE_TYPING_INDICATOR;
  const showReadReceipts = APP_CONFIG.CHAT_CONFIG.ENABLE_READ_RECEIPTS;

  const chatList = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
      lastMessage: 'Thanks for the coins! 🎉',
      time: '2:30 PM',
      unread: 2,
      online: true,
      transactionId: 'tx_001'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      lastMessage: 'The project went great!',
      time: '11:45 AM',
      unread: 0,
      online: false,
      transactionId: 'tx_002'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      lastMessage: 'Really appreciate the recognition',
      time: 'Yesterday',
      unread: 1,
      online: true,
      transactionId: 'tx_003'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      lastMessage: 'Looking forward to collaborating more!',
      time: '3 days ago',
      unread: 0,
      online: false,
      transactionId: 'tx_004'
    },
  ];

  const messages: { [key: string]: any[] } = {
    '1': [
      {
        id: 'm1',
        sender: 'system',
        content: 'Transaction completed: Sarah received 50 coins',
        time: '2:00 PM',
        type: 'transaction',
        transactionDetails: {
          amount: 50,
          message: 'Great work on the presentation!'
        }
      },
      {
        id: 'm2',
        sender: 'Sarah Johnson',
        content: 'Wow, thank you so much! That really made my day 😊',
        time: '2:15 PM',
        type: 'message'
      },
      {
        id: 'm3',
        sender: user.username,
        content: 'You deserved it! Your presentation was fantastic.',
        time: '2:20 PM',
        type: 'message'
      },
      {
        id: 'm4',
        sender: 'Sarah Johnson',
        content: 'Thanks for the coins! 🎉',
        time: '2:30 PM',
        type: 'message'
      },
      {
        id: 'm5',
        sender: 'Sarah Johnson',
        content: 'Looking forward to working on more projects together!',
        time: '2:31 PM',
        type: 'message'
      },
    ],
    '2': [
      {
        id: 'm6',
        sender: 'system',
        content: 'Transaction completed: Mike received 25 coins',
        time: '9:00 AM',
        type: 'transaction',
        transactionDetails: {
          amount: 25,
          message: 'Thanks for helping with the project'
        }
      },
      {
        id: 'm7',
        sender: 'Mike Chen',
        content: 'Thank you for the recognition! It means a lot.',
        time: '9:30 AM',
        type: 'message'
      },
      {
        id: 'm8',
        sender: user.username,
        content: 'Your help was invaluable. Team effort makes all the difference!',
        time: '10:00 AM',
        type: 'message'
      },
      {
        id: 'm9',
        sender: 'Mike Chen',
        content: 'The project went great!',
        time: '11:45 AM',
        type: 'message'
      },
    ],
    '3': [
      {
        id: 'm10',
        sender: 'system',
        content: 'Transaction completed: Emma received 100 coins',
        time: 'Yesterday 4:45 PM',
        type: 'transaction',
        transactionDetails: {
          amount: 100,
          message: 'Excellent debugging skills!'
        }
      },
      {
        id: 'm11',
        sender: 'Emma Wilson',
        content: 'Really appreciate the recognition',
        time: 'Yesterday 5:00 PM',
        type: 'message'
      },
    ],
    '4': [
      {
        id: 'm12',
        sender: 'system',
        content: 'Transaction completed: David received 75 coins',
        time: '3 days ago 3:00 PM',
        type: 'transaction',
        transactionDetails: {
          amount: 75,
          message: 'Excellent leadership on the team project'
        }
      },
      {
        id: 'm13',
        sender: 'David Kim',
        content: 'Thank you! The team really came together on this one.',
        time: '3 days ago 3:15 PM',
        type: 'message'
      },
      {
        id: 'm14',
        sender: user.username,
        content: 'Your leadership made all the difference.',
        time: '3 days ago 3:20 PM',
        type: 'message'
      },
      {
        id: 'm15',
        sender: 'David Kim',
        content: 'Looking forward to collaborating more!',
        time: '3 days ago 3:25 PM',
        type: 'message'
      },
    ]
  };

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    // In a real app, this would send the message to the backend
    const newMessage = {
      id: `m_${Date.now()}`,
      sender: user.username,
      content: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'message'
    };
    
    // Add the message to the chat (in a real app this would be handled by state management)
    if (messages[selectedChat.id]) {
      messages[selectedChat.id].push(newMessage);
    }
    
    setMessage('');
    setTimeout(scrollToBottom, 100);
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <Users className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Team Chat</h1>
            <p className="text-gray-600">Connect with colleagues about your transactions and projects</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-700">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium">Stay connected and build stronger relationships through meaningful conversations!</p>
          </div>
        </div>
      </motion.div>



      {/* Mobile Layout */}
      <div className="lg:hidden">
        {showChatList ? (
          /* Chat List - Mobile */
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <div className="p-4 border-b border-gray-100">
                {onNavigate && (
                  <div className="flex items-center gap-2 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('wallet')}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Dashboard
                    </Button>
                  </div>
                )}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectChat(chat)}
                    className="p-4 cursor-pointer transition-all border-b border-gray-50 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <img src={chat.avatar} alt={chat.name} className="rounded-full" />
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800 truncate">{chat.name}</p>
                          <div className="flex items-center gap-2">
                            {chat.unread > 0 && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                                {chat.unread}
                              </Badge>
                            )}
                            <p className="text-xs text-gray-500">{chat.time}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Chat Window - Mobile */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 top-0 bg-white z-30 flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="p-1 mr-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <img src={selectedChat?.avatar} alt={selectedChat?.name} className="rounded-full" />
                  </Avatar>
                  {selectedChat?.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedChat?.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedChat?.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
              {selectedChat && messages[selectedChat.id]?.map((msg) => (
                <div key={msg.id}>
                  {msg.type === 'transaction' ? (
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg p-3 max-w-sm">
                        <div className="flex items-center gap-2 text-purple-700 text-sm">
                          <Coins className="w-4 h-4" />
                          <span>{msg.content}</span>
                        </div>
                        {msg.transactionDetails && (
                          <div className="mt-2 text-xs text-purple-600">
                            <p>Amount: {Math.abs(msg.transactionDetails.amount)} coins</p>
                            <p>Message: "{msg.transactionDetails.message}"</p>
                          </div>
                        )}
                        <p className="text-xs text-purple-500 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === user.username
                          ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
                          : 'bg-white shadow-sm text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === user.username ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-20">
              <div className="flex gap-2 max-w-6xl mx-auto">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white border-gray-300 focus:border-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer transition-all border-b border-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-gradient-to-r from-purple-50 to-rose-50 border-l-4 border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <img src={chat.avatar} alt={chat.name} className="rounded-full" />
                      </Avatar>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800 truncate">{chat.name}</p>
                        <div className="flex items-center gap-2">
                          {chat.unread > 0 && (
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500">{chat.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <img src={selectedChat.avatar} alt={selectedChat.name} className="rounded-full" />
                        </Avatar>
                        {selectedChat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{selectedChat.name}</p>
                        <p className="text-xs text-gray-500">
                          {selectedChat.online ? 'Online' : 'Last seen recently'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages[selectedChat.id]?.map((msg) => (
                      <div key={msg.id}>
                        {msg.type === 'transaction' ? (
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg p-3 max-w-sm">
                              <div className="flex items-center gap-2 text-purple-700 text-sm">
                                <Coins className="w-4 h-4" />
                                <span>{msg.content}</span>
                              </div>
                              {msg.transactionDetails && (
                                <div className="mt-2 text-xs text-purple-600">
                                  <p>Amount: {Math.abs(msg.transactionDetails.amount)} coins</p>
                                  <p>Message: "{msg.transactionDetails.message}"</p>
                                </div>
                              )}
                              <p className="text-xs text-purple-500 mt-1">{msg.time}</p>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === user.username
                                ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${
                                msg.sender === user.username ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-white/80"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a colleague to start chatting about your transactions</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}