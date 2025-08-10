import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  age?: string;
  goals?: string[];
  activities?: string[];
  gaming?: string;
  gender?: string;
  socialMediaTime?: string;
  consistency?: string;
  motivation?: string[];
  timeCommitment?: string;
  focusArea?: string[];
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  getPersonalizedRoadmap: () => any;
  getPersonalizedHome: () => any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({});

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const clearUserData = () => {
    setUserData({});
  };

  const getPersonalizedRoadmap = () => {
    const { goals, activities, motivation, timeCommitment, consistency } = userData;
    
    // Generate personalized roadmap based on user data
    const roadmap = {
      profile: {
        description: generateProfileDescription(),
        focusAreas: activities || [],
        motivationType: motivation?.[0] || 'Logros y recompensas',
        timeCommitment: timeCommitment || '30-60 minutos'
      },
      phases: generatePhases(),
      features: generateFeatures(),
      firstMission: generateFirstMission()
    };

    return roadmap;
  };

  const getPersonalizedHome = () => {
    const { activities, goals, consistency } = userData;
    
    return {
      stats: generateStats(),
      quickActions: generateQuickActions(),
      recentProgress: generateRecentProgress()
    };
  };

  // Helper functions for personalization
  const generateProfileDescription = () => {
    const { goals, consistency, motivation } = userData;
    let description = 'Eres alguien que busca mejorar su vida personal. ';
    
    if (goals?.includes('Ser más consistente')) {
      description += 'Tu enfoque principal es desarrollar consistencia en tus hábitos. ';
    }
    
    if (motivation?.includes('Logros y recompensas')) {
      description += 'Te motiva especialmente el sistema de logros y recompensas. ';
    }
    
    if (consistency === 'Muy inconsistente') {
      description += 'Piru te ayudará a construir una base sólida de hábitos.';
    } else {
      description += 'Piru te ayudará a llevar tus hábitos al siguiente nivel.';
    }
    
    return description;
  };

  const generatePhases = () => {
    const { activities, timeCommitment } = userData;
    const phases = [];

    // Phase 1: Foundation
    const foundationActivities = activities?.slice(0, 2) || ['Ejercicio físico', 'Leer más'];
    phases.push({
      title: 'Semana 1-2: Fundación',
      color: 'blue',
      activities: foundationActivities.map(activity => `• ${activity} (15 min/día)`)
    });

    // Phase 2: Building
    const buildingActivities = activities?.slice(2, 4) || ['Meditar', 'Pasar menos tiempo en el celular'];
    phases.push({
      title: 'Semana 3-4: Construcción',
      color: 'green',
      activities: buildingActivities.map(activity => `• ${activity} (20 min/día)`)
    });

    // Phase 3: Consolidation
    phases.push({
      title: 'Semana 5-8: Consolidación',
      color: 'purple',
      activities: ['• Mantener todos los hábitos establecidos', '• Agregar nuevos desafíos semanales', '• Celebrar logros y progreso']
    });

    // Phase 4: Mastery
    phases.push({
      title: 'Mes 2-3: Maestría',
      color: 'yellow',
      activities: ['• Optimizar rutinas basado en resultados', '• Agregar hábitos más desafiantes', '• Compartir progreso con comunidad']
    });

    return phases;
  };

  const generateFeatures = () => {
    const { motivation } = userData;
    const features = [];

    if (motivation?.includes('Logros y recompensas')) {
      features.push({ icon: '🎯', text: 'Sistema de logros y recompensas' });
    }
    if (motivation?.includes('Progreso visual')) {
      features.push({ icon: '📈', text: 'Progreso visual detallado' });
    }
    if (motivation?.includes('Retos personales')) {
      features.push({ icon: '🏆', text: 'Desafíos semanales personalizados' });
    }
    if (motivation?.includes('Competencia con otros')) {
      features.push({ icon: '⚔️', text: 'Modo competitivo con amigos' });
    }

    // Default features
    if (features.length === 0) {
      features.push(
        { icon: '🎯', text: 'Sistema de logros y recompensas' },
        { icon: '📈', text: 'Progreso visual detallado' },
        { icon: '🏆', text: 'Desafíos semanales personalizados' },
        { icon: '⏰', text: 'Recordatorios inteligentes' }
      );
    }

    return features;
  };

  const generateFirstMission = () => {
    const { activities } = userData;
    const firstActivity = activities?.[0] || 'Ejercicio físico';
    
    return {
      title: 'El Primer Paso',
      description: `Completa 3 días consecutivos de ${firstActivity.toLowerCase()}. Cada día que completes te dará 50 XP y te acercará a tu primer logro.`,
      reward: '150 XP + Logro "Iniciador"',
      activity: firstActivity
    };
  };

  const generateStats = () => {
    return {
      level: 1,
      xp: 0,
      xpToNext: 100,
      habitsCompleted: 0,
      streak: 0
    };
  };

  const generateQuickActions = () => {
    const { activities } = userData;
    const actions = [
      { title: 'Crear Nuevo Hábito', color: 'blue', icon: '➕' },
      { title: 'Ver Mis Misiones', color: 'green', icon: '📋' },
      { title: 'Estadísticas Detalladas', color: 'purple', icon: '📊' }
    ];

    if (activities?.includes('Ejercicio físico')) {
      actions.push({ title: 'Iniciar Entrenamiento', color: 'orange', icon: '💪' });
    }
    if (activities?.includes('Meditar')) {
      actions.push({ title: 'Sesión de Meditación', color: 'indigo', icon: '🧘' });
    }

    return actions;
  };

  const generateRecentProgress = () => {
    return {
      todayCompleted: 0,
      weeklyGoal: 5,
      monthlyGoal: 20
    };
  };

  const value: UserContextType = {
    userData,
    updateUserData,
    clearUserData,
    getPersonalizedRoadmap,
    getPersonalizedHome
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 