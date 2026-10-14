import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/colors';

type QueueEntry = {
  label: string;
  sub: string;
  status: 'active' | 'waiting' | 'you';
};

const FALLBACK_POSITION = 3;
const FALLBACK_TOTAL = 5;
const FALLBACK_WAIT = 18;
const FALLBACK_AHEAD = 2;

const FALLBACK_LIST: QueueEntry[] = [
  { label: 'Patient A', sub: 'In consultation', status: 'active' },
  { label: 'Patient B', sub: '~8 min', status: 'waiting' },
  { label: 'You', sub: '~18 min', status: 'you' },
  { label: 'Patient D', sub: '~28 min', status: 'waiting' },
  { label: 'Patient E', sub: '~35 min', status: 'waiting' },
];

const CANCEL_REASONS = [
  'Schedule conflict',
  'Feeling better or no longer needed',
  'Prefer a different doctor',
  'Personal emergency',
  'Other',
];

const RESCHEDULE_DATES = [
  { label: 'Sat', day: '8' },
  { label: 'Sun', day: '9' },
  { label: 'Mon', day: '10' },
  { label: 'Tue', day: '11' },
  { label: 'Wed', day: '12' },
  { label: 'Thu', day: '13' },
  { label: 'Fri', day: '14' },
];

const RESCHEDULE_SLOTS = [
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '1:00 PM', available: true },
  { time: '1:30 PM', available: true },
  { time: '2:00 PM', available: false },
  { time: '2:30 PM', available: true },
];

