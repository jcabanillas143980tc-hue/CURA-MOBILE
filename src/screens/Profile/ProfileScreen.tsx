import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/colors';

// Mirrors: id="screen-profile"
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProfileScreen</Text>
      {/* TODO: build UI to match id="screen-profile", wire up the matching src/api/*.ts call */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
});
