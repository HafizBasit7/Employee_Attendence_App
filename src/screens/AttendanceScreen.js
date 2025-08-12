import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';

export default function AttendanceScreen() {
  return (
    <Screen>
      <AppHeader title="Attendance" />
      <View style={styles.content}>
        <View style={styles.mapPlaceholder}>
          <AppText style={{ color: colors.textSecondary }}>
            Map Placeholder (Geofenced region)
          </AppText>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]}>
            <AppText>Check In</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cta, { backgroundColor: colors.secondary }]}>
            <AppText>Check Out</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Today</AppText>
          <AppText style={styles.cardBody}>9:05 AM - 5:20 PM • 8h 12m</AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: 12 },
  cta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cardBody: { color: colors.textSecondary },
});


