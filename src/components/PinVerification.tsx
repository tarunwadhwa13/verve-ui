import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, X, ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface PinVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => void;
  recipientName?: string;
  amount?: string;
  loading?: boolean;
  error?: string;
}

export function PinVerification({ 
  isOpen, 
  onClose, 
  onVerify, 
  recipientName, 
  amount, 
  loading = false, 
  error = '' 
}: PinVerificationProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      setShake(true);
      setPin(['', '', '', '']);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (newPin.every(digit => digit) && newPin.join('').length === 4) {
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          onVerify(newPin.join(''));
        }, 300);
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const clearPin = () => {
    setPin(['', '', '', '']);
    setSuccess(false);
    const firstInput = document.getElementById('pin-0');
    firstInput?.focus();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          x: shake ? [0, -10, 10, -10, 10, 0] : 0
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ 
          duration: 0.2,
          x: { duration: 0.5 }
        }}
        className="w-full max-w-md"
      >
        <Card className="p-6 bg-white shadow-2xl border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                success ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {success ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Shield className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {success ? 'Verified!' : 'Security Verification'}
                </h2>
                <p className="text-sm text-gray-600">Enter your 4-digit PIN</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Transaction Details */}
          {recipientName && amount && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">Transaction Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium text-gray-800">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-blue-600">{amount} coins</span>
                </div>
              </div>
            </div>
          )}

          {/* PIN Input */}
          <div className="mb-6">
            <div className="flex gap-3 justify-center mb-4">
              {pin.map((digit, index) => (
                <motion.div
                  key={index}
                  animate={success ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <Input
                    id={`pin-${index}`}
                    type="password"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-bold border-2 ${
                      success 
                        ? 'border-green-300 bg-green-50' 
                        : error 
                        ? 'border-red-300 bg-red-50' 
                        : digit 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300'
                    } focus:border-blue-500`}
                    maxLength={1}
                    disabled={loading || success}
                  />
                </motion.div>
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm text-center mb-4"
              >
                {error}
              </motion.p>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm">Verifying...</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={clearPin}
              disabled={loading || success}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}