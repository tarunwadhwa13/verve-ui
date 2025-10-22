import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, UserPlus, Mail, User, Shield, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth, User as UserType } from '../contexts/AuthContext';

// Mock additional users for admin management
const mockAllUsers: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    balance: 2450,
    role: 'admin',
    badges: []
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    balance: 1850,
    role: 'user',
    badges: []
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    balance: 950,
    role: 'user',
    badges: []
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=faces',
    balance: 1200,
    role: 'user',
    badges: []
  }
];

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserType[]>(mockAllUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    balance: 1000
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAddUser = () => {
    if (!newUser.username || !newUser.username) {
      setError('Name and email are required');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      setError('User with this email already exists');
      return;
    }

    const user: UserType = {
      id: Date.now().toString(),
      name: newUser.username,
      email: newUser.email,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces&sig=${Date.now()}`,
      balance: newUser.balance,
      role: newUser.role,
      badges: [
        { id: 'first_send', name: 'First Send', description: 'Sent your first coins', icon: '🚀', unlocked: false },
        { id: 'generous_giver', name: 'Generous Giver', description: 'Sent 500+ coins', icon: '💝', unlocked: false },
        { id: 'team_player', name: 'Team Player', description: 'Sent coins to 10 different colleagues', icon: '🤝', unlocked: false },
        { id: 'appreciation_master', name: 'Appreciation Master', description: 'Received 1000+ coins', icon: '🏆', unlocked: false },
        { id: 'daily_sender', name: 'Daily Sender', description: 'Send coins for 7 consecutive days', icon: '📅', unlocked: false },
        { id: 'mentor', name: 'Mentor', description: 'Help 5 colleagues with projects', icon: '🧑‍🏫', unlocked: false },
      ]
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user', balance: 1000 });
    setIsAddUserOpen(false);
    setSuccess('User added successfully');
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setSuccess('User deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserType>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    setEditingUser(null);
    setSuccess('User updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage users and system settings</p>
          </div>
          
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for the Verve platform.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: 'admin' | 'user') => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={newUser.balance}
                    onChange={(e) => setNewUser({ ...newUser, balance: parseInt(e.target.value) || 0 })}
                    placeholder="Enter initial balance"
                  />
                </div>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts, roles, and balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <Input
                            value={user.username}
                            onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, name: e.target.value } : u))}
                            className="w-40"
                          />
                          <Input
                            value={user.email}
                            onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, email: e.target.value } : u))}
                            className="w-60"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    
                    <div className="text-sm text-gray-600">
                      {user.balance.toLocaleString()} coins
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingUser === user.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateUser(user.id, user)}
                            className="h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.id !== '1' && ( // Prevent deleting the main admin
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}