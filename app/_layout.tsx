import { Slot } from 'expo-router';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UserProvider } from '@/context/UserProvider';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black } from '@expo-google-fonts/cinzel';
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
    <GluestackUIProvider mode="light">
      <UserProvider>
        <Slot />
      </UserProvider>
    </GluestackUIProvider>
  );
}
