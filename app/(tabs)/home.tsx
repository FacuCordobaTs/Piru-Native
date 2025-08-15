import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Animated, StyleSheet, ScrollView, ImageBackground, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit, useHabits } from '@/context/HabitsProvider';

// Import images
const mascotImage = require('../../assets/images/piru-transparent.png');
const backgroundImage = require('../../assets/images/nivel1.jpg');

// Custom icons using emoji
const FlameIcon = () => <Text className="text-base text-yellow-400">🔥</Text>;
const PlusIcon = () => <Text className="text-base text-yellow-400">➕</Text>;
const ClockIcon = () => <Text className="text-base text-yellow-400">⏰</Text>;
const SwordIcon = () => <Text className="text-base text-yellow-400">⚔️</Text>;
const ShieldIcon = () => <Text className="text-base text-yellow-400">🛡️</Text>;

// BlurredCard component for true glassmorphism effect
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
      className={`relative rounded-2xl overflow-hidden mb-4 ${className || ''}`}
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
      <View className="bg-black/30 p-4">
        {children}
      </View>
    </View>
  );
};

// Glassmorphism card component with enhanced styling
const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View className="rounded-2xl border border-yellow-400/30 p-4 mb-4" style={style}>
    {children}
  </View>
);

// Weekly Calendar Component with enhanced styling
const WeeklyCalendar = () => {
  const days = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
  const dates = [15, 16, 17, 18, 19, 20, 21];
  const today = 17;

  return (
    <BlurredCard className="mb-6">
      <View className="flex-row items-center mb-4">
        <SwordIcon />
        <Text className="text-lg font-bold text-white ml-2">Semana del Guerrero</Text>
      </View>
      <View className="flex-row justify-between items-center">
        {days.map((day, index) => (
          <View key={day} className="items-center">
            <Text className="text-xs text-white/70 mb-2">{day}</Text>
            <View
              className={`w-10 h-10 rounded-full items-center justify-center border border-white/20 bg-white/10 ${
                dates[index] === today ? 'bg-white/40 scale-110' : ''
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  dates[index] === today ? 'text-white' : 'text-white/90'
                }`}
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
  <BlurredCard>
    <View className="flex-row items-center justify-center gap-4">
      <View className="relative">
        <View className="w-32 h-32 overflow-hidden">
          <Image source={mascotImage} className="w-full h-full" style={{ objectFit: 'contain' }} />
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
      className="absolute inset-0 items-center justify-center z-10"
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <GlassCard style={styles.celebrationCard}>
        <View className="items-center">
          <Text className="text-3xl mb-2">⚔️</Text>
          <Text className="text-lg font-bold text-yellow-400 mb-1">¡Racha +1!</Text>
          <Text className="text-sm text-white/90">{habit.streak + 1} días de gloria</Text>
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
    <View className="absolute inset-0 z-20" pointerEvents="none">
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: piece.color,
            transform: [
              { translateY: piece.translateY },
              { translateX: piece.translateX },
            ],
            left: piece.left,
          }}
        />
      ))}
    </View>
  );
};

// Habit Item Component with enhanced styling
const HabitItem = ({ habit, onComplete }: { habit: Habit, onComplete: (id: number) => void }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  console.log(habit)
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Done":
        return 'bg-green-500/30 border-green-500/50';
      case "Skip":
        return 'bg-yellow-500/30 border-yellow-500/50';
      default:
        return 'bg-blue-500/30 border-blue-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Done":
        return "Done";
      case "Skip":
        return "Skip";
      default:
        return "New";
    }
  };

  const handleComplete = () => {
    if (habit.currentStreak === 0) {
      setShowConfetti(true);
      onComplete(habit.id);
    }
  };

  const handleConfettiDone = () => {
    setShowConfetti(false);
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className={`rounded-2xl border border-yellow-400/30 p-5 mb-4 ${
          habit.currentStreak > 0 ? 'opacity-80 bg-green-500/20' : 'bg-white/15'
        }`}
        onPress={handleComplete}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4 flex-1">
            <View
              className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                habit.currentStreak > 0 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-yellow-400/50 bg-white/10'
              }`}
              style={habit.currentStreak > 0 ? styles.habitCheckboxCompletedShadow : {}}
            >
              {habit.currentStreak > 0 && <ShieldIcon />}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Text
                  className={`text-base font-bold text-white ${
                    habit.currentStreak > 0 ? 'line-through opacity-70' : ''
                  }`}
                >
                  {habit.name}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className={`px-3 py-1.5 rounded-xl border ${getStatusStyle(habit.currentStreak > 0 ? 'Done' : 'New')}`}>
                  <Text className="text-xs font-bold text-white">{getStatusText(habit.currentStreak > 0 ? 'Done' : 'New')}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="items-end">
            <View className="flex-row items-center gap-1 mb-1">
              <FlameIcon />
              <Text className="text-xl font-bold text-yellow-400">{habit.currentStreak}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ClockIcon />
              <Text className="text-xs text-white/70">{habit.reminderTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Celebration Animation */}
      {/* {celebration === habit.id && (
        <CelebrationAnimation habit={habit} />
      )} */}

      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti onDone={handleConfettiDone} />
      )}
    </View>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { habits, completeHabit, refreshHabits } = useHabits();

  useEffect(() => {
    refreshHabits();
  }, []);

  return (
    <ImageBackground source={backgroundImage} className="flex-1">
      <View className="flex-1 bg-black/50">
        <SafeAreaView className="flex-1 pt-8">
          <View className="p-4 max-w-md self-center w-full flex-1">
            {/* Static Header Section */}
            <View className="mb-6">
              {/* Weekly Calendar */}
              <WeeklyCalendar />

              {/* Mascot Section */}
              <MascotSection />
            </View>

            {/* Scrollable Habits Section */}
            <ScrollView 
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              indicatorStyle="white"
            >
              {/* Habits List */}
              <View className="gap-4 mb-6">
                {habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onComplete={completeHabit}
                  />
                ))}
              </View>

              {/* New Habit Button */}
              <TouchableOpacity
                onPress={() => router.push('/create-habit')}
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
                    <PlusIcon />
                    <Text className="text-base font-bold text-black">Crear Nuevo Hábito</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // BlurredCard complex positioning styles
  blurredImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  
  // Mascot badge with complex shadow
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
  habitCheckboxCompletedShadow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Celebration card with complex styling
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
}); 