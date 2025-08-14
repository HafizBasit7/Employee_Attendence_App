import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';
import NotificationIcon from '../components/NotificationIcon';

export default function AssignmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [showNotifications, setShowNotifications] = useState(true);
  const [page, setPage] = useState(1);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { user } = useAuth();

  // Get task status filter
  const getStatusFilter = () => {
    switch (activeTab) {
      case 'In-progress':
        return 'inprogress';
      case 'Completed':
        return 'completed';
      default:
        return undefined;
    }
  };

  // Fetch tasks with React Query
  const { 
    data: tasksData, 
    isLoading, 
    refetch, 
    isRefetching 
  } = useQuery({
    queryKey: ['myTasks', activeTab, page],
    queryFn: () => taskService.getMyTasks({
      status: getStatusFilter(),
      page,
      limit: 10,
    }),
    keepPreviousData: true,
  });

  const tasks = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination || {};

  const handleAssignmentPress = (task) => {
    navigation.navigate('TaskDetailsScreen', { task });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  const loadMoreTasks = () => {
    if (pagination.page < Math.ceil(pagination.total / 10)) {
      setPage(prev => prev + 1);
    }
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const renderTaskItem = ({ item: task }) => (
    <TouchableOpacity
      style={styles.assignmentCard}
      onPress={() => handleAssignmentPress(task)}
      activeOpacity={0.8}
    >
      {/* Assignment Header */}
      <View style={styles.assignmentHeader}>
        <AppText style={styles.assignmentTitle}>{task.title.length > 30 ? task.title.slice(0, 30) + '...' : task.title}</AppText>
        <AppText style={styles.createDate}>
          <AppText style={{ fontWeight: 'bold' }}>Created: </AppText>
          {formatDate(task.createdAt)}
        </AppText>
      </View>

      {/* Description */}
      <AppText style={styles.description} numberOfLines={3}>
        {task.description || 'No description provided'}
      </AppText>

      {/* Details Table */}
      <View style={styles.detailsTable}>
        <View style={styles.tableRow}>
          <AppText style={styles.tableLabel}>Assigned by:</AppText>
          <AppText style={styles.tableValue}>Admin</AppText>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <AppText style={styles.priorityText}>
              {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
            </AppText>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.tableRow}>
          <AppText style={styles.tableLabel}>Created:</AppText>
          <AppText style={styles.tableValue}>{formatDate(task.createdAt)}</AppText>
          <AppText style={styles.tableLabel}>Status:</AppText>
          <AppText style={[styles.tableValue, { color: task.status === 'completed' ? colors.success : colors.warning }]}>
            {task.status === 'inprogress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </AppText>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {task.status === 'completed' ? (
          <AppText style={styles.completedText}>100% Completed</AppText>
        ) : (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${task.progress || 0}%` }
              ]}
            />
          </View>
        )}
      </View>
      <View style={styles.progressRow}>
        <AppText style={styles.sectionTitle}>Progress</AppText>
        <AppText style={styles.progressPercentage}>
          {task.status === 'completed' ? '100%' : `${task.progress || 0}%`}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !isRefetching) {
    return <Loader visible={true} text="Loading tasks..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* User Header with Notification */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.profileSection} 
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Image
              source={
                user?.profilePicture 
                  ? { uri: user.profilePicture }
                  : require('../../assets/avatar.png')
              }
              style={styles.avatar}
            />
            <View>
              <AppText style={styles.userName}>{user?.name || 'User'}</AppText>
              <AppText style={styles.taskCount}>{pagination.total || 0} tasks assigned</AppText>
            </View>
          </TouchableOpacity>
        </View>
        <NotificationIcon navigation={navigation} />
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
            onPress={() => handleTabChange(tab)}
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

      {/* Tasks List */}
      <FlatList
      showsVerticalScrollIndicator={false}
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReached={loadMoreTasks}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={colors.textSecondary} />
            <AppText style={styles.emptyText}>No tasks found</AppText>
            <AppText style={styles.emptySubtext}>
              {activeTab === 'All' ? 'You have no assigned tasks' : `No ${activeTab.toLowerCase()} tasks`}
            </AppText>
          </View>
        }
        ListFooterComponent={
          isLoading && tasks.length > 0 ? (
            <View style={styles.loadingFooter}>
              <Loader visible={true} text="Loading more..." />
            </View>
          ) : null
        }
      />

      <AlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    paddingTop: 0,
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

  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
   
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingFooter: {
    paddingVertical: 20,
  },
});