import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import AlertModal from '../../components/AlertModal';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Validation Error',
        message: 'Please enter both email and password.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // Navigation will be handled by RootNavigator based on auth state
        setAlertConfig({
          visible: true,
          type: 'success',
          title: 'Welcome!',
          message: 'Login successful. Redirecting...',
        });
        
        // Navigate based on user role
        setTimeout(() => {
          navigation.navigate(result.data.isAdmin ? 'AdminMain' : 'Main');
        }, 1500);
      } else {
        setAlertConfig({
          visible: true,
          type: 'error',
          title: 'Login Failed',
          message: result.message || 'Invalid credentials. Please try again.',
        });
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
          </View>
        </View>

       

        {/* Login Section */}
        <View style={styles.section}>
         
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.forgotPassword} onPress={()=> {navigation.navigate('ForgotPass')}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity> */}
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
        </ScrollView>
      </KeyboardAvoidingView>

      <Loader visible={isLoading} text="Logging in..." />
      
      <AlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    marginBottom: 24,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 38,
    padding: 16,
    fontSize: 14,
    backgroundColor: colors.card,
    marginBottom: 12,
    color: colors.textPrimary,
    minHeight: 50,
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
    marginTop: 16,
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