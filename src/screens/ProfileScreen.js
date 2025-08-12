import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from '../components/ConfirmationModal';

export default function ProfileScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogout = () => {
    setShowLogoutModal(false);
    // Add your logout logic here
    navigation.navigate('SplashScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={require('../../assets/avatar.png')} 
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Adam Bartford</Text>
            <Text style={styles.profileEmail}>adam.bartford@domain.com</Text>
            <Text style={styles.profileRole}>Role: <Text style={styles.roleText}>Junior</Text></Text>
            <Text style={styles.profileRole}>Employee ID: <Text style={styles.roleText}>384543</Text></Text>
          </View>
        </View>

        {/* Menu Items */}
        <MenuItem icon="home-outline" label="Home" onPress={() => {}} />
        
        {/* Dark/Light Mode with Switch */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="person-outline" size={22} color="#000" />
            <Text style={styles.menuLabel}>Dark/Light Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        <MenuItem icon="document-text-outline" label="FAQ’s" onPress={() => {}} />
        <MenuItem icon="settings-outline" label="Settings" onPress={() => {navigation.navigate("Settings")}} />

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={() => setShowLogoutModal(true)}>
          <View style={styles.menuLeft}>
            <Ionicons name="power-outline" size={22} color="#fff" />
            <Text style={styles.signOutLabel}>Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>




        <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to Sign Out?"
        confirmText="Sign Out"
      />

      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color="#000" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
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
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'red',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: '#444',
  },
  roleText: {
    color: '#888',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 14,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B22222',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signOutLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
  },
});
