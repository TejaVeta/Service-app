import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import { categoryAPI } from '../../utils/api';

interface Category {
  _id: string;
  name: string;
  icon: string;
  type: string;
  description?: string;
}

export default function Home() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const homeCategories = categories.filter(c => c.type === 'home');
  const commercialCategories = categories.filter(c => c.type === 'commercial');

  const renderCategoryCard = (category: Category) => (
    <TouchableOpacity
      key={category._id}
      style={styles.categoryCard}
      onPress={() => router.push(`/services/${category._id}?name=${category.name}&type=${category.type}`)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={category.icon as any} size={32} color={colors.primary} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {category.description && (
          <Text style={styles.categoryDescription} numberOfLines={2}>
            {category.description}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

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
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color={colors.white} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.appTitle}>WorkHub</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/language')} style={styles.headerIcon}>
            <Ionicons name="language" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/wallet')} style={styles.headerIcon}>
            <Ionicons name="wallet" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Service Cards */}
        <View style={styles.mainCardsContainer}>
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => router.push('/services-list?type=home')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <Ionicons name="home" size={48} color={colors.white} />
              <Text style={styles.mainCardTitle}>✨ Home Services ✨</Text>
              <Text style={styles.mainCardSubtitle}>Plumbing, Electrical, and more</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => router.push('/services-list?type=commercial')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4F46E5', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <Ionicons name="business" size={48} color={colors.white} />
              <Text style={styles.mainCardTitle}>✨ Commercial Services ✨</Text>
              <Text style={styles.mainCardSubtitle}>Professional business solutions</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Featured Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['#FACC15', '#FCD34D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <Ionicons name="star" size={24} color={colors.text} />
            <Text style={styles.bannerText}>Get 20% off on your first booking!</Text>
          </LinearGradient>
        </View>

        {/* All Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse All Services</Text>
          {categories.map(renderCategoryCard)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>India's #1 fastest skilled service app</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  mainCardsContainer: {
    padding: 20,
    gap: 16,
  },
  mainCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 8,
    opacity: 0.9,
    textAlign: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
