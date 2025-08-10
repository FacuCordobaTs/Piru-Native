import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserProvider';

export default function RoadmapPage() {
  const router = useRouter();
  const { getPersonalizedRoadmap } = useUser();
  const roadmapData = getPersonalizedRoadmap();

  const handleStartJourney = () => {
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-white mb-2">¡Tu Roadmap!</Text>
          <Text className="text-lg text-gray-300 text-center">
            Basado en tus respuestas, hemos creado tu plan personalizado
          </Text>
        </View>

        {/* Personal Analysis */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            📊 Tu Perfil
          </Text>
          <Text className="text-gray-300 text-base leading-6">
            {roadmapData.profile.description}
          </Text>
        </View>

        {/* Roadmap Steps */}
        <View className="space-y-4 mb-8">
          <Text className="text-xl font-semibold text-white mb-4">
            🗺️ Tu Camino a la Mejora
          </Text>

          {roadmapData.phases.map((phase: any, index: number) => (
            <View 
              key={index}
              className={`bg-${phase.color}-600/20 rounded-2xl p-4 border border-${phase.color}-500/30`}
            >
              <Text className={`text-${phase.color}-300 font-semibold mb-2`}>
                {phase.title}
              </Text>
              <Text className="text-gray-300 text-sm">
                {phase.activities.join('\n')}
              </Text>
            </View>
          ))}
        </View>

        {/* Key Features for You */}
        <View className="bg-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-700/30">
          <Text className="text-xl font-semibold text-white mb-4">
            ⚡ Características Personalizadas
          </Text>
          <View className="space-y-3">
            {roadmapData.features.map((feature: any, index: number) => (
              <View key={index} className="flex-row items-center">
                <Text className="text-purple-300 mr-3">{feature.icon}</Text>
                <Text className="text-gray-300 flex-1">{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* First Mission */}
        <View className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-blue-500/30">
          <Text className="text-xl font-semibold text-white mb-4">
            🚀 Tu Primera Misión
          </Text>
          <Text className="text-gray-300 text-base mb-4">
            <Text className="font-semibold">"{roadmapData.firstMission.title}"</Text>
          </Text>
          <Text className="text-gray-300 text-sm leading-6">
            {roadmapData.firstMission.description}
          </Text>
          <View className="mt-4 bg-blue-600/30 rounded-xl p-3">
            <Text className="text-blue-200 text-sm text-center">
              Recompensa: {roadmapData.firstMission.reward}
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          onPress={handleStartJourney}
          className="bg-white rounded-2xl px-8 py-4 mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-black text-lg font-semibold text-center">
            ¡Comenzar Mi Aventura!
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 