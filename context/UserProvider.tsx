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
const API_BASE_URL = 'https://api.piru.app/api';

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
  console.log(user)
  const isAuthenticated = !!token && !!user;

  // Initialize app - check for existing token
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Login
  const login = async () => {
    try {
      setIsLoading(true);
      
      // Configure redirect URI for React Native
      // For development, use your local IP or localhost
      // For production, use your app's custom scheme
      const redirectUri = 'piru://quiz';          // For production app
      
      // Start OAuth flow
      const authUrl = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        // Extract token from URL
        const url = new URL(result.url);
        const tokenParam = url.searchParams.get('token');
        
        if (tokenParam) {
          await AsyncStorage.setItem('authToken', tokenParam);
          setToken(tokenParam);
          await refreshUserData();
          router.replace('/(tabs)/home');
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

  // Logout
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

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        apiCall('/user/profile'),
        apiCall('/user/stats')
      ]);

      setUser(profileResponse.data.user);
      setSettings(profileResponse.data.settings);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If token is invalid, logout
      if (error instanceof Error && error.message.includes('401')) {
        await logout();
      }
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      await apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      await refreshUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Update user settings
  const updateUserSettings = async (data: Partial<UserSettings>) => {
    try {
      await apiCall('/user/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      await refreshUserData();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Add experience points
  const addExperience = async (experience: number) => {
    try {
      const response = await apiCall('/user/experience', {
        method: 'POST',
        body: JSON.stringify({ experience })
      });
      
      // Update local state immediately for better UX
      if (user && stats) {
        setUser(prev => prev ? {
          ...prev,
          experience: response.data.newExperience,
          level: response.data.newLevel,
          experienceToNext: response.data.newExperienceToNext
        } : null);
        
        setStats(prev => prev ? {
          ...prev,
          experience: response.data.newExperience,
          level: response.data.newLevel,
          experienceToNext: response.data.newExperienceToNext
        } : null);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  // Update user streak
  const updateStreak = async (currentStreak: number) => {
    try {
      const response = await apiCall('/user/streak', {
        method: 'PUT',
        body: JSON.stringify({ currentStreak })
      });
      
      // Update local state immediately
      if (user && stats) {
        setUser(prev => prev ? {
          ...prev,
          currentStreak: response.data.currentStreak,
          longestStreak: response.data.longestStreak
        } : null);
        
        setStats(prev => prev ? {
          ...prev,
          currentStreak: response.data.currentStreak,
          longestStreak: response.data.longestStreak
        } : null);
      }
      
      return response.data;
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
    isAuthenticated,
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

// Hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 