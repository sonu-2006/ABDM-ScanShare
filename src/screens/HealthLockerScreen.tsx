import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { FileX, ArrowLeft, Stethoscope, ChevronRight } from 'lucide-react-native';
import { getVisits, getActiveProfile } from '../utils/storage';
import { Visit } from '../types';

const HealthLockerScreen = ({ navigation }: any) => {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const active = await getActiveProfile();
      const history = await getVisits();

      // Filter visits for the active user exactly like the home screen
      const userHistory = history.filter(v =>
        (active?.abhaNumber && v.abhaNumber === active.abhaNumber) ||
        (v.patientName === active?.fullName)
      );

      setVisits(userHistory);
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    loadData();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Full Hospital History</Text>
        <View style={{ width: 32 }} />
      </View>

      {visits.length === 0 ? (
        <View style={styles.content}>
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <FileX size={60} color={COLORS.textMuted} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>No Records Found</Text>
            <Text style={styles.subtitle}>
              Your generated tokens will appear here once you visit a hospital.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
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
                 <Text style={styles.tokenLabel}>Token</Text>
                 <Text style={styles.tokenNumber}>{visit.tokenNumber}</Text>
               </View>
             </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  visitCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(43, 103, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  visitMain: {
    flex: 1,
  },
  hospitalText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  visitMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tokenBadge: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  tokenNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
});

export default HealthLockerScreen;
