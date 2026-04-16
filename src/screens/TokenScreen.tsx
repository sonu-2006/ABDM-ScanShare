import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { CheckCircle2, Calendar, Clock, ArrowLeft, Download, ShieldCheck, Building2, Ticket, ChevronRight } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { saveVisit, getActiveProfile } from '../utils/storage';
import { Visit } from '../types';

const TokenScreen = ({ navigation, route }: any) => {
  const { hospital } = route.params;
  const [downloading, setDownloading] = useState(false);
  
  const [tokenNumber] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [queueStatus] = useState("4 people ahead");
  const [dateStr] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [timeStr] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Save the visit to history on mount
  useEffect(() => {
    const recordVisit = async () => {
        const active = await getActiveProfile();
        
        const newVisit: Visit = {
            id: Date.now().toString(),
            hospitalName: hospital.name || 'Apollo Hospital',
            location: hospital.location || 'Greams Road, Chennai',
            date: dateStr,
            time: timeStr,
            tokenNumber: tokenNumber,
            type: 'OPD Registration',
            status: 'Completed',
            abhaNumber: active?.abhaNumber,
            patientName: active?.fullName,
            counterId: hospital.counter || 'GENERAL'
        };
        await saveVisit(newVisit);
    };
    recordVisit();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; color: #111827; background-color: #F9FAFB;">
            <div style="text-align: center; border: 1px solid #e5e7eb; padding: 50px; border-radius: 40px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              <h1 style="color: #2B67F6; margin-bottom: 5px; font-size: 36px; font-weight: 900;">ScanToken</h1>
              <p style="color: #6b7280; margin-bottom: 40px; font-size: 16px;">Verified OPD Registration Token</p>
              
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #6b7280; font-weight: 800; margin-top: 20px;">Patient Queue ID</div>
              <div style="font-size: 96px; font-weight: 900; color: #111827; margin: 30px 0; letter-spacing: -2px;">#${tokenNumber}</div>
              
              <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; text-align: left; margin-top: 40px; border: 1px solid #f1f5f9;">
                <p style="margin: 8px 0; font-size: 15px;"><span style="color: #6b7280;">HOSPITAL:</span> <strong style="color: #2B67F6;">${hospital.name}</strong></p>
                <p style="margin: 8px 0; font-size: 15px;"><span style="color: #6b7280;">LOCATION:</span> <strong>${hospital.location}</strong></p>
                <p style="margin: 8px 0; font-size: 15px;"><span style="color: #6b7280;">TIMESTAMP:</span> <strong>${dateStr} | ${timeStr}</strong></p>
                <p style="margin: 8px 0; font-size: 15px;"><span style="color: #6b7280;">STATUS:</span> <strong style="color: #10B981;">CONNECTED</strong></p>
              </div>
              
              <div style="margin-top: 50px; padding: 18px; background: rgba(16, 185, 129, 0.05); border-radius: 15px; color: #10B981; font-size: 14px; font-weight: 800; text-align: center; border: 1px solid rgba(16, 185, 129, 0.1);">
                Ayushman Bharat Digital Mission Verified
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Could not generate download.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBanner}>
           <ShieldCheck size={18} color={COLORS.success} />
           <Text style={styles.topBannerText}>SESSION VERIFIED</Text>
        </View>

        <View style={styles.intro}>
           <View style={[styles.checkCircle, SHADOWS.sm]}>
              <CheckCircle2 size={56} color={COLORS.success} />
           </View>
           <Text style={styles.introTitle}>Success!</Text>
           <Text style={styles.introSub}>Your profile is securely shared with {hospital.name}</Text>
        </View>

        {/* Minimalist Ticket */}
        <View style={[styles.ticket, SHADOWS.md]}>
           <View style={styles.ticketTop}>
              <View style={styles.ticketBranding}>
                 <Ticket size={24} color={COLORS.primary} />
                 <Text style={styles.ticketBrandLabel}>OPD REGISTRATION TOKEN</Text>
              </View>
              <Text style={styles.tokenVal}>#{tokenNumber}</Text>
              <View style={styles.queuePill}>
                 <Text style={styles.queueText}>{queueStatus.toUpperCase()}</Text>
              </View>
           </View>
           
           <View style={styles.dividerBox}>
              <View style={styles.dotLeft} />
              <View style={styles.dashLine} />
              <View style={styles.dotRight} />
           </View>
           
           <View style={styles.ticketBottom}>
              <View style={styles.infoMeta}>
                 <View style={styles.metaItem}>
                    <Calendar size={18} color={COLORS.textMuted} />
                    <View>
                        <Text style={styles.metaLabel}>VISIT DATE</Text>
                        <Text style={styles.metaVal}>{dateStr}</Text>
                    </View>
                 </View>
                 <View style={styles.metaItem}>
                    <Clock size={18} color={COLORS.textMuted} />
                    <View>
                        <Text style={styles.metaLabel}>TIME</Text>
                        <Text style={styles.metaVal}>{timeStr}</Text>
                    </View>
                 </View>
              </View>
              
              <View style={styles.hospitalRow}>
                 <View style={styles.hospitalIcon}>
                    <Building2 size={24} color={COLORS.primary} />
                 </View>
                 <View style={{ flex: 1 }}>
                    <Text style={styles.hospitalLabel}>HOSPITAL UNIT</Text>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalLoc}>{hospital.location}</Text>
                 </View>
              </View>
           </View>
        </View>

        <TouchableOpacity 
          style={[styles.downloadPill, SHADOWS.sm]} 
          onPress={handleDownload}
          disabled={downloading}
        >
            {downloading ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <>
                <View style={[styles.dlIcon, { backgroundColor: 'rgba(43, 103, 246, 0.05)' }]}>
                    <Download size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.downloadLabel}>Download Digital Receipt</Text>
              </>
            )}
        </TouchableOpacity>

        <View style={styles.complianceRow}>
           <ShieldCheck size={14} color={COLORS.textMuted} />
           <Text style={styles.complianceText}>Authenticated via ABDM Digital Network</Text>
        </View>
      </ScrollView>

      <View style={styles.footerNav}>
        <TouchableOpacity 
          style={[styles.homeBtn, SHADOWS.md]}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.homeBtnText}>Done</Text>
          <ChevronRight size={22} color="#fff" />
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
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 10,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  topBannerText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.success,
    letterSpacing: 1.5,
  },
  intro: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 6,
  },
  introSub: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 22,
    fontWeight: '500',
  },
  ticket: {
    backgroundColor: '#fff',
    borderRadius: 36,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  ticketTop: {
    padding: SPACING.xl,
    alignItems: 'center',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  ticketBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ticketBrandLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2.5,
  },
  tokenVal: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -3,
    marginVertical: 4,
  },
  queuePill: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 10,
  },
  queueText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.warning,
    letterSpacing: 1,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
  },
  dotLeft: {
    width: 24,
    height: 48,
    backgroundColor: COLORS.background,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginLeft: -1,
  },
  dotRight: {
    width: 24,
    height: 48,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    marginRight: -1,
  },
  dashLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  ticketBottom: {
    padding: SPACING.xl,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  infoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  metaVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  hospitalIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  hospitalLoc: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  downloadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
  },
  dlIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 18,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 36,
    paddingBottom: 20,
    opacity: 0.6,
  },
  complianceText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  footerNav: {
    padding: SPACING.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  homeBtn: {
    backgroundColor: COLORS.secondary,
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
});

export default TokenScreen;
