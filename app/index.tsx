import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/context/UserProvider';
import { T } from '@/components/ui/T';

export default function IndexScreen() {
  const router = useRouter();
  const { userData } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkUserStatus = () => {
      // If user has completed the quiz (has userData), go to main app
      if (userData && Object.keys(userData).length > 0) {
        router.replace('/(tabs)/home');
      } else {
        // Show welcome screen for new users
        setIsLoading(false);
      }
    };

    // Small delay to prevent flash
    const timer = setTimeout(checkUserStatus, 100);
    return () => clearTimeout(timer);
  }, [userData, router]);

  const handleStartJourney = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a0b2e' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 relative">
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/images/welcome-bg.jpg')}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      
      {/* Overlay */}
      <View className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <SafeAreaView className="flex-1 relative z-10">
        <View className="flex-1 justify-center items-center p-4">
          {/* Glassmorphism Card */}
          <View className="w-full max-w-sm p-6 rounded-2xl" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <View className="items-center space-y-4">
              {/* Logo */}
              <Image
                source={require('../assets/images/piru-logo-transparente.webp')}
                style={{ width: 72, height: 72, opacity: 0.95 }}
                resizeMode="contain"
              />
              
              {/* App name */}
              <T className="text-xs uppercase tracking-widest text-white/90 font-medium">
                piru.app
              </T>
              
              {/* Main title */}
              <T className="text-3xl font-cinzel-bold text-white text-center leading-tight">
                Tu camino a la mejor versión de ti comienza ahora
              </T>
              
              {/* Description */}
              <T className="text-white/80 text-sm text-center">
                Combina hábitos, NoFap y progreso RPG para forjar tu leyenda.
              </T>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              onPress={handleStartJourney}
              className="mt-6 w-full"
              activeOpacity={0.9}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <View style={{
                width: '100%',
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 3,
                borderTopColor: '#FFED4A',
                borderLeftColor: '#FFED4A',
                borderRightColor: '#B8860B',
                borderBottomColor: '#B8860B',
                shadowColor: '#DAA520',
                backgroundColor: '#DAA520',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 8,
              }}>
                    <T className="text-black font-cinzel-bold text-base text-center">
                    Comenzar
                  </T>
              </View>
            </TouchableOpacity>
            
            {/* Subtitle */}
            <T className="mt-3 text-center text-xs text-white">
              Listo para tu aventura
            </T>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
