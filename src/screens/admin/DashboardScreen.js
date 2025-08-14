import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Total Employees</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>132</Text>
          <Text style={styles.statLabel}>Present Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>On Leave</Text>
        </View>
      </View>
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 5,
  },
});
