# React Native Integration with Backend

This document explains how the React Native app integrates with the backend API for the Piru habits and nofap gamification app.

## 🚀 **Quick Start**

### 1. **Environment Setup**

Create a `.env` file in the `Native` directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Development settings
EXPO_PUBLIC_DEV_MODE=true
```

### 2. **Install Dependencies**

```bash
cd Native
bun install
```

### 3. **Start the Backend**

```bash
cd Backend
bun run dev
```

### 4. **Start the React Native App**

```bash
cd Native
bun run start
```

## 🔐 **Authentication Flow**

### **Google OAuth Integration**

1. **User taps "Continuar con Google"** in the login screen
2. **WebBrowser opens** Google OAuth flow
3. **Backend processes** the OAuth callback
4. **JWT token is returned** in the redirect URL
5. **Token is stored** securely in AsyncStorage
6. **User is authenticated** and redirected to the app

### **API Authentication**

All API calls automatically include the JWT token in the Authorization header:

```typescript
// Automatically handled by the API service
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

## 📱 **Key Components**

### **UserProvider Context**

Manages user authentication and data:

```typescript
import { useUser } from '@/context/UserProvider';

const { user, isAuthenticated, login, logout, stats } = useUser();
```

**Available methods:**
- `login()` - Start Google OAuth flow
- `logout()` - Clear authentication and redirect to login
- `refreshUserData()` - Update user profile and stats
- `updateUserProfile(data)` - Update user information
- `updateUserSettings(data)` - Update user preferences
- `addExperience(amount)` - Add experience points
- `updateStreak(count)` - Update user streak

### **Habit Management**

Use the `useHabits` hook for habit operations:

```typescript
import { useHabits } from '@/hooks/useHabits';

const { 
  habits, 
  isLoading, 
  createHabit, 
  completeHabit, 
  deleteHabit 
} = useHabits();
```

**Available methods:**
- `loadHabits()` - Fetch user's habits
- `createHabit(data)` - Create new habit
- `updateHabit(id, updates)` - Update habit
- `deleteHabit(id)` - Delete habit
- `completeHabit(id, data?)` - Mark habit as completed
- `getHabit(id)` - Get specific habit details
- `getHabitStats(id)` - Get habit statistics

### **HabitList Component**

Ready-to-use component for displaying habits:

```typescript
import { HabitList } from '@/components/HabitList';

<HabitList onHabitComplete={(habitId, result) => {
  console.log('Habit completed:', result);
}} />
```

## 🎮 **Gamification Features**

### **Experience System**

- Users gain XP for completing habits
- Automatic level progression
- Experience requirements increase by 50% each level

### **Streak Tracking**

- Individual habit streaks
- Overall user streak
- Longest streak tracking

### **Real-time Updates**

- Habit completion updates user stats immediately
- Level up notifications
- Streak celebrations

## 🔧 **API Integration**

### **Automatic Token Management**

The API service automatically:
- Retrieves tokens from AsyncStorage
- Includes tokens in all requests
- Handles authentication errors
- Refreshes user data when needed

### **Error Handling**

All API calls include comprehensive error handling:
- Network errors
- Authentication failures
- Server errors
- User-friendly error messages

## 📊 **Data Flow**

```
User Action → React Native → API Service → Backend → Database
     ↑                                                      ↓
     ← User Context ← Habit Hook ← Response ← Backend ←
```

## 🛠 **Development Tips**

### **Testing Authentication**

1. Start the backend server
2. Open the React Native app
3. Tap "Continuar con Google"
4. Complete Google OAuth
5. Check that user data loads

### **Debugging API Calls**

Enable debug logging in the API service:

```typescript
// In services/habitService.ts
console.log('API Call:', endpoint, options);
```

### **Environment Variables**

Remember to update the API URL for different environments:
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## 🎯 **Example Usage**

### **Complete Habit Flow**

```typescript
const { completeHabit } = useHabits();
const { refreshUserData } = useUser();

const handleCompleteHabit = async (habitId: number) => {
  try {
    const result = await completeHabit(habitId);
    
    // Show celebration
    Alert.alert(
      '¡Hábito Completado! 🎉',
      `Ganaste ${result.experienceGained} XP\nNueva racha: ${result.newStreak} días`
    );
    
    // Refresh user data to show updated stats
    await refreshUserData();
  } catch (error) {
    Alert.alert('Error', 'No se pudo completar el hábito');
  }
};
```

### **Create New Habit**

```typescript
const { createHabit } = useHabits();

const handleCreateHabit = async () => {
  try {
    const newHabit = await createHabit({
      name: 'Meditación',
      description: 'Meditar 10 minutos al día',
      targetDays: 7,
      experienceReward: 15,
      reminderTime: '09:00'
    });
    
    console.log('Habit created:', newHabit);
  } catch (error) {
    Alert.alert('Error', 'No se pudo crear el hábito');
  }
};
```

## 🔒 **Security Features**

- JWT tokens with 7-day expiration
- Secure token storage in AsyncStorage
- Automatic token validation
- Protected API endpoints
- Google OAuth integration

## 📈 **Performance Optimizations**

- Automatic data caching
- Optimistic UI updates
- Efficient state management
- Minimal API calls
- Background data refresh

The React Native app is now fully integrated with your backend and ready to provide a complete habits and nofap gamification experience! 🚀
