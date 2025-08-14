import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored auth data on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const { token, userData } = await authService.getStoredAuthData();
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.status && response.data) {
        const { token, ...userData } = response.data;
        
        // Store auth data
        await authService.storeAuthData(token, userData);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Invalid credentials' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.status && response.data?.user) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        
        // Update stored data
        const { token } = await authService.getStoredAuthData();
        await authService.storeAuthData(token, updatedUser);
        
        return { success: true, data: updatedUser };
      }
      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update profile' 
      };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    checkAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
