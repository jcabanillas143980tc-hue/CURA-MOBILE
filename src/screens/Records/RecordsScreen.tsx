import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../constants/colors';
import { getMedicalRecords } from '../../api/records';

// Mirrors: id="screen-records" — search-box, recordsTimeline (expandable
// rec-card items with doctor notes, vitals, prescribed medication)

type Vital = { label: string; value: string };
type MedicalRecord = {
  id: string;
  title: string;
  doctor_name: string;
  date: string;
  status: 'Completed' | 'Pending';
  notes: string;
  vitals: Vital[];
  medication: string | null;
};

const FALLBACK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    title: 'Annual Wellness Check',
    doctor_name: 'Dr. Elena Markov',
    date: 'Jul 14, 2026',
    status: 'Completed',
    notes: 'Patient in excellent health. Blood pressure and glucose levels within normal range. Recommended continued exercise and balanced diet. No medications required.',
    vitals: [
      { label: 'Blood Pressure', value: '118/76' },
      { label: 'Pulse', value: '72 bpm' },
      { label: 'Oxygen Level', value: '98%' },
    ],
    medication: null,
  },
  {
    id: '2',
    title: 'Mild Hypertension',
    doctor_name: 'Dr. James Osei',
    date: 'May 3, 2026',
    status: 'Completed',
    notes: 'Blood pressure reading elevated at 138/89. Prescribed Lisinopril 5mg once daily. Advised to reduce sodium intake and monitor readings at home weekly. Follow-up in 4 weeks.',
    vitals: [
      { label: 'Blood Pressure', value: '138/89' },
      { label: 'Pulse', value: '78 bpm' },
      { label: 'Oxygen Level', value: '97%' },
    ],
    medication: 'Lisinopril 5mg — once daily',
  },
];

export default function RecordsScreen() {
  const [records, setRecords] = useState<MedicalRecord[]>(FALLBACK_RECORDS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMedicalRecords().then(setRecords).catch(() => {
      // No backend yet — keep the fallback preview records.
    });
  }, []);

  const filtered = records.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Records</Text>
        <Text style={styles.headerSub}>{records.length} records on file</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={{ color: colors.muted }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search records, diagnoses…"
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {filtered.map((record, i) => {
          const isOpen = expandedId === record.id;
          return (
            <View key={record.id} style={styles.timelineItem}>
              <View style={styles.timelineDotCol}>
                <View style={[styles.tdot, i === 0 && styles.tdotActive]} />
                {i < filtered.length - 1 && <View style={styles.tline} />}
              </View>

              <TouchableOpacity
                style={styles.recCard}
                onPress={() => setExpandedId(isOpen ? null : record.id)}
                activeOpacity={0.8}
              >
                <View style={styles.recTop}>
                  <View style={styles.avatarMd}>
                    <Text style={styles.avatarMdText}>
                      {record.doctor_name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recTitle}>{record.title}</Text>
                    <Text style={styles.recDoc}>{record.doctor_name} · {record.date}</Text>
                  </View>
                  <View style={styles.pillGreen}>
                    <Text style={styles.pillGreenText}>{record.status}</Text>
                  </View>
                </View>

                {isOpen && (
                  <View style={styles.recNotes}>
                    <Text style={styles.notesLabel}>DOCTOR NOTES</Text>
                    <Text style={styles.notesText}>{record.notes}</Text>

                    <Text style={[styles.notesLabel, { marginTop: spacing.md }]}>VITALS</Text>
                    <View style={styles.vitalsGrid}>
                      {record.vitals.map((v) => (
                        <View key={v.label} style={styles.vitalBox}>
                          <Text style={styles.vitalKey}>{v.label}</Text>
                          <Text style={styles.vitalVal}>{v.value}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={[styles.notesLabel, { marginTop: spacing.md }]}>PRESCRIBED MEDICATION</Text>
                    <Text style={styles.notesText}>
                      {record.medication ?? 'No medication prescribed for this visit.'}
                    </Text>

                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>🖹 Prescription</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>↗ Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <Text style={{ textAlign: 'center', color: colors.muted, marginTop: spacing.xl }}>
            No records match your search.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 2 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginTop: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 14 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  timelineItem: { flexDirection: 'row', gap: spacing.sm },
  timelineDotCol: { alignItems: 'center', width: 16 },
  tdot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border, marginTop: 6 },
  tdotActive: { backgroundColor: colors.blueMid },
  tline: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4 },
  recCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.cardBorder,
  },
  recTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarMd: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700', fontSize: 12 },
  recTitle: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  recDoc: { color: colors.muted, fontSize: 12 },
  pillGreen: { backgroundColor: colors.greenBg, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  pillGreenText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  recNotes: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.insetBg },
  notesLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  notesText: { color: colors.ink, fontSize: 13, marginTop: 4, lineHeight: 19 },
  vitalsGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  vitalBox: { flex: 1, backgroundColor: colors.insetBg, borderRadius: radius.sm, padding: spacing.sm },
  vitalKey: { color: colors.muted, fontSize: 10 },
  vitalVal: { color: colors.ink, fontWeight: '700', fontSize: 13, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, alignItems: 'center',
  },
  actionBtnText: { color: colors.blueMid, fontWeight: '600', fontSize: 12 },
});