import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Animated, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/components/ui/T';
import { LinearGradient } from 'expo-linear-gradient';

// Import images
const backgroundImage = require('../assets/images/pricing-landscape.jpg');

// Custom icons using emoji
const CrownIcon = () => <Text style={styles.icon}>👑</Text>;
const ClockIcon = () => <Text style={styles.icon}>⏰</Text>;
const XIcon = () => <Text style={styles.icon}>✕</Text>;
const ZapIcon = () => <Text style={styles.icon}>⚡</Text>;
const ShieldIcon = () => <Text style={styles.icon}>🛡️</Text>;

// Glassmorphism card component
const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.glassCard, style]}>
    {children}
  </View>
);

// Animated star component
const AnimatedStar = ({ delay, duration, left, top }: { delay: number, duration: number, left: number, top: number }) => {
  const opacity = new Animated.Value(0.3);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    const timer = setTimeout(() => animate(), delay * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          opacity,
          left: `${left}%`,
          top: `${top}%`,
        },
      ]}
    />
  );
};

// Feature item component
const FeatureItem = ({ text }: { text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureDot} />
    <T className="text-sm text-white/90">{text}</T>
  </View>
);

export default function PricingScreen() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ minutes: 9, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleComplete = () => {
    router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Animated stars background */}
      <View style={StyleSheet.absoluteFillObject}>
                 {Array.from({ length: 50 }).map((_, i) => (
           <AnimatedStar
             key={i}
             delay={Math.random() * 3}
             duration={40 + Math.random() * 4}
             left={Math.random() * 100}
             top={Math.random() * 100}
           />
         ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
          {/* Close button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={handleComplete} style={styles.closeButton}>
              <XIcon />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <T className="text-white text-2xl font-cinzel-bold mb-2 text-center">
              Oferta Especial de Lanzamiento
            </T>
            <T className="text-white/80 text-lg text-center">
              Tu transformación comienza ahora
            </T>
          </View>

          {/* Discount card */}
          <GlassCard style={styles.discountCard}>
            <View style={styles.discountContent}>
              <View style={styles.discountHeader}>
                <ZapIcon />
                <T className="text-white text-sm font-medium">DESCUENTO EXCLUSIVO</T>
              </View>
              <T className="text-white text-3xl font-bold mb-2">70% OFF</T>
              <T className="text-white/90 text-sm">Solo para los primeros 1000 usuarios</T>
            </View>
          </GlassCard>

          {/* Timer card */}
          <GlassCard style={styles.timerCard}>
            <View style={styles.timerContent}>
              <ClockIcon />
              <T className="text-sm text-white">Esta oferta expira en:</T>
              <View style={styles.timerDisplay}>
                <T className="font-mono font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </T>
              </View>
            </View>
          </GlassCard>

          {/* Premium card - Updated structure */}
          <View style={styles.premiumCard}>
            <Image source={backgroundImage} style={styles.premiumBackground} />
            <View style={styles.premiumOverlay} />
            
            <View style={styles.premiumContent}>
              {/* Premium badge */}
              <View style={styles.premiumBadge}>
                <CrownIcon />
                <T className="text-sm font-cinzel-bold text-black">PREMIUM</T>
              </View>

              {/* Main content */}
              <View style={styles.premiumMainContent}>
                <T className="text-white text-2xl font-cinzel-bold mb-6 text-center">
                  Conviértete en la mejor versión de ti mismo
                </T>

                <View style={styles.pricingSection}>
                  <View style={styles.priceComparison}>
                    <T className="text-white/70 text-lg line-through">$29.99</T>
                    <View style={styles.discountBadge}>
                      <T className="text-white text-xs font-bold">-70%</T>
                    </View>
                  </View>
                  <T className="text-white text-4xl font-cinzel-bold mb-1">$8.99</T>
                  <T className="text-white/80 text-sm mb-6">por mes • Facturado anualmente</T>
                </View>

                <View style={styles.featuresList}>
                  <FeatureItem text="Sistema NoFap completo con coaching IA" />
                  <FeatureItem text="Analytics avanzados y reportes detallados" />
                  <FeatureItem text="Comunidad premium y mentorías" />
                  <FeatureItem text="Recordatorios inteligentes personalizados" />
                </View>
              </View>

              {/* Trial card */}
              <GlassCard style={styles.trialCard}>
                <T className="text-green-400 font-cinzel-bold text-lg text-center">
                  PRUEBA GRATIS 7 DÍAS
                </T>
                <T className="text-white/80 text-sm text-center mt-1">
                  Cancela cuando quieras, sin compromisos
                </T>
              </GlassCard>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.ctaButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFD700', '#F59E0B']}
              style={styles.buttonGradient}
            >
              <T className="text-black font-cinzel-bold text-lg text-center">
                COMENZAR PRUEBA GRATUITA
              </T>
            </LinearGradient>
          </TouchableOpacity>

          {/* Trust indicators */}
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <ShieldIcon />
              <T className="text-white text-xs">Pago seguro</T>
            </View>
            <T className="text-white text-xs">•</T>
            <T className="text-white text-xs">Sin compromisos</T>
            <T className="text-white text-xs">•</T>
            <T className="text-white text-xs">Cancela fácil</T>
          </View>

          {/* Footer text */}
          <T className="text-center text-white text-xs mb-12">
            No pagarás nada hasta que termine tu prueba gratuita de 7 días
          </T>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // gray-900
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  header: {
    marginBottom: 32,
  },
  glassCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    marginBottom: 24,
  },
  discountCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  discountContent: {
    alignItems: 'center',
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timerCard: {
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  timerDisplay: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  premiumCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 500, // Ensure minimum height
    position: 'relative',
  },
  premiumBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  premiumOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  premiumContent: {
    flex: 1,
    padding: 32,
    position: 'relative',
    justifyContent: 'space-between',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(245, 158, 11, 1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  premiumMainContent: {
    marginTop: 40, // Account for badge
    flex: 1,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuresList: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
    marginTop: 4,
    flexShrink: 0,
  },
  trialCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginTop: 'auto',
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  trustIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 16,
    color: '#fbbf24',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },
});