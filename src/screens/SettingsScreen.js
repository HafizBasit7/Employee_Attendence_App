import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Settings Options */}
        <View style={styles.menuContainer}>
          <SettingsItem 
            icon="notifications-outline" 
            label="Notification" 
            onPress={() => navigation.navigate('NotificationSettings')} 
          />
          <SettingsItem 
            icon="document-text-outline" 
            label="Terms & Condition" 
            onPress={() => navigation.navigate('TermsAndConditions')} 
          />
          <SettingsItem 
            icon="lock-closed-outline" 
            label="Privacy Policy" 
            onPress={() => navigation.navigate('PrivacyPolicy')} 
          />
          <SettingsItem 
            icon="information-circle-outline" 
            label="About App" 
            onPress={() => navigation.navigate('AboutApp')} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={22} color="#000" />
        <Text style={styles.itemLabel}>{label}</Text>
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
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
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
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    // marginBottom:10
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});