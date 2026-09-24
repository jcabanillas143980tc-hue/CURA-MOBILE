import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

type Category = 'all' | 'appointments' | 'queue' | 'prescriptions';
type Notif = {
  id: string;
  category: Exclude<Category, 'all'>;
  icon: string;
  iconBg: string;
  title: string;
  time: string;
  text: string;
  section: 'TODAY' | 'YESTERDAY';
  unread: boolean;
  alert?: boolean;
};

const NOTIFS: Notif[] = [
  {
    id: '1', category: 'queue', icon: '⏱️', iconBg: colors.purpleBg,
    title: 'Queue Update', time: 'Just now',
    text: "You're now 3rd in line! Estimated wait: ~18 minutes. Head to the clinic soon.",
    section: 'TODAY', unread: true,
  },
  {
    id: '2', category: 'appointments', icon: '📅', iconBg: '#E1F7F3',
    title: 'Appointment Confirmed', time: '2h ago',
    text: 'Your appointment with Dr. Elena Markov on Aug 7 at 10:30 AM has been confirmed.',
    section: 'TODAY', unread: true,
  },
  {
    id: '3', category: 'prescriptions', icon: '💊', iconBg: colors.amberBg,
    title: 'Medication Reminder', time: '8:00 AM',
    text: "Time to take your Lisinopril 5mg. Don't forget your morning dose!",
    section: 'TODAY', unread: true,
  },
  {
    id: '4', category: 'prescriptions', icon: '⚠️', iconBg: colors.redBg,
    title: 'Refill Needed Soon', time: 'Yesterday',
    text: 'Your Ferrous Sulfate supply is running low — only 16 days remaining.',
    section: 'YESTERDAY', unread: false, alert: true,
  },
];

const TABS: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'queue', label: 'Queue' },
  { key: 'prescriptions', label: 'Prescriptions' },
];

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [notifs, setNotifs] = useState(NOTIFS);

  const filtered = activeTab === 'all' ? notifs : notifs.filter((n) => n.category === activeTab);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  const readNotif = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const sections = ['TODAY', 'YESTERDAY'] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.countBadge}><Text style={styles.countBadgeText}>{unreadCount}</Text></View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {sections.map((section) => {
          const items = filtered.filter((n) => n.section === section);
          if (items.length === 0) return null;
          return (
            <View key={section}>
              <Text style={styles.sectionLabel}>{section}</Text>
              {items.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.notifCard, n.alert && styles.notifCardAlert]}
                  onPress={() => readNotif(n.id)}
                >
                  <View style={[styles.notifIcon, { backgroundColor: n.iconBg }]}>
                    <Text style={{ fontSize: 16 }}>{n.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.notifTopRow}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                    <Text style={styles.notifText}>{n.text}</Text>
                  </View>
                  {n.unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <Text style={{ textAlign: 'center', color: colors.muted, marginTop: spacing.xl }}>
            No notifications in this category.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  backCircle: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  countBadge: { backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  countBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  markRead: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600', marginTop: spacing.sm },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.sm, backgroundColor: colors.surface },
  tab: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.insetBg },
  tabActive: { backgroundColor: colors.blueMid },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm },
  notifCard: {
    flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  notifCardAlert: { borderColor: colors.red, borderWidth: 1 },
  notifIcon: {
    width: 38, height: 38, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  notifTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  notifTitle: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  notifTime: { color: colors.muted, fontSize: 11 },
  notifText: { color: colors.muted, fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blueMid, marginTop: 4 },
});