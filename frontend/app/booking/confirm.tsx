import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { bookingAPI } from '../../utils/api';

export default function BookingConfirm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useAuthStore(state => state.user);
  const { items, total, clearCart } = useCartStore();

  const address = params.address ? JSON.parse(params.address as string) : null;
  const dateStr = params.date as string;
  const time = params.time as string;

  const subtotal = total;
  const convenienceFee = 50;
  const tax = subtotal * 0.18;
  const finalTotal = subtotal + convenienceFee + tax;

  const handleBookNow = async () => {
    if (!user || !address || !dateStr) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    try {
      const scheduledDate = new Date(dateStr);
      const response = await bookingAPI.create({
        customer_id: user._id,
        customer_name: user.name,
        customer_phone: user.phone,
        services: items,
        total_price: finalTotal,
        scheduled_at: scheduledDate,
        address: address,
        images: [],
      });

      if (response.data.success) {
        clearCart();
        router.replace(`/booking/finding?booking_id=${response.data.booking_id}`);
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.servicePrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Address */}
        {address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Address</Text>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>{address.street}</Text>
                <Text style={styles.addressLine}>{address.city}, {address.state}</Text>
                <Text style={styles.addressLine}>PIN: {address.pincode}</Text>
                {address.landmark && (
                  <Text style={styles.addressLandmark}>Near: {address.landmark}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleText}>
                {dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not selected'}
              </Text>
              <Text style={styles.scheduleTime}>{time}</Text>
            </View>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Convenience Fee</Text>
              <Text style={styles.priceValue}>₹{convenienceFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (18%)</Text>
              <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleBookNow} activeOpacity={0.8}>
          <LinearGradient
            colors={gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Book Services</Text>
            <Ionicons name="checkmark-circle" size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
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
    color: colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceQuantity: {
    fontSize: 14,
    color: colors.textLight,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  addressText: {
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  addressLandmark: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
