import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/colors';

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (form.password !== form.confirm) {
      Alert.alert('Passwords do not match', 'Please re-enter your password.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
    } catch (e: any) {
      Alert.alert('Registration failed', e?.response?.data?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.logoBox}>
          <Feather name="plus" size={18} color="#fff" />
        </View>
        <Text style={styles.brand}>CURA</Text>
        <Text style={styles.tagline}>HEALTH COMPANION</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Sign up to get started with CURA</Text>

        <Text style={styles.label}>Full Name</Text>
        <View style={styles.field}>
          <Feather name="user" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Juan Dela Cruz"
            placeholderTextColor={colors.muted}
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
          />
        </View>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.field}>
          <Feather name="mail" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
          />
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.field}>
          <Feather name="phone" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="+63 900 000 0000"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.field}>
          <Feather name="lock" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPw}
            value={form.password}
            onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
          />
          <TouchableOpacity onPress={() => setShowPw((s) => !s)}>
            <Feather name={showPw ? 'eye-off' : 'eye'} size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.field}>
          <Feather name="lock" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPw}
            value={form.confirm}
            onChangeText={(v) => setForm((f) => ({ ...f, confirm: v }))}
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} disabled={submitting}>
          <Text style={styles.primaryBtnText}>{submitting ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.link}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.blueMid, alignItems: 'center',
    paddingTop: 56, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  backCircle: {
    position: 'absolute', left: 20, top: 52, width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  logoBox: {
    width: 48, height: 48, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  brand: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginTop: 2 },
  body: { padding: spacing.lg },
  welcome: { fontSize: 20, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 2, marginBottom: spacing.lg },
  label: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md, height: 46,
  },
  input: { flex: 1, color: colors.ink, fontSize: 14 },
  primaryBtn: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footerText: { textAlign: 'center', color: colors.muted, fontSize: 13, marginTop: spacing.lg },
  link: { color: colors.blueMid, fontWeight: '700' },
});