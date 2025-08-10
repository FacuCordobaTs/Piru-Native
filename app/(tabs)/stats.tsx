import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '@/context/UserProvider';

export default function StatsPage() {
  const { userData } = useUser();

  const stats = {
    level: 1,
    totalXP: 150,
    xpToNext: 100,
    habitsCompleted: 3,
    currentStreak: 2,
    longestStreak: 5,
    totalDays: 7,
    achievements: 2,
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">Estadísticas</Text>
          <Text className="text-gray-300 text-lg">
            Tu progreso detallado
          </Text>
        </View>

        {/* Level Progress */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🎯 Nivel {stats.level}
          </Text>
          
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-300">Progreso al siguiente nivel</Text>
              <Text className="text-purple-300">{stats.totalXP}/{stats.totalXP + stats.xpToNext} XP</Text>
            </View>
            <View className="bg-purple-900/50 rounded-full h-3">
              <View 
                className="bg-purple-400 rounded-full h-3"
                style={{ width: `${(stats.totalXP / (stats.totalXP + stats.xpToNext)) * 100}%` }}
              />
            </View>
          </View>
          
          <Text className="text-gray-300 text-sm">
            Te faltan {stats.xpToNext} XP para el nivel {stats.level + 1}
          </Text>
        </View>

        {/* Key Stats */}
        <View className="grid grid-cols-2 gap-4 mb-6">
          <View className="bg-blue-600/20 rounded-2xl p-4 border border-blue-500/30">
            <Text className="text-2xl font-bold text-white mb-1">{stats.habitsCompleted}</Text>
            <Text className="text-blue-300 text-sm">Hábitos Completados</Text>
          </View>
          
          <View className="bg-green-600/20 rounded-2xl p-4 border border-green-500/30">
            <Text className="text-2xl font-bold text-white mb-1">{stats.currentStreak}</Text>
            <Text className="text-green-300 text-sm">Días Consecutivos</Text>
          </View>
          
          <View className="bg-purple-600/20 rounded-2xl p-4 border border-purple-500/30">
            <Text className="text-2xl font-bold text-white mb-1">{stats.achievements}</Text>
            <Text className="text-purple-300 text-sm">Logros Desbloqueados</Text>
          </View>
          
          <View className="bg-yellow-600/20 rounded-2xl p-4 border border-yellow-500/30">
            <Text className="text-2xl font-bold text-white mb-1">{stats.totalDays}</Text>
            <Text className="text-yellow-300 text-sm">Días Total</Text>
          </View>
        </View>

        {/* Weekly Progress */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            📊 Progreso Semanal
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Meta Semanal</Text>
              <Text className="text-white font-semibold">{stats.weeklyGoal} hábitos</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Completados</Text>
              <Text className="text-white font-semibold">{stats.weeklyProgress}</Text>
            </View>
            
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-300">Progreso</Text>
                <Text className="text-purple-300">{Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%</Text>
              </View>
              <View className="bg-purple-900/50 rounded-full h-2">
                <View 
                  className="bg-purple-400 rounded-full h-2"
                  style={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🏆 Logros
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">🎯</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold">Iniciador</Text>
                <Text className="text-gray-400 text-sm">Completa tu primera misión</Text>
              </View>
              <Text className="text-green-400 text-sm">Desbloqueado</Text>
            </View>
            
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">🔥</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold">Consistente</Text>
                <Text className="text-gray-400 text-sm">Mantén una racha de 3 días</Text>
              </View>
              <Text className="text-green-400 text-sm">Desbloqueado</Text>
            </View>
            
            <View className="flex-row items-center opacity-50">
              <Text className="text-2xl mr-4">⭐</Text>
              <View className="flex-1">
                <Text className="text-gray-400 font-semibold">Maestro</Text>
                <Text className="text-gray-500 text-sm">Completa 10 hábitos diferentes</Text>
              </View>
              <Text className="text-gray-500 text-sm">Bloqueado</Text>
            </View>
          </View>
        </View>

        {/* Streak Info */}
        <View className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 mb-8 border border-orange-500/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🔥 Racha Actual
          </Text>
          <Text className="text-2xl font-bold text-white mb-2">
            {stats.currentStreak} días
          </Text>
          <Text className="text-gray-300 text-sm mb-4">
            Racha más larga: {stats.longestStreak} días
          </Text>
          <Text className="text-orange-300 text-sm">
            ¡Mantén la racha para ganar XP extra!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 