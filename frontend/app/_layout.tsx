import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const loadAuth = useAuthStore(state => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
