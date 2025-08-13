import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Animated, StyleSheet, ScrollView, ImageBackground, useWindowDimensions, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/components/ui/T';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/context/UserProvider';
import { useHabits } from '@/hooks/useHabits';
import { Ionicons } from '@expo/vector-icons';

// Import images
const mascotImage = require('../../assets/images/piru-transparent.png');
const backgroundImage = require('../../assets/images/Landscape-start.jpg');

// Custom icons using emoji
const FlameIcon = () => <Text style={styles.icon}>🔥</Text>;
const PlusIcon = () => <Text style={styles.icon}>➕</Text>;
const ClockIcon = () => <Text style={styles.icon}>⏰</Text>;
const CheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;
const SwordIcon = () => <Text style={styles.icon}>⚔️</Text>;
const ShieldIcon = () => <Text style={styles.icon}>🛡️</Text>;

// BlurredCard component for true glassmorphism effect
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

// Glassmorphism card component with enhanced styling
const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.glassCard, style]}>
    {children}
  </View>
);

// Weekly Calendar Component with enhanced styling
const WeeklyCalendar = () => {
  const days = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
  const dates = [15, 16, 17, 18, 19, 20, 21];
  const today = 17;

  return (
    <BlurredCard style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <SwordIcon />
        <Text style={styles.calendarTitle}>Semana del Guerrero</Text>
      </View>
      <View style={styles.calendarContainer}>
        {days.map((day, index) => (
          <View key={day} style={styles.calendarDay}>
            <Text style={styles.calendarDayText}>{day}</Text>
            <View
              style={[
                styles.calendarDate,
                dates[index] === today && styles.calendarDateToday
              ]}
            >
              <Text
                style={[
                  styles.calendarDateText,
                  dates[index] === today && styles.calendarDateTextToday
                ]}
              >
                {dates[index]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </BlurredCard>
  );
};

// Mascot Section Component with enhanced styling
const MascotSection = () => (
  <BlurredCard style={styles.mascotCard}>
    <View style={styles.mascotContainer}>
      <View style={styles.mascotImageContainer}>
        <View style={styles.mascotImageBorder}>
          <Image source={mascotImage} style={styles.mascotImage} />
        </View>
        <View style={styles.mascotBadge}>
          <FlameIcon />
        </View>
      </View>
    </View>
  </BlurredCard>
);

// Celebration Animation Component with enhanced styling
const CelebrationAnimation = ({ habit }: { habit: any }) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.celebrationContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <GlassCard style={styles.celebrationCard}>
        <View style={styles.celebrationContent}>
          <Text style={styles.celebrationEmoji}>⚔️</Text>
          <Text style={styles.celebrationTitle}>¡Racha +1!</Text>
          <Text style={styles.celebrationSubtitle}>{habit.streak + 1} días de gloria</Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

// Confetti Animation Component
const Confetti = ({ onDone }: { onDone?: () => void }) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    translateY: Animated.Value;
    translateX: Animated.Value;
    color: string;
    left: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#facc15', '#fb923c', '#38bdf8', '#34d399', '#f472b6'];
    const pieces = Array.from({ length: 50 }, (_, index) => ({
      id: index,
      translateY: new Animated.Value(-50 - Math.random() * 50),
      translateX: new Animated.Value(0),
      color: colors[index % colors.length],
      left: Math.random() * 300,
    }));
    
    setConfettiPieces(pieces);

    // Animate each piece
    const animations = pieces.map((piece) => {
      const duration = 2000 + Math.random() * 1000;
      const delay = Math.random() * 300;
      
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(piece.translateY, {
            toValue: 400 + Math.random() * 200,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.translateX, {
            toValue: (Math.random() - 0.5) * 80,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onDone?.();
    });
  }, []);

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: piece.color,
              transform: [
                { translateY: piece.translateY },
                { translateX: piece.translateX },
              ],
              left: piece.left,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Habit Item Component with enhanced styling
const HabitItem = ({ habit, onComplete, celebration }: { habit: any, onComplete: (id: number) => void, celebration: number | null }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await onComplete(habit.id);
      setShowConfetti(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el hábito');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleConfettiDone = () => {
    setShowConfetti(false);
  };

  return (
    <View style={styles.habitItemContainer}>
      <TouchableOpacity
        style={[
          styles.habitCard,
          habit.completed && styles.habitCardCompleted
        ]}
        onPress={handleComplete}
        activeOpacity={0.8}
      >
        <View style={styles.habitContent}>
          <View style={styles.habitLeft}>
            <View
              style={[
                styles.habitCheckbox,
                habit.completed && styles.habitCheckboxCompleted
              ]}
            >
              {habit.completed && <ShieldIcon />}
            </View>

            <View style={styles.habitInfo}>
              <View style={styles.habitHeader}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text
                  style={[
                    styles.habitName,
                    habit.completed && styles.habitNameCompleted
                  ]}
                >
                  {habit.name}
                </Text>
              </View>
                          <View style={styles.habitStatus}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Activo</Text>
              </View>
            </View>
            </View>
          </View>

          <View style={styles.habitRight}>
            <View style={styles.streakContainer}>
              <FlameIcon />
              <Text style={styles.streakText}>{habit.currentStreak}</Text>
            </View>
            <View style={styles.durationContainer}>
              <ClockIcon />
              <Text style={styles.durationText}>+{habit.experienceReward} XP</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Celebration Animation */}
      {celebration === habit.id && (
        <CelebrationAnimation habit={habit} />
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti onDone={handleConfettiDone} />
      )}
    </View>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { user, stats } = useUser();
  const { habits, isLoading, completeHabit, createHabit } = useHabits();
  const [celebration, setCelebration] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabitData, setNewHabitData] = useState({
    name: '',
    description: '',
    targetDays: 7,
    experienceReward: 10,
    reminderTime: '09:00'
  });

  const handleCompleteHabit = async (habitId: number) => {
    try {
      const result = await completeHabit(habitId);
      setCelebration(habitId);
      setTimeout(() => setCelebration(null), 2000);
      
      Alert.alert(
        '¡Hábito Completado! 🎉',
        `Ganaste ${result.experienceGained} XP\nNueva racha: ${result.newStreak} días${result.leveledUp ? '\n\n¡SUBISTE DE NIVEL! 🚀' : ''}`,
        [{ text: '¡Genial!' }]
      );
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const handleCreateHabit = async () => {
    if (!newHabitData.name.trim()) {
      Alert.alert('Error', 'El nombre del hábito es requerido');
      return;
    }

    try {
      await createHabit(newHabitData);
      setShowCreateModal(false);
      setNewHabitData({
        name: '',
        description: '',
        targetDays: 7,
        experienceReward: 10,
        reminderTime: '09:00'
      });
      Alert.alert('Éxito', 'Hábito creado exitosamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el hábito');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Static Header Section */}
            <View style={styles.staticSection}>
              {/* Weekly Calendar */}
              <WeeklyCalendar />

              {/* Mascot Section */}
              <MascotSection />
            </View>

            {/* Scrollable Habits Section */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              indicatorStyle="white"
            >
              {/* Habits List */}
              <View style={styles.habitsContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando hábitos...</Text>
                  </View>
                ) : habits.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="list-outline" size={48} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.emptyText}>No tienes hábitos aún</Text>
                    <Text style={styles.emptySubtext}>Crea tu primer hábito para comenzar</Text>
                  </View>
                ) : (
                  habits.map((habit) => (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      onComplete={handleCompleteHabit}
                      celebration={celebration}
                    />
                  ))
                )}
              </View>

              {/* New Habit Button */}
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                style={styles.newHabitButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFD700', '#F59E0B']}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonContent}>
                    <PlusIcon />
                    <Text style={styles.newHabitButtonText}>Forjar Nuevo Hábito</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>

      {/* Create Habit Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forjar Nuevo Hábito</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre del hábito *</Text>
              <TextInput
                style={styles.textInput}
                value={newHabitData.name}
                onChangeText={(text) => setNewHabitData(prev => ({ ...prev, name: text }))}
                placeholder="Ej: Meditación, Ejercicio, NoFap..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newHabitData.description}
                onChangeText={(text) => setNewHabitData(prev => ({ ...prev, description: text }))}
                placeholder="Describe tu hábito..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Días objetivo</Text>
              <TextInput
                style={styles.textInput}
                value={newHabitData.targetDays.toString()}
                onChangeText={(text) => setNewHabitData(prev => ({ ...prev, targetDays: parseInt(text) || 7 }))}
                placeholder="7"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Experiencia por completar</Text>
              <TextInput
                style={styles.textInput}
                value={newHabitData.experienceReward.toString()}
                onChangeText={(text) => setNewHabitData(prev => ({ ...prev, experienceReward: parseInt(text) || 10 }))}
                placeholder="10"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hora de recordatorio</Text>
              <TextInput
                style={styles.textInput}
                value={newHabitData.reminderTime}
                onChangeText={(text) => setNewHabitData(prev => ({ ...prev, reminderTime: text }))}
                placeholder="09:00"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateHabit}
              >
                <Text style={[styles.buttonText, styles.createButtonText]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay for better readability
  },
  safeArea: {
    flex: 1,
    paddingTop: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    padding: 16,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  },
  staticSection: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  glassCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    padding: 16,
    marginBottom: 16,
  },
  calendarCard: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarDay: {
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  calendarDate: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  calendarDateToday: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ scale: 1.1 }],
  },
  calendarDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  calendarDateTextToday: {
    color: '#fff',
  },
  mascotCard: {
    
  },
  mascotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  mascotImageContainer: {
  },
  mascotImageBorder: {
    width: 120,
    height: 120,
    overflow: 'hidden',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  mascotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  mascotMessageContainer: {
    flex: 1,
  },
  mascotMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mascotMessageText: {
    fontSize: 12,
    color: '#000',
    lineHeight: 20,
    fontWeight: '500',
  },
  mascotMessageArrow: {
    position: 'absolute',
    bottom: -8,
    left: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
  },
  habitsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  habitItemContainer: {
    position: 'relative',
  },
  habitCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  habitCardCompleted: {
    opacity: 0.8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  habitCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  habitCheckboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  habitIcon: {
    fontSize: 18,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  habitStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  statusSkip: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  statusNew: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  habitRight: {
    alignItems: 'flex-end',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  celebrationCard: {
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  celebrationContent: {
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  celebrationSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  newHabitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  newHabitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    fontSize: 16,
    color: '#FFD700',
  },
  checkIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  blurredCardContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  blurredImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  contentOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  createButtonText: {
    color: '#000000',
  },
}); 