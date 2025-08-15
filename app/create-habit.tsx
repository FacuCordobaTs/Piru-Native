import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T } from '@/components/ui/T';

const backgroundImage = require('../assets/images/landscape-quiz.jpg');

// Componente para el efecto de glassmorphism con estilos del quiz
const BlurredCard = ({ children, style, className }: { children: React.ReactNode, style?: any, className?: string }) => {
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<View>(null);
  const { width, height } = useWindowDimensions();

  return (
    <View
      ref={cardRef}
      onLayout={() => {
        cardRef.current?.measure((fx, fy, cardWidth, cardHeight, px, py) => {
          setLayout({ x: px, y: py, width: cardWidth, height: cardHeight });
        });
      }}
      className={`relative rounded-3xl overflow-hidden ${className || ''}`}
      style={style}
    >
      <Image
        source={backgroundImage}
        style={[
          styles.blurredImage,
          {
            top: -layout.y,
            left: -layout.x,
            width: width,
            height: height,
          },
        ]}
        blurRadius={20}
      />
      <View className="rounded-3xl bg-black/30">
        {children}
      </View>
    </View>
  );
};

// Componente IronButton con estilo medieval del quiz
const IronButton = ({ onPress, disabled, children, style }: { onPress: () => void, disabled?: boolean, children: React.ReactNode, style?: any }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={1}
    className={`flex-1 py-4 rounded-xl overflow-hidden ${disabled ? 'opacity-50' : ''}`}
    style={style}
  >
    <View
    >
      <View style={styles.ironButtonBorder}>
        <Text className="font-cinzel-bold text-base text-center text-white">
          {children}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Componente GoldButton con estilo medieval del quiz
const GoldButton = ({ onPress, disabled, children, style }: { onPress: () => void, disabled?: boolean, children: React.ReactNode, style?: any }) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    disabled={disabled}
    className={`flex-1 py-4 rounded-xl overflow-hidden`}
    style={{
      paddingVertical: 16,
      borderRadius: 12,
      overflow: 'hidden',
    }}
  >
      <View style={{
        width: '100%',
        paddingHorizontal: 6,
        paddingVertical: 10,
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
      <View className="flex-row items-center justify-center gap-3">
        <Text className="font-cinzel-bold text-base text-center text-black">
          {children}
        </Text>
      </View>
      </View>
  </TouchableOpacity>
);

// Componente para los días de la semana, adaptado del OptionButton del quiz
const DayButton = ({ onPress, active, label }: { onPress: () => void, active: boolean, label: string }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="flex-1 aspect-square">
    <View className={`flex-1 rounded-xl justify-center items-center border ${
      active 
        ? 'bg-yellow-400 border-yellow-400' 
        : 'bg-white/10 border-white/20'
    }`}>
      <T className="text-white font-cinzel-bold text-lg">{label}</T>
    </View>
  </TouchableOpacity>
);

// Componentes de iconos con emojis
const PlusIcon = () => <T className="text-lg">➕</T>;

interface FormData {
  name: string;
  description: string;
  selectedDays: string[];
  reminderTime: string;
  experienceReward: number;
}

// Usamos una función simple para simular la navegación de regreso, ya que
// 'useRouter' no está disponible.
const handleBack = () => {
  Alert.alert('Volver', 'Simulando el regreso a la pantalla anterior.');
};

// Usamos una función simple para simular la creación del hábito, ya que
// el contexto 'useHabits' no está disponible.
const mockCreateHabit = async (habitData: any) => {
  console.log('Simulando la creación del hábito:', habitData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function CreateHabitScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = [
    { short: "L", full: "Lunes" },
    { short: "M", full: "Martes" },
    { short: "M", full: "Miércoles" },
    { short: "J", full: "Jueves" },
    { short: "V", full: "Viernes" },
    { short: "S", full: "Sábado" },
    { short: "D", full: "Domingo" },
  ];

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    selectedDays: [],
    reminderTime: '09:00',
    experienceReward: 10,
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleCreateHabit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el hábito');
      return;
    }

    if (formData.selectedDays.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un día');
      return;
    }

    try {
      setIsSubmitting(true);
      await mockCreateHabit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        targetDays: formData.selectedDays.length,
        experienceReward: formData.experienceReward,
        reminderTime: formData.reminderTime,
      });

      Alert.alert(
        '¡Éxito!',
        'Tu hábito legendario ha sido forjado con éxito',
        [
          {
            text: 'Continuar',
            onPress: () => handleBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'No se pudo crear el hábito. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={backgroundImage}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/50" />

        <SafeAreaView className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

            {/* Card para el encabezado */}
            <BlurredCard className="rounded-3xl mb-5 ">
              <View className="flex-row items-center justify-center p-5">
                <T className="text-xl font-cinzel-bold text-white">Crear Nuevo Hábito</T>
              </View>
            </BlurredCard>

            {/* Card principal para el formulario */}
            <BlurredCard className="rounded-3xl mb-5">
              <View className="flex-1 p-6">
                {/* Nombre del Hábito */}
                <T className="text-xl font-cinzel-bold text-white mb-4 mt-4">¿Qué hábito quieres crear?</T>
                <TextInput
                style={styles.textInput}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Ej: Meditación matutina"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  className="h-16 bg-white/10 rounded-xl px-4 text-white text-base border border-white/20"
                  maxLength={255}
                />

                {/* Selección de días */}
                <T className="text-xl font-cinzel-bold text-white mb-4 mt-8">¿Qué días lo harás?</T>
                <View className="flex-row flex-wrap justify-between gap-2">
                  {days.map((day, index) => (
                    <DayButton
                      key={index}
                      label={day.short}
                      active={formData.selectedDays.includes(day.full)}
                      onPress={() => toggleDay(day.full)}
                    />
                  ))}
                </View>

                {/* Hora del Recordatorio */}
                <T className="text-xl font-cinzel-bold text-white mb-4 mt-8">Hora del Recordatorio</T>
                <View className="flex-row items-center justify-center gap-2.5">
                  <TextInput
                    value={formData.reminderTime.split(':')[0]}
                    onChangeText={(value) => {
                      const hour = Math.max(0, Math.min(23, parseInt(value) || 0));
                      handleInputChange('reminderTime', `${hour.toString().padStart(2, '0')}:${formData.reminderTime.split(':')[1]}`);
                    }}
                    className="h-12 w-15 bg-white/10 rounded-xl px-2 text-white text-lg text-center border border-white/20"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <T className="text-white text-2xl font-bold">:</T>
                  <TextInput
                    value={formData.reminderTime.split(':')[1]}
                    onChangeText={(value) => {
                      const minute = Math.max(0, Math.min(59, parseInt(value) || 0));
                      handleInputChange('reminderTime', `${formData.reminderTime.split(':')[0]}:${minute.toString().padStart(2, '0')}`);
                    }}
                    className="h-12 w-15 bg-white/10 rounded-xl px-2 text-white text-lg text-center border border-white/20"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                {/* Recompensa de Experiencia (simplificado para el nuevo estilo) */}
                <T className="text-xl font-cinzel-bold text-white mb-4 mt-8">Recompensa de Experiencia</T>
                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-bold text-yellow-400">{formData.experienceReward} XP</Text>
                  <View className="flex-row gap-2.5">
                    <IronButton onPress={() => handleInputChange('experienceReward', Math.max(5, formData.experienceReward - 5))} style={styles.sliderButton}>
                      -
                    </IronButton>
                    <IronButton onPress={() => handleInputChange('experienceReward', Math.min(50, formData.experienceReward + 5))} style={styles.sliderButton}>
                      +
                    </IronButton>
                  </View>
                </View>
              </View>
            </BlurredCard>

            {/* Botón de envío */}
            <View className="py-5 px-2.5">
              <GoldButton
                onPress={handleCreateHabit}
                disabled={!formData.name.trim() || formData.selectedDays.length === 0 || isSubmitting}
                style={styles.submitButton}
              >
                <View className="flex-row items-center justify-center">
                  <PlusIcon />
                  <T className="ml-2 text-black font-cinzel-bold text-base">
                    {isSubmitting ? 'Creando...' : 'Crear Hábito'}
                  </T>
                </View>
              </GoldButton>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  // BlurredCard complex positioning styles
  blurredImage: {
    position: 'absolute',
    // Los estilos top, left, width y height se ajustan dinámicamente
  },
  
  // Iron button complex border and shadow effects
  ironButtonBorder: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 3,
    borderTopColor: '#4a4a4a',
    borderLeftColor: '#4a4a4a',
    borderRightColor: '#1a1a1a',
    borderBottomColor: '#1a1a1a',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Gold button complex border and shadow effects
  goldButtonBorder: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 3,
    borderTopColor: '#FFD700',
    borderLeftColor: '#FFD700',
    borderRightColor: '#F59E0B',
    borderBottomColor: '#F59E0B',
    backgroundColor: 'rgba(255, 215, 0, 1)',
  },
  
  // Slider button dimensions
  sliderButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Submit button dimensions
  submitButton: {
    width: '100%', 
    paddingVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  textInput: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16, 
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    fontSize: 16,
  },
});
