import { useState, useEffect, useCallback } from 'react';
import { habitService, Habit, HabitCompletion, HabitStats } from '@/services/habitService';
import { useUser } from '@/context/UserProvider';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, refreshUserData } = useUser();

  // Load habits
  const loadHabits = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const habitsData = await habitService.getHabits();
      setHabits(habitsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load habits');
      console.error('Error loading habits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Create habit
  const createHabit = useCallback(async (habitData: {
    name: string;
    description?: string;
    targetDays?: number;
    experienceReward?: number;
    reminderTime?: string;
  }) => {
    try {
      setError(null);
      const newHabit = await habitService.createHabit(habitData);
      setHabits(prev => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create habit');
      throw err;
    }
  }, []);

  // Update habit
  const updateHabit = useCallback(async (habitId: number, updates: {
    name?: string;
    description?: string;
    targetDays?: number;
    experienceReward?: number;
    reminderTime?: string;
  }) => {
    try {
      setError(null);
      await habitService.updateHabit(habitId, updates);
      setHabits(prev => prev.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update habit');
      throw err;
    }
  }, []);

  // Delete habit
  const deleteHabit = useCallback(async (habitId: number) => {
    try {
      setError(null);
      await habitService.deleteHabit(habitId);
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      throw err;
    }
  }, []);

  // Complete habit
  const completeHabit = useCallback(async (habitId: number, data?: {
    notes?: string;
    mood?: 'great' | 'good' | 'okay' | 'bad';
  }) => {
    try {
      setError(null);
      const result = await habitService.completeHabit(habitId, data);
      
      // Update habit streak in local state
      setHabits(prev => prev.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              currentStreak: result.newStreak,
              longestStreak: result.newLongestStreak 
            }
          : habit
      ));

      // Refresh user data to update experience and level
      await refreshUserData();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete habit');
      throw err;
    }
  }, [refreshUserData]);

  // Get habit details
  const getHabit = useCallback(async (habitId: number) => {
    try {
      setError(null);
      return await habitService.getHabit(habitId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get habit');
      throw err;
    }
  }, []);

  // Get habit completions
  const getHabitCompletions = useCallback(async (habitId: number, limit = 30, offset = 0) => {
    try {
      setError(null);
      return await habitService.getHabitCompletions(habitId, limit, offset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get habit completions');
      throw err;
    }
  }, []);

  // Get habit stats
  const getHabitStats = useCallback(async (habitId: number) => {
    try {
      setError(null);
      return await habitService.getHabitStats(habitId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get habit stats');
      throw err;
    }
  }, []);

  // Load habits when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadHabits();
    }
  }, [isAuthenticated, loadHabits]);

  return {
    habits,
    isLoading,
    error,
    loadHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getHabit,
    getHabitCompletions,
    getHabitStats,
  };
};
