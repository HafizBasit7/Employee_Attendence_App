import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { uploadImage } from '../../utils/upload';
import { useAuth } from '../context/AuthContext';
import AppText from '../components/AppText';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';
import NotificationIcon from '../components/NotificationIcon';

export default function ProfileScreen({ navigation }) {
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Profile</AppText>
          <NotificationIcon navigation={navigation} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
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
          <View style={styles.profileInfo}>
            <AppText style={styles.profileName}>{user?.name || 'User'}</AppText>
            <AppText style={styles.profileEmail}>{user?.email || 'user@example.com'}</AppText>
            <AppText style={styles.profileRole}>Role: <AppText style={styles.roleText}>Employee</AppText></AppText>
            <AppText style={styles.profileRole}>Employee ID: <AppText style={styles.roleText}>{user?.userId?.slice(-6) || 'N/A'}</AppText></AppText>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <Ionicons name="power-outline" size={22} color="#fff" />
            <AppText style={styles.signOutLabel}>Sign Out</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

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



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
    paddingTop: 0,
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleText: {
    color: colors.textSecondary,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signOutLabel: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 12,
    fontWeight: '600',
  },
});

