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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { T } from '@/components/ui/T';

// Importa tus imágenes desde la ruta correcta
const backgroundImage = require('../assets/images/landscape-quiz.jpg');
const logoImage = require('../assets/images/piru-logo-transparente.webp');

interface FormData {
  name: string;
  age: string;
  goals: string[];
  focusArea: string;
}

const goals = [
  { id: "nofap", label: "Dejar el fap", icon: "🛡️" },
  { id: "discipline", label: "Ser más disciplinado", icon: "⚔️" },
  { id: "mindset", label: "Mejorar mi mentalidad", icon: "🧠" },
  { id: "energy", label: "Aumentar mi energía", icon: "⚡" },
  { id: "other", label: "Otro", icon: "✨" },
];

const areas = [
  { id: "physical", label: "Físico", icon: "💪" },
  { id: "intellect", label: "Intelecto", icon: "🧠" },
  { id: "psyche", label: "Psique", icon: "🧘" },
  { id: "spiritual", label: "Espiritual", icon: "✨" },
  { id: "core", label: "Autoestima/Núcleo", icon: "🔥" },
];

// Nuevo componente para el efecto de glassmorphism con estilos simplificados
const BlurredCard = ({ children, style }: { children: React.ReactNode, style?: any }) => {
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
      style={[styles.blurredCardContainer, style]}
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
      <View style={styles.contentOverlay}>
        {children}
      </View>
    </View>
  );
};

