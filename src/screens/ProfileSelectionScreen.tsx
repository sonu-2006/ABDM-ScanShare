import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image, Alert } from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { getProfiles, setActiveProfile, deleteProfile } from '../utils/storage';
import { UserProfile } from '../types';
import { UserPlus, ChevronRight, CheckCircle2, ShieldCheck, Activity, Trash2 } from 'lucide-react-native';

const ProfileSelectionScreen = ({ navigation }: any) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  const load = async () => {
    const all = await getProfiles();
    setProfiles(all);
    
    // If all profiles were deleted, go to setup
    if (all.length === 0) {
        navigation.replace('ProfileSetup');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSelect = async (profile: UserProfile) => {
    await setActiveProfile(profile.id);
    navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { profile } }],
    });
  };

  const handleDelete = (profile: UserProfile) => {
    Alert.alert(
        'Delete Profile',
        `Are you sure you want to remove ${profile.fullName}? All their hospital history will be permanently deleted.`,
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Delete', 
                style: 'destructive', 
                onPress: async () => {
                    await deleteProfile(profile.id);
                    load();
                } 
            }
        ]
    );
  };

  const handleAddMember = () => {
    navigation.navigate('ProfileSetup', { mode: 'add' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
         <View style={styles.branding}>
            <View style={styles.logoBox}><Activity size={20} color="#fff" /></View>
            <Text style={styles.brandTitle}>ScanToken</Text>
         </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
           <Text style={styles.title}>Who's registering?</Text>
           <Text style={styles.subtitle}>Select a health profile to manage their separate hospital records and digital tokens.</Text>
        </View>

        <View style={styles.profileList}>
            {profiles.map((p) => (
              <View key={p.id} style={[styles.profileCard, SHADOWS.sm]}>
                 <TouchableOpacity 
                    style={styles.profileMainAction}
                    onPress={() => handleSelect(p)}
                 >
                    <View style={styles.avatarBox}>
                        <Text style={styles.avatarText}>{p.fullName[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                       <Text style={styles.profileName}>{p.fullName}</Text>
                       <Text style={styles.profileMeta}>{p.mobile} • {p.gender}</Text>
                    </View>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    style={styles.deleteIconBox} 
                    onPress={() => handleDelete(p)}
                 >
                    <Trash2 size={20} color="#EF4444" />
                 </TouchableOpacity>
              </View>
            ))}

           <TouchableOpacity style={[styles.addBtn, SHADOWS.sm]} onPress={handleAddMember}>
              <View style={styles.addIconBox}>
                 <UserPlus size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.addText}>Add Family Member</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.infoBanner}>
           <ShieldCheck size={18} color={COLORS.success} />
           <Text style={styles.infoText}>Each account maintains individual data isolation & ABDM history.</Text>
        </View>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  titleSection: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    fontWeight: '500',
  },
  profileList: {
    gap: 12,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row', // Keep for the container
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileMainAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 8,
  },
  deleteIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    marginRight: 8,
  },
  avatarBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  profileMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(43, 103, 246, 0.3)',
    marginTop: 10,
  },
  addIconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(43, 103, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    padding: 20,
    borderRadius: 20,
    marginTop: 60,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default ProfileSelectionScreen;
