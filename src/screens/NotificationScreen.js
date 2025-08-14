import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppText from '../components/AppText';
import AppHeader from '../components/AppHeader';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';
import { colors } from '../theme/colors';
import { notificationService } from '../services/notificationService';

export default function NotificationScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const queryClient = useQueryClient();

  // Fetch notifications with pagination
  const { data: notificationsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationService.getNotifications({ page, limit: 10 }),
    keepPreviousData: true,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate and refetch notifications and unread status
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to mark notification as read',
      });
    },
  });

  const notifications = notificationsData?.data?.notifications || [];
  const pagination = notificationsData?.data?.pagination || {};

  const handleNotificationPress = (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }

    // Navigate based on notification action
    if (notification.action === 'view_task') {
      // Navigate to assignments screen
      navigation.navigate('Main', { 
        screen: 'Assignments',
        params: { highlightTaskId: notification.relatedTaskId }
      });
    } else {
      // Default to assignments screen
      navigation.navigate('Main', { screen: 'Assignments' });
    }
  };

  const loadMoreNotifications = () => {
    if (pagination.hasNextPage && !isLoading && !isRefetching) {
      setPage(prev => prev + 1);
    }
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const renderNotificationItem = ({ item: notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <Ionicons 
              name={notification.action === 'view_task' ? 'briefcase' : 'information-circle'} 
              size={20} 
              color={!notification.isRead ? colors.primary : colors.textSecondary} 
            />
          </View>
          <View style={styles.notificationDetails}>
            <AppText style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadText
            ]}>
              New Task Assignment
            </AppText>
            <AppText style={styles.notificationTime}>
              {formatNotificationTime(notification.createdAt)}
            </AppText>
          </View>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        
        <AppText 
          style={[
            styles.notificationMessage,
            !notification.isRead && styles.unreadText
          ]}
          numberOfLines={2}
        >
          {notification.content}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={80} color={colors.border} />
      <AppText style={styles.emptyTitle}>No Notifications</AppText>
      <AppText style={styles.emptySubtext}>
        You're all caught up! No new notifications to show.
      </AppText>
    </View>
  );

  const renderFooter = () => {
    if (!pagination.hasNextPage) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Loader visible={isLoading || isRefetching} text="Loading more..." />
      </View>
    );
  };

  if (isLoading && !isRefetching && page === 1) {
    return <Loader visible={true} text="Loading notifications..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Notifications</AppText>
        </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={notifications.length === 0 ? styles.emptyListContainer : styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={() => {
              setPage(1);
              refetch();
            }} 
          />
        }
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 0,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    color: colors.textPrimary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notificationItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadNotification: {
    borderLeftColor: colors.primary,
    backgroundColor: colors.primary + '05', // Very light primary color
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 52,
  },
  unreadText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
