import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/components/ui/T';
import { LinearGradient } from 'expo-linear-gradient';

// Import images
const backgroundImage = require('../assets/images/landscape.jpg');

// Custom icons using emoji
const FlameIcon = () => <Text style={styles.icon}>🔥</Text>;
const CrownIcon = () => <Text style={styles.icon}>👑</Text>;
const TrophyIcon = () => <Text style={styles.icon}>🏆</Text>;
const ShieldIcon = () => <Text style={styles.icon}>🛡️</Text>;
const ZapIcon = () => <Text style={styles.icon}>⚡</Text>;
const UsersIcon = () => <Text style={styles.icon}>👥</Text>;

// Glassmorphism card component
const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.glassCard, style]}>
    {children}
  </View>
);

// Confetti animation component
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
      translateY: new Animated.Value(-100 - Math.random() * 100),
      translateX: new Animated.Value(0),
      color: colors[index % colors.length],
      left: Math.random() * 400,
    }));
    
    setConfettiPieces(pieces);

    // Animate each piece
    const animations = pieces.map((piece) => {
      const duration = 2000 + Math.random() * 1000;
      const delay = Math.random() * 500;
      
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(piece.translateY, {
            toValue: 800 + Math.random() * 200,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.translateX, {
            toValue: (Math.random() - 0.5) * 100,
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
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
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

// Feature item component
const FeatureItem = ({ icon: Icon, title, desc }: { icon: React.ComponentType, title: string, desc: string }) => (
  <View style={styles.featureItem}>
    <Icon />
    <View style={styles.featureContent}>
      <T className="font-semibold text-sm text-white">{title}</T>
      <T className="text-xs text-white/80">{desc}</T>
    </View>
  </View>
);

// Badge component
const Badge = ({ icon, name }: { icon: string, name: string }) => (
  <View style={styles.badgeContainer}>
    <Text style={styles.badgeIcon}>{icon}</Text>
    <T className="text-[11px] mt-1 text-white text-center">{name}</T>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  const handleConfettiDone = () => {
    setShowConfetti(false);
  };

  const features = [
    { icon: FlameIcon, title: "Rachas NoFap", desc: "Construí rachas épicas y desbloqueá logros." },
    { icon: ShieldIcon, title: "Hábitos y Quests", desc: "Misiones diarias para mejorar tus stats." },
    { icon: UsersIcon, title: "Guild", desc: "Competí y crecé con tu equipo." },
    { icon: ZapIcon, title: "XP y Recompensas", desc: "Subí de nivel y reclamá cofres de botín." },
  ];

  const badges = [
    { icon: "🛡️", name: "Guerrero Novato" },
    { icon: "⚔️", name: "Disciplina de Hierro" },
    { icon: "🏆", name: "Maestro del Autocontrol" },
  ];

  const handleContinue = () => {
    router.push('/pricing');
  };

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <View style={styles.overlay} />
             {showConfetti && <Confetti onDone={handleConfettiDone} />}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Profile Card */}
          <GlassCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>🧝</Text>
              </View>
              <View style={styles.profileInfo}>
                <T className="text-xs uppercase tracking-widest text-white/80">Este es tu perfil</T>
                <T className="text-xl font-extrabold text-white">Héroe</T>
                <T className="text-xs text-white/80">Nivel 12 • 1,250/2,000 XP • Racha 47d</T>
              </View>
                             <CrownIcon />
             </View>
           </GlassCard>

          {/* Badges Card */}
          <GlassCard style={styles.badgesCard}>
            <View style={styles.cardHeader}>
              <TrophyIcon />
              <T className="font-bold text-white ml-2">Logros iniciales</T>
            </View>
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <Badge key={index} icon={badge.icon} name={badge.name} />
              ))}
            </View>
          </GlassCard>

          {/* Features Card */}
          <GlassCard style={styles.featuresCard}>
            <T className="font-bold mb-2 text-white">Con piru.app vas a poder</T>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  desc={feature.desc}
                />
              ))}
            </View>
          </GlassCard>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.buttonGradient}
            >
              <T className="font-semibold text-white text-center">Continuar</T>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  glassCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    marginBottom: 16,
  },
  profileCard: {
    marginTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  icon: {
    fontSize: 20,
    color: '#fbbf24', // yellow-300
  },
  badgesCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeContainer: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
  },
  featuresCard: {
    padding: 16,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureContent: {
    flex: 1,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
