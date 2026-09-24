import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

type Specialty = { key: string; name: string; icon: string; count: number };
type Doctor = { name: string; spec: string; rating: number; wait: number; specialty: string };

const SPECIALTIES: Specialty[] = [
  { key: 'consultations', name: 'Medical Consultations & Check-ups', icon: '🩺', count: 7 },
  { key: 'dental', name: 'Dental Services', icon: '🦷', count: 2 },
  { key: 'lab', name: 'Laboratory & Testing', icon: '🧪', count: 2 },
  { key: 'maternal', name: 'Maternal & Child Health', icon: '🍼', count: 2 },
  { key: 'vaccination', name: 'Vaccinations & Immunizations', icon: '💉', count: 4 },
];

const DOCTORS: Doctor[] = [
  { specialty: 'consultations', name: 'Dr. Elena Markov', spec: 'General Consultation', rating: 4.9, wait: 15 },
  { specialty: 'consultations', name: 'Dr. Rachel Kim', spec: 'General Consultation', rating: 4.8, wait: 20 },
  { specialty: 'consultations', name: 'Dr. Miguel Santos', spec: 'General Consultation', rating: 4.6, wait: 25 },
  { specialty: 'consultations', name: 'Dr. James Osei', spec: 'Health Check-up', rating: 4.8, wait: 40 },
  { specialty: 'consultations', name: 'Dr. Priya Nair', spec: 'Health Check-up', rating: 4.7, wait: 10 },
  { specialty: 'consultations', name: 'Dr. Ahmed Hassan', spec: 'Health Check-up', rating: 4.9, wait: 12 },
  { specialty: 'consultations', name: 'Dr. Laura Chen', spec: 'Health Check-up', rating: 4.6, wait: 30 },
  { specialty: 'dental', name: 'Dr. Daniel Cruz', spec: 'Dentist', rating: 4.5, wait: 22 },
  { specialty: 'dental', name: 'Dr. Nina Alvarez', spec: 'Dentist', rating: 4.8, wait: 8 },
  { specialty: 'lab', name: 'Dr. Sofia Reyes', spec: 'Laboratory Technologist', rating: 4.9, wait: 18 },
  { specialty: 'lab', name: 'Dr. Tomas Villanueva', spec: 'Laboratory Technologist', rating: 4.7, wait: 35 },
  { specialty: 'maternal', name: 'Dr. Grace Lim', spec: 'OB-GYN', rating: 4.9, wait: 20 },
  { specialty: 'maternal', name: 'Dr. Marcus Webb', spec: 'Pediatrician', rating: 4.6, wait: 45 },
  { specialty: 'vaccination', name: 'Dr. Carlos Mendoza', spec: 'Immunization Nurse', rating: 4.8, wait: 14 },
  { specialty: 'vaccination', name: 'Dr. Emily Park', spec: 'Immunization Nurse', rating: 4.7, wait: 26 },
  { specialty: 'vaccination', name: 'Dr. Victor Diaz', spec: 'Immunization Nurse', rating: 4.5, wait: 33 },
  { specialty: 'vaccination', name: 'Dr. Hannah Cole', spec: 'Immunization Nurse', rating: 4.9, wait: 9 },
];

export default function DoctorSelectScreen() {
  const navigation = useNavigation<any>();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const filteredDoctors = specialty ? DOCTORS.filter((d) => d.specialty === specialty.key) : [];

  const onContinue = () => {
    if (selectedDoctor) {
      navigation.navigate('DateTimeSelect', { doctorId: selectedDoctor });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {specialty && (
          <TouchableOpacity style={styles.backCircle} onPress={() => { setSpecialty(null); setSelectedDoctor(null); }}>
            <Feather name="chevron-left" size={16} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
        <Text style={styles.headerTitle}>{specialty ? 'Choose a Doctor' : 'Select Specialty'}</Text>
        <View style={styles.progressRow}>
          <View style={[styles.seg, styles.segDone]} />
          <View style={styles.seg} />
          <View style={styles.seg} />
          <View style={styles.seg} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {!specialty ? (
          <>
            <Text style={styles.sectionTitle}>What kind of doctor do you need?</Text>
            {SPECIALTIES.map((s) => (
              <TouchableOpacity key={s.key} style={styles.specCard} onPress={() => setSpecialty(s)}>
                <View style={styles.specIconCircle}><Text style={{ fontSize: 20 }}>{s.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specName}>{s.name}</Text>
                  <Text style={styles.specCount}>{s.count} available</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => { setSpecialty(null); setSelectedDoctor(null); }}>
              <Text style={styles.linkBack}>‹ Change Specialty</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{specialty.name}</Text>
            {filteredDoctors.map((d) => {
              const isSelected = selectedDoctor === d.name;
              return (
                <TouchableOpacity
                  key={d.name}
                  style={[styles.docCard, isSelected && styles.docCardSelected]}
                  onPress={() => setSelectedDoctor(d.name)}
                >
                  <View style={styles.avatarMd}>
                    <Text style={styles.avatarMdText}>
                      {d.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{d.name}</Text>
                    <Text style={styles.docSpec}>{d.spec}</Text>
                    <Text style={styles.docMeta}>⭐ {d.rating} · Wait ~{d.wait} min</Text>
                  </View>
                  <View style={styles.pillGreen}><Text style={styles.pillGreenText}>Available</Text></View>
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Feather name="check" size={12} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {specialty && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !selectedDoctor && styles.continueBtnDisabled]}
            disabled={!selectedDoctor}
            onPress={onContinue}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  sectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginBottom: spacing.md },
  specCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder,
  },
  specIconCircle: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: colors.homeHeaderBg,
    alignItems: 'center', justifyContent: 'center',
  },
  specName: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  specCount: { color: colors.muted, fontSize: 12 },
  linkBack: { color: colors.blueMid, fontWeight: '600', fontSize: 13, marginBottom: spacing.md },
  docCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1.5, borderColor: colors.cardBorder,
  },
  docCardSelected: { borderColor: colors.blueMid, backgroundColor: colors.homeHeaderBg },
  avatarMd: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700', fontSize: 12 },
  docName: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  docSpec: { color: colors.muted, fontSize: 12 },
  docMeta: { color: colors.muted, fontSize: 11, marginTop: 2 },
  pillGreen: { backgroundColor: colors.greenBg, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  pillGreenText: { color: colors.green, fontSize: 10, fontWeight: '700' },
  checkCircle: {
    position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.blueMid, alignItems: 'center', justifyContent: 'center',
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, padding: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  continueBtn: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  continueBtnDisabled: { backgroundColor: colors.border },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});