import { useState, useEffect } from 'react';
import { User, ChatUser } from '../types/user';
import { userService } from '../services/UserService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      return await userService.searchUsers({ query });
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  };

  const getUserById = async (id: string): Promise<User | undefined> => {
    try {
      return await userService.getUserById(id);
    } catch (err) {
      console.error('Get user failed:', err);
      return undefined;
    }
  };

  return {
    users,
    loading,
    error,
    searchUsers,
    getUserById,
    refreshUsers: loadUsers
  };
}

export function useChatUsers() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChatUsers();
  }, []);

  const loadChatUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await userService.getUsersForChat();
      setChatUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat users');
    } finally {
      setLoading(false);
    }
  };

  return {
    chatUsers,
    loading,
    error,
    refreshChatUsers: loadChatUsers
  };
}

export function useUserSearch() {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await userService.searchUsers({ query });
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    searching,
    search,
    clearSearch
  };
}