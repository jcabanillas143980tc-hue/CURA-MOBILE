import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUpcomingAppointment } from '../../api/appointments';
import { colors, spacing, radius } from '../../constants/colors';

// Mirrors: id="screen-home" — homeAptCard, homeAptStatus, homeQueueBand,
// homeMedBadge1-3, bellDot (notification indicator)
export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    getUpcomingAppointment().then(setAppointment).catch(() => setAppointment(null));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Appointment</Text>
        <Text style={styles.cardBody}>
          {appointment ? `${appointment.doctor_name} — ${appointment.date} ${appointment.time}` : 'No upcoming appointment'}
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('BookingFlow')}>
        <Text style={styles.primaryButtonText}>Book an Appointment</Text>
      </TouchableOpacity>

      {/* TODO: symptom-checker entry point, medication badges (homeMedBadge1-3) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.homeHeaderBg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.ink },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.md },
  cardTitle: { fontWeight: '600', color: colors.ink, marginBottom: spacing.xs },
  cardBody: { color: colors.muted },
  primaryButton: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  primaryButtonText: { color: colors.surface, fontWeight: '600' },
});
