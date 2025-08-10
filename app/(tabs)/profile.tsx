import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context/UserProvider';

export default function ProfilePage() {
  const { userData, clearUserData } = useUser();

  const profileInfo = {
    name: 'Usuario',
    email: 'usuario@example.com',
    joinDate: 'Hace 7 días',
    totalXP: 150,
    level: 1,
    achievements: 2
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">Perfil</Text>
          <Text className="text-gray-300 text-lg">
            Tu información personal
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-purple-600 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl text-white">👤</Text>
            </View>
            <Text className="text-xl font-bold text-white mb-1">{profileInfo.name}</Text>
            <Text className="text-gray-400">{profileInfo.email}</Text>
            <Text className="text-gray-500 text-sm">Miembro desde {profileInfo.joinDate}</Text>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{profileInfo.level}</Text>
              <Text className="text-gray-400 text-sm">Nivel</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{profileInfo.totalXP}</Text>
              <Text className="text-gray-400 text-sm">XP Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{profileInfo.achievements}</Text>
              <Text className="text-gray-400 text-sm">Logros</Text>
            </View>
          </View>
        </View>

        {/* User Preferences */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🎯 Tus Preferencias
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Edad</Text>
              <Text className="text-white">{userData.age || 'No especificado'}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Género</Text>
              <Text className="text-white">{userData.gender || 'No especificado'}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Tiempo diario</Text>
              <Text className="text-white">{userData.timeCommitment || 'No especificado'}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300">Consistencia</Text>
              <Text className="text-white">{userData.consistency || 'No especificado'}</Text>
            </View>
          </View>
        </View>

        {/* Goals & Activities */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🎯 Tus Objetivos
          </Text>
          
          {userData.goals && userData.goals.length > 0 ? (
            <View className="space-y-2">
              {userData.goals.map((goal, index) => (
                <View key={index} className="flex-row items-center">
                  <Text className="text-purple-400 mr-3">•</Text>
                  <Text className="text-gray-300 flex-1">{goal}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-400">No especificados</Text>
          )}

          <Text className="text-xl font-semibold text-white mb-4 mt-6">
            🏃 Tus Actividades
          </Text>
          
          {userData.activities && userData.activities.length > 0 ? (
            <View className="space-y-2">
              {userData.activities.map((activity, index) => (
                <View key={index} className="flex-row items-center">
                  <Text className="text-green-400 mr-3">•</Text>
                  <Text className="text-gray-300 flex-1">{activity}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-400">No especificadas</Text>
          )}
        </View>

        {/* Settings */}
        <View className="space-y-4 mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            ⚙️ Configuración
          </Text>
          
          <TouchableOpacity className="bg-purple-900/50 rounded-2xl p-4 border border-purple-700/30">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">🔔</Text>
              <Text className="text-white text-lg flex-1">Notificaciones</Text>
              <Text className="text-purple-300">Configurar</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-purple-900/50 rounded-2xl p-4 border border-purple-700/30">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">🌙</Text>
              <Text className="text-white text-lg flex-1">Tema Oscuro</Text>
              <Text className="text-purple-300">Activado</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-purple-900/50 rounded-2xl p-4 border border-purple-700/30">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">📊</Text>
              <Text className="text-white text-lg flex-1">Exportar Datos</Text>
              <Text className="text-purple-300">PDF</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-purple-900/50 rounded-2xl p-4 border border-purple-700/30">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-4">🔄</Text>
              <Text className="text-white text-lg flex-1">Reiniciar Progreso</Text>
              <Text className="text-red-400">Peligroso</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity className="bg-red-600/20 rounded-2xl p-4 border border-red-500/30">
            <Text className="text-red-400 text-center text-lg font-semibold">
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-600/20 rounded-2xl p-4 border border-gray-500/30"
            onPress={clearUserData}
          >
            <Text className="text-gray-400 text-center text-lg font-semibold">
              Limpiar Datos (Testing)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 