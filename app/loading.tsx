import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingPage() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState('Analizando tus respuestas...');
  const [currentStep, setCurrentStep] = useState(0);
  const mountedRef = useRef(true);
  const hasNavigatedRef = useRef(false);

  const loadingSteps = [
    'Analizando tus respuestas...',
    'Calculando tu perfil...',
    'Diseñando tu roadmap personalizado...',
    'Preparando tus misiones...',
    'Configurando tu experiencia...',
    '¡Casi listo!'
  ];

  useEffect(() => {
    mountedRef.current = true;
    hasNavigatedRef.current = false;
    
    const timer = setInterval(() => {
      if (!mountedRef.current) return;
      
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          if (mountedRef.current) {
            setLoadingText(loadingSteps[prev + 1]);
          }
          return prev + 1;
        } else {
          // Navigate to roadmap after all steps (only once)
          if (mountedRef.current && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            setTimeout(() => {
              if (mountedRef.current) {
                router.push('/roadmap');
              }
            }, 1500);
          }
          return prev;
        }
      });
    }, 1200);

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
      <View className="flex-1 justify-center items-center px-8">
        {/* App Logo */}
        <View className="items-center mb-16">
          <Text className="text-6xl font-bold text-white mb-4">piru</Text>
          <Text className="text-lg text-gray-300 text-center">
            Creando tu aventura personalizada
          </Text>
        </View>

        {/* Loading Animation */}
        <View className="items-center mb-12">
          {/* Simple loading indicator */}
          <View className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mb-8" />
          
          <Text className="text-xl font-semibold text-white text-center mb-4">
            {loadingText}
          </Text>
          
          <Text className="text-gray-400 text-center">
            Paso {currentStep + 1} de {loadingSteps.length}
          </Text>
        </View>

        {/* Progress Dots */}
        <View className="flex-row space-x-2">
          {loadingSteps.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? 'bg-purple-400' : 'bg-purple-900/50'
              }`}
            />
          ))}
        </View>

        {/* Loading Tips */}
        <View className="mt-12">
          <Text className="text-gray-500 text-center text-sm">
            Mientras tanto, piensa en tu primera misión...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 