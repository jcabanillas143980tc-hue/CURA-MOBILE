import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';
import { bookAppointment } from '../../api/appointments';

const QUICK_REASONS = ['Routine check-up', 'Medication refill', 'Follow-up visit', 'New symptoms'];

export default function ConfirmBookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId, date, time } = route.params ?? {};
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onConfirm = async () => {
    setSubmitting(true);
    try {
      const result = await bookAppointment({ doctor_id: doctorId, date, time, reason });
      navigation.navigate('AllSet', { appointmentId: result?.id ?? 'preview' });
    } catch {
      navigation.navigate('AllSet', { appointmentId: 'preview' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>STEP 3 OF 4</Text>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={styles.progressRow}>
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
          <View style={styles.seg} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <Text style={styles.aptLabel}>Booking Summary</Text>
          <View style={styles.docRow}>
            <View style={styles.avatarMd}><Text style={styles.avatarMdText}>DR</Text></View>
            <View>
              <Text style={styles.docName}>{doctorId ?? 'Dr. Elena Markov'}</Text>
              <Text style={styles.docSpec}>General Practice</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.sumRow}>
            <Text style={styles.k}>📅 Date</Text>
            <Text style={styles.v}>{date ?? 'August 7, 2026'}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.k}>🕐 Time</Text>
            <Text style={styles.v}>{time ?? '10:30 AM'}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.k}>📍 Type</Text>
            <Text style={styles.v}>In-person visit</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reason for Visit</Text>
        <Text style={styles.sectionSub}>Briefly describe your symptoms or why you need to see the doctor.</Text>
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={4}
          placeholder="e.g. Persistent headache for 3 days, mild fever…"
          placeholderTextColor={colors.muted}
          value={reason}
          onChangeText={setReason}
        />

        <Text style={styles.quickLabel}>Quick select</Text>
        <View style={styles.quickRow}>
          {QUICK_REASONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.quickBtn, reason === r && styles.quickBtnActive]}
              onPress={() => setReason(r)}
            >
              <Text style={[styles.quickBtnText, reason === r && styles.quickBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>ℹ️ Your information is private and shared only with your doctor.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={onConfirm} disabled={submitting}>
          <Text style={styles.continueBtnText}>
            {submitting ? 'Booking...' : 'Confirm Appointment →'}
          </Text>
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
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  aptLabel: { color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: spacing.sm },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatarMd: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700', fontSize: 12 },
  docName: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  docSpec: { color: colors.muted, fontSize: 12 },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  k: { color: colors.muted, fontSize: 13 },
  v: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginTop: spacing.lg },
  sectionSub: { color: colors.muted, fontSize: 12, marginTop: 2, marginBottom: spacing.sm },
  textarea: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md, minHeight: 90, textAlignVertical: 'top',
    color: colors.ink, fontSize: 13,
  },
  quickLabel: { color: colors.muted, fontSize: 12, fontWeight: '600', marginTop: spacing.md, marginBottom: spacing.sm },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  quickBtnActive: { backgroundColor: colors.blueMid, borderColor: colors.blueMid },
  quickBtnText: { color: colors.ink, fontSize: 12.5, fontWeight: '600' },
  quickBtnTextActive: { color: '#fff' },
  notice: { backgroundColor: colors.homeHeaderBg, borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.md },
  noticeText: { color: colors.muted, fontSize: 12 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, padding: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  continueBtn: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});