// Componente IronButton con estilo medieval
const IronButton = ({ onPress, disabled, children, style }: { onPress: () => void, disabled?: boolean, children: React.ReactNode, style?: any }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.9}
    style={[styles.ironButton, disabled ? styles.ironButtonDisabled : {}, style]}
  >
    <LinearGradient
      colors={['#4a4a4a', '#2a2a2a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.ironButtonGradient}
    >
             <View style={styles.ironButtonBorder}>
         <T className="text-white font-cinzel text-base text-center">
           {children}
         </T>
       </View>
    </LinearGradient>
  </TouchableOpacity>
);

// Componente GoldButton con estilo medieval
const GoldButton = ({ onPress, disabled, children, style }: { onPress: () => void, disabled?: boolean, children: React.ReactNode, style?: any }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    disabled={disabled}
    style={[styles.goldButton, disabled ? styles.goldButtonDisabled : {}, style]}
  >
    <LinearGradient
      colors={['#FFD700', '#F59E0B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.goldButtonGradient}
    >
             <View style={styles.goldButtonBorder}>
         <T className="text-black font-cinzel-bold text-base text-center">
           {children}
         </T>
       </View>
    </LinearGradient>
  </TouchableOpacity>
);

const OptionButton = ({ onPress, active, icon, label }: { onPress: () => void, active: boolean, icon: string, label: string }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.optionButtonWrapper}>
    <View style={[styles.optionButtonBase, active ? styles.optionButtonActive : {}]}>
      <T style={styles.optionIcon}>{icon}</T>
      <T style={styles.optionLabel}>{label}</T>
    </View>
  </TouchableOpacity>
);

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(1);
  const [form, setForm] = useState<FormData>({ name: "", age: "", goals: [], focusArea: "" });

  const total = 4;
  const progress = Math.round((current / total) * 100);

  const canNext = () => {
    if (current === 1) return form.name.trim().length > 0;
    if (current === 2) return !!Number(form.age) && Number(form.age) > 0;
    if (current === 3) return form.goals.length > 0;
    if (current === 4) return !!form.focusArea;
    return false;
  };

  const handleComplete = (formData: FormData) => {
    console.log("Quiz completado con:", formData);
    // updateUserData(formData);
    router.push('/loading');
  };

  return (
    <View style={styles.flex1}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

            {/* Card para el encabezado */}
            <BlurredCard style={styles.headerCard}>
              <View style={styles.headerCardContent}>
                <Image
                  source={logoImage}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
                <View>
                  <T className="text-xs uppercase tracking-widest text-white/80">piru</T>
                  <T className="text-lg font-cinzel-bold text-white">Setup rápido</T>
                </View>
              </View>
            </BlurredCard>

            {/* Placa de progreso */}
            <View style={styles.plaque}>
              <T className="text-center text-white font-cinzel-black text-base tracking-widest">QUIZ {progress}%</T>
            </View>

            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
              <LinearGradient
                colors={['#FDE047', '#F59E0B']}
                style={[styles.progressBar, { width: `${progress}%` }]}
              />
            </View>

            {/* Card principal para las preguntas */}
            <BlurredCard style={styles.mainCard}>
              {current === 1 && (
                <View>
                  <T className="font-cinzel-bold text-white mb-4 text-xl">¿Cuál es tu nombre o apodo?</T>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: Alex, DragonSlayer..."
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />
                </View>
              )}
              {current === 2 && (
                <View>
                  <T className="font-cinzel-bold text-white mb-4 text-xl">¿Cuántos años tenés?</T>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ej: 25"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    keyboardType="numeric"
                    value={form.age}
                    onChangeText={(text) => setForm({ ...form, age: text })}
                  />
                </View>
              )}
              {current === 3 && (
                <View>
                  <T className="font-cinzel-bold text-white mb-4 text-xl">¿Qué querés lograr con piru?</T>
                  <View style={styles.optionsContainer}>
                    {goals.map((g) => (
                      <OptionButton
                        key={g.id}
                        icon={g.icon}
                        label={g.label}
                        active={form.goals.includes(g.id)}
                        onPress={() =>
                          setForm((prev) => ({
                            ...prev,
                            goals: prev.goals.includes(g.id)
                              ? prev.goals.filter((x) => x !== g.id)
                              : [...prev.goals, g.id],
                          }))
                        }
                      />
                    ))}
                  </View>
                </View>
              )}
              {current === 4 && (
                <View>
                  <T className="font-cinzel-bold text-white mb-4 text-xl">¿En qué área querés mejorar más?</T>
                  <View style={styles.optionsContainer}>
                    {areas.map((a) => (
                      <OptionButton
                        key={a.id}
                        icon={a.icon}
                        label={a.label}
                        active={form.focusArea === a.id}
                        onPress={() => setForm({ ...form, focusArea: a.id })}
                      />
                    ))}
                  </View>
                </View>
              )}
            </BlurredCard>

            {/* Controles de navegación */}
            <View style={styles.controlsContainer}>
              <IronButton
                 onPress={() => setCurrent(Math.max(1, current - 1))}
                 disabled={current === 1}
               >
                 Atrás
               </IronButton>

                             <GoldButton
                 onPress={() => {
                   if (current < 4) {
                     canNext() && setCurrent(current + 1);
                   } else {
                     canNext() && handleComplete(form);
                   }
                 }}
                 disabled={!canNext()}
               >
                 Siguiente
               </GoldButton>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  safeArea: { flex: 1, zIndex: 10 },
  scrollViewContent: { flexGrow: 1, padding: 16, width: '100%', alignSelf: 'center' },
  blurredCardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  blurredImage: {
    position: 'absolute',
    zIndex: -1,
  },
  contentOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    marginTop: 20,
  },
  headerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: { width: 40, height: 40, marginRight: 12 },
  headerSubtitle: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255, 255, 255, 0.8)' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  plaque: {
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(218, 165, 32, 0.6)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  plaqueText: { textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1.5 },
  progressContainer: {
    height: 12,
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: { height: '100%', borderRadius: 9999 },
  mainCard: {
    width: '100%',
  },
  questionText: { fontWeight: 'bold', color: 'white', marginBottom: 16, fontSize: 20 },
  textInput: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    fontSize: 16,
  },
  optionsContainer: { gap: 12 },
  optionButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(0,0,0, 0.4)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  optionIcon: { fontSize: 22, marginRight: 16, color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  optionLabel: { color: 'white', fontSize: 16, fontWeight: '500', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  controlsContainer: { flexDirection: 'row', gap: 16, marginTop: 16 },
  ironButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ironButtonGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    shadowColor: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  
  ironButtonDisabled: {
    opacity: 1,
  },
  goldButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  goldButtonGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldButtonBorder: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  },
  
  goldButtonDisabled: {
    opacity: 1,
  },
});
