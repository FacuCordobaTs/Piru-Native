import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '@/context/UserProvider';
import { useHabits } from '@/context/HabitsProvider';
import { T } from '@/components/ui/T';

/**
 * Example component showing how to use the UserProvider and HabitsProvider
 * This demonstrates the integration with the backend API
 */
export const AuthExample: React.FC = () => {
  const { 
    user, 
    stats, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    addExperience,
    updateStreak 
  } = useUser();
  
  const { 
    habits, 
    isLoading: habitsLoading,
    refreshHabits,
    createHabit,
    completeHabit 
  } = useHabits();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    }
  };

  const handleCreateTestHabit = async () => {
    try {
      await createHabit({
        name: 'Test Habit',
        description: 'A test habit for demo',
        targetDays: 7,
        experienceReward: 15
      });
      Alert.alert('Success', 'Habit created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit');
    }
  };

  const handleCompleteHabit = async (habitId: number) => {
    try {
      const result = await completeHabit(habitId, {
        mood: 'great',
        notes: 'Feeling awesome!'
      });
      
      Alert.alert(
        'Habit Completed!', 
        `You gained ${result.experienceGained} XP! ${result.leveledUp ? 'Level up!' : ''}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete habit');
    }
  };

  const handleAddExperience = async () => {
    try {
      const result = await addExperience(50);
      Alert.alert(
        'Experience Added!',
        `${result.leveledUp ? 'Level up! ' : ''}New level: ${result.newUserLevel}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add experience');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <T>Loading...</T>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <T className="text-xl mb-4">Not authenticated</T>
        <TouchableOpacity 
          onPress={handleLogin}
          className="bg-blue-500 px-6 py-3 rounded"
        >
          <T className="text-white">Login with Google</T>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <T className="text-2xl font-bold mb-4">Welcome {user?.name || user?.email}!</T>
      
      {/* User Stats */}
      <View className="bg-gray-100 p-4 rounded mb-4">
        <T className="text-lg font-bold">Your Stats</T>
        <T>Level: {stats?.level}</T>
        <T>Experience: {stats?.experience}/{stats?.experienceToNext}</T>
        <T>Current Streak: {stats?.currentStreak}</T>
        <T>Total Habits: {stats?.totalHabits}</T>
        <T>Active Habits: {stats?.activeHabits}</T>
      </View>

      {/* Action Buttons */}
      <View className="mb-4">
        <TouchableOpacity 
          onPress={handleAddExperience}
          className="bg-green-500 px-4 py-2 rounded mb-2"
        >
          <T className="text-white text-center">Add 50 XP</T>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleCreateTestHabit}
          className="bg-blue-500 px-4 py-2 rounded mb-2"
        >
          <T className="text-white text-center">Create Test Habit</T>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={refreshHabits}
          className="bg-purple-500 px-4 py-2 rounded mb-2"
          disabled={habitsLoading}
        >
          <T className="text-white text-center">
            {habitsLoading ? 'Loading...' : 'Refresh Habits'}
          </T>
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      <View className="flex-1">
        <T className="text-lg font-bold mb-2">Your Habits ({habits.length})</T>
        {habits.map((habit) => (
          <View key={habit.id} className="bg-gray-100 p-3 rounded mb-2">
            <T className="font-bold">{habit.name}</T>
            <T>Streak: {habit.currentStreak} days</T>
            <T>Reward: {habit.experienceReward} XP</T>
            <TouchableOpacity 
              onPress={() => handleCompleteHabit(habit.id)}
              className="bg-green-500 px-3 py-1 rounded mt-2"
            >
              <T className="text-white text-center">Complete Today</T>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        onPress={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        <T className="text-white text-center">Logout</T>
      </TouchableOpacity>
    </View>
  );
};
