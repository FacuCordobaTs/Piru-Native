import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 pt-24" style={{ backgroundColor: '#1a0b2e' }}>
      <View className="flex-1 px-6 pt-4">
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
              <Text className="text-white font-semibold">1</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Experiencia</Text>
              <Text className="text-white font-semibold">0 / 100 XP</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Hábitos Completados</Text>
              <Text className="text-white font-semibold">0</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="space-y-4">
          <TouchableOpacity className="bg-blue-600/80 rounded-2xl p-4 border border-blue-500/30">
            <Text className="text-white text-lg font-semibold text-center">
              Crear Nuevo Hábito
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-green-600/80 rounded-2xl p-4 border border-green-500/30">
            <Text className="text-white text-lg font-semibold text-center">
              Ver Mis Misiones
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-purple-600/80 rounded-2xl p-4 border border-purple-500/30">
            <Text className="text-white text-lg font-semibold text-center">
              Estadísticas Detalladas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 