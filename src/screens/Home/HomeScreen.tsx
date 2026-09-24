import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

type Med = { id: string; name: string; sub: string; iconBg: string; taken: boolean };

const INITIAL_MEDS: Med[] = [
  { id: '1', name: 'Lisinopril', sub: '5 mg · 8:00 AM', iconBg: '#E1F7F3', taken: false },
  { id: '2', name: 'Ferrous Sulfate', sub: '325 mg · 8:00 AM', iconBg: colors.amberBg, taken: false },
  { id: '3', name: 'Phenylephrine HCl', sub: '10 mg · 8:00 AM', iconBg: '#DCEBFF', taken: false },
];

const QUICK_ACTIONS = [
  { label: 'Book Appointment', icon: 'calendar', bg: colors.greenBg, color: colors.green, action: 'BookingFlow' },
  { label: 'Chat with Clinic', icon: 'message-circle', bg: '#DBEAFE', color: '#2563EB', action: null },
  { label: 'Prescriptions', icon: 'file-text', bg: colors.purpleBg, color: colors.purple, action: 'Medicine' },
  { label: 'Health Summary', icon: 'activity', bg: colors.amberBg, color: colors.amber, action: 'Records' },
] as const;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [meds, setMeds] = useState(INITIAL_MEDS);

  const toggleMed = (id: string) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <View style={[styles.blob, styles.blobTeal]} />
        <View style={[styles.blob, styles.blobMint]} />
        <View style={[styles.blob, styles.blobPurple]} />

        <View style={styles.greetRow}>
          <View>
            <Text style={styles.greetSub}>Good morning,</Text>
            <Text style={styles.greetName}>Sarah Johnson 👋</Text>
            <Text style={styles.greetDate}>Monday, Aug 7 · Next dose in 2h 15m</Text>
          </View>
          <View style={styles.greetIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
              <Feather name="bell" size={16} color={colors.blueMid} />
              <View style={styles.dotBadge} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatarSm}><Text style={styles.avatarSmText}>SJ</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Queue')}>
          <View style={styles.aptTop}>
            <Text style={styles.aptLabel}>Upcoming Appointment</Text>
            <View style={styles.pillGreen}>
              <Feather name="check" size={11} color={colors.green} />
              <Text style={styles.pillGreenText}>Confirmed</Text>
            </View>
          </View>
          <View style={styles.aptDocRow}>
            <View style={styles.avatarMd}><Text style={styles.avatarMdText}>EM</Text></View>
            <View>
              <Text style={styles.docName}>Dr. Elena Markov</Text>
              <Text style={styles.docSpec}>General Practitioner</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.aptMetaRow}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Text style={styles.aptMetaText}>📅 <Text style={styles.bold}>Mon, Aug 7, 2026</Text></Text>
              <Text style={styles.aptMetaText}>🕐 <Text style={styles.bold}>10:30 AM</Text></Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.muted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.queueBand} onPress={() => navigation.navigate('Queue')}>
          <Text style={styles.queueNum}>3</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.queueTitle}>Queue Position</Text>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.queueSub}>You're #3 — estimated wait ~18 min</Text>
          </View>
          <Feather name="activity" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medicine')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {meds.map((med, i) => (
            <View key={med.id}>
              <View style={styles.medRow}>
                <View style={styles.medLeft}>
                  <View style={[styles.medIcon, { backgroundColor: med.iconBg }]}>
                    <Text>💊</Text>
                  </View>
                  <View>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medSub}>{med.sub}</Text>
                  </View>
                </View>
                <View style={styles.medRight}>
                  <TouchableOpacity
                    style={[styles.takenBadge, med.taken && styles.takenBadgeDone]}
                    onPress={() => toggleMed(med.id)}
                  >
                    <Text style={[styles.takenBadgeText, med.taken && styles.takenBadgeTextDone]}>
                      {med.taken ? '1/1 taken' : '0/1 taken'}
                    </Text>
                  </TouchableOpacity>
                  <Feather name="chevron-right" size={15} color={colors.muted} />
                </View>
              </View>
              {i < meds.length - 1 && <View style={styles.hrLight} />}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.qaGrid}>
          {QUICK_ACTIONS.map((qa) => (
            <TouchableOpacity
              key={qa.label}
              style={styles.qaCard}
              onPress={() => qa.action && navigation.navigate(qa.action)}
            >
              <View style={[styles.qaIcon, { backgroundColor: qa.bg }]}>
                <Feather name={qa.icon as any} size={20} color={qa.color} />
              </View>
              <Text style={styles.qaLabel}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.homeHeaderBg,
    paddingTop: spacing.xl + spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  blob: { position: 'absolute', width: 220, height: 220, borderRadius: 110, opacity: 0.35 },
  blobTeal: { backgroundColor: '#3DD9C4', top: -80, left: -40 },
  blobMint: { backgroundColor: '#8FF0DD', top: 20, left: 120 },
  blobPurple: { backgroundColor: '#B9A9F5', top: -60, right: -60 },
  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetSub: { color: colors.homeHeaderSub, fontSize: 13 },
  greetName: { color: colors.ink, fontSize: 20, fontWeight: '700', marginTop: 2 },
  greetDate: { color: colors.homeHeaderSub, fontSize: 12, marginTop: 4 },
  greetIcons: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.pill, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  dotBadge: {
    position: 'absolute', top: 6, right: 8, width: 7, height: 7,
    borderRadius: 4, backgroundColor: colors.red,
  },
  avatarSm: {
    width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSmText: { color: colors.blueMid, fontWeight: '700', fontSize: 13 },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  aptTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aptLabel: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  pillGreen: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.greenBg, paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: radius.pill,
  },
  pillGreenText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  aptDocRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  avatarMd: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700' },
  docName: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  docSpec: { color: colors.muted, fontSize: 12 },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  hrLight: { height: 1, backgroundColor: colors.insetBg, marginVertical: spacing.sm },
  aptMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aptMetaText: { color: colors.ink, fontSize: 13 },
  bold: { fontWeight: '700' },
  queueBand: {
    backgroundColor: colors.blueMid, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  queueNum: { color: '#fff', fontSize: 28, fontWeight: '800', width: 40, textAlign: 'center' },
  queueTitle: { color: '#fff', fontWeight: '700', fontSize: 13 },
  queueSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7CFFB2' },
  sectionTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.sm,
  },
  sectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginTop: spacing.sm },
  seeAll: { color: colors.blueMid, fontSize: 13, fontWeight: '600' },
  medRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  medLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  medIcon: {
    width: 36, height: 36, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  medName: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  medSub: { color: colors.muted, fontSize: 12 },
  medRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  takenBadge: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
  },
  takenBadgeDone: { backgroundColor: colors.greenBg, borderColor: colors.greenBg },
  takenBadgeText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  takenBadgeTextDone: { color: colors.green },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  qaCard: {
    width: '47.5%', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, alignItems: 'flex-start', borderWidth: 1, borderColor: colors.cardBorder,
  },
  qaIcon: {
    width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  qaLabel: { color: colors.ink, fontWeight: '600', fontSize: 13 },
});