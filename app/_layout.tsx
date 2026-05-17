import { Stack } from 'expo-router';
import { UserProvider } from '../src/context/UserContext';

// El RootLayout solo monta el Stack y el Provider.
// La lógica de auth vive en app/(tabs)/_layout.tsx mediante
// useRootNavigationState + Redirect, que es el patrón correcto
// de Expo Router para proteger rutas sin el error de "navigate
// before mounting".
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="job/[id]" />
      </Stack>
    </UserProvider>
  );
}