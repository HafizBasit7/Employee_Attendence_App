import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import { uploadImage } from '../../utils/upload';
import { useAuth } from '../context/AuthContext';
import AppText from '../components/AppText';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';

export default function SettingsScreen({ navigation }) {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { user, logout, updateUserProfile } = useAuth();

  // Profile picture update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => updateUserProfile(profileData),
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Profile picture updated successfully',
      });
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile picture',
      });
    },
  });

  const isLoading = updateProfileMutation.isPending;

  const handleProfilePictureUpdate = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        setAlertConfig({
          visible: true,
          type: 'warning',
          title: 'Permission Required',
          message: 'Permission to access camera roll is required!',
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Upload image and get URL
        const imageUrl = await uploadImage(asset, `profile_${user.userId}_${Date.now()}`);
        
        // Update profile with new image URL
        updateProfileMutation.mutate({
          profilePicture: imageUrl,
        });
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload profile picture. Please try again.',
      });
    }
  };

  const handleLogout = () => {
    setAlertConfig({
      visible: true,
      type: 'warning',
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      showCancel: true,
      onConfirm: async () => {
        try {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
        closeAlert();
      },
    });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Settings</AppText>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleProfilePictureUpdate}
            activeOpacity={0.7}
          >
            <Image
              source={
                user?.profilePicture 
                  ? { uri: user.profilePicture }
                  : require('../../assets/avatar.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <AppText style={styles.profileName}>{user?.name || 'User'}</AppText>
          <AppText style={styles.profileEmail}>{user?.email || 'user@example.com'}</AppText>
        </View>

        {/* Settings Options */}
        <View style={styles.menuContainer}>
          <SettingsItem 
            icon="notifications-outline" 
            label="Notifications" 
            onPress={() => {
              setAlertConfig({
                visible: true,
                type: 'info',
                title: 'Coming Soon',
                message: 'Notification settings will be available soon.',
              });
            }} 
          />
          <SettingsItem 
            icon="document-text-outline" 
            label="Terms & Conditions" 
            onPress={() => {
              setAlertConfig({
                visible: true,
                type: 'info',
                title: 'Coming Soon',
                message: 'Terms & Conditions will be available soon.',
              });
            }} 
          />
          <SettingsItem 
            icon="lock-closed-outline" 
            label="Privacy Policy" 
            onPress={() => {
              setAlertConfig({
                visible: true,
                type: 'info',
                title: 'Coming Soon',
                message: 'Privacy Policy will be available soon.',
              });
            }} 
          />
          <SettingsItem 
            icon="information-circle-outline" 
            label="About App" 
            onPress={() => {
              setAlertConfig({
                visible: true,
                type: 'info',
                title: 'Employee Management App',
                message: 'Version 1.0.0\nDeveloped for attendance and task management.',
              });
            }} 
          />
          <SettingsItem 
            icon="log-out-outline" 
            label="Logout" 
            onPress={handleLogout}
            isLogout={true}
          />
        </View>
      </ScrollView>

      <Loader visible={isLoading} text="Updating profile..." />
      
      <AlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={alertConfig.showCancel}
      />
    </SafeAreaView>
  );
}

function SettingsItem({ icon, label, onPress, isLogout = false }) {
  return (
    <TouchableOpacity 
      style={[styles.settingsItem, isLogout && styles.logoutItem]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={isLogout ? colors.danger : colors.textPrimary} 
        />
        <AppText style={[styles.itemLabel, isLogout && styles.logoutLabel]}>
          {label}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 0,
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  logoutLabel: {
    color: colors.danger,
  },
});