import { Slot } from 'expo-router';
import { UserProvider } from '@/context/UserProvider';

export default function App() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
