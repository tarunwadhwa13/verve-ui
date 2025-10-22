import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Users, Search, X, ChevronLeft, Heart, Gift } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { PinVerification } from './PinVerification';
import { userService } from '@/services/UserService';
import { authService } from '@/services/AuthService';

interface SendCoinsProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
}

export function SendCoins({ user }: SendCoinsProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock user settings - in real app, this would come from user preferences
  const userSettings = {
    requirePinForTransfers: true,
    requirePinForLargeAmounts: false,
    largeAmountThreshold: 100
  };

  // TODO: Replace with real API call when backend is ready
  // const colleagues = [
  //   {
  //     id: '2',
  //     name: 'Sarah Johnson',
  //     email: 'sarah.johnson@company.com',
  //     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=faces',
  //     department: 'Design'
  //   },
  //   {
  //     id: '3',
  //     name: 'Mike Chen',
  //     email: 'mike.chen@company.com',
  //     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  //     department: 'Engineering'
  //   },
  //   {
  //     id: '4',
  //     name: 'Emma Wilson',
  //     email: 'emma.wilson@company.com',
  //     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
  //     department: 'Marketing'
  //   },
  //   {
  //     id: '5',
  //     name: 'David Kim',
  //     email: 'david.kim@company.com',
  //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  //     department: 'Sales'
  //   },
  // ];

  // Backend integration code (uncomment when backend is ready):

  const [colleagues, setColleagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleagues = async () => {
      try {
        const users = await userService.getAllUsers();
        // Filter out current user
        const filteredUsers = users.filter(u => u.id !== user.id);
        setColleagues(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch colleagues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleagues();
  }, [user.id]);

  const filteredColleagues = colleagues.filter(colleague =>
    colleague.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colleague.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colleague.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const drawNameOnEnvelope = (name: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '18px cursive';
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'center';
    
    let currentIndex = 0;
    const drawLetter = () => {
      if (currentIndex < name.length) {
        const partialName = name.substring(0, currentIndex + 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(partialName, canvas.width / 2, canvas.height / 2 + 5);
        currentIndex++;
        setTimeout(drawLetter, 150);
      }
    };
    
    drawLetter();
  };

  const handleSend = async () => {
    if (!selectedRecipient || !amount || !message) return;

    // Check if PIN is required
    const amountNum = parseInt(amount);
    const needsPin = userSettings.requirePinForTransfers || 
                     (userSettings.requirePinForLargeAmounts && amountNum >= userSettings.largeAmountThreshold);

    if (needsPin) {
      setShowPinVerification(true);
      return;
    }

    // If no PIN needed, proceed with transfer
    executeSend();
  };

  const handlePinVerify = async (pin: string) => {
    setPinLoading(true);
    setPinError('');

    // TODO: Replace with real PIN verification when backend is ready
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const result = await authService.verifyPin(pin);
      if (result.success) {
        setShowPinVerification(false);
        setPinLoading(false);
        executeSend();
      } else {
        setPinError(result.error || 'Invalid PIN. Please try again.');
        setPinLoading(false);
      }
    } catch (error) {
      setPinError('Verification failed. Please try again.');
      setPinLoading(false);
    }
  };

  const executeSend = () => {
    setShowAnimation(true);
    setAnimationStep(1);

    // Step 1: Show card (1 second)
    setTimeout(() => setAnimationStep(2), 1000);
    
    // Step 2: Card enlarges (0.8 seconds)
    setTimeout(() => setAnimationStep(3), 1800);
    
    // Step 3: Card shrinks and moves to envelope (1.2 seconds)
    setTimeout(() => {
      setAnimationStep(4);
      drawNameOnEnvelope(selectedRecipient.name);
    }, 3000);
    
    // Step 4: Name writing completes (2.5 seconds)
    setTimeout(() => setAnimationStep(5), 5500);
    
    // Step 5: Envelope slides right (1 second)
    setTimeout(() => {
      setShowAnimation(false);
      setAnimationStep(0);
      setSelectedRecipient(null);
      setAmount('');
      setMessage('');
      setShowMobileForm(false);
      setPinError('');
    }, 6500);
  };

  const handleSelectRecipient = (colleague: any) => {
    setSelectedRecipient(colleague);
    setShowMobileForm(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Mobile Header */}
      <div className="lg:hidden mb-6">
        {showMobileForm && (
          <Button
            variant="ghost"
            onClick={() => setShowMobileForm(false)}
            className="mb-4 p-0"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Recipients
          </Button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center relative">
            <Gift className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Appreciate & Gift</h1>
            <p className="text-gray-600">Recognize your colleagues' amazing contributions</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border border-rose-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-purple-700">
            <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <Gift className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium">Make someone's day brighter with your appreciation!</p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Animation Modal */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Envelope Background (always present but invisible until step 3) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: animationStep >= 3 ? 1 : 0,
                  scale: animationStep >= 3 ? 1 : 0.8,
                  x: animationStep === 5 ? 800 : 0
                }}
                transition={{ 
                  duration: animationStep === 5 ? 1 : 0.3,
                  ease: "easeInOut"
                }}
                className="absolute bg-gradient-to-br from-yellow-100 to-amber-100 border-4 border-yellow-300 rounded-2xl p-6 lg:p-8 w-80 lg:w-96 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-full h-16 lg:h-20 mb-4 flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={64}
                      className="border-2 border-dashed border-amber-400 rounded bg-white/70"
                    />
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>To:</strong> {selectedRecipient?.email}</p>
                    <p><strong>From:</strong> {user.email}</p>
                    <div className="mt-3 text-xs text-amber-800 bg-amber-100 p-2 rounded flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>With Appreciation</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Letter Card */}
              <AnimatePresence>
                {animationStep >= 1 && animationStep <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, y: 100 }}
                    animate={{ 
                      opacity: 1, 
                      scale: animationStep === 2 ? 1.1 : animationStep === 3 ? 0.4 : 1,
                      y: animationStep === 3 ? -20 : 0,
                      x: animationStep === 3 ? 0 : 0,
                      rotate: animationStep === 3 ? 5 : 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.2, 
                      y: -50,
                      transition: { duration: 0.5 }
                    }}
                    transition={{ 
                      duration: animationStep === 3 ? 1.2 : 0.6, 
                      ease: animationStep === 3 ? "easeInOut" : "easeOut" 
                    }}
                    className="absolute bg-white rounded-lg shadow-2xl p-6 lg:p-8 w-72 lg:w-80 border-2 border-purple-200"
                    style={{ 
                      transformOrigin: 'center center',
                      zIndex: animationStep === 3 ? 10 : 5
                    }}
                  >
                    <div className="text-center">
                      <div className="mb-4 text-purple-500">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center relative">
                          <Gift className="w-6 h-6 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                            <Heart className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                        Dear {selectedRecipient?.name},
                      </h3>
                      <div className="mb-6 space-y-3">
                        <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {amount} coins
                        </div>
                        <p className="text-gray-600 italic text-sm lg:text-base">
                          "{message}"
                        </p>
                      </div>
                      <div className="border-t pt-4 text-sm text-gray-500">
                        <p>With heartfelt appreciation,</p>
                        <p className="font-semibold text-purple-600">{user.username}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Verification Modal */}
      <PinVerification
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onVerify={handlePinVerify}
        recipientName={selectedRecipient?.name}
        amount={amount}
        loading={pinLoading}
        error={pinError}
      />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {!showMobileForm ? (
          /* Recipient Selection - Mobile */
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Colleague
              </h2>
              
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search colleagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredColleagues.map((colleague) => (
                  <motion.div
                    key={colleague.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectRecipient(colleague)}
                    className="p-3 rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 border border-gray-200 hover:border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <img src={colleague.avatar} alt={colleague.name} className="rounded-full" />
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{colleague.name}</p>
                        <p className="text-sm text-gray-600">{colleague.department}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Transfer Form - Mobile */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Appreciate {selectedRecipient?.name}
              </h2>

              <div className="mb-4 p-3 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg border border-rose-200">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <img src={selectedRecipient?.avatar} alt={selectedRecipient?.name} className="rounded-full" />
                  </Avatar>
                  <span className="font-semibold text-gray-800">{selectedRecipient?.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Amount (Available: {user.balance.toLocaleString()} coins)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white/80"
                    max={user.balance}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Appreciation Message
                  </label>
                  <Textarea
                    placeholder="Share what you appreciate about their work..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-white/80 min-h-[100px] resize-none"
                  />
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!selectedRecipient || !amount || !message || parseInt(amount) > user.balance}
                  className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600 h-12"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Send {amount} Coins
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipient Selection - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Colleague
            </h2>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search colleagues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredColleagues.map((colleague) => (
                <motion.div
                  key={colleague.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRecipient(colleague)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedRecipient?.id === colleague.id
                      ? 'bg-gradient-to-r from-purple-100 to-rose-100 border-2 border-purple-300'
                      : 'bg-gray-50 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 border-2 border-transparent hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <img src={colleague.avatar} alt={colleague.name} className="rounded-full" />
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{colleague.name}</p>
                      <p className="text-sm text-gray-600">{colleague.department}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Transfer Form - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Appreciation Details
            </h2>

            {selectedRecipient && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg border border-rose-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <img src={selectedRecipient.avatar} alt={selectedRecipient.name} className="rounded-full" />
                    </Avatar>
                    <span className="font-semibold text-gray-800">{selectedRecipient.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecipient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Amount (Available: {user.balance.toLocaleString()} coins)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/80"
                  max={user.balance}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Appreciation Message
                </label>
                <Textarea
                  placeholder="Share what you appreciate about their work..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/80 min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSend}
                disabled={!selectedRecipient || !amount || !message || parseInt(amount) > user.balance}
                className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600"
              >
                <Heart className="w-4 h-4 mr-2" />
                Send Appreciation
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}