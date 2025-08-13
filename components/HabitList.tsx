import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/hooks/useHabits';
import { useUser } from '@/context/UserProvider';
import { T } from '@/components/ui/T';

interface HabitListProps {
  onHabitComplete?: (habitId: number, result: any) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ onHabitComplete }) => {
  const { habits, isLoading, error, completeHabit } = useHabits();
  const { user } = useUser();
  const [completingHabit, setCompletingHabit] = useState<number | null>(null);

  const handleCompleteHabit = async (habitId: number) => {
    try {
      setCompletingHabit(habitId);
      const result = await completeHabit(habitId);
      
      Alert.alert(
        '¡Hábito Completado! 🎉',
        `Ganaste ${result.experienceGained} XP\nNueva racha: ${result.newStreak} días${result.leveledUp ? '\n\n¡SUBISTE DE NIVEL! 🚀' : ''}`,
        [{ text: '¡Genial!' }]
      );
      
      onHabitComplete?.(habitId, result);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el hábito. Inténtalo de nuevo.');
    } finally {
      setCompletingHabit(null);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando hábitos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="list-outline" size={48} color="rgba(255, 255, 255, 0.5)" />
        <Text style={styles.emptyText}>No tienes hábitos aún</Text>
        <Text style={styles.emptySubtext}>Crea tu primer hábito para comenzar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {habits.map((habit) => (
        <TouchableOpacity
          key={habit.id}
          style={[
            styles.habitCard,
            completingHabit === habit.id && styles.habitCardCompleting
          ]}
          onPress={() => handleCompleteHabit(habit.id)}
          disabled={completingHabit === habit.id}
          activeOpacity={0.8}
        >
          <View style={styles.habitContent}>
            <View style={styles.habitLeft}>
              <View style={styles.habitIcon}>
                <Ionicons 
                  name={completingHabit === habit.id ? "hourglass-outline" : "checkmark-circle-outline"} 
                  size={24} 
                  color={completingHabit === habit.id ? "#FFD700" : "#FFFFFF"} 
                />
              </View>
              
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.description && (
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                )}
                <View style={styles.habitMeta}>
                  <View style={styles.streakContainer}>
                    <Ionicons name="flame" size={16} color="#FFD700" />
                    <Text style={styles.streakText}>{habit.currentStreak}</Text>
                  </View>
                  <View style={styles.xpContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.xpText}>+{habit.experienceReward} XP</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.habitRight}>
              <Text style={styles.habitStatus}>
                {completingHabit === habit.id ? 'Completando...' : 'Toca para completar'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
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
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
  },
  habitCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  habitCardCompleting: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  habitDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  habitMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  habitRight: {
    alignItems: 'flex-end',
  },
  habitStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});
