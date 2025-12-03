import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

export default function ReferAndEarn() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [copied, setCopied] = useState(false);

  // Generate referral link based on user ID
  const referralLink = `https://workhub.app/invite?ref=${user?._id || 'DEMO123'}`;
  const referralCode = user?._id?.slice(-6).toUpperCase() || 'DEMO123';

  const handleCopyLink = () => {
    Clipboard.setString(referralLink);
    setCopied(true);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join WorkHub - India's #1 Fastest Service App! Use my referral code ${referralCode} and get ₹100 bonus on signup. Download now: ${referralLink}`,
        title: 'Join WorkHub',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const rewards = [
    { icon: 'gift', title: '₹100', description: 'When friend signs up' },
    { icon: 'wallet', title: '₹200', description: 'When they book first service' },
    { icon: 'star', title: '₹500', description: 'For every 5 referrals' },
  ];

  const steps = [
    { icon: 'share-social', title: 'Share Link', description: 'Share your unique referral link with friends' },
    { icon: 'person-add', title: 'Friend Signs Up', description: 'Your friend registers using your link' },
    { icon: 'card', title: 'They Book', description: 'Friend books their first service' },
    { icon: 'cash', title: 'You Earn', description: 'Get rewards credited to wallet' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.giftIconContainer}>
            <Ionicons name="gift" size={80} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>Share the Love,</Text>
          <Text style={styles.heroTitle}>Earn Rewards!</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends & earn up to ₹500 per referral
          </Text>
        </LinearGradient>

        {/* Referral Code Card */}
        <View style={styles.referralCard}>
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.referralCode}>{referralCode}</Text>
          </View>
          
          <Text style={styles.referralLabel} style={{ marginTop: 16 }}>Your Referral Link</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.referralLink} numberOfLines={1}>
              {referralLink}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, copied && styles.copiedButton]}
              onPress={handleCopyLink}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={copied ? "checkmark-circle" : "copy"} 
                size={20} 
                color={colors.white} 
              />
              <Text style={styles.actionButtonText}>
                {copied ? 'Copied!' : 'Copy Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social" size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>Share Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Earn Rewards</Text>
          <View style={styles.rewardsGrid}>
            {rewards.map((reward, index) => (
              <View key={index} style={styles.rewardCard}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name={reward.icon as any} size={32} color={colors.primary} />
                </View>
                <Text style={styles.rewardAmount}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 How It Works</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepIconContainer}>
                <Ionicons name={step.icon as any} size={28} color={colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral rewards are credited within 24 hours{'\n'}
            • Friend must complete first booking to unlock rewards{'\n'}
            • Rewards can be used for future bookings{'\n'}
            • Unlimited referrals allowed{'\n'}
            • Offer valid for new users only
          </Text>
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
  heroSection: {
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
  },
  giftIconContainer: {
    marginBottom: 20,
    transform: [{ rotate: '-15deg' }],
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.95,
  },
  referralCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  referralLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  referralCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  linkContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referralLink: {
    fontSize: 14,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  copiedButton: {
    backgroundColor: colors.success,
  },
  shareButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  rewardsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
  },
  stepCard: {
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
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  termsSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
});
