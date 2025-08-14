import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Monthly Attendance Summary</Text>
        <View style={styles.reportStats}>
          <Text style={styles.statText}>Average Attendance: 92%</Text>
          <Text style={styles.statText}>Late Arrivals: 15</Text>
          <Text style={styles.statText}>Early Departures: 8</Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Department Performance</Text>
        <View style={styles.reportStats}>
          <Text style={styles.statText}>IT: 95% attendance</Text>
          <Text style={styles.statText}>HR: 98% attendance</Text>
          <Text style={styles.statText}>Finance: 94% attendance</Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Leave Statistics</Text>
        <View style={styles.reportStats}>
          <Text style={styles.statText}>Sick Leave: 25 days</Text>
          <Text style={styles.statText}>Vacation: 45 days</Text>
          <Text style={styles.statText}>Personal: 15 days</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  reportCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  reportStats: {
    gap: 10,
  },
  statText: {
    fontSize: 14,
    color: colors.text,
  },
});
