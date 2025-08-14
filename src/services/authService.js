import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.post('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Store token and user data
  storeAuthData: async (token, userData) => {
    try {
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['userData', JSON.stringify(userData)]
      ]);
      
      // Update axios default header
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  },

  // Get stored auth data
  getStoredAuthData: async () => {
    try {
      const [[, token], [, userData]] = await AsyncStorage.multiGet(['authToken', 'userData']);
      return {
        token,
        userData: userData ? JSON.parse(userData) : null
      };
    } catch (error) {
      console.error('Error getting stored auth data:', error);
      return { token: null, userData: null };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};
