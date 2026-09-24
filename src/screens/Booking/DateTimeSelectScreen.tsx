import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

const DAYS_IN_AUG_2026 = 31;
const AUG_2026_STARTS_ON = 6; // Saturday (0 = Sun)
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIME_SLOTS = [
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: true },
  { time: '3:30 PM', available: true },
  { time: '4:00 PM', available: true },
];

export default function DateTimeSelectScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId } = route.params ?? {};
  const [selectedDay, setSelectedDay] = useState(7);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('10:30 AM');

  const cells: (number | null)[] = [
    ...Array(AUG_2026_STARTS_ON).fill(null),
    ...Array.from({ length: DAYS_IN_AUG_2026 }, (_, i) => i + 1),
  ];

  const onContinue = () => {
    if (selectedSlot) {
      navigation.navigate('ConfirmBooking', {
        doctorId,
        date: `August ${selectedDay}, 2026`,
        time: selectedSlot,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>STEP 2 OF 4</Text>
        <Text style={styles.headerTitle}>Choose Date & Time</Text>
        <View style={styles.progressRow}>
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
          <View style={styles.seg} />
          <View style={styles.seg} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.calCard}>
          <View style={styles.calNav}>
            <Text style={styles.calNavArrow}>‹</Text>
            <Text style={styles.calMonth}>August 2026</Text>
            <Text style={styles.calNavArrow}>›</Text>
          </View>
          <View style={styles.calGrid}>
            {DOW.map((d) => (
              <Text key={d} style={styles.calDow}>{d}</Text>
            ))}
            {cells.map((day, i) => (
              <TouchableOpacity
                key={i}
                disabled={day === null}
                onPress={() => day && setSelectedDay(day)}
                style={[
                  styles.calDay,
                  day === null && styles.calDayDisabled,
                  day === selectedDay && styles.calDaySelected,
                ]}
              >
                {day !== null && (
                  <Text style={[styles.calDayText, day === selectedDay && styles.calDayTextSelected]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              disabled={!slot.available}
              onPress={() => setSelectedSlot(slot.time)}
              style={[
                styles.slot,
                !slot.available && styles.slotUnavailable,
                selectedSlot === slot.time && styles.slotSelected,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  !slot.available && styles.slotTextUnavailable,
                  selectedSlot === slot.time && styles.slotTextSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !selectedSlot && styles.continueBtnDisabled]}
          disabled={!selectedSlot}
          onPress={onContinue}
        >
          <Text style={styles.continueBtnText}>Continue to Confirm →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl },
  backCircle: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  stepLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: spacing.md },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  segDone: { backgroundColor: '#fff' },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  calCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  calNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  calNavArrow: { fontSize: 18, color: colors.muted, paddingHorizontal: spacing.sm },
  calMonth: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDow: { width: `${100 / 7}%`, textAlign: 'center', color: colors.muted, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  calDay: {
    width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.sm,
  },
  calDayDisabled: { opacity: 0.25 },
  calDaySelected: { backgroundColor: colors.blueMid },
  calDayText: { color: colors.ink, fontSize: 13 },
  calDayTextSelected: { color: '#fff', fontWeight: '700' },
  sectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginTop: spacing.lg, marginBottom: spacing.sm },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    width: '31%', paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  slotUnavailable: { backgroundColor: colors.insetBg, borderColor: colors.insetBg },
  slotSelected: { backgroundColor: colors.blueMid, borderColor: colors.blueMid },
  slotText: { color: colors.ink, fontSize: 12.5, fontWeight: '600' },
  slotTextUnavailable: { color: colors.muted, textDecorationLine: 'line-through' },
  slotTextSelected: { color: '#fff' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, padding: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  continueBtn: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  continueBtnDisabled: { backgroundColor: colors.border },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});