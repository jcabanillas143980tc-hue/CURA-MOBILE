import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { colors, spacing, radius } from '../../constants/colors';

type Condition = {
  id: string;
  icon: string;
  iconBg: string;
  name: string;
  meta: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  tabletsLeft: number;
  tabletsTotal: number;
  progressColor: string;
  refillNote: string;
  medName: string;
  medDose: string;
  prescribedBy: string;
  duration: string;
  nextCheckup: string;
  howToTake: string;
  doseTime: string;
};

const CONDITIONS: Condition[] = [
  {
    id: '1',
    icon: '❤️',
    iconBg: colors.redBg,
    name: 'High Blood Pressure',
    meta: '1 medication · Managed since Jan 2026',
    badge: 'Ongoing',
    badgeColor: colors.blueMid,
    badgeBg: '#F0F4FF',
    tabletsLeft: 62,
    tabletsTotal: 90,
    progressColor: colors.blueMid,
    refillNote: 'Next refill in ~9 days',
    medName: 'Lisinopril',
    medDose: '5 mg · Once daily — 8:00 AM',
    prescribedBy: 'Dr. James Osei',
    duration: 'Ongoing · Lifelong',
    nextCheckup: 'Sep 12, 2026 — review BP control',
    howToTake: '1 tablet, once a day at 8:00 AM, after breakfast. Taking it with food helps prevent dizziness. Avoid taking at night.',
    doseTime: '8:00 AM · 5 mg',
  },
  {
    id: '2',
    icon: '🩸',
    iconBg: colors.amberBg,
    name: 'Iron Deficiency Anemia',
    meta: '1 medication · Managed since Nov 2025',
    badge: 'Fixed Course',
    badgeColor: colors.blueMid,
    badgeBg: '#F0F4FF',
    tabletsLeft: 44,
    tabletsTotal: 60,
    progressColor: colors.amber,
    refillNote: '16 days remaining',
    medName: 'Ferrous Sulfate',
    medDose: '325 mg · Once daily — 12:00 PM',
    prescribedBy: 'Dr. Priya Nair',
    duration: '60-day course',
    nextCheckup: 'Sep 20, 2026 — recheck iron levels',
    howToTake: '1 tablet, once a day with lunch. Take with vitamin C-rich food to improve absorption. Avoid taking with dairy or coffee.',
    doseTime: '12:00 PM · 325 mg',
  },
];

