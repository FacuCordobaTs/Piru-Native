import React from 'react';
import { View, Text } from 'react-native';
import { T } from './T';

export function FontTest() {
  return (
    <View style={{ padding: 20, backgroundColor: 'black', flex: 1 }}>
      {/* Prueba con componente T */}
      <T style={{ color: 'white', fontSize: 24, marginBottom: 10 }}>
        Test Cinzel Regular (T component)
      </T>
      
      <T style={{ color: 'white', fontSize: 20, marginBottom: 10 }} className="font-cinzel-bold">
        Test Cinzel Bold (T component)
      </T>
      
      <T style={{ color: 'white', fontSize: 18, marginBottom: 10 }} className="font-cinzel-black">
        Test Cinzel Black (T component)
      </T>
      
      {/* Prueba con Text directo */}
      <Text className="font-cinzel text-white text-base mb-2">
        Test Cinzel Regular (Text direct)
      </Text>
      
      <Text className="font-cinzel-bold text-white text-base mb-2">
        Test Cinzel Bold (Text direct)
      </Text>
      
      <Text className="font-cinzel-black text-white text-base mb-2">
        Test Cinzel Black (Text direct)
      </Text>
      
      {/* Texto normal para comparar */}
      <Text style={{ color: 'white', fontSize: 16, marginTop: 20 }}>
        Texto normal del sistema (comparación)
      </Text>
    </View>
  );
}
