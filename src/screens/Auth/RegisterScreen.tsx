import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/colors';

// Mirrors: id="screen-register" — fields regName, regEmail, regPhone, pwInput
export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      {(['name', 'email', 'phone', 'password'] as const).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          secureTextEntry={field === 'password'}
          value={form[field]}
          onChangeText={(v) => setForm((f) => ({ ...f, [field]: v }))}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: spacing.lg, textAlign: 'center' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  button: { backgroundColor: colors.blueMid, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  buttonText: { color: colors.surface, fontWeight: '600' },
  link: { color: colors.blueMid, textAlign: 'center', marginTop: spacing.lg },
});
