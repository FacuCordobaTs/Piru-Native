# Authentication & Backend Integration Guide

This guide explains how to use the authentication system and backend integration in the Piru React Native app.

## 🔧 Setup

### 1. Environment Variables

Create a `.env` file in the Native directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For production, use your actual backend URL.

### 2. Backend Configuration

Make sure your backend is running and accessible at the URL specified in your environment variables.

## 🔐 Authentication Flow

### UserProvider

The `UserProvider` handles all authentication and user-related operations:

```tsx
import { useUser } from '@/context/UserProvider';

const MyComponent = () => {
  const { 
    user,           // Current user data
    stats,          // User statistics  
    settings,       // User settings
    isAuthenticated,// Authentication status
    isLoading,      // Loading state
    login,          // Google OAuth login
    logout,         // Logout function
    addExperience,  // Add XP to user
    updateStreak,   // Update user streak
    updateUserProfile,    // Update profile
    updateUserSettings,   // Update settings
    refreshUserData       // Refresh user data
  } = useUser();

  // Your component logic here
};
```

### HabitsProvider

The `HabitsProvider` handles all habit-related operations:

```tsx
import { useHabits } from '@/context/HabitsProvider';

const MyComponent = () => {
  const {
    habits,           // Array of user habits
    isLoading,        // Loading state
    refreshHabits,    // Refresh habits list
    createHabit,      // Create new habit
    updateHabit,      // Update existing habit
    deleteHabit,      // Delete habit
    completeHabit,    // Mark habit as completed
    getHabitStats,    // Get habit statistics
    getHabitCompletions // Get habit completion history
  } = useHabits();

  // Your component logic here
};
```

## 📱 Usage Examples

### Login Screen Integration

```tsx
import { useUser } from '@/context/UserProvider';

export default function LoginScreen() {
  const { login, isLoading, isAuthenticated } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await login();
      // UserProvider automatically navigates to home on success
    } catch (error) {
      Alert.alert('Error', 'Authentication failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <TouchableOpacity 
      onPress={handleGoogleSignIn}
      disabled={isSigningIn || isLoading}
    >
      <Text>
        {isSigningIn ? 'Connecting...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
}
```

### Creating a Habit

```tsx
const handleCreateHabit = async () => {
  try {
    const newHabit = await createHabit({
      name: 'Daily Exercise',
      description: 'Work out for 30 minutes',
      targetDays: 7,
      experienceReward: 25,
      reminderTime: '07:00'
    });
    
    Alert.alert('Success', `Habit "${newHabit.name}" created!`);
  } catch (error) {
    Alert.alert('Error', 'Failed to create habit');
  }
};
```

### Completing a Habit

```tsx
const handleCompleteHabit = async (habitId: number) => {
  try {
    const result = await completeHabit(habitId, {
      mood: 'great',
      notes: 'Feeling energized after workout!'
    });
    
    Alert.alert(
      'Habit Completed! 🎉',
      `Streak: ${result.newStreak} days\n` +
      `Experience: +${result.experienceGained} XP\n` +
      `${result.leveledUp ? 'LEVEL UP! 🎊' : ''}`
    );
  } catch (error) {
    Alert.alert('Error', 'Failed to complete habit');
  }
};
```

### Adding Experience Points

```tsx
const handleBonusExperience = async () => {
  try {
    const result = await addExperience(100);
    
    Alert.alert(
      result.leveledUp ? 'LEVEL UP! 🎊' : 'Experience Added!',
      `Level: ${result.newUserLevel}\n` +
      `Experience: ${result.newUserExperience}/${result.newUserExperienceToNext}`
    );
  } catch (error) {
    Alert.alert('Error', 'Failed to add experience');
  }
};
```

## 🔄 Data Flow

1. **Authentication**: User logs in via Google OAuth
2. **Token Storage**: JWT token is stored securely in AsyncStorage
3. **API Calls**: All requests include the Bearer token in headers
4. **State Management**: User and habits data are cached in React context
5. **Real-time Updates**: Local state is updated immediately for better UX

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Handles token expiration gracefully
- **Secure Storage**: Tokens stored in AsyncStorage (consider SecureStore for production)
- **Request Interceptors**: Automatic token inclusion in API requests
- **Error Handling**: Automatic logout on authentication errors

## 🎮 Gamification Features

- **Experience System**: Users gain XP for completing habits
- **Level Progression**: Automatic level ups with increasing XP requirements
- **Streak Tracking**: Daily streaks for habits and overall progress
- **Mood Tracking**: Users can log their mood when completing habits
- **Statistics**: Comprehensive progress tracking and analytics

## 📊 Available Data

### User Object
```typescript
interface User {
  id: number;
  email: string;
  name?: string;
  level: number;
  experience: number;
  experienceToNext: number;
  currentStreak: number;
  longestStreak: number;
  avatar?: string;
  skills?: any;
}
```

### Habit Object
```typescript
interface Habit {
  id: number;
  userId: number;
  name: string;
  description?: string;
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  experienceReward: number;
  createdAt: string;
  reminderTime: string;
}
```

## 🚨 Error Handling

All API calls include automatic error handling:

- **Network Errors**: Proper error messages
- **Authentication Errors**: Automatic logout
- **Validation Errors**: Clear error descriptions
- **Server Errors**: Graceful fallbacks

## 🔧 Development Tips

1. **Check Authentication State**: Always check `isAuthenticated` before showing protected content
2. **Handle Loading States**: Use `isLoading` to show loading indicators
3. **Refresh Data**: Call `refreshUserData()` and `refreshHabits()` when needed
4. **Error Boundaries**: Wrap components in error boundaries for better UX
5. **Optimistic Updates**: Local state updates happen immediately for better UX

## 📝 Example Component

Check `Native/components/examples/AuthExample.tsx` for a complete working example of all features.

## 🚀 Production Considerations

1. **Use SecureStore**: Replace AsyncStorage with Expo SecureStore for tokens
2. **Environment Variables**: Use different API URLs for dev/staging/production
3. **Error Tracking**: Implement crash reporting (Sentry, Bugsnag)
4. **Performance**: Implement proper caching and pagination
5. **Deep Links**: Configure proper deep link handling for OAuth redirects
