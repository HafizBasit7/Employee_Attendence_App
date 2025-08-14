import api from './api';

export const attendanceService = {
  // Check in with location
  checkIn: async (lat, lon) => {
    try {
      const response = await api.post('/attendance/check-in', { lat, lon });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Check-in failed' };
    }
  },

  // Check out with location
  checkOut: async (lat, lon) => {
    try {
      const response = await api.post('/attendance/check-out', { lat, lon });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Check-out failed' };
    }
  },

  // Get attendance history
  getMyHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/attendance/my?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get attendance history' };
    }
  },

  // Get today's attendance status
  getTodayStatus: async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      const response = await api.get(`/attendance/my?startDate=${startOfDay}&endDate=${endOfDay}&limit=1`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get today status' };
    }
  }
};
