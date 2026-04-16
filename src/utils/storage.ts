import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Visit } from '../types';

const PROFILES_KEY = '@user_profiles_list';
const ACTIVE_PROFILE_ID_KEY = '@active_profile_id';

// Profiles Management
export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const existing = await getProfiles();
    const index = existing.findIndex(p => p.id === profile.id);
    let updated;
    if (index >= 0) {
        updated = [...existing];
        updated[index] = profile;
    } else {
        updated = [...existing, profile];
    }
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    await setActiveProfile(profile.id);
  } catch (e) {
    console.error('Error saving profile', e);
  }
};

export const deleteProfile = async (id: string): Promise<void> => {
  try {
    const existing = await getProfiles();
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    
    // Clean up associated data
    await AsyncStorage.removeItem(`@visits_${id}`);
    
    // If we deleted the active profile, reset active ID
    const activeId = await getActiveProfileId();
    if (activeId === id) {
        await AsyncStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
    }
  } catch (e) {
    console.error('Error deleting profile', e);
  }
};

export const getProfiles = async (): Promise<UserProfile[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PROFILES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting profiles', e);
    return [];
  }
};

export const setActiveProfile = async (id: string): Promise<void> => {
    await AsyncStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
};

export const getActiveProfileId = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(ACTIVE_PROFILE_ID_KEY);
};

export const getActiveProfile = async (): Promise<UserProfile | null> => {
    const profiles = await getProfiles();
    const activeId = await getActiveProfileId();
    if (!activeId && profiles.length > 0) return profiles[0];
    return profiles.find(p => p.id === activeId) || (profiles.length > 0 ? profiles[0] : null);
};

// Visits History (Keyed by User ID)
export const saveVisit = async (visit: Visit): Promise<void> => {
    try {
        const activeId = await getActiveProfileId();
        if (!activeId) return;
        
        const key = `@visits_${activeId}`;
        const existing = await getVisitsByProfile(activeId);
        const updated = [visit, ...existing];
        await AsyncStorage.setItem(key, JSON.stringify(updated.slice(0, 15)));
    } catch (e) {
        console.error('Error saving visit', e);
    }
};

export const getVisits = async (): Promise<Visit[]> => {
    const activeId = await getActiveProfileId();
    if (!activeId) return [];
    return getVisitsByProfile(activeId);
};

export const getVisitsByProfile = async (profileId: string): Promise<Visit[]> => {
    try {
        const key = `@visits_${profileId}`;
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error getting visits', e);
        return [];
    }
};

export const clearAll = async (): Promise<void> => {
  try {
    const profiles = await getProfiles();
    for (const p of profiles) {
        await AsyncStorage.removeItem(`@visits_${p.id}`);
    }
    await AsyncStorage.removeItem(PROFILES_KEY);
    await AsyncStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
  } catch (e) {
    console.error('Error clearing storage', e);
  }
};
