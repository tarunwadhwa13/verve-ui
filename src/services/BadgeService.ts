import { apiService } from './ApiService';
import { Badge } from '../types/user';
import { APP_CONFIG } from '../config/config';

export interface BadgeProgress {
  badgeId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  badges: Badge[];
}

class BadgeService {
  async getUserBadges(userId: string): Promise<Badge[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock user badges (ENABLE_MOCK_DATA = true)');
      return this.getMockBadges(userId);
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<Badge[]>(`/users/${userId}/badges`);
      */
      
      // Fallback to mock for now
      return this.getMockBadges(userId);
    } catch (error) {
      console.warn('API not available, using mock badges:', error);
      return this.getMockBadges(userId);
    }
  }

  async getAllBadges(): Promise<Badge[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock badges (ENABLE_MOCK_DATA = true)');
      return this.getAllMockBadges();
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<Badge[]>('/badges');
      */
      
      // Fallback to mock for now
      return this.getAllMockBadges();
    } catch (error) {
      console.warn('API not available, using mock badges:', error);
      return this.getAllMockBadges();
    }
  }

  async getBadgeCategories(): Promise<BadgeCategory[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock badge categories (ENABLE_MOCK_DATA = true)');
      return this.getMockBadgeCategories();
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<BadgeCategory[]>('/badges/categories');
      */
      
      // Fallback to mock for now
      return this.getMockBadgeCategories();
    } catch (error) {
      console.warn('API not available, using mock badge categories:', error);
      return this.getMockBadgeCategories();
    }
  }

  async getUserBadgeProgress(userId: string): Promise<BadgeProgress[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock badge progress (ENABLE_MOCK_DATA = true)');
      return this.getMockBadgeProgress();
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<BadgeProgress[]>(`/users/${userId}/badge-progress`);
      */
      
      // Fallback to mock for now
      return this.getMockBadgeProgress();
    } catch (error) {
      console.warn('API not available, using mock badge progress:', error);
      return this.getMockBadgeProgress();
    }
  }

  async awardBadge(userId: string, badgeId: string): Promise<Badge> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock badge award (ENABLE_MOCK_DATA = true)');
      const allBadges = this.getAllMockBadges();
      const badge = allBadges.find(b => b.id === badgeId);
      if (badge) {
        return {
          ...badge,
          earnedAt: new Date().toISOString()
        };
      }
      throw new Error('Badge not found');
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.post<Badge>(`/users/${userId}/badges`, { badgeId });
      */
      
      // Fallback to mock for now
      const allBadges = this.getAllMockBadges();
      const badge = allBadges.find(b => b.id === badgeId);
      if (badge) {
        return {
          ...badge,
          earnedAt: new Date().toISOString()
        };
      }
      throw new Error('Badge not found');
    } catch (error) {
      console.warn('API not available for awarding badge:', error);
      // Return mock awarded badge
      const allBadges = this.getAllMockBadges();
      const badge = allBadges.find(b => b.id === badgeId);
      if (badge) {
        return {
          ...badge,
          earnedAt: new Date().toISOString()
        };
      }
      throw new Error('Badge not found');
    }
  }

  async checkBadgeEligibility(userId: string): Promise<string[]> {
    // TODO: Remove mock data when backend is ready
    if (APP_CONFIG.ENABLE_MOCK_DATA) {
      console.log('[BadgeService] Using mock badge eligibility (ENABLE_MOCK_DATA = true)');
      return []; // Return empty array for mock
    }

    try {
      // Backend integration code (uncomment when backend is ready):
      /*
      return await apiService.get<string[]>(`/users/${userId}/badge-eligibility`);
      */
      
      // Fallback to mock for now
      return [];
    } catch (error) {
      console.warn('API not available for badge eligibility check:', error);
      return []; // Return empty array for mock
    }
  }

  // Mock methods for development
  private getMockBadges(userId: string): Badge[] {
    return [
      {
        id: 'first_send',
        name: 'First Send',
        description: 'Sent your first coins',
        icon: '🚀',
        category: 'achievement',
        rarity: 'common',
        earnedAt: '2024-08-25T10:00:00Z'
      },
      {
        id: 'generous_giver',
        name: 'Generous Giver',
        description: 'Sent 500+ coins',
        icon: '💝',
        category: 'achievement',
        rarity: 'rare',
        earnedAt: '2024-08-26T14:30:00Z'
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Sent coins to 10 different colleagues',
        icon: '🤝',
        category: 'recognition',
        rarity: 'rare',
        earnedAt: '2024-08-27T16:45:00Z'
      }
    ];
  }

  private getAllMockBadges(): Badge[] {
    return [
      // Achievement badges
      {
        id: 'first_send',
        name: 'First Send',
        description: 'Sent your first coins',
        icon: '🚀',
        category: 'achievement',
        rarity: 'common'
      },
      {
        id: 'generous_giver',
        name: 'Generous Giver',
        description: 'Sent 500+ coins',
        icon: '💝',
        category: 'achievement',
        rarity: 'rare'
      },
      {
        id: 'coin_collector',
        name: 'Coin Collector',
        description: 'Received 1000+ coins',
        icon: '🏆',
        category: 'achievement',
        rarity: 'epic'
      },
      {
        id: 'daily_sender',
        name: 'Daily Sender',
        description: 'Send coins for 7 consecutive days',
        icon: '📅',
        category: 'achievement',
        rarity: 'rare'
      },
      // Recognition badges
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Sent coins to 10 different colleagues',
        icon: '🤝',
        category: 'recognition',
        rarity: 'rare'
      },
      {
        id: 'mentor',
        name: 'Mentor',
        description: 'Help 5 colleagues with projects',
        icon: '🧑‍🏫',
        category: 'recognition',
        rarity: 'epic'
      },
      {
        id: 'culture_champion',
        name: 'Culture Champion',
        description: 'Promoted positive company culture',
        icon: '🌟',
        category: 'recognition',
        rarity: 'legendary'
      },
      // Milestone badges
      {
        id: 'welcome_aboard',
        name: 'Welcome Aboard',
        description: 'Joined the platform',
        icon: '🎉',
        category: 'milestone',
        rarity: 'common'
      },
      {
        id: 'one_month',
        name: 'One Month Strong',
        description: 'Active for one month',
        icon: '🗓️',
        category: 'milestone',
        rarity: 'common'
      },
      {
        id: 'six_months',
        name: 'Half Year Hero',
        description: 'Active for six months',
        icon: '📆',
        category: 'milestone',
        rarity: 'rare'
      },
      // Special badges
      {
        id: 'beta_tester',
        name: 'Beta Tester',
        description: 'Early adopter of the platform',
        icon: '🧪',
        category: 'special',
        rarity: 'legendary'
      },
      {
        id: 'top_contributor',
        name: 'Top Contributor',
        description: 'Among top 10% of active users',
        icon: '⭐',
        category: 'special',
        rarity: 'legendary'
      }
    ];
  }

  private getMockBadgeCategories(): BadgeCategory[] {
    const allBadges = this.getAllMockBadges();
    
    return [
      {
        id: 'achievement',
        name: 'Achievements',
        description: 'Badges earned through specific actions and milestones',
        badges: allBadges.filter(badge => badge.category === 'achievement')
      },
      {
        id: 'recognition',
        name: 'Recognition',
        description: 'Badges for recognizing and helping colleagues',
        badges: allBadges.filter(badge => badge.category === 'recognition')
      },
      {
        id: 'milestone',
        name: 'Milestones',
        description: 'Badges for platform usage milestones',
        badges: allBadges.filter(badge => badge.category === 'milestone')
      },
      {
        id: 'special',
        name: 'Special',
        description: 'Rare and unique badges',
        badges: allBadges.filter(badge => badge.category === 'special')
      }
    ];
  }

  private getMockBadgeProgress(): BadgeProgress[] {
    return [
      {
        badgeId: 'coin_collector',
        currentValue: 750,
        targetValue: 1000,
        percentage: 75
      },
      {
        badgeId: 'daily_sender',
        currentValue: 4,
        targetValue: 7,
        percentage: 57
      },
      {
        badgeId: 'mentor',
        currentValue: 2,
        targetValue: 5,
        percentage: 40
      },
      {
        badgeId: 'six_months',
        currentValue: 3,
        targetValue: 6,
        percentage: 50
      }
    ];
  }
}

// Export singleton instance
export const badgeService = new BadgeService();