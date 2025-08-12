import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function VerificationCodeScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef([]);


  const focusNextField = (index) => {
    if (index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const focusPreviousField = (index, value) => {
    if (value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    if (text && index < 3) {
      focusNextField(index);
    }
  };
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(30); // Reset timer
    // Add your resend logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Wave Background */}
      <ImageBackground 
        // source={require('./assets/wave_bg.png')} // Add your wave image
        style={styles.waveBackground}
        resizeMode="cover"
      >
        {/* Main Content */}
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Logo Section */}
          <View style={styles.logoContainer}>
          {/* <Text style={styles.logoText}>K@TEC</Text>
          <Text style={styles.subtitle}>ROHRLETTUNOBBAU UND INDUSTRIEBERVICE</Text> */}
          <Image
            source={require('../../../assets/Mask.png')} // Replace with your actual image path
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

          {/* Verification Content */}
     
            <View style={styles.content}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.description}>
              Enter the 4-digit code sent to your email to verify your identity.
            </Text>

            {/* Hidden TextInput for keyboard */}
            <View style={{ height: 0, overflow: 'hidden' }}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent: { key } }) => {
                    if (key === 'Backspace' && code[index] === '') {
                      focusPreviousField(index);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>

            {/* Visible OTP Boxes */}
            <TouchableOpacity 
              style={styles.codeContainer}
              activeOpacity={1}
              onPress={() => inputRefs.current[0].focus()}
            >
              {[0, 1, 2, 3].map((index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.codeBox,
                    inputRefs.current[index]?.isFocused() && styles.focusedBox
                  ]}
                  onPress={() => inputRefs.current[index].focus()}
                >
                  <Text style={styles.codeText}>{code[index]}</Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>


            {/* Timer */}
            <Text style={styles.timer}>
              {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
            </Text>

            {/* Resend Code */}
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>
                Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('ResetPass')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  waveBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardSecondary,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  timer: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resendLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 38,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});