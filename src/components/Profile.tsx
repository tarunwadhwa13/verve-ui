import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Key, 
  Mail,
  Save,
  Edit3,
  Camera,
  Settings
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Avatar } from './ui/avatar';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface ProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    badges?: any[];
  };
}

export function Profile({ user }: ProfileProps) {
  const [settings, setSettings] = useState({
    // Security Settings
    requirePinForTransfers: true,
    requirePinForLargeAmounts: false,
    largeAmountThreshold: 100,
    twoFactorEnabled: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    badgeUnlockAlerts: true,
    weeklyDigest: true,
    
    // Privacy Settings
    profileVisibility: 'colleagues',
    showBadgesPublicly: true,
    showTransactionHistory: false,
    
    // Appearance Settings
    theme: 'light',
    language: 'en',
    reducedMotion: false,
    compactMode: false
  });

  const [userInfo, setUserInfo] = useState({
    name: user.username,
    email: user.email,
    department: 'Engineering',
    jobTitle: 'Senior Developer',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about creating great user experiences and helping colleagues succeed.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUserInfoChange = (key: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    console.log('Settings saved:', { settings, userInfo });
  };

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20">
              <img src={user.avatar} alt={user.username} className="rounded-full" />
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-blue-500 hover:bg-blue-600"
            >
              <Camera className="w-4 h-4 text-white" />
            </Button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 truncate">{userInfo.name}</h2>
            <p className="text-gray-600 truncate break-all">{userInfo.email}</p>
            <p className="text-sm text-gray-500 truncate">{userInfo.jobTitle} • {userInfo.department}</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "default" : "outline"}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <div className="min-w-0">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => handleUserInfoChange('name', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => handleUserInfoChange('email', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={userInfo.department}
              onChange={(e) => handleUserInfoChange('department', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={userInfo.jobTitle}
              onChange={(e) => handleUserInfoChange('jobTitle', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={userInfo.phone}
              onChange={(e) => handleUserInfoChange('phone', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
          <div className="md:col-span-2 min-w-0">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={userInfo.bio}
              onChange={(e) => handleUserInfoChange('bio', e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-w-0"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button onClick={saveChanges} className="flex items-center gap-2 justify-center">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="justify-center">
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Transfer Security
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Require PIN for all transfers</p>
              <p className="text-sm text-gray-600">Ask for PIN verification before sending coins</p>
            </div>
            <Switch
              checked={settings.requirePinForTransfers}
              onCheckedChange={(value) => handleSettingChange('requirePinForTransfers', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">PIN for large amounts only</p>
              <p className="text-sm text-gray-600">Only require PIN for transfers above threshold</p>
            </div>
            <Switch
              checked={settings.requirePinForLargeAmounts}
              onCheckedChange={(value) => handleSettingChange('requirePinForLargeAmounts', value)}
              disabled={settings.requirePinForTransfers}
            />
          </div>
          
          {settings.requirePinForLargeAmounts && !settings.requirePinForTransfers && (
            <div className="ml-4">
              <Label htmlFor="threshold">Large amount threshold (coins)</Label>
              <Input
                id="threshold"
                type="number"
                value={settings.largeAmountThreshold}
                onChange={(e) => handleSettingChange('largeAmountThreshold', parseInt(e.target.value))}
                className="mt-1 w-32"
              />
            </div>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(value) => handleSettingChange('twoFactorEnabled', value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          PIN Management
        </h3>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Key className="w-4 h-4 mr-2" />
            Change PIN
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Reset PIN
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Push Notifications</p>
              <p className="text-sm text-gray-600">Browser push notifications</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Transaction Alerts</p>
              <p className="text-sm text-gray-600">Notify when coins are sent or received</p>
            </div>
            <Switch
              checked={settings.transactionAlerts}
              onCheckedChange={(value) => handleSettingChange('transactionAlerts', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Badge Unlock Alerts</p>
              <p className="text-sm text-gray-600">Notify when new badges are earned</p>
            </div>
            <Switch
              checked={settings.badgeUnlockAlerts}
              onCheckedChange={(value) => handleSettingChange('badgeUnlockAlerts', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Weekly Digest</p>
              <p className="text-sm text-gray-600">Weekly summary of your activity</p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={(value) => handleSettingChange('weeklyDigest', value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Privacy Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Show badges publicly</p>
              <p className="text-sm text-gray-600">Let colleagues see your earned badges</p>
            </div>
            <Switch
              checked={settings.showBadgesPublicly}
              onCheckedChange={(value) => handleSettingChange('showBadgesPublicly', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Show transaction history</p>
              <p className="text-sm text-gray-600">Allow others to see your transaction history</p>
            </div>
            <Switch
              checked={settings.showTransactionHistory}
              onCheckedChange={(value) => handleSettingChange('showTransactionHistory', value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance & Accessibility
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-800 mb-2">Theme</p>
            <div className="flex gap-2">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleSettingChange('theme', 'light')}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleSettingChange('theme', 'dark')}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                variant={settings.theme === 'auto' ? 'default' : 'outline'}
                onClick={() => handleSettingChange('theme', 'auto')}
                className="flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Auto
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Reduced motion</p>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(value) => handleSettingChange('reducedMotion', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Compact mode</p>
              <p className="text-sm text-gray-600">Use smaller spacing and elements</p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(value) => handleSettingChange('compactMode', value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'security': return renderSecuritySection();
      case 'notifications': return renderNotificationsSection();
      case 'privacy': return renderPrivacySection();
      case 'appearance': return renderAppearanceSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Profile & Settings</h1>
            <p className="text-gray-600">Manage your account preferences and security settings</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.name}
                </motion.button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}