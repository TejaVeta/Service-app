import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { categoryAPI, cartAPI } from '../../utils/api';

interface Service {
  _id: string;
  title: string;
  description?: string;
  price: number;
  duration_minutes: number;
}

export default function ServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useAuthStore(state => state.user);
  const { items, addItem } = useCartStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = params.id as string;
  const categoryName = params.name as string;
  const categoryType = params.type as string;

  useEffect(() => {
    loadServices();
  }, [categoryId]);

  const loadServices = async () => {
    try {
      const response = await categoryAPI.getServices(categoryId);
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (service: Service) => {
    if (!user) return;

    try {
      await cartAPI.add(user._id, service._id, service.title, service.price);
      addItem({
        service_id: service._id,
        title: service.title,
        price: service.price,
        quantity: 1,
      });
      Alert.alert('Success', 'Service added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Alert.alert('Error', 'Failed to add service to cart');
    }
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSubtitle}>{categoryType === 'home' ? 'Home' : 'Commercial'} Services</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
          <Ionicons name="cart" size={24} color={colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.servicesList}>
          {services.map((service) => (
            <View key={service._id} style={styles.serviceCard}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.description && (
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    {service.description}
                  </Text>
                )}
                <View style={styles.serviceDetails}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price:</Text>
                    <Text style={styles.price}>₹{service.price}</Text>
                  </View>
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={14} color={colors.textLight} />
                    <Text style={styles.duration}>{service.duration_minutes} mins</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(service)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Summary Footer */}
      {cartCount > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartSummaryLeft}>
            <Text style={styles.cartItemsText}>{cartCount} items</Text>
            <Text style={styles.cartTotalText}>₹{cartTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.viewCartButton}
            >
              <Text style={styles.viewCartText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  cartButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  servicesList: {
    padding: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: colors.textLight,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cartSummaryLeft: {
    flex: 1,
  },
  cartItemsText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  cartTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});
