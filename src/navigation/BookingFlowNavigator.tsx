import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorSelectScreen from '../screens/Booking/DoctorSelectScreen';
import DateTimeSelectScreen from '../screens/Booking/DateTimeSelectScreen';
import ConfirmBookingScreen from '../screens/Booking/ConfirmBookingScreen';
import AllSetScreen from '../screens/Booking/AllSetScreen';

// Maps to screen-doctor -> screen-datetime -> screen-confirm -> screen-allset
export type BookingStackParamList = {
  DoctorSelect: undefined;
  DateTimeSelect: { doctorId: string };
  ConfirmBooking: { doctorId: string; date: string; time: string };
  AllSet: { appointmentId: string };
};
const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingFlowNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="DoctorSelect" component={DoctorSelectScreen} options={{ title: 'Choose Doctor' }} />
      <Stack.Screen name="DateTimeSelect" component={DateTimeSelectScreen} options={{ title: 'Pick Schedule' }} />
      <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} options={{ title: 'Confirm' }} />
      <Stack.Screen name="AllSet" component={AllSetScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
