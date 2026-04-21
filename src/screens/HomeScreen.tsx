import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, Alert, ImageBackground } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import {
  Scan,
  History,
  Users,
  CalendarDays,
  Info,
  Bell,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Heart,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react-native';
import { getVisits, getActiveProfile, getProfiles } from '../utils/storage';
import { Visit, UserProfile } from '../types';

const HomeScreen = ({ navigation }: any) => {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayTokens, setTodayTokens] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const active = await getActiveProfile();
      const all = await getProfiles();
      const history = await getVisits();

      setActiveUser(active);
      setProfiles(all);

      // Filter visits for the active user precisely
      // Match by abhaNumber if exists, otherwise by fullName
      const userHistory = history.filter(v =>
        (active?.abhaNumber && v.abhaNumber === active.abhaNumber) ||
        (v.patientName === active?.fullName)
      );

      const todayDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const currentTokens = userHistory.filter(v => v.date === todayDate).length;

      setTotalVisits(userHistory.length);
      setTodayTokens(currentTokens);
      setVisits(userHistory.slice(0, 2));
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    loadData(); // Initial load
    return unsubscribe;
  }, [navigation, activeUser]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Header */}
      <View style={styles.topNav}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{activeUser?.fullName || 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.notiBtn, SHADOWS.sm]} onPress={() => navigation.navigate('SelectProfile')}>
            <Users size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notiBtn, SHADOWS.sm]}>
            <Bell size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* HERO SECTION WITH DOCTOR IMAGE */}
        <View style={styles.heroDoctorRow}>
          <View style={[styles.heroContainer, { flex: 1.2 }]}>
            <ImageBackground
              source={{ uri: 'file:///C:/Users/gnyan/.gemini/antigravity/brain/07702fb1-a9d8-4d59-8ef3-43c08c547e6a/medical_dashboard_hero_1776325818705.png' }}
              style={styles.heroContent}
              imageStyle={{ borderRadius: 28 }}
            >
              <View style={styles.heroOverlay}>
                <View style={styles.trustBadge}>
                  <ShieldCheck size={14} color="#fff" />
                  <Text style={styles.trustBadgeText}>ABDM CERTIFIED</Text>
                </View>
                <Text style={styles.heroTitle}>Your Health, Simplified.</Text>
                <Text style={styles.heroSub}>Manage your ABDM profile & get instant tokens.</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.doctorImageContainer}>
            <Image
              source={require('../../assets/images/image.png')}
              style={styles.doctorImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* QUICK ACTIONS - Useful shortcuts */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, SHADOWS.sm, { borderColor: 'rgba(43, 103, 246, 0.1)' }]}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(43, 103, 246, 0.1)' }]}>
              <Activity size={18} color={COLORS.primary} />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Total Tokens Generated</Text>
              <Text style={[styles.statVal, { color: COLORS.primary }]}>{totalVisits}</Text>
            </View>
          </View>
        </View>

        {/* SCAN QR - FULL WIDTH */}
        <TouchableOpacity
          style={[styles.scanFullCard, SHADOWS.md]}
          onPress={() => navigation.navigate('Scanner')}
        >
          <View style={styles.scanIconBoxLarge}>
            <Scan size={36} color="#fff" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleLarge}>Scan QR & Get Token</Text>
            <Text style={styles.cardSubLarge}>Skip the queue — share your ABHA instantly</Text>
          </View>
          <ArrowRight size={24} color="#fff" />
        </TouchableOpacity>

        {/* HISTORY SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hospital History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HealthLocker')}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {visits.length > 0 ? (
          <View style={styles.historyList}>
            {visits.map((visit) => (
              <TouchableOpacity key={visit.id} style={[styles.visitCard, SHADOWS.sm]}>
                <View style={styles.visitIcon}>
                  <Stethoscope size={20} color={COLORS.primary} />
                </View>
                <View style={styles.visitMain}>
                  <Text style={styles.hospitalText}>{visit.hospitalName}</Text>
                  <Text style={styles.visitMeta}>{visit.date} • {visit.counterId}</Text>
                </View>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenLabel}>TOKEN</Text>
                  <Text style={styles.tokenNumber}>#{visit.tokenNumber}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyHistory}>
            <History size={40} color={COLORS.border} />
            <Text style={styles.emptyText}>No recent scans for {(activeUser?.fullName || '').split(' ')[0]}. Your visits will appear here.</Text>
          </View>
        )}

        {/* HEALTH INSIGHTS */}
        <View style={[styles.insightCard, SHADOWS.sm]}>
          <View style={styles.insightHeader}>
            <TrendingUp size={20} color={COLORS.primary} />
            <Text style={styles.insightTitle}>Health Insight</Text>
          </View>
          <Text style={styles.insightText}>
            "Sharing your ABHA profile digitally reduces registration time by 90% and ensures error-free record keeping."
          </Text>
          <View style={styles.insightFooter}>
            <Award size={14} color={COLORS.primary} />
            <Text style={styles.insightFooterText}>Powered by ABDM standards</Text>
          </View>
        </View>

        {/* FAMILY BANNER */}
        <View style={[styles.banner, SHADOWS.sm]}>
          <View style={styles.bannerInfo}>
            <View style={styles.bannerIcon}>
              <Users size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.bannerTitle}>Family Health</Text>
              <Text style={styles.bannerSub}>
                {profiles.length} Profiles registered
              </Text>
            </View>
          </View>
          <View style={styles.bannerActions}>
            <TouchableOpacity style={styles.bannerAction} onPress={() => navigation.navigate('SelectProfile')}>
              <Text style={styles.bannerActionText}>Manage Profiles</Text>
              <ArrowRight size={14} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bannerAction, { marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 15 }]}
              onPress={() => navigation.navigate('Instructions')}
            >
              <View style={styles.learnIconBox}>
                <Info size={14} color="#fff" />
              </View>
              <Text style={[styles.bannerActionText, { color: COLORS.secondary }]}>Learn how to scan and book</Text>
              <ChevronRight size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.trustFooter}>
        <ShieldCheck size={14} color={COLORS.textMuted} />
        <Text style={styles.trustText}>Ayushman Bharat Digital Mission (ABDM) Verified</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notiBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  heroContainer: {
    height: 180,
    marginBottom: 24,
  },
  heroContent: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 55, 126, 0.7)', // Deeper, more interesting premium indigo
    padding: 24,
    justifyContent: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
    marginBottom: 12,
  },
  trustBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    lineHeight: 18,
    width: '80%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  heroDoctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  scanFullCard: {
    backgroundColor: '#00BFA5',
    padding: 28,
    paddingVertical: 32,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  scanIconBoxLarge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleLarge: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  cardSubLarge: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  doctorImageContainer: {
    flex: 0.6,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  doctorImage: {
    width: 140,
    height: 140,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  historyList: {
    gap: 12,
    marginBottom: 32,
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitMain: {
    flex: 1,
  },
  hospitalText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  visitMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  tokenBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(43, 103, 246, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tokenLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 2,
  },
  tokenNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderRadius: 28,
    gap: 12,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(43, 103, 246, 0.1)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 22,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.5,
  },
  insightFooterText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  banner: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 32,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 20,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  bannerSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  bannerActions: {
    gap: 8,
  },
  bannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerActionText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  learnIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    opacity: 0.5,
  },
  trustText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;
