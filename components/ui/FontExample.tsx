import React from 'react';
import { View, Text } from 'react-native';
import { T } from './T';

export function FontExample() {
  return (
    <View className="p-4 space-y-4">
      {/* Ejemplo con el componente T (usa Cinzel por defecto) */}
      <T className="text-2xl text-white">Texto con Cinzel Regular</T>
      
      {/* Ejemplo con Cinzel Bold */}
      <T className="text-xl font-cinzel-bold text-white">Texto con Cinzel Bold</T>
      
      {/* Ejemplo con Cinzel Black */}
      <T className="text-lg font-cinzel-black text-white">Texto con Cinzel Black</T>
      
      {/* Ejemplo usando Text directamente con clases de NativeWind */}
      <Text className="text-base font-cinzel text-white">Texto directo con Cinzel</Text>
      <Text className="text-sm font-cinzel-bold text-white">Texto directo con Cinzel Bold</Text>
      <Text className="text-xs font-cinzel-black text-white">Texto directo con Cinzel Black</Text>
    </View>
  );
}
