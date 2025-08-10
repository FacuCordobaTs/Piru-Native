import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context/UserProvider';

export default function MissionsPage() {
  const { userData } = useUser();

  const missions = [
    {
      id: 1,
      title: 'El Primer Paso',
      description: 'Completa 3 días consecutivos de ejercicio',
      progress: 1,
      total: 3,
      reward: '150 XP + Logro "Iniciador"',
      status: 'active'
    },
    {
      id: 2,
      title: 'Lector Ávido',
      description: 'Lee 30 minutos por día durante una semana',
      progress: 0,
      total: 7,
      reward: '200 XP + Logro "Lector"',
      status: 'locked'
    },
    {
      id: 3,
      title: 'Meditador Zen',
      description: 'Medita 10 minutos diarios por 5 días',
      progress: 0,
      total: 5,
      reward: '100 XP + Logro "Zen"',
      status: 'locked'
    }
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">Misiones</Text>
          <Text className="text-gray-300 text-lg">
            Completa misiones para ganar XP y logros
          </Text>
        </View>

        {/* Active Missions */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            🎯 Misiones Activas
          </Text>
          
          {missions.filter(m => m.status === 'active').map((mission) => (
            <View key={mission.id} className="bg-purple-900/50 rounded-2xl p-6 mb-4 border border-purple-700/30">
              <Text className="text-lg font-semibold text-white mb-2">
                {mission.title}
              </Text>
              <Text className="text-gray-300 text-sm mb-4">
                {mission.description}
              </Text>
              
              {/* Progress Bar */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-400 text-sm">Progreso</Text>
                  <Text className="text-purple-300 text-sm">
                    {mission.progress}/{mission.total}
                  </Text>
                </View>
                <View className="bg-purple-900/50 rounded-full h-2">
                  <View 
                    className="bg-purple-400 rounded-full h-2"
                    style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                  />
                </View>
              </View>
              
              <View className="bg-purple-600/30 rounded-xl p-3">
                <Text className="text-purple-200 text-sm text-center">
                  Recompensa: {mission.reward}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Locked Missions */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            🔒 Misiones Bloqueadas
          </Text>
          
          {missions.filter(m => m.status === 'locked').map((mission) => (
            <View key={mission.id} className="bg-gray-800/50 rounded-2xl p-6 mb-4 border border-gray-700/30 opacity-60">
              <Text className="text-lg font-semibold text-gray-400 mb-2">
                {mission.title}
              </Text>
              <Text className="text-gray-500 text-sm mb-4">
                {mission.description}
              </Text>
              
              <View className="bg-gray-700/30 rounded-xl p-3">
                <Text className="text-gray-500 text-sm text-center">
                  Recompensa: {mission.reward}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Challenge */}
        <View className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-6 mb-8 border border-green-500/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🏆 Desafío Semanal
          </Text>
          <Text className="text-gray-300 text-base mb-4">
            Completa 5 hábitos diferentes esta semana
          </Text>
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-300">Progreso</Text>
            <Text className="text-green-300">2/5</Text>
          </View>
          
          <View className="bg-green-600/30 rounded-xl p-3">
            <Text className="text-green-200 text-sm text-center">
              Recompensa: 500 XP + Logro "Semanal"
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 