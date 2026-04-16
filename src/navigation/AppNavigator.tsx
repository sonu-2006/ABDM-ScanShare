import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import HospitalDetailsScreen from '../screens/HospitalDetailsScreen';
import ProfileShareScreen from '../screens/ProfileShareScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import TokenScreen from '../screens/TokenScreen';
import HealthLockerScreen from '../screens/HealthLockerScreen';
import InstructionScreen from '../screens/InstructionScreen';
import ProfileSelectionScreen from '../screens/ProfileSelectionScreen';
import { COLORS } from '../constants/Theme';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = ({ initialRoute }: { initialRoute: keyof RootStackParamList }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: COLORS.text,
        },
        headerTintColor: COLORS.primary,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="ProfileSetup" 
        component={ProfileSetupScreen} 
        options={{ title: 'My Profile', headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'ScanToken', headerShown: false }}
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HospitalDetails" 
        component={HospitalDetailsScreen} 
        options={{ title: 'Verification' }}
      />
      <Stack.Screen 
        name="FinalProfileShare" 
        component={ProfileShareScreen} 
        options={{ title: 'Share Profile' }}
      />
      <Stack.Screen 
        name="Processing" 
        component={ProcessingScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Token" 
        component={TokenScreen} 
        options={{ title: 'Registration Token', headerLeft: () => null }}
      />
      <Stack.Screen 
        name="HealthLocker" 
        component={HealthLockerScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Instructions" 
        component={InstructionScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SelectProfile" 
        component={ProfileSelectionScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
