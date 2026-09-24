import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/colors';

// Mirrors: id="screen-login" in cura-app-10.html
export default function LoginScreen() {
  const { login, loginAsDevPreviewUser } = useAuth();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('patient@cura.health');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message ?? 'Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Feather name="plus" size={22} color="#fff" />
        </View>
        <Text style={styles.brand}>CURA</Text>
        <Text style={styles.tagline}>HEALTH COMPANION</Text>
        <Text style={styles.subtag}>Your health, our priority</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>Sign in to continue to your account</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.field}>
          <Feather name="mail" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.field}>
          <Feather name="lock" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.rowEnd}>
          <Text style={styles.linkSm}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} disabled={submitting}>
          <Text style={styles.primaryBtnText}>{submitting ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>or continue with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Alert.alert('Coming soon', 'Google Sign-In will be enabled once connected to the backend.')}
          >
            <Text style={styles.socialBtnText}>🔴 Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Alert.alert('Coming soon', 'Apple Sign-In will be enabled once connected to the backend.')}
          >
            <Text style={styles.socialBtnText}> Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.link}>Register now</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.devButton} onPress={loginAsDevPreviewUser}>
          <Text style={styles.devButtonText}>🛠 Continue as Preview User (Dev Mode)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.blueMid, alignItems: 'center',
    paddingTop: 56, paddingBottom: 32, borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  logoBox: {
    width: 56, height: 56, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  brand: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginTop: 2 },
  subtag: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 6 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  welcome: { fontSize: 20, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 2, marginBottom: spacing.lg },
  label: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md, height: 46,
  },
  input: { flex: 1, color: colors.ink, fontSize: 14 },
  rowEnd: { alignItems: 'flex-end', marginBottom: spacing.md },
  linkSm: { color: colors.blueMid, fontSize: 12, fontWeight: '600' },
  primaryBtn: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  divider: { textAlign: 'center', color: colors.muted, fontSize: 12, marginVertical: spacing.md },
  socialRow: { flexDirection: 'row', gap: spacing.sm },
  socialBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, alignItems: 'center',
  },
  socialBtnText: { color: colors.ink, fontWeight: '600', fontSize: 13 },
  footerText: { textAlign: 'center', color: colors.muted, fontSize: 13, marginTop: spacing.lg },
  link: { color: colors.blueMid, fontWeight: '700' },
  devButton: {
    marginTop: spacing.lg, padding: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.amber, borderStyle: 'dashed',
  },
  devButtonText: { color: colors.amber, textAlign: 'center', fontSize: 12, fontWeight: '600' },
});