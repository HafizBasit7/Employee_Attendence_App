import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import AppText from '../../components/AppText';
import { useAuth } from '../../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (isAuthenticated && user) {
          // Navigate based on user role
          navigation.replace(user.isAdmin ? 'AdminMain' : 'Main');
        } else {
          navigation.replace('Login');
        }
      }, 2000);
    }
  }, [isLoading, isAuthenticated, user, navigation]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/Mask.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText style={styles.title}>Employee Management</AppText>
        <AppText style={styles.subtitle}>Attendance & Task Tracking</AppText>
      </View>
      
      <View style={styles.footer}>
        <AppText style={styles.version}>Version 1.0.0</AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});