import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { getProfiles, getActiveProfile, clearAll } from './src/utils/storage';
import { UserProfile } from './src/types';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from './src/constants/Theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<any>('ProfileSetup');

  useEffect(() => {
    async function init() {
      try {
        // await clearAll(); // Data wipe disabled to allow profile persistence
        const allProfiles = await getProfiles();
        const active = await getActiveProfile();
        
        if (allProfiles.length === 0) {
            setInitialRoute('ProfileSetup');
        } else {
            // Always go to SelectProfile if we have users, to allow "Logging in"
            setInitialRoute('SelectProfile');
        }
      } catch (e) {
        setInitialRoute('ProfileSetup');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
}
