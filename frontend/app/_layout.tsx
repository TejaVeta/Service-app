import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { initI18n } from '../i18n';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

export default function RootLayout() {
  const loadAuth = useAuthStore(state => state.loadAuth);
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      await loadAuth();
      setI18nInitialized(true);
    };
    initialize();
  }, []);

  if (!i18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={require('../i18n').default}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </I18nextProvider>
  );
}
