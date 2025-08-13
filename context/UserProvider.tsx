import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';

// Types
export interface User {
  id: number;
  email: string;
  name?: string;
  level: number;
  experience: number;
  experienceToNext: number;
  currentStreak: number;
  longestStreak: number;
  avatar?: string;
  skills?: any;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  reminderTime: string;
  language: string;
}

export interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  currentStreak: number;
  longestStreak: number;
  totalHabits: number;
  activeHabits: number;
  totalExperienceFromHabits: number;
  progressToNextLevel: number;
}

interface UserContextType {
  user: User | null;
  settings: UserSettings | null;
  stats: UserStats | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserSettings: (data: Partial<UserSettings>) => Promise<void>;
  addExperience: (experience: number) => Promise<void>;
  updateStreak: (currentStreak: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// API Helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Start Google OAuth flow
      const redirectUrl = 'exp://192.168.1.100:8081'; // Update with your Expo dev server URL
      const authUrl = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      if (result.type === 'success' && result.url) {
        // Extract token from URL
        const url = new URL(result.url);
        const tokenParam = url.searchParams.get('token');
        
        if (tokenParam) {
          await AsyncStorage.setItem('authToken', tokenParam);
          setToken(tokenParam);
          await refreshUserData();
          router.push('/quiz'); // Navigate to quiz after successful login
        } else {
          throw new Error('No token received from OAuth');
        }
      } else if (result.type === 'cancel') {
        console.log('OAuth cancelled by user');
      } else {
        throw new Error('OAuth failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setSettings(null);
      setStats(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      if (!token) return;

      // Get user profile and settings
      const profileResponse = await apiCall('/user/profile');
      if (profileResponse.success) {
        setUser(profileResponse.data.user);
        setSettings(profileResponse.data.settings);
      }

      // Get user stats
      const statsResponse = await apiCall('/user/stats');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If token is invalid, logout
      if (error instanceof Error && error.message.includes('401')) {
        await logout();
      }
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const response = await apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (response.success && user) {
        setUser({ ...user, ...data });
      }
      
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUserSettings = async (data: Partial<UserSettings>) => {
    try {
      const response = await apiCall('/user/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (response.success && settings) {
        setSettings({ ...settings, ...data });
      }
      
      return response;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const addExperience = async (experience: number) => {
    try {
      const response = await apiCall('/user/experience', {
        method: 'POST',
        body: JSON.stringify({ experience }),
      });
      
      if (response.success) {
        await refreshUserData(); // Refresh to get updated stats
        return response.data;
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const updateStreak = async (currentStreak: number) => {
    try {
      const response = await apiCall('/user/streak', {
        method: 'PUT',
        body: JSON.stringify({ currentStreak }),
      });
      
      if (response.success) {
        await refreshUserData(); // Refresh to get updated stats
        return response.data;
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  };

  const value: UserContextType = {
    user,
    settings,
    stats,
    isLoading,
    isAuthenticated: !!token,
    token,
    login,
    logout,
    refreshUserData,
    updateUserProfile,
    updateUserSettings,
    addExperience,
    updateStreak,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 