import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// import Screen from '../components/Screen';
import AppHeader from '../../components/AppHeader';
import AppText from '../../components/AppText';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminAssignmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [showNotifications, setShowNotifications] = useState(true);

  const assignments = [
    {
      id: '1',
      title: 'Abc Task',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit odio, mattis quam tortor taciti aenean luctus nullam enim,',
      createDate: 'Jan 05, 2024',
      assignedBy: 'You',
      priority: 'Medium',
      startDate: 'Jan 07, 2024',
      dueDate: 'Feb 25, 2024',
      progress: '40%',
      status: 'In-progress',
      startTime: '4:30 PM',
      endTime: '10:30 PM',
      category: 'Lorem ipsum ______'
    },
    {
      id: '2',
      title: 'Abc Task',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit odio, mattis quam tortor taciti aenean luctus nullam enim,',
      createDate: 'Jan 05, 2024',
      assignedBy: 'Admin',
      priority: 'Medium',
      startDate: 'Jan 07, 2024',
      dueDate: 'Jan 08, 2024',
      progress: '100% Completed',
      status: 'Completed',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      category: 'Development'
    },
    {
      id: '3',
      title: 'Abc Task',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit odio, mattis quam tortor taciti aenean luctus nullam enim,',
      createDate: 'Jan 05, 2024',
      assignedBy: 'You',
      priority: 'Medium',
      startDate: 'Jan 07, 2024',
      dueDate: 'Jan 08, 2024',
      progress: '40%',
      status: 'In-progress',
      startTime: '10:00 AM',
      endTime: '6:00 PM',
      category: 'Design'
    },
  ];

  const filteredAssignments = activeTab === 'All'
    ? assignments
    : assignments.filter(item => item.status.toLowerCase().includes(activeTab.toLowerCase()));

  const handleAssignmentPress = (assignment) => {
    navigation.navigate('TaskScreen', { assignment });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* User Header with Notification */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.profileSection} 
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/avatar.png')}
              style={styles.avatar}
            />
            <View>
              <AppText style={styles.userName}>Hi John</AppText>
              <AppText style={styles.taskCount}>Good Morning!</AppText>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => setShowNotifications(false)}
        >
           <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          {showNotifications && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Tab Filter */}
      <View style={styles.tabContainer}>
        {['All', 'In-progress', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <AppText style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Assignments List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredAssignments.map((assignment) => (
          <TouchableOpacity
            key={assignment.id}
            style={styles.assignmentCard}
            onPress={() => handleAssignmentPress(assignment)}
            activeOpacity={0.8}
          >
            {/* Assignment Header */}
            <View style={styles.assignmentHeader}>
              <AppText style={styles.assignmentTitle}>{assignment.title}</AppText>
              <AppText style={styles.createDate}>
                <AppText style={{ fontWeight: 'bold' }}>Create Date: </AppText>
                {assignment.createDate}
              </AppText>

            </View>

            {/* Description */}
            <AppText style={styles.description}>{assignment.description}</AppText>

            {/* Details Table */}
            <View style={styles.detailsTable}>
              <View style={styles.tableRow}>
                <AppText style={styles.tableLabel}>Assigned by:</AppText>
                <AppText style={styles.tableValue}>{assignment.assignedBy}</AppText>
                <View style={styles.priorityBadge}>
                  <AppText style={styles.priorityText}>{assignment.priority}</AppText>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.tableRow}>
                <AppText style={styles.tableLabel}>Start Date:</AppText>
                <AppText style={styles.tableValue}>{assignment.startDate}</AppText>
                <AppText style={styles.tableLabel}>Due Date:</AppText>
                <AppText style={styles.tableValue}>{assignment.dueDate}</AppText>
              </View>
            </View>
            <View style={styles.divider} />

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {assignment.progress.includes('%') ? (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: assignment.progress }
                    ]}
                  />
                </View>
              ) : (
                <AppText style={styles.completedText}>{assignment.progress}</AppText>
              )}
            </View>
            <View style={styles.progressRow}>
              <AppText style={styles.sectionTitle}>Progress</AppText>
              <AppText style={styles.progressPercentage}>{assignment.progress}</AppText>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
 
  userName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  taskCount: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  notificationIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  notificationBadge: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute', top: 6, right: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },

  assignmentCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0, // Or 16 if you want padding on sides
    borderWidth: 1,
    borderColor: colors.border,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  createDate: {
    fontSize: 12,
    color: colors.textSecondary,
    flexDirection: 'row',

  },
  description: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsTable: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
    width: 80,
  },
  tableValue: {
    fontSize: 12,
    color: colors.textPrimary,
    marginRight: 16,
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: colors.info,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 16,
    width: 80,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  completedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // keep them vertically aligned
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'right'
  },
});