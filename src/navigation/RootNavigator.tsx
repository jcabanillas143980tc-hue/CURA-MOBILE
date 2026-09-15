import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import BookingFlowNavigator from './BookingFlowNavigator';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  BookingFlow: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // TODO: splash screen

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="BookingFlow" component={BookingFlowNavigator} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
