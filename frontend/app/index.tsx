import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, loadAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await loadAuth();
      // Small delay for smooth transition
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }, 500);
    };
    
    checkAuth();
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
