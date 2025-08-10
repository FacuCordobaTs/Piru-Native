import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from '@react-native-community/blur'; // ¡Importante para el efecto glass!
import { LinearGradient } from 'expo-linear-gradient'; // ¡Importante para el gradiente del botón!

// import { useUser } from '@/context/UserProvider'; // Descomenta si usas este contexto

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

const OptionButton = ({ onPress, active, icon, label }: { onPress: () => void, active: boolean, icon: string, label: string }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <BlurView
      style={[styles.optionButtonBase, active ? styles.optionButtonActive : {}]}
      blurType="dark" // Puedes probar 'light', 'dark', 'xlight'
      blurAmount={10} // Ajusta la intensidad del desenfoque
    >
      <Text style={styles.optionIcon}>{icon}</Text>
      <Text style={styles.optionLabel}>{label}</Text>
    </BlurView>
  </TouchableOpacity>
);

export default function QuizPage() {
  const router = useRouter();
  // const { updateUserData } = useUser();
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
    // router.push('/loading');
  };

  return (
    <View style={styles.flex1}>
      <ImageBackground
        source={require('../assets/images/landscape.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          
          <BlurView style={styles.headerCard} blurType="dark" blurAmount={15}>
            <Image
              source={require('../assets/images/piru-logo-white.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerSubtitle}>piru.app</Text>
              <Text style={styles.headerTitle}>Setup rápido</Text>
            </View>
          </BlurView>

          <View style={styles.plaque}>
            <Text style={styles.plaqueText}>QUIZ {progress}%</Text>
          </View>

          <View style={styles.progressContainer}>
            <LinearGradient
              colors={['#FDE047', '#F59E0B']}
              style={[styles.progressBar, { width: `${progress}%` }]}
            />
          </View>

          <BlurView style={styles.mainCard} blurType="dark" blurAmount={10}>
            {current === 1 && (
              <View>
                <Text style={styles.questionText}>¿Cuál es tu nombre o apodo?</Text>
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
                <Text style={styles.questionText}>¿Cuántos años tenés?</Text>
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
                <Text style={styles.questionText}>¿Qué querés lograr con piru.app?</Text>
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
                <Text style={styles.questionText}>¿En qué área querés mejorar más?</Text>
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
          </BlurView>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={() => setCurrent(Math.max(1, current - 1))}
              disabled={current === 1}
              style={[styles.controlButton, current === 1 ? styles.backButtonDisabled : styles.backButtonEnabled]}
              activeOpacity={0.8}
            >
              <Text style={styles.controlButtonText}>Atrás</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (current < 4) {
                  canNext() && setCurrent(current + 1);
                } else {
                  canNext() && handleComplete(form);
                }
              }}
              disabled={!canNext()}
              style={{ flex: 1 }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={canNext() ? ['#FFD700', '#F59E0B'] : ['#5A5A5A', '#4A4A4A']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.controlButton, styles.nextButtonEnabled]}
              >
                <Text style={styles.controlButtonText}>
                  {current < 4 ? 'Siguiente' : '¡Empezar aventura!'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.25)' },
  safeArea: { flex: 1, zIndex: 10 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', padding: 16, maxWidth: 500, width: '100%', alignSelf: 'center' },
  headerCard: {
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden', // Necesario para que BlurView respete el borde redondeado
  },
  headerLogo: { width: 32, height: 32, marginRight: 12 },
  headerSubtitle: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255, 255, 255, 0.8)' },
  headerTitle: { fontSize: 14, fontWeight: '600', color: 'white' },
  plaque: { borderRadius: 12, padding: 16, marginBottom: 16, backgroundColor: 'rgba(139, 69, 19, 0.8)', borderWidth: 2, borderColor: 'rgba(218, 165, 32, 0.6)' },
  plaqueText: { textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18 },
  progressContainer: { height: 12, borderRadius: 9999, overflow: 'hidden', marginBottom: 16, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  progressBar: { height: '100%' },
  mainCard: { borderRadius: 16, padding: 16, marginBottom: 16, overflow: 'hidden' }, // overflow: 'hidden' es clave
  questionText: { fontWeight: 'bold', color: 'white', marginBottom: 16, fontSize: 18 },
  textInput: { width: '100%', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)', fontSize: 16 },
  optionsContainer: { gap: 12 },
  optionButtonBase: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Un color base sutil
    overflow: 'hidden',
  },
  optionButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  optionIcon: { fontSize: 22, marginRight: 16, color: 'white' },
  optionLabel: { color: 'white', fontSize: 16, fontWeight: '500' },
  controlsContainer: { flexDirection: 'row', gap: 12 },
  controlButton: { flex: 1, paddingVertical: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  controlButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  backButtonEnabled: {
    backgroundColor: '#212121', // Un gris muy oscuro, casi negro
    borderWidth: 1,
    borderColor: '#424242', // Borde superior sutilmente más claro
  },
  backButtonDisabled: { backgroundColor: '#333', borderWidth: 1, borderColor: '#444' },
  nextButtonEnabled: {
    borderBottomWidth: 2, // Sombra inferior para efecto 3D
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
});
