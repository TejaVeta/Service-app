import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../utils/api';

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(phone);
      if (response.data.success) {
        setShowOTP(true);
        // For demo, show the OTP
        Alert.alert('OTP Sent', `Your OTP is: ${response.data.otp}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(phone, otp);
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>WorkHub</Text>
          <Text style={styles.subtitle}>India's #1 Fastest Skilled Service App</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor={colors.textLight}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            editable={!showOTP}
          />

          {showOTP && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </>
          )}

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <TouchableOpacity
              onPress={showOTP ? handleVerifyOTP : handleSendOTP}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {showOTP ? 'Verify OTP' : 'Send OTP'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {showOTP && (
            <TouchableOpacity onPress={() => setShowOTP(false)} style={styles.changeNumber}>
              <Text style={styles.changeNumberText}>Change Phone Number</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 20,
    color: colors.textLight,
    fontWeight: '500',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeNumber: {
    marginTop: 16,
    alignItems: 'center',
  },
  changeNumberText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 16,
  },
});
