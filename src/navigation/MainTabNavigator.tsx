import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import QueueScreen from '../screens/Queue/QueueScreen';
import RecordsScreen from '../screens/Records/RecordsScreen';
import PrescriptionsScreen from '../screens/Prescriptions/PrescriptionsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { colors } from '../constants/colors';

// Bottom tabs. Notifications (screen-notifications) opens from the bell
// icon on Home rather than living in the tab bar, matching the mockup.
export type MainTabParamList = {
  Home: undefined; Queue: undefined; Records: undefined; Prescriptions: undefined; Profile: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blueMid,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} />
      <Tab.Screen name="Records" component={RecordsScreen} />
      <Tab.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
