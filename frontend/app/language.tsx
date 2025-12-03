import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../utils/api';

const languages = [
  { code: 'te', name: 'తెలుగు', nativeName: 'Telugu' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'हिंदी', nativeName: 'Hindi' },
  { code: 'ta', name: 'தமிழ்', nativeName: 'Tamil' },
  { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', nativeName: 'Malayalam' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nativeName: 'Punjabi' },
];

export default function Language() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferred_language || 'English');

  const handleSelectLanguage = async (language: string) => {
    setSelectedLanguage(language);
    if (user) {
      try {
        await userAPI.updateProfile(user._id, undefined, language);
        setUser({ ...user, preferred_language: language });
      } catch (error) {
        console.error('Failed to update language:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.nativeName && styles.selectedCard,
              ]}
              onPress={() => handleSelectLanguage(language.nativeName)}
              activeOpacity={0.7}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.nativeName}</Text>
              </View>
              {selectedLanguage === language.nativeName && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  languageList: {
    padding: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
    color: colors.textLight,
  },
  checkmark: {
    marginLeft: 12,
  },
});
