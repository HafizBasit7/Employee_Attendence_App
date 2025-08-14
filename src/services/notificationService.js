import api from './api';

export const notificationService = {
  // Get notifications with pagination
  getNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/notifications/fetchNotifications?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get notifications' };
    }
  },

  // Check if there are unread notifications
  hasUnreadNotifications: async () => {
    try {
      const response = await api.get('/notifications/hasUnreadNotifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check unread notifications' };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  }
};
