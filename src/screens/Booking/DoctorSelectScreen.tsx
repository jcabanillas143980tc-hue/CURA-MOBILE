import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/colors';

// Mirrors: id="screen-doctor" (doctorList, doctorStep)
export default function DoctorSelectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DoctorSelectScreen</Text>
      {/* TODO: build UI to match id="screen-doctor" (doctorList, doctorStep), wire up the matching src/api/*.ts call */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
});
