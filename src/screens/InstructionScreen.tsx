import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { 
  ArrowLeft, 
  Scan, 
  Share2, 
  Ticket, 
  Timer, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react-native';

const InstructionScreen = ({ navigation }: any) => {
  const steps = [
    {
      title: 'Find the QR Code',
      desc: 'Look for the "Scan & Share" QR code at the hospital registration counter or OPD entrance.',
      icon: <Scan size={28} color={COLORS.primary} />,
      badge: 'Step 1'
    },
    {
      title: 'Scan & Verify',
      desc: 'Use our secure scanner to read the hospital’s unique identifier. Your health profile will be ready to share instantly.',
      icon: <ShieldCheck size={28} color={COLORS.primary} />,
      badge: 'Step 2'
    },
    {
      title: 'Express Sharing',
      desc: 'Confirm the details you want to share. All data is transferred via a secure ABDM encrypted tunnel.',
      icon: <Share2 size={28} color={COLORS.primary} />,
      badge: 'Step 3'
    },
    {
      title: 'Get Your Token',
      desc: 'A digital token number will be generated. This replaces the manual form filling process.',
      icon: <Ticket size={28} color={COLORS.primary} />,
      badge: 'Step 4'
    },
    {
        title: 'Skip the Queue',
        desc: 'Show the digital token to the staff. They will instantly see your details on their system.',
        icon: <Timer size={28} color={COLORS.primary} />,
        badge: 'Final'
      }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workflow Process</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
           <View style={styles.infoIconBox}>
              <Info size={24} color={COLORS.primary} />
           </View>
           <Text style={styles.introTitle}>How it works?</Text>
           <Text style={styles.introSub}>
             ScanToken simplifies hospital registration by digitizing the paper-trail using the Ayushman Bharat Digital Mission (ABDM) standards.
           </Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepLeft}>
                 <View style={[styles.iconCircle, SHADOWS.sm]}>
                    {step.icon}
                 </View>
                 {index !== steps.length - 1 && <View style={styles.connector} />}
              </View>
              <View style={[styles.stepContent, SHADOWS.sm]}>
                 <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{step.badge}</Text>
                 </View>
                 <Text style={styles.stepTitle}>{step.title}</Text>
                 <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.benefitBox, SHADOWS.sm]}>
            <View style={styles.benefitHeader}>
                <CheckCircle2 size={20} color={COLORS.success} />
                <Text style={styles.benefitTitle}>Why use ScanToken?</Text>
            </View>
            <View style={styles.benefitGrid}>
               <View style={styles.benefitItem}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>Zero contact registration</Text>
               </View>
               <View style={styles.benefitItem}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>100% Privacy & Consent based</Text>
               </View>
               <View style={styles.benefitItem}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>No manual form filling</Text>
               </View>
               <View style={styles.benefitItem}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>Instant token generation</Text>
               </View>
            </View>
        </View>

        <TouchableOpacity style={[styles.ctaBtn, SHADOWS.md]} onPress={() => navigation.navigate('Scanner')}>
           <Text style={styles.ctaBtnText}>Start First Scan</Text>
           <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  introBox: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  infoIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(43, 103, 246, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 103, 246, 0.1)',
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  introSub: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  stepsContainer: {
    paddingLeft: 10,
    marginBottom: 40,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  stepLeft: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(43, 103, 246, 0.1)',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    paddingTop: 36,
    position: 'relative',
  },
  stepBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    fontWeight: '500',
  },
  benefitBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 28,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  benefitGrid: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitBullet: {
    fontSize: 18,
    color: COLORS.success,
    fontWeight: '900',
  },
  benefitText: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default InstructionScreen;
