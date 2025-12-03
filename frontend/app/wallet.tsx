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

export default function Wallet() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const paymentMethods = [
    { name: 'PhonePe', icon: 'phone-portrait', color: '#5F259F' },
    { name: 'Paytm', icon: 'wallet', color: '#00BAF2' },
    { name: 'Google Pay', icon: 'logo-google', color: '#4285F4' },
    { name: 'UPI', icon: 'cash', color: '#097939' },
    { name: 'Debit/Credit Card', icon: 'card', color: '#FF6B6B' },
    { name: 'Net Banking', icon: 'business', color: '#2E7D32' },
  ];

  const transactions = [
    { id: '1', type: 'credit', amount: 1000, date: '2025-01-15', desc: 'Added money' },
    { id: '2', type: 'debit', amount: 500, date: '2025-01-14', desc: 'Booking payment' },
    { id: '3', type: 'credit', amount: 200, date: '2025-01-13', desc: 'Referral bonus' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCardContainer}>
          <LinearGradient
            colors={gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>₹{user?.wallet_balance.toFixed(2) || '0.00'}</Text>
            <TouchableOpacity style={styles.addMoneyButton}>
              <Text style={styles.addMoneyText}>Add Money</Text>
              <Ionicons name="add-circle" size={20} color={colors.white} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentGrid}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity key={index} style={styles.paymentMethod} activeOpacity={0.7}>
                <View style={[styles.paymentIcon, { backgroundColor: method.color }]}>
                  <Ionicons name={method.icon as any} size={24} color={colors.white} />
                </View>
                <Text style={styles.paymentName} numberOfLines={2}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Refer & Earn */}
        <TouchableOpacity style={styles.referCard} activeOpacity={0.8}>
          <View style={styles.referIconContainer}>
            <Ionicons name="gift" size={32} color={colors.accent} />
          </View>
          <View style={styles.referInfo}>
            <Text style={styles.referTitle}>Refer & Earn Money</Text>
            <Text style={styles.referSubtitle}>Share with friends and earn rewards</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: transaction.type === 'credit' ? '#D1FAE5' : '#FEE2E2' }
              ]}>
                <Ionicons
                  name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                  size={20}
                  color={transaction.type === 'credit' ? colors.success : colors.error}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'credit' ? colors.success : colors.error }
              ]}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
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
  balanceCardContainer: {
    padding: 20,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 24,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addMoneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentMethod: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  paymentName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  referCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  referIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  referInfo: {
    flex: 1,
  },
  referTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  referSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