export default function QueueScreen() {
  const navigation = useNavigation<any>();

  const [confidence] = useState(87); // TODO: wire to real AI confidence score
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>('10');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const predictedArrival = new Date(Date.now() + FALLBACK_WAIT * 60 * 1000);
  const predictedArrivalLabel = predictedArrival.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const confirmCancel = () => {
    setCancelModalVisible(false);
    setSelectedReason(null);
    // TODO: call cancelAppointment() API once backend exists
  };

  const confirmReschedule = () => {
    setRescheduleModalVisible(false);
    setSelectedSlot(null);
    // TODO: call rescheduleAppointment() API once backend exists
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
               {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Queue Tracker</Text>
          </View>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Updated 3s ago</Text>
          </View>
        </View>

        {/* Position card */}
        <View style={styles.positionCard}>
          <Text style={styles.positionLabel}>Your Position</Text>
          <Text style={styles.positionNumber}>#{FALLBACK_POSITION}</Text>
        </View>

        {/* Predicted Doctor Arrival */}
        <View style={styles.predictCard}>
          <View style={styles.predictIconWrap}>
            <Feather name="clock" size={18} color={colors.blueMid} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.predictLabel}>PREDICTED DOCTOR ARRIVAL</Text>
            <Text style={styles.predictTime}>{predictedArrivalLabel}</Text>
            <Text style={styles.predictSub}>Based on current consultation pace</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{confidence}%</Text>
          </View>
        </View>

        {/* Stat row */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{FALLBACK_WAIT} min</Text>
            <Text style={styles.statLabel}>Estimated Wait</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{FALLBACK_AHEAD}</Text>
            <Text style={styles.statLabel}>Ahead of You</Text>
          </View>
        </View>

        {/* Notify toggle banner */}
        <View style={styles.notifyBanner}>
          <View style={styles.notifyLeft}>
            <Text style={styles.notifyIcon}>🔔</Text>
            <Text style={styles.notifyText}>Notify me 5 min before my turn</Text>
          </View>
          <Switch
            value={notifyEnabled}
            onValueChange={setNotifyEnabled}
            trackColor={{ false: colors.border, true: colors.blueLight }}
            thumbColor={notifyEnabled ? colors.blueMid : '#fff'}
          />
        </View>

        {/* Queue Progress */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Queue Progress</Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(FALLBACK_POSITION / FALLBACK_TOTAL) * 100}%` },
              ]}
            />
          </View>

          {FALLBACK_LIST.map((entry, idx) => (
            <View
              key={idx}
              style={[
                styles.queueRow,
                entry.status === 'you' && styles.queueRowYou,
              ]}
            >
              <View
                style={[
                  styles.queueDot,
                  entry.status === 'active' && styles.queueDotActive,
                  entry.status === 'you' && styles.queueDotYou,
                ]}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.queueName,
                    entry.status === 'you' && styles.queueNameYou,
                  ]}
                >
                  {entry.label}
                </Text>
                <Text style={styles.queueSub}>{entry.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Your Appointment */}
        <View style={styles.sectionCard}>
          <View style={styles.apptHeaderRow}>
            <Text style={styles.sectionTitle}>Your Appointment</Text>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedPillText}>Confirmed</Text>
            </View>
          </View>

          <Text style={styles.doctorName}>Dr. Elena Markov</Text>
          <Text style={styles.doctorSpecialty}>General Practitioner</Text>

          <View style={styles.apptDetailRow}>
            <Text style={styles.apptDetailLabel}>Appointment Type</Text>
            <Text style={styles.apptDetailValue}>General Check-up</Text>
          </View>
          <View style={styles.apptDetailRow}>
            <Text style={styles.apptDetailLabel}>Clinic</Text>
            <Text style={styles.apptDetailValue}>Leonardia Clinic</Text>
          </View>

          <View style={styles.apptActionRow}>
            <TouchableOpacity
              style={styles.rescheduleBtn}
              onPress={() => setRescheduleModalVisible(true)}
            >
              <Feather name="calendar" size={16} color={colors.blueMid} />
              <Text style={styles.rescheduleBtnText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setCancelModalVisible(true)}
            >
              <Feather name="x-circle" size={16} color={colors.red} />
              <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Cancel Appointment Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCancelModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            <Text style={styles.modalSubtitle}>
              Please tell us why you're cancelling
            </Text>

            {CANCEL_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonRow}
                onPress={() => setSelectedReason(reason)}
              >
                <View
                  style={[
                    styles.radioOuter,
                    selectedReason === reason && styles.radioOuterSelected,
                  ]}
                >
                  {selectedReason === reason && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.confirmCancelBtn,
                !selectedReason && styles.btnDisabled,
              ]}
              disabled={!selectedReason}
              onPress={confirmCancel}
            >
              <Text style={styles.confirmCancelBtnText}>Confirm Cancellation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keepBtn}
              onPress={() => setCancelModalVisible(false)}
            >
              <Text style={styles.keepBtnText}>Keep Appointment</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Reschedule Appointment Modal */}
      <Modal
        visible={rescheduleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRescheduleModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>
            <Text style={styles.modalSubtitle}>Select a new date</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateStrip}
            >
              {RESCHEDULE_DATES.map((d) => (
                <TouchableOpacity
                  key={d.day}
                  style={[
                    styles.dateChip,
                    selectedDate === d.day && styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDate(d.day)}
                >
                  <Text
                    style={[
                      styles.dateChipDay,
                      selectedDate === d.day && styles.dateChipTextSelected,
                    ]}
                  >
                    {d.label}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipNum,
                      selectedDate === d.day && styles.dateChipTextSelected,
                    ]}
                  >
                    {d.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalSubtitle}>Available Time Slots</Text>
            <View style={styles.slotGrid}>
              {RESCHEDULE_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  disabled={!slot.available}
                  style={[
                    styles.slotChip,
                    !slot.available && styles.slotChipDisabled,
                    selectedSlot === slot.time && styles.slotChipSelected,
                  ]}
                  onPress={() => setSelectedSlot(slot.time)}
                >
                  <Text
                    style={[
                      styles.slotChipText,
                      !slot.available && styles.slotChipTextDisabled,
                      selectedSlot === slot.time && styles.slotChipTextSelected,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, !selectedSlot && styles.btnDisabled]}
              disabled={!selectedSlot}
              onPress={confirmReschedule}
            >
              <Text style={styles.confirmBtnText}>Confirm New Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keepBtn}
              onPress={() => setRescheduleModalVisible(false)}
            >
              <Text style={styles.keepBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
    backBtn: { marginRight: spacing.sm },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.ink },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  liveText: { fontSize: 12, color: colors.muted },

  positionCard: {
    backgroundColor: colors.blueDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  positionLabel: { color: '#DFF5F1', fontSize: 13, marginBottom: 4 },
  positionNumber: { color: '#fff', fontSize: 40, fontWeight: '800' },

  predictCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  predictIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueLight + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictLabel: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  predictTime: { fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 2 },
  predictSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  confidenceBadge: {
    backgroundColor: colors.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  confidenceText: { fontSize: 12, fontWeight: '700', color: colors.green },

  statRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.ink },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },

  notifyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blueLight + '1A',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.blueLight + '55',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notifyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  notifyIcon: { fontSize: 16 },
  notifyText: { fontSize: 13, fontWeight: '600', color: colors.ink, flexShrink: 1 },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: { height: '100%', backgroundColor: colors.blueMid, borderRadius: 4 },

  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: spacing.sm,
  },
  queueRowYou: {
    backgroundColor: colors.blueLight + '1A',
    borderRadius: radius.md,
    paddingHorizontal: 8,
  },
  queueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  queueDotActive: { backgroundColor: colors.amber },
  queueDotYou: { backgroundColor: colors.blueMid },
  queueName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  queueNameYou: { color: colors.blueDark },
  queueSub: { fontSize: 12, color: colors.muted },

  apptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedPill: {
    backgroundColor: colors.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  confirmedPillText: { fontSize: 12, fontWeight: '700', color: colors.green },

  doctorName: { fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: spacing.xs },
  doctorSpecialty: { fontSize: 13, color: colors.muted, marginBottom: spacing.sm },

  apptDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  apptDetailLabel: { fontSize: 13, color: colors.muted },
  apptDetailValue: { fontSize: 13, fontWeight: '600', color: colors.ink },

  apptActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
     rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.blueMid,
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blueMid,
    textAlign: 'center',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.red,
    textAlign: 'center',
    flexShrink: 1,
  },

  // Modal shared
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: colors.muted, marginBottom: spacing.sm, marginTop: spacing.sm },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: colors.blueMid },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blueMid,
  },
  reasonText: { fontSize: 14, color: colors.ink },

  confirmCancelBtn: {
    backgroundColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  confirmCancelBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  keepBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  keepBtnText: { color: colors.muted, fontWeight: '600', fontSize: 14 },

  dateStrip: { marginBottom: spacing.sm },
  dateChip: {
    width: 56,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  dateChipSelected: { backgroundColor: colors.blueMid, borderColor: colors.blueMid },
  dateChipDay: { fontSize: 11, color: colors.muted },
  dateChipNum: { fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 2 },
  dateChipTextSelected: { color: '#fff' },

  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotChipSelected: { backgroundColor: colors.blueMid, borderColor: colors.blueMid },
  slotChipDisabled: { backgroundColor: colors.bg, borderColor: colors.border },
  slotChipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  slotChipTextSelected: { color: '#fff' },
  slotChipTextDisabled: { color: colors.muted, textDecorationLine: 'line-through' },

  confirmBtn: {
    backgroundColor: colors.blueMid,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  btnDisabled: { opacity: 0.4 },
});