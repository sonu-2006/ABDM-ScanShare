import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { 
  User, 
  CheckCircle, 
  Smartphone, 
  MapPin, 
  ChevronRight, 
  Users, 
  Calendar, 
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Fingerprint,
  AtSign,
  Activity
} from 'lucide-react-native';
import { getProfiles, getActiveProfile } from '../utils/storage';
import { UserProfile } from '../types';
import { differenceInYears, parse } from 'date-fns';

const ProfileShareScreen = ({ navigation, route }: any) => {
  const { hospital } = route.params;
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    address: '',
    gender: '',
    age: '',
    abhaNumber: '',
    abhaAddress: '',
  });

  React.useEffect(() => {
    const load = async () => {
      const user = await getActiveProfile();
      if (user) {
        setActiveUser(user);
        
        // Calculate age from DOB
        let age = 'N/A';
        try {
          if (user.dateOfBirth) {
            const birthDate = parse(user.dateOfBirth, 'dd-MM-yyyy', new Date());
            age = differenceInYears(new Date(), birthDate).toString();
          }
        } catch (e) {}

        // Ensure ABHA number is formatted for display
        let formattedAbha = user.abhaNumber || 'Not Linked';
        if (formattedAbha.replace(/\D/g, '').length === 14 && !formattedAbha.includes('-')) {
            const c = formattedAbha.replace(/\D/g, '');
            formattedAbha = `${c.slice(0, 2)}-${c.slice(2, 6)}-${c.slice(6, 10)}-${c.slice(10, 14)}`;
        }

        setForm({
          fullName: user.fullName || '',
          mobile: user.mobile || '',
          address: user.address || '',
          gender: user.gender || '',
          age: age,
          abhaNumber: formattedAbha,
          abhaAddress: (user.abhaAddress || 'Not Linked').toLowerCase(),
        });
      }
    };
    load();
  }, []);

  const handleConfirm = () => {
    navigation.navigate('Processing', { hospital });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic Hospital Header */}
      <View style={styles.hospitalBanner}>
        <View style={styles.hInfo}>
            <Building2 size={22} color={COLORS.primary} />
            <View>
                <Text style={styles.hName}>{hospital.name}</Text>
                <Text style={styles.hLoc}>{hospital.location}</Text>
            </View>
        </View>
        <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{hospital.counter || 'OPD-01'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Registration</Text>
          <Text style={styles.subtitle}>
            Module 5: Scan & Share. We are reusing your existing ABHA identity for this express registration.
          </Text>
        </View>

        {/* Existing ABHA Identity Section - Display Only */}
        <View style={[styles.abhaCard, SHADOWS.sm]}>
           <View style={styles.cardIndicator} />
           <View style={styles.cardHeader}>
              <View style={styles.idBadge}>
                 <Activity size={16} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>EXISTING ABHA IDENTITY</Text>
           </View>

           <View style={styles.idsGrid}>
              <View style={styles.idItem}>
                 <Fingerprint size={18} color={COLORS.primary} />
                 <View>
                    <Text style={styles.idLabel}>ABHA NUMBER</Text>
                    <Text style={styles.idValue}>{form.abhaNumber}</Text>
                 </View>
              </View>
              <View style={styles.idItem}>
                 <AtSign size={18} color={COLORS.primary} />
                 <View>
                    <Text style={styles.idLabel}>ABHA ADDRESS</Text>
                    <Text style={styles.idValue}>{form.abhaAddress}</Text>
                 </View>
              </View>
           </View>
           
           <View style={styles.infoNote}>
              <ShieldCheck size={14} color={COLORS.success} />
              <Text style={styles.infoNoteText}>Pre-authenticated via ABDM V3 Vault</Text>
           </View>
        </View>

        {/* Demographic Details for Review */}
        <View style={styles.sectionHeader}>
           <Users size={18} color={COLORS.secondary} />
           <Text style={styles.sectionTitle}>Profile Details</Text>
        </View>

        <View style={styles.detailsList}>
           <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>FULL NAME</Text>
              <Text style={styles.detailText}>{form.fullName}</Text>
           </View>
           
           <View style={styles.detailRow}>
              <View style={[styles.detailItem, { flex: 1 }]}>
                 <Text style={styles.detailLabel}>GENDER</Text>
                 <Text style={styles.detailText}>{form.gender}</Text>
              </View>
              <View style={[styles.detailItem, { flex: 1 }]}>
                 <Text style={styles.detailLabel}>AGE</Text>
                 <Text style={styles.detailText}>{form.age} Years</Text>
              </View>
           </View>

           <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>MOBILE</Text>
              <Text style={styles.detailText}>{form.mobile}</Text>
           </View>

           <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ADDRESS</Text>
              <Text style={styles.detailText}>{form.address || 'H-24, Sector 15, New Delhi'}</Text>
           </View>
        </View>

        <View style={styles.privacyBanner}>
            <Lock size={14} color={COLORS.textMuted} />
            <Text style={styles.privacyText}>
                No new ABHA details are being created. We are securely transmitting your stored profile to the Hospital HMIS.
            </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.shareBtn, SHADOWS.md]} onPress={handleConfirm}>
          <Text style={styles.shareBtnText}>Share & Get Token</Text>
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
  hospitalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  hName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  hLoc: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  counterBadge: {
    backgroundColor: 'rgba(43, 103, 246, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginTop: 8,
    fontWeight: '500',
  },
  abhaCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(43, 103, 246, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  idBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  idsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  idItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  idValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    padding: 10,
    borderRadius: 12,
  },
  infoNoteText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  detailsList: {
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderRadius: 20,
    padding: 4,
    gap: 2,
    marginBottom: 32,
  },
  detailItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 2,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  privacyBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    marginBottom: 40,
    opacity: 0.6,
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: ROUNDING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },
});

export default ProfileShareScreen;
