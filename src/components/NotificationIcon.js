import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import { notificationService } from '../services/notificationService';

const NotificationIcon = ({ navigation, size = 24 }) => {
  // Check for unread notifications
  const { data: unreadData } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: notificationService.hasUnreadNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const hasUnread = unreadData?.status === true;

  const handleNotificationPress = () => {
    // Navigate to NotificationScreen first
    navigation.navigate('NotificationScreen');
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleNotificationPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name="bell" 
        size={size} 
        color={colors.textPrimary} 
      />
      {hasUnread && <View style={styles.notificationDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});

export default NotificationIcon;
