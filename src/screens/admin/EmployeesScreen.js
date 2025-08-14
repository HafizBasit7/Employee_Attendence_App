import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '../../theme/colors';

const dummyEmployees = [
  { id: '1', name: 'John Doe', department: 'IT', status: 'Present' },
  { id: '2', name: 'Jane Smith', department: 'HR', status: 'On Leave' },
  { id: '3', name: 'Mike Johnson', department: 'Finance', status: 'Present' },
];

export default function EmployeesScreen() {
  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.name}</Text>
      <Text style={styles.employeeDetails}>{item.department}</Text>
      <Text style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'Present' ? colors.success : colors.warning }
      ]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employees</Text>
      <FlatList
        data={dummyEmployees}
        renderItem={renderEmployee}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    gap: 10,
  },
  employeeCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  employeeDetails: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    color: colors.white,
    fontSize: 12,
  },
});
