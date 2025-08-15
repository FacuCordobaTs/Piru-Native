import { Slot } from 'expo-router';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UserProvider } from '@/context/UserProvider';
import { HabitsProvider } from '@/context/HabitsProvider';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black } from '@expo-google-fonts/cinzel';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    Cinzel_900Black,
  });

  if (!fontsLoaded) {
    return null; // O puedes mostrar un splash screen aquí
  }

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <UserProvider>
          <HabitsProvider>
            <Slot />
          </HabitsProvider>
        </UserProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
