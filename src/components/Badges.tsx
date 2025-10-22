import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Lock, Calendar, Trophy, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface BadgesProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges: {
      id: string;
      name: string;
      description: string;
      icon: string;
      unlocked: boolean;
      unlockedAt?: string;
    }[];
  };
}

export function Badges({ user }: BadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: Award },
    { id: 'sending', label: 'Sending', icon: Trophy },
    { id: 'receiving', label: 'Receiving', icon: Target },
    { id: 'social', label: 'Social', icon: Calendar },
  ];

  const badgeCategories = {
    sending: ['first_send', 'generous_giver', 'daily_sender'],
    receiving: ['appreciation_master'],
    social: ['team_player', 'mentor'],
  };

  const filteredBadges = selectedCategory === 'all' 
    ? user.badges 
    : user.badges.filter(badge => badgeCategories[selectedCategory]?.includes(badge.id));

  const unlockedCount = user.badges.filter(b => b.unlocked).length;
  const totalBadges = user.badges.length;
  const progressPercentage = (unlockedCount / totalBadges) * 100;

  // Sample progress towards next badges
  const progressData = {
    appreciation_master: { current: 850, target: 1000, unit: 'coins received' },
    daily_sender: { current: 3, target: 7, unit: 'consecutive days' },
    mentor: { current: 2, target: 5, unit: 'colleagues helped' },
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Award className="w-6 h-6 lg:w-8 lg:h-8" />
          Badge Collection
        </h1>
        <p className="text-gray-600">Earn badges by being an awesome colleague!</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 lg:mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Collection Progress</h3>
              <p className="text-white/90">
                {unlockedCount} of {totalBadges} badges unlocked
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="w-24 lg:w-32">
                <Progress value={progressPercentage} className="h-2 bg-white/20" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className={`p-6 h-full transition-all duration-300 hover:shadow-xl ${
              badge.unlocked 
                ? 'bg-white/80 backdrop-blur-sm border-white/20 shadow-lg ring-2 ring-yellow-200' 
                : 'bg-white/40 backdrop-blur-sm border-white/10 opacity-75'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl ${
                  badge.unlocked 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {badge.unlocked ? badge.icon : <Lock className="w-6 h-6" />}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                
                {badge.unlocked ? (
                  <div>
                    <Badge className="bg-green-100 text-green-700 mb-2">
                      Unlocked
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Earned on {badge.unlockedAt}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Badge className="bg-gray-100 text-gray-700 mb-3">
                      Locked
                    </Badge>
                    
                    {/* Progress towards badge */}
                    {progressData[badge.id] && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{progressData[badge.id].current} / {progressData[badge.id].target}</span>
                          <span>{progressData[badge.id].unit}</span>
                        </div>
                        <Progress 
                          value={(progressData[badge.id].current / progressData[badge.id].target) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Badge Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Badge Tips
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Send coins regularly to unlock sending badges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Help colleagues with projects to earn social badges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Receive appreciation from teammates for recognition badges</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Complete daily actions to unlock streak badges</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}