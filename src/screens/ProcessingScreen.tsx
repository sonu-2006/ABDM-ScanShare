import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/Theme';
import { ShieldCheck, CloudLightning, Server, CheckCircle2, HeartPulse } from 'lucide-react-native';

const ProcessingScreen = ({ navigation, route }: any) => {
  const { hospital } = route.params;
  const [step, setStep] = useState(0);
  const progressAnim = useState(new Animated.Value(0))[0];

  const steps = [
    { label: "5.3.1 Initiating Profile Share", icon: <CloudLightning size={24} color={COLORS.primary} /> },
    { label: "5.3.2 Receiving Share Callback", icon: <Server size={24} color={COLORS.primary} /> },
    { label: "5.3.3 Hospital Processing (On-Share)", icon: <HeartPulse size={24} color={COLORS.primary} /> },
    { label: "5.3.4 Finalizing Token Creation", icon: <CheckCircle2 size={24} color={COLORS.success} /> }
  ];

  useEffect(() => {
    const runSequence = async () => {
      // Step 1: Profile Share
      Animated.timing(progressAnim, {
        toValue: 0.25,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      await new Promise(r => setTimeout(r, 1000));
      setStep(1);

      // Step 2: Share Callback
      Animated.timing(progressAnim, {
        toValue: 0.5,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      await new Promise(r => setTimeout(r, 1200));
      setStep(2);

      // Step 3: Profile On-Share (Hospital processing)
      Animated.timing(progressAnim, {
        toValue: 0.75,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      await new Promise(r => setTimeout(r, 1500));
      setStep(3);

      // Step 4: Final Callback
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      await new Promise(r => setTimeout(r, 1000));
      
      navigation.replace('Token', { hospital });
    };

    runSequence();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={[styles.glowBox, SHADOWS.md]}>
           <ShieldCheck size={50} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Secure Transmission</Text>
        <Text style={styles.subtitle}>Sharing your health persona with {hospital.name} via ABDM V3 channels.</Text>

        <View style={styles.progressWrapper}>
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }) 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.stepList}>
          {steps.map((s, idx) => (
            <View key={idx} style={[styles.stepRow, step < idx && styles.stepInactive]}>
              <View style={[styles.stepIcon, step === idx && styles.activeIconGlow]}>
                 {s.icon}
              </View>
              <Text style={[styles.stepText, step === idx && styles.activeText]}>
                {s.label}
              </Text>
              {step > idx && <CheckCircle2 size={18} color={COLORS.success} />}
            </View>
          ))}
        </View>

        <View style={styles.securityFooter}>
           <LockIcon />
           <Text style={styles.lockText}>ENCRYPTION ACTIVE: AES-256 GCM</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const LockIcon = () => (
    <View style={{ width: 14, height: 16 }}>
        <View style={{ width: 14, height: 10, backgroundColor: COLORS.textMuted, marginTop: 6, borderRadius: 2 }} />
        <View style={{ width: 10, height: 8, borderColor: COLORS.textMuted, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderTopLeftRadius: 5, borderTopRightRadius: 5, position: 'absolute', top: 0, left: 2 }} />
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  glowBox: {
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(43, 103, 246, 0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 50,
    fontWeight: '500',
  },
  progressWrapper: {
    width: '100%',
    marginBottom: 40,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  stepList: {
    width: '100%',
    gap: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepInactive: {
    opacity: 0.4,
    backgroundColor: 'transparent',
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconGlow: {
    backgroundColor: 'rgba(43, 103, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(43, 103, 246, 0.2)',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 60,
    opacity: 0.5,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
});

export default ProcessingScreen;
