import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

export default function FindingProvider() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useAuthStore(state => state.user);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Timer animation
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-redirect to success after timer
          router.replace(`/booking/success?booking_id=${params.booking_id}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Rotation animation for the ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    return () => clearInterval(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WorkHub</Text>
        <TouchableOpacity style={styles.supportButton}>
          <Ionicons name="headset" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          {/* Circular Progress Ring */}
          <Animated.View style={[styles.progressRing, { transform: [{ rotate }] }]}>
            <View style={styles.progressRingInner}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.statusText}>Finding your best service provider</Text>
        <Text style={styles.subText}>Please wait while we match you with the perfect professional</Text>

        {/* Customer Info Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerIconContainer}>
            <Ionicons name="person" size={32} color={colors.white} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{user?.name}</Text>
            <Text style={styles.customerPhone}>{user?.phone}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>India's #1 fastest skilled service app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  supportButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  timerContainer: {
    marginBottom: 40,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  customerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    textAlign: 'center',
  },
});
