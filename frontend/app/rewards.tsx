import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

export default function Rewards() {
  const router = useRouter();
  const user = useAuthStore();

  // Mock rewards data - in production, fetch from API
  const rewardPoints = 1250;
  const availableRewards = [
    { id: 1, title: '₹50 Off', points: 500, description: 'On services above ₹500', icon: 'pricetag' },
    { id: 2, title: '₹100 Off', points: 1000, description: 'On services above ₹1000', icon: 'pricetag' },
    { id: 3, title: '₹250 Off', points: 2500, description: 'On services above ₹2500', icon: 'pricetag' },
    { id: 4, title: 'Free Service', points: 5000, description: 'One free basic service', icon: 'gift' },
  ];

  const recentActivity = [
    { id: 1, action: 'Booking Completed', points: '+100', date: '2 days ago', icon: 'checkmark-circle', color: colors.success },
    { id: 2, action: 'Referral Bonus', points: '+200', date: '5 days ago', icon: 'people', color: colors.primary },
    { id: 3, action: 'Redeemed Reward', points: '-500', date: '1 week ago', icon: 'gift', color: colors.error },
    { id: 4, action: 'First Booking Bonus', points: '+150', date: '2 weeks ago', icon: 'star', color: colors.accent },
  ];

  const tasks = [
    { id: 1, title: 'Complete your profile', points: 50, completed: true, icon: 'person' },
    { id: 2, title: 'Book 5 services', points: 200, completed: false, progress: '3/5', icon: 'calendar' },
    { id: 3, title: 'Refer 3 friends', points: 300, completed: false, progress: '1/3', icon: 'people' },
    { id: 4, title: 'Leave a review', points: 50, completed: false, icon: 'star' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Points Balance Card */}
        <LinearGradient
          colors={['#F59E0B', '#FACC15', '#FCD34D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceContent}>
            <Ionicons name="trophy" size={48} color={colors.white} />
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Your Reward Points</Text>
              <Text style={styles.balanceAmount}>{rewardPoints.toLocaleString()}</Text>
              <Text style={styles.balanceSubtext}>Keep earning to unlock more rewards!</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Earn More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Complete Tasks to Earn</Text>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskIconContainer}>
                <Ionicons 
                  name={task.icon as any} 
                  size={24} 
                  color={task.completed ? colors.success : colors.primary} 
                />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {task.progress && (
                  <Text style={styles.taskProgress}>{task.progress}</Text>
                )}
              </View>
              <View style={styles.taskPoints}>
                <Text style={styles.taskPointsText}>+{task.points}</Text>
                {task.completed && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Available Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 Redeem Rewards</Text>
          <View style={styles.rewardsGrid}>
            {availableRewards.map((reward) => {
              const canRedeem = rewardPoints >= reward.points;
              return (
                <TouchableOpacity
                  key={reward.id}
                  style={[styles.rewardCard, !canRedeem && styles.lockedCard]}
                  activeOpacity={canRedeem ? 0.7 : 1}
                >
                  <View style={[styles.rewardIconBg, !canRedeem && styles.lockedIconBg]}>
                    <Ionicons 
                      name={reward.icon as any} 
                      size={28} 
                      color={canRedeem ? colors.primary : colors.textLight} 
                    />
                  </View>
                  <Text style={[styles.rewardTitle, !canRedeem && styles.lockedText]}>
                    {reward.title}
                  </Text>
                  <Text style={[styles.rewardDescription, !canRedeem && styles.lockedText]}>
                    {reward.description}
                  </Text>
                  <View style={styles.rewardPoints}>
                    <Ionicons 
                      name="star" 
                      size={14} 
                      color={canRedeem ? colors.accent : colors.textLight} 
                    />
                    <Text style={[styles.rewardPointsText, !canRedeem && styles.lockedText]}>
                      {reward.points} points
                    </Text>
                  </View>
                  {!canRedeem && (
                    <View style={styles.lockedBadge}>
                      <Ionicons name="lock-closed" size={12} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Ionicons name={activity.icon as any} size={20} color={activity.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text style={[
                styles.activityPoints,
                { color: activity.points.startsWith('+') ? colors.success : colors.error }
              ]}>
                {activity.points}
              </Text>
            </View>
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
  balanceCard: {
    margin: 20,
    borderRadius: 24,
    padding: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceInfo: {
    marginLeft: 20,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.85,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  taskCard: {
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
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  taskProgress: {
    fontSize: 13,
    color: colors.textLight,
  },
  taskPoints: {
    alignItems: 'center',
  },
  taskPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  lockedCard: {
    opacity: 0.6,
  },
  rewardIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedIconBg: {
    backgroundColor: '#F3F4F6',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
  },
  lockedText: {
    color: colors.textLight,
  },
  rewardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardPointsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  lockedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
