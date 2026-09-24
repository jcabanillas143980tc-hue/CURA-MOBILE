import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../constants/colors';
import { getQueueStatus } from '../../api/queue';

// Mirrors: id="screen-queue" — pos-card, stat-row, qprog-bar, plist-row list,
// queueAptCard (appointment details section at the bottom)

type QueueEntry = { label: string; sub: string; status: 'done' | 'active' | 'you' | 'waiting' };

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

export default function QueueScreen() {
  const [position, setPosition] = useState(FALLBACK_POSITION);
  const [wait, setWait] = useState(FALLBACK_WAIT);
  const [confidence, setConfidence] = useState(87);
  const [connectionLost, setConnectionLost] = useState(false);

  useEffect(() => {
    // No appointment id available in this preview build — swap in the real
    // upcoming appointment id once the backend/auth flow is wired up.
    getQueueStatus('current')
      .then((data) => {
        setPosition(data.position);
        setWait(data.estimated_wait_minutes);
        // TODO: once the AI service exposes a wait-time confidence score
        // alongside estimated_wait_minutes, read it from `data` here too.
        setConnectionLost(false);
      })
      .catch(() => setConnectionLost(true));
  }, []);

  const predictedArrival = new Date(Date.now() + wait * 60 * 1000);
  const predictedArrivalLabel = predictedArrival.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Queue Tracker</Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>Live · Updated 3s ago</Text>
        </View>
      </View>

      <View style={styles.body}>
        {connectionLost && (
          <View style={styles.connBanner}>
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Text style={styles.connBannerText}>
              Connection lost — showing last known queue position.
            </Text>
            <TouchableOpacity onPress={() => setConnectionLost(false)}>
              <Text style={styles.connRetry}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.posCard}>
          <Text style={styles.posLabel}>YOUR POSITION</Text>
          <Text style={styles.posNum}>#{position}</Text>
          <Text style={styles.posSub}>in line</Text>
        </View>

        <View style={styles.predictCard}>
          <View style={styles.predictLeft}>
            <Text style={{ fontSize: 20 }}>🩺</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.predictLabel}>PREDICTED DOCTOR ARRIVAL</Text>
            <Text style={styles.predictTime}>{predictedArrivalLabel}</Text>
            <Text style={styles.predictSub}>Based on current consultation pace</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{confidence}%</Text>
            <Text style={styles.confidenceLabel}>confidence</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={[styles.statBox, { backgroundColor: colors.amberBg }]}>
            <Text style={styles.statNum}>~{wait} min</Text>
            <Text style={styles.statLbl}>Estimated Wait</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.purpleBg }]}>
            <Text style={styles.statNum}>{FALLBACK_AHEAD} patients</Text>
            <Text style={styles.statLbl}>Ahead of You</Text>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Queue Progress</Text>
          <Text style={styles.sectionSub}>{position}/{FALLBACK_TOTAL} in queue</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(position / FALLBACK_TOTAL) * 100}%` }]} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          {FALLBACK_LIST.map((entry, i) => (
            <View
              key={i}
              style={[styles.plistRow, entry.status === 'you' && styles.plistRowYou]}
            >
              <View style={styles.plistLeft}>
                <View
                  style={[
                    styles.plistNum,
                    entry.status === 'active' && styles.plistNumActive,
                  ]}
                >
                  <Text style={styles.plistNumText}>
                    {entry.status === 'active' ? '✓' : `#${i + 1}`}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.plistName, entry.status === 'you' && { color: colors.blueMid }]}>
                    {entry.label}
                  </Text>
                  <Text style={[styles.plistSub, entry.status === 'active' && { color: colors.green }]}>
                    {entry.sub}
                  </Text>
                </View>
              </View>
              {entry.status === 'active' && (
                <View style={styles.pillGreen}><Text style={styles.pillGreenText}>Active</Text></View>
              )}
              {entry.status === 'you' && <View style={styles.liveDotSmall} />}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your Appointment</Text>
        <View style={styles.card}>
          <View style={styles.aptTopRow}>
            <View style={styles.avatarMd}><Text style={styles.avatarMdText}>EM</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>Dr. Elena Markov</Text>
              <Text style={styles.docSpec}>General Practitioner · Today, 10:30 AM</Text>
            </View>
            <View style={styles.pillGreen}><Text style={styles.pillGreenText}>Confirmed</Text></View>
          </View>
          <View style={styles.hr} />
          <View style={styles.extraRow}>
            <Text style={styles.extraKey}>Appointment Type</Text>
            <Text style={styles.extraVal}>In-person Consultation</Text>
          </View>
          <View style={styles.extraRow}>
            <Text style={styles.extraKey}>Clinic</Text>
            <Text style={styles.extraVal}>Leonardia Clinic</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7CFFB2' },
  liveDotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blueMid },
  liveLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  body: { padding: spacing.lg, gap: spacing.md },
  connBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.amberBg, borderRadius: radius.md, padding: spacing.sm,
  },
  connBannerText: { flex: 1, color: colors.amber, fontSize: 12 },
  connRetry: { color: colors.amber, fontWeight: '700', fontSize: 12 },
  posCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder,
  },
  posLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  posNum: { color: colors.blueDark, fontSize: 48, fontWeight: '800' },
  posSub: { color: colors.muted, fontSize: 13 },
  predictCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.homeHeaderBg, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  predictLeft: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  predictLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  predictTime: { color: colors.ink, fontWeight: '800', fontSize: 18, marginTop: 2 },
  predictSub: { color: colors.muted, fontSize: 11, marginTop: 1 },
  confidenceBadge: { alignItems: 'center' },
  confidenceText: { color: colors.blueMid, fontWeight: '800', fontSize: 15 },
  confidenceLabel: { color: colors.muted, fontSize: 9 },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  statBox: { flex: 1, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  statNum: { fontWeight: '800', fontSize: 16, color: colors.ink },
  statLbl: { fontSize: 11, color: colors.muted, marginTop: 2 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginTop: spacing.sm },
  sectionSub: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  progressBarBg: { height: 8, borderRadius: 4, backgroundColor: colors.insetBg, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: colors.blueMid },
  plistRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.insetBg,
  },
  plistRowYou: { backgroundColor: colors.homeHeaderBg, borderRadius: radius.sm, paddingHorizontal: spacing.sm },
  plistLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  plistNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.insetBg,
    alignItems: 'center', justifyContent: 'center',
  },
  plistNumActive: { backgroundColor: colors.green },
  plistNumText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  plistName: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  plistSub: { color: colors.muted, fontSize: 12 },
  pillGreen: { backgroundColor: colors.greenBg, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  pillGreenText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  aptTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarMd: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: '#D1E3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarMdText: { color: '#1E3FCB', fontWeight: '700' },
  docName: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  docSpec: { color: colors.muted, fontSize: 12 },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  extraKey: { color: colors.muted, fontSize: 13 },
  extraVal: { color: colors.ink, fontSize: 13, fontWeight: '600' },
});