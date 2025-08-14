import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.logoContainer}>
          {/* <Text style={styles.logoText}>K@TEC</Text>
          <Text style={styles.subtitle}>ROHRLETTUNOBBAU UND INDUSTRIEBERVICE</Text> */}
          <Image
            source={require('../../../assets/Mask.png')} // Replace with your actual image path
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login your account</Text>
        </View>

        {/* Email Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email ID"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="*******"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.rememberMeButton}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkedBox]}>
                {rememberMe && <View style={styles.checkmark} />}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.rememberMeButton}
              onPress={() => setIsAdmin(!isAdmin)}
            >
              <View style={[styles.checkbox, isAdmin && styles.checkedBox]}>
                {isAdmin && <View style={styles.checkmark} />}
              </View>
              <Text style={styles.rememberMeText}>Login as Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

       

        {/* Login Section */}
        <View style={styles.section}>
         
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => {
              navigation.navigate(isAdmin ? 'AdminMain' : 'Main');
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword} onPress={()=> {navigation.navigate('ForgotPass')}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing-in, you agree to our{' '}
            <Text style={styles.linkText}>Terms & Conditions</Text>{' | '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign:'center'
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign:'center'
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 38,
    padding: 16,
    fontSize: 12,
    backgroundColor: colors.card,
    marginBottom: 16,
    color: colors.textPrimary,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  rememberMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  rememberMeText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 38,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});