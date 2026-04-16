import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { COLORS, SPACING, ROUNDING, SHADOWS } from '../constants/Theme';
import { UserProfile } from '../types';
import { saveProfile, getProfiles } from '../utils/storage';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clipboard, 
  ChevronDown, 
  ShieldCheck,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Fingerprint,
  AtSign,
  AlertCircle
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const ProfileSetupScreen = ({ navigation, route }: any) => {
  const isAddingMember = route.params?.mode === 'add';
  
  const [profile, setProfile] = useState<UserProfile>({
    id: Date.now().toString(),
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    mobile: '',
    pincode: '',
    state: '',
    district: '',
    address: '',
    abhaNumber: '',
    abhaAddress: '',
  });

  const [errors, setErrors] = useState({
    abhaNumber: '',
    abhaAddress: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));

  const formatAbhaNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 14);
    
    let formatted = limited;
    if (limited.length > 10) {
      formatted = `${limited.slice(0, 2)}-${limited.slice(2, 6)}-${limited.slice(6, 10)}-${limited.slice(10, 14)}`;
    } else if (limited.length > 6) {
      formatted = `${limited.slice(0, 2)}-${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}-${limited.slice(2)}`;
    }
    return formatted;
  };

  const validateAbhaNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 0 && cleaned.length < 14) {
      setErrors(prev => ({ ...prev, abhaNumber: `Enter ${14 - cleaned.length} more digits` }));
    } else {
      setErrors(prev => ({ ...prev, abhaNumber: '' }));
    }
  };

  const validateAbhaAddress = (text: string) => {
    const abhaAddrRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (text.length > 0 && !abhaAddrRegex.test(text)) {
      setErrors(prev => ({ ...prev, abhaAddress: 'Format: username@domain (e.g. name@abdm)' }));
    } else {
      setErrors(prev => ({ ...prev, abhaAddress: '' }));
    }
  };

  const handleSave = async () => {
    if (!profile.fullName || !profile.mobile || !profile.pincode) {
      Alert.alert('Required Fields', 'Please complete the Name, Mobile, and Pincode sections.');
      return;
    }

    const abhaCleaned = (profile.abhaNumber || '').replace(/\D/g, '');
    if (abhaCleaned && abhaCleaned.length !== 14) {
      Alert.alert('Incomplete ABHA', `Your ABHA Number currently has ${abhaCleaned.length} digits. It must be exactly 14 digits.`);
      return;
    }

    const abhaAddrRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (profile.abhaAddress && !abhaAddrRegex.test(profile.abhaAddress)) {
      Alert.alert('Invalid ABHA Address', 'Please use the correct format (e.g. name@abdm).');
      return;
    }

    // Check for Duplicates (Name or ABHA Number)
    const allProfiles = await getProfiles();
    
    const isDuplicateName = allProfiles.find(p => p.fullName.toLowerCase() === profile.fullName.toLowerCase() && p.id !== profile.id);
    if (isDuplicateName) {
        Alert.alert('Duplicate Identity', `A profile named "${profile.fullName}" already exists. Please use a unique name for this family member.`);
        return;
    }

    if (abhaCleaned) {
        const isDuplicateAbha = allProfiles.find(p => (p.abhaNumber || '').replace(/\D/g, '') === abhaCleaned && p.id !== profile.id);
        if (isDuplicateAbha) {
            Alert.alert('Duplicate ABHA', 'This ABHA Number is already registered in another profile on this device.');
            return;
        }
    }

    if (profile.abhaAddress) {
        const isDuplicateAddress = allProfiles.find(p => (p.abhaAddress || '').toLowerCase() === profile.abhaAddress?.toLowerCase() && p.id !== profile.id);
        if (isDuplicateAddress) {
            Alert.alert('Duplicate Handle', `The ABHA address "${profile.abhaAddress}" is already in use by another profile.`);
            return;
        }
    }

    await saveProfile(profile);
    navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { profile } }],
    });
  };

  const updateField = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAbhaNumberChange = (text: string) => {
    const formatted = formatAbhaNumber(text);
    updateField('abhaNumber', formatted);
    validateAbhaNumber(formatted);
  };

  const handleAbhaAddressChange = (text: string) => {
    const lower = text.toLowerCase();
    updateField('abhaAddress', lower);
    validateAbhaAddress(lower);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, 'dd-MM-yyyy');
      updateField('dateOfBirth', formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            {isAddingMember && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.secondary} />
                </TouchableOpacity>
            )}
          </View>

          <View style={styles.header}>
             <View style={styles.headerIcon}>
                <User size={30} color={COLORS.primary} />
             </View>
             <Text style={styles.title}>{isAddingMember ? 'Family Member' : 'My Health ID'}</Text>
             <Text style={styles.subtitle}> Establish your secure clinical persona for ABDM V3 Scan & Share. </Text>
          </View>

          {/* ABHA / Digital ID Section */}
          <View style={[styles.card, SHADOWS.sm, { borderColor: errors.abhaNumber || errors.abhaAddress ? '#EF4444' : 'rgba(43, 103, 246, 0.2)', borderWidth: 1 }]}>
            <View style={styles.cardHeader}>
               <ShieldCheck size={18} color={COLORS.primary} />
               <Text style={[styles.cardTitle, { color: COLORS.primary }]}>ABDM Digital Identity</Text>
            </View>

            <View style={styles.formGroup}>
                <View style={styles.innerField}>
                    <Text style={styles.label}>ABHA NUMBER (14 DIGITS)</Text>
                    <View style={[styles.inputContainer, errors.abhaNumber ? styles.inputError : null]}>
                        <Fingerprint size={18} color={errors.abhaNumber ? '#EF4444' : COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="XX-XXXX-XXXX-XXXX"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="number-pad"
                            maxLength={17}
                            value={profile.abhaNumber}
                            onChangeText={handleAbhaNumberChange}
                        />
                    </View>
                    {errors.abhaNumber ? (
                        <View style={styles.errorRow}>
                            <AlertCircle size={12} color="#EF4444" />
                            <Text style={styles.errorText}>{errors.abhaNumber}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.innerField}>
                    <Text style={styles.label}>ABHA ADDRESS (PHR ID)</Text>
                    <View style={[styles.inputContainer, errors.abhaAddress ? styles.inputError : null]}>
                        <AtSign size={18} color={errors.abhaAddress ? '#EF4444' : COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="example@abdm"
                            autoCapitalize="none"
                            placeholderTextColor={COLORS.textMuted}
                            value={profile.abhaAddress}
                            onChangeText={handleAbhaAddressChange}
                        />
                    </View>
                    {errors.abhaAddress ? (
                        <View style={styles.errorRow}>
                            <AlertCircle size={12} color="#EF4444" />
                            <Text style={styles.errorText}>{errors.abhaAddress}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
          </View>

          {/* Identity Section */}
          <View style={[styles.card, SHADOWS.sm]}>
            <View style={styles.cardHeader}>
               <CheckCircle size={18} color={COLORS.primary} />
               <Text style={styles.cardTitle}>Personal Particulars</Text>
            </View>

            <View style={styles.formGroup}>
                <View style={styles.innerField}>
                    <Text style={styles.label}>LEGAL FULL NAME</Text>
                    <View style={styles.inputContainer}>
                        <User size={18} color={COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="As per Government ID"
                            placeholderTextColor={COLORS.textMuted}
                            value={profile.fullName}
                            onChangeText={(text) => updateField('fullName', text)}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.innerField, { flex: 1.2 }]}>
                        <Text style={styles.label}>DATE OF BIRTH</Text>
                        <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                            <Calendar size={18} color={COLORS.textMuted} />
                            <Text style={[styles.inputVal, !profile.dateOfBirth && { color: COLORS.textMuted }]}>
                                {profile.dateOfBirth || "DD-MM-YYYY"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.innerField, { flex: 0.8 }]}>
                        <Text style={styles.label}>GENDER</Text>
                        <View style={styles.genderPicker}>
                            {['M', 'F', 'O'].map((g) => (
                                <TouchableOpacity 
                                    key={g} 
                                    style={[styles.genderBtn, profile.gender[0] === g && styles.genderBtnActive]} 
                                    onPress={() => updateField('gender', g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other')}
                                >
                                    <Text style={[styles.genderBtnText, profile.gender[0] === g && styles.genderBtnTextActive]}>{g}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
          </View>

          {/* Contact Section */}
          <View style={[styles.card, SHADOWS.sm]}>
             <View style={styles.cardHeader}>
                <Smartphone size={18} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Communications</Text>
             </View>

             <View style={styles.formGroup}>
                <View style={styles.innerField}>
                    <Text style={styles.label}>MOBILE NUMBER</Text>
                    <View style={styles.inputContainer}>
                        <Phone size={18} color={COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="10-digit primary mobile"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={profile.mobile}
                            onChangeText={(text) => updateField('mobile', text)}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.innerField, { flex: 1 }]}>
                        <Text style={styles.label}>PINCODE</Text>
                        <View style={styles.inputContainer}>
                            <MapPin size={18} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="6-digit"
                                placeholderTextColor={COLORS.textMuted}
                                keyboardType="number-pad"
                                maxLength={6}
                                value={profile.pincode}
                                onChangeText={(text) => updateField('pincode', text)}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.innerField}>
                    <Text style={styles.label}>PERMANENT RESIDENCE</Text>
                    <View style={[styles.inputContainer, { height: 70, alignItems: 'flex-start', paddingTop: 12 }]}>
                        <Clipboard size={18} color={COLORS.textMuted} />
                        <TextInput
                            style={[styles.input, { height: '100%' }]}
                            placeholder="House No, Street, Landmark"
                            placeholderTextColor={COLORS.textMuted}
                            multiline
                            value={profile.address}
                            onChangeText={(text) => updateField('address', text)}
                        />
                    </View>
                </View>
             </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity 
            style={[styles.saveBtn, SHADOWS.md, (errors.abhaNumber || errors.abhaAddress) && styles.saveBtnDisabled]} 
            onPress={handleSave}
            disabled={!!(errors.abhaNumber || errors.abhaAddress)}
          >
            <Text style={styles.saveBtnText}>{isAddingMember ? 'Register Member' : 'Save Health ID'}</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.footerShield}>
             <ShieldCheck size={14} color={COLORS.textMuted} />
             <Text style={styles.footerShieldText}>Ayushman Bharat Digital Mission Verified</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  topHeader: {
    height: 40,
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: 10,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: ROUNDING.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  formGroup: {
    gap: SPACING.lg,
  },
  innerField: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  inputVal: {
    flex: 1,
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  genderPicker: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 5,
    height: 56,
    gap: 5,
  },
  genderBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  genderBtnActive: {
    backgroundColor: COLORS.primary,
  },
  genderBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textMuted,
  },
  genderBtnTextActive: {
    color: '#fff',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: ROUNDING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: SPACING.xl,
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  footerShield: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    marginBottom: 40,
    opacity: 0.6,
  },
  footerShieldText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

export default ProfileSetupScreen;