export default function PrescriptionsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [takenIds, setTakenIds] = useState<Record<string, boolean>>({});
  const [reminderOn, setReminderOn] = useState<Record<string, boolean>>({ '1': true, '2': true });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prescriptions</Text>
        <Text style={styles.headerSub}>{CONDITIONS.length} conditions managed</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {CONDITIONS.map((c) => {
          const isOpen = expandedId === c.id;
          const taken = !!takenIds[c.id];
          const pct = Math.round((c.tabletsLeft / c.tabletsTotal) * 100);

          return (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => setExpandedId(isOpen ? null : c.id)}
              activeOpacity={0.8}
            >
              <View style={styles.rxHead}>
                <View style={[styles.medIcon, { backgroundColor: c.iconBg }]}>
                  <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.n1}>{c.name}</Text>
                  <Text style={styles.s1}>{c.meta}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: c.badgeBg }]}>
                  <Text style={[styles.pillText, { color: c.badgeColor }]}>{c.badge}</Text>
                </View>
              </View>

              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: c.progressColor }]} />
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>{c.tabletsLeft}/{c.tabletsTotal} tablets left</Text>
                <Text style={styles.progressText}>{c.refillNote}</Text>
              </View>

              {isOpen && (
                <View style={styles.extra}>
                  <Text style={styles.infoTitle}>Prescribed Medication</Text>
                  <View style={styles.medRow}>
                    <View style={styles.medIconSm}><Text>💊</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.n1}>{c.medName}</Text>
                      <Text style={styles.s1}>{c.medDose}</Text>
                    </View>
                  </View>

                  <View style={styles.detailGrid}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailKey}>Prescribed by</Text>
                      <Text style={styles.detailVal}>{c.prescribedBy}</Text>
                    </View>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailKey}>Duration</Text>
                      <Text style={styles.detailVal}>{c.duration}</Text>
                    </View>
                    <View style={[styles.detailBox, { width: '100%' }]}>
                      <Text style={styles.detailKey}>Next Check-up</Text>
                      <Text style={styles.detailVal}>{c.nextCheckup}</Text>
                    </View>
                  </View>

                  <View style={styles.noteBox}>
                    <Text style={{ fontSize: 16 }}>🍽️</Text>
                    <Text style={styles.noteText}>
                      <Text style={{ fontWeight: '700' }}>How to take: </Text>
                      {c.howToTake}
                    </Text>
                  </View>

                  <View style={styles.takenRow}>
                    <View>
                      <Text style={[styles.doseStatus, taken && styles.doseStatusDone]}>
                        {taken ? 'Taken ✓' : 'Reminder scheduled'}
                      </Text>
                      <Text style={styles.l1}>Today's Dose</Text>
                      <Text style={styles.l2}>{c.doseTime}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.takenBtn, taken && styles.takenBtnDone]}
                      onPress={(e) => {
                        e.stopPropagation();
                        setTakenIds((prev) => ({ ...prev, [c.id]: !prev[c.id] }));
                      }}
                    >
                      <Text style={[styles.takenBtnText, taken && { color: '#fff' }]}>
                        {taken ? 'Taken' : 'Mark as Taken'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.switchRow}>
                    <View>
                      <Text style={styles.l1}>Daily Reminder</Text>
                      <Text style={styles.l2}>Get notified at dose time</Text>
                    </View>
                    <Switch
                      value={!!reminderOn[c.id]}
                      onValueChange={(v) => setReminderOn((prev) => ({ ...prev, [c.id]: v }))}
                      trackColor={{ true: colors.blueMid, false: colors.border }}
                    />
                  </View>

                  <TouchableOpacity style={styles.outlineBtn} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.outlineBtnText}>📅 View Calendar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 2 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.cardBorder,
  },
  rxHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  medIcon: {
    width: 40, height: 40, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  medIconSm: {
    width: 36, height: 36, borderRadius: radius.sm, backgroundColor: '#E1F7F3',
    alignItems: 'center', justifyContent: 'center',
  },
  n1: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  s1: { color: colors.muted, fontSize: 12 },
  pill: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  pillText: { fontSize: 11, fontWeight: '700' },
  progressBg: { height: 8, borderRadius: 4, backgroundColor: colors.insetBg, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressText: { color: colors.muted, fontSize: 11 },
  extra: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.insetBg },
  infoTitle: { color: colors.ink, fontWeight: '700', fontSize: 13, marginBottom: spacing.sm },
  medRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.insetBg, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm,
  },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  detailBox: { width: '47%', backgroundColor: colors.insetBg, borderRadius: radius.sm, padding: spacing.sm },
  detailKey: { color: colors.muted, fontSize: 10 },
  detailVal: { color: colors.ink, fontWeight: '600', fontSize: 12, marginTop: 2 },
  noteBox: {
    flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.amberBg,
    borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.sm,
  },
  noteText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 17 },
  takenRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.md,
  },
  doseStatus: { color: colors.amber, fontSize: 11, fontWeight: '700' },
  doseStatusDone: { color: colors.green },
  l1: { color: colors.ink, fontWeight: '600', fontSize: 13, marginTop: 2 },
  l2: { color: colors.muted, fontSize: 12 },
  takenBtn: {
    borderWidth: 1, borderColor: colors.blueMid, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  takenBtnDone: { backgroundColor: colors.green, borderColor: colors.green },
  takenBtnText: { color: colors.blueMid, fontWeight: '600', fontSize: 12 },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.insetBg,
  },
  outlineBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.md,
  },
  outlineBtnText: { color: colors.ink, fontWeight: '600', fontSize: 13 },
});