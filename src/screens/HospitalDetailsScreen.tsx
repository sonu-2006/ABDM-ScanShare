import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Stethoscope,
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react-native';
import { getActiveProfile } from '../utils/storage';

const HospitalDetailsScreen = ({ navigation, route }: any) => {
  const { hospital: scanData } = route.params;
  const [loading, setLoading] = useState(true);
  const [hospitalInfo, setHospitalInfo] = useState<any>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Module 5.3.1 - Simulate backend call for hospital details using hipId
        // This is the Step 4 logic
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

        // Dynamic Data Mapping based on HIP ID
        let hospitalName = "Apollo Hospital (V3)";
        let location = "Greams Road, Chennai, Tamil Nadu";
        let dept = "General OPD";

        const hipId = scanData.hipId.toUpperCase();

        if (hipId.includes('AIIMS')) {
          hospitalName = "AIIMS New Delhi";
          location = "Ansari Nagar, New Delhi";
          dept = "Main OPD Block";
        } else if (hipId.includes('ANKURA')) {
          hospitalName = "Ankura Hospital";
          location = "Banjara Hills, Hyderabad";
          dept = "Pediatrics / Gynae";
        } else if (hipId.includes('SAFDARJUNG')) {
          hospitalName = "Safdarjung Hospital";
          location = "Ansari Nagar East, New Delhi";
          dept = "Main Registration Hall";
        } else {
          // UNIVERSAL FALLBACK: Handle ANY other hospital in India
          // Format ID like "MAX_HEALTH_01" -> "Max Health 01"
          hospitalName = scanData.hipId
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
          
          location = "Verified Health Facility";
          dept = "General OPD / Registration";
        }

        const mockResponse = {
          name: hospitalName,
          department: dept,
          counter: scanData.counterId || "OPD-01",
          location: location,
          timings: "08:00 AM - 08:00 PM",
          verified: true,
          hipId: scanData.hipId
        };

        setHospitalInfo(mockResponse);

        const active = await getActiveProfile();
        setProfile(active);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scanData.hipId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Verifying HMS Credentials...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Provider</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <View style={[styles.facilityIconLarge, SHADOWS.sm]}>
            <Building2 size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.hospitalName}>{hospitalInfo.name}</Text>
          <View style={styles.verifiedTag}>
            <ShieldCheck size={14} color={COLORS.success} />
            <Text style={styles.verifiedText}>ABDM VERIFIED PROVIDER</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, SHADOWS.sm]}>
          <Text style={styles.cardSectionLabel}>FACILITY APPOINTMENT DETAILS</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Stethoscope size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>DEPARTMENT</Text>
              <Text style={styles.infoValue}>{hospitalInfo.department}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LayoutDashboard size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>COUNTER / UNIT</Text>
              <Text style={styles.infoValue}>{hospitalInfo.counter}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <MapPin size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>FACILITY LOCATION</Text>
              <Text style={styles.infoValue}>{hospitalInfo.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Clock size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>OPD TIMINGS</Text>
              <Text style={styles.infoValue}>{hospitalInfo.timings}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.consentBox, isChecked && styles.consentBoxActive]}>
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked && <CheckCircle2 size={16} color="#fff" />}
            </View>
            <Text style={styles.consentText}>
              I confirm these hospital details are correct and I am ready to share my digital health profile for instant registration.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityNote}>
          <ShieldCheck size={14} color={COLORS.textMuted} />
          <Text style={styles.securityNoteText}>Identified via Secure HIP ID: {hospitalInfo.hipId}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !isChecked && styles.continueBtnDisabled, SHADOWS.md]}
          disabled={!isChecked}
          onPress={() => navigation.navigate('FinalProfileShare', { hospital: hospitalInfo, profile })}
        >
          <Text style={styles.continueBtnText}>Proceed to Share</Text>
          <ArrowRight size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 15,
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  headerNav: {
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
    marginBottom: 32,
    marginTop: 10,
  },
  facilityIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hospitalName: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 20,
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  consentBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  consentBoxActive: {
    backgroundColor: 'rgba(43, 103, 246, 0.03)',
    borderColor: 'rgba(43, 103, 246, 0.1)',
  },
  checkRow: {
    flexDirection: 'row',
    gap: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    opacity: 0.6,
  },
  securityNoteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: ROUNDING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default HospitalDetailsScreen;
