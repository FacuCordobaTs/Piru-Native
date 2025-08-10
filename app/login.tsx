import React from 'react';
import { View, Text, TouchableOpacity, Alert, ImageBackground, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const handleGoogleSignIn = async () => {
    try {
      // For now, simulate successful login and go to quiz
      // In production, implement actual Google OAuth here
      console.log('Google sign in pressed - navigating to quiz');
      router.push('/quiz');
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Ha ocurrido un error durante el inicio de sesión');
    }
  };

  const handleSkipLogin = () => {
    // Allow users to skip login for testing purposes
    router.push('/quiz');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/images/login-landscape.jpg')}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      
      {/* Overlay */}
      <View className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <SafeAreaView className="flex-1 relative z-10">
        {/* Header with back button */}
        <View className="pt-12 px-5 pb-5">
          <TouchableOpacity 
            onPress={handleBackPress} 
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center p-4">
          {/* Glassmorphism Card */}
          <View className="w-full max-w-md p-6 rounded-2xl" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            {/* Header with shield icon */}
            <View className="flex-row items-center justify-center mb-3">
              <Ionicons name="shield-checkmark" size={16} color="rgba(255, 255, 255, 0.9)" />
              <Text className="text-xs uppercase tracking-widest text-white/90 font-medium ml-2">
                SINCRONIZA TU PROGRESO
              </Text>
            </View>

            {/* Title */}
            <Text className="text-2xl font-extrabold text-white text-center mb-2">
              Guarda tu progreso
            </Text>
            
            {/* Description */}
            <Text className="text-sm text-white/85 text-center mb-6">
              Sincroniza tu aventura en todos tus dispositivos y nunca pierdas tu progreso.
            </Text>

            {/* Google Button */}
            <TouchableOpacity 
              onPress={handleGoogleSignIn}
              className="w-full h-12 rounded-xl bg-white flex-row items-center justify-center mb-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="text-slate-900 font-semibold ml-3">
                Continuar con Google
              </Text>
            </TouchableOpacity>

            {/* Benefits text */}
            <Text className="text-xs text-white/75 text-center mb-5">
              Respaldo seguro • Compite con tu Guild • Progreso en la nube
            </Text>

            {/* Skip button */}
            <TouchableOpacity 
              onPress={handleSkipLogin}
              className="w-full py-2.5 rounded-xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm text-center">
                Entrar sin cuenta por ahora
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}


