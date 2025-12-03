import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradient } from '../theme/colors';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupport() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean; time: string }>>([
    { text: 'Hello! I\'m WorkHub Assistant. How can I help you today?', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);

  const faqs: FAQ[] = [
    {
      id: 1,
      category: 'Booking',
      question: 'How do I book a service?',
      answer: 'Simply browse our services, select the one you need, add it to cart, choose your address and preferred time slot, then proceed to payment. You\'ll receive a booking confirmation immediately.',
    },
    {
      id: 2,
      category: 'Booking',
      question: 'Can I book multiple services at once?',
      answer: 'Yes! You can add multiple services to your cart and book them together. You can also schedule them for different times if needed.',
    },
    {
      id: 3,
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept UPI, debit/credit cards, net banking, digital wallets (PhonePe, Paytm, Google Pay), and wallet balance. All payments are secure and encrypted.',
    },
    {
      id: 4,
      category: 'Payment',
      question: 'Is it safe to pay online?',
      answer: 'Absolutely! We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers.',
    },
    {
      id: 5,
      category: 'Cancellation',
      question: 'What is the cancellation policy?',
      answer: 'Free cancellation up to 24 hours before service. 50% charge for cancellations 12-24 hours before. No refund for cancellations less than 12 hours before scheduled time.',
    },
    {
      id: 6,
      category: 'Cancellation',
      question: 'How long does it take to get a refund?',
      answer: 'Refunds are processed within 5-7 business days and will be credited to your original payment method or wallet.',
    },
    {
      id: 7,
      category: 'Service',
      question: 'How do you verify service providers?',
      answer: 'All our service providers undergo thorough background checks, skill verification, and must have valid licenses. We regularly monitor their performance through customer reviews.',
    },
    {
      id: 8,
      category: 'Service',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We have a 100% satisfaction guarantee. If you\'re not happy with the service, contact us within 24 hours and we\'ll send another provider or issue a full refund.',
    },
    {
      id: 9,
      category: 'Account',
      question: 'How do I change my registered phone number?',
      answer: 'Go to Profile > Settings > Contact customer support. For security reasons, phone number changes require verification.',
    },
    {
      id: 10,
      category: 'Account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can request account deletion from Settings. All your data will be permanently removed within 30 days as per our privacy policy.',
    },
  ];

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleCall = () => {
    Linking.openURL('tel:+911800XXXXXX');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@workhub.app?subject=Help%20Request');
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;

    const userMessage = {
      text: chatMessage,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(chatMessage.toLowerCase());
      setChatMessages(prev => [
        ...prev,
        {
          text: botResponse,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    if (message.includes('book') || message.includes('service')) {
      return 'To book a service, tap on Home Services or Commercial Services from the home screen, select your desired service, and add it to cart. Need help with a specific service?';
    } else if (message.includes('payment') || message.includes('pay')) {
      return 'We accept UPI, cards, net banking, and digital wallets. All payments are 100% secure. Which payment method would you prefer?';
    } else if (message.includes('cancel')) {
      return 'Free cancellation is available up to 24 hours before your scheduled service. Would you like to cancel a booking?';
    } else if (message.includes('refund')) {
      return 'Refunds are processed within 5-7 business days to your original payment method. Do you have a specific refund query?';
    } else if (message.includes('provider') || message.includes('worker')) {
      return 'All our service providers are verified, background-checked, and highly skilled. After booking, you\'ll see your assigned provider\'s details including rating and reviews.';
    } else if (message.includes('track')) {
      return 'You can track your service provider in real-time from the booking details page. You\'ll also receive notifications at each stage.';
    } else if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! How may I assist you today? You can ask about bookings, payments, cancellations, or any other questions.';
    } else if (message.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I\'m here to help! You can ask me about:\n• Booking services\n• Payment methods\n• Cancellation policy\n• Service providers\n• Tracking orders\n\nOr type your question and I\'ll do my best to assist you. For complex issues, please call or email us.';
    }
  };

  const categories = ['All', 'Booking', 'Payment', 'Cancellation', 'Service', 'Account'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (showChat) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setShowChat(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderTitle}>WorkHub Assistant</Text>
            <Text style={styles.chatHeaderStatus}>● Online</Text>
          </View>
          <View style={styles.chatHeaderIcon}>
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
          {chatMessages.map((msg, index) => (
            <View
              key={index}
              style={[styles.messageContainer, msg.isUser ? styles.userMessage : styles.botMessage]}
            >
              {!msg.isUser && (
                <View style={styles.botAvatar}>
                  <Ionicons name="headset" size={20} color={colors.white} />
                </View>
              )}
              <View style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, msg.isUser && styles.userMessageText]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, msg.isUser && styles.userMessageTime]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.textLight}
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Contact Options */}
        <View style={styles.quickContactContainer}>
          <TouchableOpacity style={styles.quickContactCard} onPress={() => setShowChat(true)} activeOpacity={0.8}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickContactGradient}
            >
              <Ionicons name="chatbubble-ellipses" size={32} color={colors.white} />
              <Text style={styles.quickContactTitle}>Chat with Bot</Text>
              <Text style={styles.quickContactSubtitle}>Instant answers</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickContactCard} onPress={handleCall} activeOpacity={0.8}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickContactGradient}
            >
              <Ionicons name="call" size={32} color={colors.white} />
              <Text style={styles.quickContactTitle}>Call Us</Text>
              <Text style={styles.quickContactSubtitle}>24/7 Support</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickContactCard} onPress={handleEmail} activeOpacity={0.8}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickContactGradient}
            >
              <Ionicons name="mail" size={32} color={colors.white} />
              <Text style={styles.quickContactTitle}>Email Us</Text>
              <Text style={styles.quickContactSubtitle}>support@workhub.app</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Frequently Asked Questions</Text>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FAQ List */}
          {filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleFAQ(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqIconContainer}>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'remove-circle' : 'add-circle'}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Still Need Help */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={48} color={colors.primary} />
          <Text style={styles.helpCardTitle}>Still need help?</Text>
          <Text style={styles.helpCardText}>
            Our customer support team is available 24/7 to assist you
          </Text>
          <TouchableOpacity
            style={styles.helpCardButton}
            onPress={() => setShowChat(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.helpCardButtonGradient}
            >
              <Text style={styles.helpCardButtonText}>Chat with Us</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  quickContactContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  quickContactCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickContactGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickContactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 8,
  },
  quickContactSubtitle: {
    fontSize: 11,
    color: colors.white,
    marginTop: 4,
    opacity: 0.9,
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
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  faqCard: {
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
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  faqIconContainer: {
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  faqAnswer: {
    marginTop: 12,
    marginLeft: 36,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  helpCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  helpCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  helpCardText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  helpCardButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  helpCardButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  helpCardButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  // Chat Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
  chatHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  userMessageTime: {
    color: colors.white,
    opacity: 0.8,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
