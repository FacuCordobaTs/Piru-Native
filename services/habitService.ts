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

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// API Helper function
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

// Habit Service
export const habitService = {
  // Get all habits for the current user
  getHabits: async (): Promise<Habit[]> => {
    const response = await apiCall('/habits');
    return response.data;
  },

  // Get a specific habit by ID
  getHabit: async (habitId: number): Promise<{ habit: Habit; recentCompletions: HabitCompletion[] }> => {
    const response = await apiCall(`/habits/${habitId}`);
    return response.data;
  },

  // Create a new habit
  createHabit: async (habitData: {
    name: string;
    description?: string;
    targetDays?: number;
    experienceReward?: number;
    reminderTime?: string;
  }): Promise<Habit> => {
    const response = await apiCall('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
    return response.data;
  },

  // Update a habit
  updateHabit: async (habitId: number, updates: {
    name?: string;
    description?: string;
    targetDays?: number;
    experienceReward?: number;
    reminderTime?: string;
  }): Promise<void> => {
    await apiCall(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a habit
  deleteHabit: async (habitId: number): Promise<void> => {
    await apiCall(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  },

  // Complete a habit for today
  completeHabit: async (habitId: number, data?: {
    notes?: string;
    mood?: 'great' | 'good' | 'okay' | 'bad';
  }): Promise<{
    habitId: number;
    newStreak: number;
    newLongestStreak: number;
    experienceGained: number;
    newUserExperience: number;
    newUserLevel: number;
    leveledUp: boolean;
  }> => {
    const response = await apiCall(`/habits/${habitId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
    return response.data;
  },

  // Get habit completions
  getHabitCompletions: async (habitId: number, limit = 30, offset = 0): Promise<HabitCompletion[]> => {
    const response = await apiCall(`/habits/${habitId}/completions?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get habit statistics
  getHabitStats: async (habitId: number): Promise<HabitStats> => {
    const response = await apiCall(`/habits/${habitId}/stats`);
    return response.data;
  },
};
