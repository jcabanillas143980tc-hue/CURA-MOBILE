import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import RecordsScreen from '../screens/Records/RecordsScreen';
import PrescriptionsScreen from '../screens/Prescriptions/PrescriptionsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { colors } from '../constants/colors';

export type MainTabParamList = {
  Home: undefined;
  Book: undefined;
  Records: undefined;
  Medicine: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();

function BookPlaceholder() {
  return null;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blueMid,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('BookingFlow');
          },
        })}
      />
      <Tab.Screen
        name="Records"
        component={RecordsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Medicine"
        component={PrescriptionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}