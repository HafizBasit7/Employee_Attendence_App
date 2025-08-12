import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AssignmentsScreen({ navigation }) {
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
    <Screen>
      {/* User Header with Notification */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
        <TouchableOpacity 
    style={styles.profileSection} 
    onPress={() => navigation.navigate('Profile')} // change to your screen name
    activeOpacity={0.7}
  >
          <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
          />
          <View>
            <AppText style={styles.userName}>Adam Bartford</AppText>
            <AppText style={styles.taskCount}>7 tasks for you today</AppText>
          </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => setShowNotifications(false)}
        >
          <MaterialCommunityIcons name="bell" size={24} color={colors.textPrimary} />
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
      <ScrollView contentContainerStyle={styles.container}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  taskCount: {
    fontSize: 14,
    color: colors.textSecondary,
    // marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
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
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  assignmentCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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