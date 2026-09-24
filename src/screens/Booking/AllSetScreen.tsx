import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

export default function AllSetScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP 4 OF 4</Text>
        <Text style={styles.headerTitle}>All Set!</Text>
        <View style={styles.progressRow}>
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
          <View style={[styles.seg, styles.segDone]} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.centerCol}>
          <View style={styles.checkBig}>
            <Feather name="check" size={30} color={colors.green} />
          </View>
          <Text style={styles.doneTitle}>Appointment Booked!</Text>
          <Text style={styles.doneSub}>
            Your visit has been confirmed. You'll receive a reminder 1 hour before.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.docRow}>
            <View style={styles.avatarMd}><Text style={styles.avatarMdText}>DR</Text></View>
            <View>
              <Text style={styles.docName}>Dr. Elena Markov</Text>
              <Text style={styles.docSpec}>General Practice</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.sumRow}>
            <Text style={styles.k}>Date</Text>
            <Text style={styles.v}>August 7, 2026</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.k}>Time</Text>
            <Text style={styles.v}>10:30 AM</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.k}>Status</Text>
            <View style={styles.pillGreen}><Text style={styles.pillGreenText}>Confirmed</Text></View>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.secondaryBtnText}>Book Another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Queue')}
          >
            <Text style={styles.primaryBtnText}>Track Queue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl },
  stepLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: spacing.md },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  segDone: { backgroundColor: '#fff' },
  body: { flex: 1, padding: spacing.lg },
  centerCol: { alignItems: 'center', marginTop: spacing.lg },
  checkBig: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.greenBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  doneTitle: { color: colors.ink, fontWeight: '800', fontSize: 19 },
  doneSub: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 6, paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder, marginTop: spacing.xl,
  },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatarMd: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700', fontSize: 12 },
  docName: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  docSpec: { color: colors.muted, fontSize: 12 },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  k: { color: colors.muted, fontSize: 13 },
  v: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  pillGreen: { backgroundColor: colors.greenBg, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  pillGreenText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  secondaryBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center',
  },
  secondaryBtnText: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  primaryBtn: { flex: 1, backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});