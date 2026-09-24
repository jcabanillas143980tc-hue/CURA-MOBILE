import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const PERSONAL_INFO = [
  { icon: '👤', bg: colors.purpleBg, key: 'Full Name', value: 'Sarah M. Johnson' },
  { icon: '🎂', bg: colors.amberBg, key: 'Date of Birth', value: 'March 12, 1990' },
  { icon: '📱', bg: '#E1F7F3', key: 'Phone', value: '+1 (555) 291-4847' },
  { icon: '✉️', bg: colors.pinkBg, key: 'Email', value: 'sarah@cura.health' },
  { icon: '🩸', bg: colors.redBg, key: 'Blood Type', value: 'O+' },
  { icon: '⚠️', bg: colors.amberBg, key: 'Allergies', value: 'Penicillin, Pollen' },
];

const EMERGENCY_CONTACT = [
  { icon: '👥', key: 'Contact Name', value: 'Michael Johnson' },
  { icon: '💙', key: 'Relationship', value: 'Spouse' },
  { icon: '📞', key: 'Phone', value: '+1 (555) 847-2910' },
];

const SETTINGS_LIST = [
  { icon: '📅', bg: '#E1F7F3', label: 'Appointment History', screen: 'Records' },
  { icon: '🛡️', bg: colors.greenBg, label: 'Insurance Details' },
  { icon: '🔒', bg: colors.amberBg, label: 'Privacy Settings' },
  { icon: '💬', bg: colors.pinkBg, label: 'Help & Support' },
  { icon: 'ℹ️', bg: colors.purpleBg, label: 'About CURA' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const [prescriptionReminders, setPrescriptionReminders] = useState(true);
  const [queueUpdates, setQueueUpdates] = useState(false);

  const onListPress = (item: typeof SETTINGS_LIST[number]) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(item.label, 'This section is coming soon.');
    }
  };

  const onSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout().catch(() => {}) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.idRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}><Text style={styles.avatarText}>SJ</Text></View>
            <View style={styles.onlineBadge} />
          </View>
          <View>
            <Text style={styles.profName}>Sarah Johnson</Text>
            <Text style={styles.profId}>Patient ID: CUR-2026-00847</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badgeW}><Text style={styles.badgeWText}>O+ Blood</Text></View>
              <View style={styles.badgeW}><Text style={styles.badgeWText}>Active Patient</Text></View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.card}>
          <Text style={styles.infoTitle}>Personal Information</Text>
          {PERSONAL_INFO.map((row) => (
            <View key={row.key} style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: row.bg }]}>
                <Text>{row.icon}</Text>
              </View>
              <View>
                <Text style={styles.infoK}>{row.key}</Text>
                <Text style={styles.infoV}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.emergCard]}>
          <Text style={styles.emergTitle}>⚠️ Emergency Contact</Text>
          {EMERGENCY_CONTACT.map((row) => (
            <View key={row.key} style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
                <Text>{row.icon}</Text>
              </View>
              <View>
                <Text style={styles.infoK}>{row.key}</Text>
                <Text style={styles.infoV}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.infoTitle}>Notification Preferences</Text>
          <View style={styles.prefRow}>
            <View>
              <Text style={styles.prefK}>Prescription Reminders</Text>
              <Text style={styles.prefSub}>Daily medication alerts</Text>
            </View>
            <Switch
              value={prescriptionReminders}
              onValueChange={setPrescriptionReminders}
              trackColor={{ true: colors.blueMid, false: colors.border }}
            />
          </View>
          <View style={styles.prefRow}>
            <View>
              <Text style={styles.prefK}>Queue Updates</Text>
              <Text style={styles.prefSub}>Live queue position alerts</Text>
            </View>
            <Switch
              value={queueUpdates}
              onValueChange={setQueueUpdates}
              trackColor={{ true: colors.blueMid, false: colors.border }}
            />
          </View>
        </View>

        <View style={styles.card}>
          {SETTINGS_LIST.map((item) => (
            <TouchableOpacity key={item.label} style={styles.listRow} onPress={() => onListPress(item)}>
              <View style={[styles.listIcon, { backgroundColor: item.bg }]}>
                <Text>{item.icon}</Text>
              </View>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
          <Text style={styles.signOutText}>↪ Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.blueMid, padding: spacing.lg, paddingTop: spacing.xl,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  editBtn: {
    alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill,
  },
  editBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  onlineBadge: {
    position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.green, borderWidth: 2, borderColor: colors.blueMid,
  },
  profName: { color: '#fff', fontWeight: '800', fontSize: 18 },
  profId: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  badgeW: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  badgeWText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.cardBorder,
  },
  emergCard: { backgroundColor: colors.amberBg, borderColor: colors.amberBg },
  infoTitle: { color: colors.ink, fontWeight: '700', fontSize: 14, marginBottom: spacing.sm },
  emergTitle: { color: colors.amber, fontWeight: '700', fontSize: 14, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  infoIcon: {
    width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  infoK: { color: colors.muted, fontSize: 11 },
  infoV: { color: colors.ink, fontWeight: '600', fontSize: 13, marginTop: 1 },
  prefRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.insetBg,
  },
  prefK: { color: colors.ink, fontWeight: '600', fontSize: 13 },
  prefSub: { color: colors.muted, fontSize: 11, marginTop: 1 },
  listRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.insetBg,
  },
  listIcon: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  listLabel: { flex: 1, color: colors.ink, fontWeight: '600', fontSize: 13 },
  signOutBtn: {
    borderWidth: 1, borderColor: colors.red, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  signOutText: { color: colors.red, fontWeight: '700', fontSize: 14 },
});