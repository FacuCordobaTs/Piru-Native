import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context/UserProvider';

export default function HomePage() {
  const { getPersonalizedHome } = useUser();
  const homeData = getPersonalizedHome();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">¡Bienvenido!</Text>
          <Text className="text-gray-300 text-lg">
            Tu aventura comienza ahora
          </Text>
        </View>

        {/* Stats Overview */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            Tus Estadísticas
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Nivel</Text>
              <Text className="text-white font-semibold">{homeData.stats.level}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Experiencia</Text>
              <Text className="text-white font-semibold">{homeData.stats.xp} / {homeData.stats.xpToNext} XP</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Hábitos Completados</Text>
              <Text className="text-white font-semibold">{homeData.stats.habitsCompleted}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Racha Actual</Text>
              <Text className="text-white font-semibold">{homeData.stats.streak} días</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="space-y-4 mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            Acciones Rápidas
          </Text>
          
          {homeData.quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index}
              className={`bg-${action.color}-600/80 rounded-2xl p-4 border border-${action.color}-500/30`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">{action.icon}</Text>
                <Text className="text-white text-lg font-semibold flex-1">
                  {action.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Progress */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            Progreso Reciente
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Completados Hoy</Text>
              <Text className="text-white font-semibold">{homeData.recentProgress.todayCompleted}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Meta Semanal</Text>
              <Text className="text-white font-semibold">{homeData.recentProgress.weeklyGoal} hábitos</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Meta Mensual</Text>
              <Text className="text-white font-semibold">{homeData.recentProgress.monthlyGoal} hábitos</Text>
            </View>
          </View>
        </View>

        {/* Daily Challenge */}
        <View className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-blue-500/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🎯 Desafío del Día
          </Text>
          <Text className="text-gray-300 text-base mb-4">
            Completa 3 hábitos diferentes hoy para ganar 50 XP extra
          </Text>
          <View className="bg-blue-600/30 rounded-xl p-3">
            <Text className="text-blue-200 text-sm text-center">
              Recompensa: 50 XP + Logro "Consistente"
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 