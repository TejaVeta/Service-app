import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Constants from 'expo-constants';

export default function AppDetails() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1';

  const showModal = (type: 'privacy' | 'terms') => {
    setModalContent(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const privacyPolicyContent = `
PRIVACY POLICY

Last Updated: January 2025

1. INFORMATION WE COLLECT

1.1 Personal Information
- Name and contact details
- Phone number and email address
- Location data for service delivery
- Payment information
- Profile pictures and documents (for service providers)

1.2 Usage Information
- App usage statistics
- Device information
- Service booking history
- Communication logs

2. HOW WE USE YOUR INFORMATION

We use your information to:
- Process and fulfill service bookings
- Connect you with service providers
- Process payments securely
- Send booking confirmations and updates
- Improve our services
- Provide customer support
- Send promotional offers (with consent)

3. INFORMATION SHARING

We may share your information with:
- Service providers for booking fulfillment
- Payment processors for transactions
- Legal authorities when required by law
- Analytics partners (anonymized data only)

We never sell your personal information to third parties.

4. DATA SECURITY

- End-to-end encryption for sensitive data
- Secure payment processing
- Regular security audits
- Data backup and recovery systems

5. YOUR RIGHTS

You have the right to:
- Access your personal data
- Correct inaccurate information
- Delete your account and data
- Opt-out of marketing communications
- Export your data

6. COOKIES AND TRACKING

We use cookies and similar technologies to:
- Maintain your session
- Remember preferences
- Analyze app usage
- Improve user experience

7. CHILDREN'S PRIVACY

Our services are not intended for users under 18 years of age.

8. DATA RETENTION

We retain your data for:
- Active accounts: Duration of account existence
- Inactive accounts: 2 years after last activity
- Legal requirements: As mandated by law

9. INTERNATIONAL TRANSFERS

Your data may be transferred and stored in servers located in India and other countries where our service providers operate.

10. CHANGES TO PRIVACY POLICY

We may update this policy periodically. We will notify you of significant changes via email or app notification.

11. CONTACT US

For privacy-related queries:
- Email: privacy@workhub.app
- Phone: +91-1800-XXX-XXXX
- Address: WorkHub India Pvt Ltd, Hyderabad, India

By using WorkHub, you consent to this Privacy Policy.
  `;

  const termsConditionsContent = `
TERMS AND CONDITIONS

Last Updated: January 2025

1. ACCEPTANCE OF TERMS

By accessing and using WorkHub, you accept and agree to be bound by these Terms and Conditions.

2. SERVICE DESCRIPTION

WorkHub is a platform connecting customers with service providers for home and commercial services including:
- Electrical work
- Plumbing
- Construction
- Painting
- And other skilled services

3. USER ACCOUNTS

3.1 Registration
- Must be 18 years or older
- Provide accurate information
- Maintain account security
- One account per user

3.2 Account Termination
We reserve the right to suspend or terminate accounts that:
- Violate these terms
- Engage in fraudulent activity
- Misuse the platform

4. BOOKING AND PAYMENTS

4.1 Booking Process
- All bookings are subject to availability
- Prices shown are estimates
- Final pricing may vary based on actual work
- Advance payment may be required

4.2 Payment Terms
- Multiple payment methods accepted
- Payments processed securely
- Refunds as per cancellation policy
- GST applicable on all services

4.3 Cancellation Policy
- Free cancellation: 24 hours before service
- 50% charge: 12-24 hours before service
- No refund: Less than 12 hours before service
- Emergency cancellations considered case-by-case

5. SERVICE PROVIDER TERMS

5.1 Provider Requirements
- Valid licenses and certifications
- Background verification completed
- Insurance coverage maintained
- Professional conduct expected

5.2 Service Quality
- Providers must deliver services as described
- Use appropriate tools and materials
- Follow safety standards
- Complete work within agreed timeframe

6. USER RESPONSIBILITIES

You agree to:
- Provide accurate service requirements
- Allow provider access to service location
- Make timely payments
- Treat service providers respectfully
- Report any issues promptly

7. PLATFORM FEES

- WorkHub charges a convenience fee
- Fee structure disclosed before booking
- Fees non-refundable unless service cancelled by us

8. REVIEWS AND RATINGS

- Honest reviews encouraged
- False or malicious reviews prohibited
- Reviews may be moderated
- Providers can respond to reviews

9. INTELLECTUAL PROPERTY

- WorkHub name, logo, and content are protected
- Unauthorized use prohibited
- User-generated content license granted to us

10. LIMITATION OF LIABILITY

WorkHub is a platform connecting users and providers. We are not liable for:
- Service quality or outcomes
- Provider actions or negligence
- Property damage during service
- Personal injuries
- Force majeure events

11. DISPUTE RESOLUTION

- Contact customer support first
- Mediation before legal action
- Jurisdiction: Courts of Hyderabad, India
- Governing law: Indian law

12. PROHIBITED ACTIVITIES

Users must not:
- Violate any laws
- Harass other users or providers
- Share inappropriate content
- Circumvent platform for direct payments
- Use automated systems or bots

13. INDEMNIFICATION

You agree to indemnify WorkHub against claims arising from your use of the platform or violation of these terms.

14. MODIFICATIONS

We may modify these terms at any time. Continued use constitutes acceptance of modified terms.

15. SEVERABILITY

If any provision is found invalid, remaining provisions continue in effect.

16. CONTACT INFORMATION

For terms-related queries:
- Email: legal@workhub.app
- Phone: +91-1800-XXX-XXXX
- Address: WorkHub India Pvt Ltd, Hyderabad, India

By using WorkHub, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
  `;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIconContainer}>
            <Ionicons name="briefcase" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appName}>WorkHub</Text>
          <Text style={styles.appTagline}>India's #1 Fastest Skilled Service App</Text>
          
          <View style={styles.versionContainer}>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Version {appVersion}</Text>
            </View>
            <Text style={styles.buildText}>Build {buildNumber}</Text>
          </View>
        </View>

        {/* Legal Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Documents</Text>

          <TouchableOpacity
            style={styles.documentCard}
            onPress={() => showModal('privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.documentIconContainer}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Privacy Policy</Text>
              <Text style={styles.documentDescription}>
                How we collect, use, and protect your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentCard}
            onPress={() => showModal('terms')}
            activeOpacity={0.7}
          >
            <View style={styles.documentIconContainer}>
              <Ionicons name="document-text" size={28} color={colors.primary} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Terms & Conditions</Text>
              <Text style={styles.documentDescription}>
                Rules and guidelines for using WorkHub
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>WorkHub India Pvt Ltd</Text>
            </View>
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>Services & Utilities</Text>
            </View>
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue}>45.2 MB</Text>
            </View>
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Languages</Text>
              <Text style={styles.infoValue}>7 Languages</Text>
            </View>
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>January 2025</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color={colors.primary} />
              <Text style={styles.contactText}>support@workhub.app</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.contactText}>+91-1800-XXX-XXXX</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.contactText}>Hyderabad, India</Text>
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>© 2025 WorkHub India Pvt Ltd</Text>
          <Text style={styles.copyrightText}>All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Modal for Privacy Policy / Terms */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.modalText}>
              {modalContent === 'privacy' ? privacyPolicyContent : termsConditionsContent}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  appInfoCard: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  appIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  buildText: {
    fontSize: 12,
    color: colors.textLight,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  documentCard: {
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
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
  },
  copyrightSection: {
    padding: 32,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.text,
  },
});
