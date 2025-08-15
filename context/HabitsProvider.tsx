import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Habit {
  id: number;
  userId: number;
  name: string;
  description?: string;
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  experienceReward: number;
  createdAt: string;
  reminderTime: string;
}

export interface HabitCompletion {
  id: number;
  habitId: number;
  userId: number;
  completedAt: string;
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
}

export interface HabitStats {
  habit: {
    id: number;
    name: string;
    currentStreak: number;
    longestStreak: number;
    targetDays: number;
    experienceReward: number;
  };
  stats: {
    totalCompletions: number;
    completionRate: number;
    recentStreak: number;
    moodDistribution: Record<string, number>;
    averageCompletionsPerWeek: number;
  };
}

export interface CreateHabitData {
  name: string;
  description?: string;
  targetDays?: number;
  experienceReward?: number;
  reminderTime?: string;
}

export interface CompleteHabitData {
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
}

interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  refreshHabits: () => Promise<void>;
  createHabit: (data: CreateHabitData) => Promise<Habit>;
  updateHabit: (id: number, data: Partial<CreateHabitData>) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  completeHabit: (id: number, data?: CompleteHabitData) => Promise<any>;
  getHabitStats: (id: number) => Promise<HabitStats>;
  getHabitCompletions: (id: number, limit?: number, offset?: number) => Promise<HabitCompletion[]>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

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

export const HabitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh habits list
  const refreshHabits = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall('/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Error refreshing habits:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new habit
  const createHabit = async (data: CreateHabitData): Promise<Habit> => {
    try {
      const response = await apiCall('/habits', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      const newHabit = response.data;
      setHabits(prev => [newHabit, ...prev]);
      return newHabit;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  };

  // Update habit
  const updateHabit = async (id: number, data: Partial<CreateHabitData>) => {
    try {
      await apiCall(`/habits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      // Update local state
      setHabits(prev => prev.map(habit => 
        habit.id === id ? { ...habit, ...data } : habit
      ));
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  // Delete habit
  const deleteHabit = async (id: number) => {
    try {
      await apiCall(`/habits/${id}`, {
        method: 'DELETE'
      });
      
      // Remove from local state
      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  // Complete habit
  const completeHabit = async (id: number, data?: CompleteHabitData) => {
    try {
      const response = await apiCall(`/habits/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(data || {})
      });
      
      // Update local habit state with new streak
      setHabits(prev => prev.map(habit => 
        habit.id === id ? { 
          ...habit, 
          currentStreak: response.data.newStreak,
          longestStreak: response.data.newLongestStreak
        } : habit
      ));
      
      return response.data;
    } catch (error) {
      console.error('Error completing habit:', error);
      throw error;
    }
  };

  // Get habit statistics
  const getHabitStats = async (id: number): Promise<HabitStats> => {
    try {
      const response = await apiCall(`/habits/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error getting habit stats:', error);
      throw error;
    }
  };

  // Get habit completions
  const getHabitCompletions = async (id: number, limit: number = 30, offset: number = 0): Promise<HabitCompletion[]> => {
    try {
      const response = await apiCall(`/habits/${id}/completions?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error('Error getting habit completions:', error);
      throw error;
    }
  };

  const value: HabitsContextType = {
    habits,
    isLoading,
    refreshHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getHabitStats,
    getHabitCompletions,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};

// Hook to use the habits context
export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
