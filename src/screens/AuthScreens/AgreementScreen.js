import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import AppText from '../../components/AppText';
import { colors } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgreementScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('terms');
  
  // Sample content for both tabs
  const termsContent = `
    Lorem ipsum dolor sit amet consectetur adipiscing elit faucibus duis ante montes potenti, aenean rhoncus gravida platea mus neque leo pretium dictum in condimentum. Curae semper euismod neque volutpat ullamcorper aenean sodales hac, vivamus vulputate pulvinar tincidunt integer cum diam ad urna, risus mollis sed natoque placerat augue cras. Commodo magnis in ultrices diam facilisis sagittis ante, vestibulum senectus augue tempor eros eleifend per semper, facilisis ad risus sociis ligula integer.

    Torquent platea netus vulputate suspendisse nec ut, consequat praesent proin per auctor libero potenti, mollis maecenas aptent tempor dignissim. Imperdiet suscipit risus sagittis laculis eget justo convallis blandit fringilla, facilisis nec nulla massa congue hendrerit himenaeos per. In senectus ligula est nisi ullamcorper volutpat auctor, eleifend at torquent neque montes nostra.
  `;

  const privacyContent = `
    Privacy Policy Content Goes Here. This would be different text specifically about your privacy policy.

    Adipiscing elit faucibus duis ante montes potenti, aenean rhoncus gravida platea mus neque leo pretium dictum in condimentum. Curae semper euismod neque volutpat ullamcorper aenean sodales hac, vivamus vulputate pulvinar tincidunt integer cum diam ad urna.

    Data collection and usage policies would be described here in detail for your users to review.
  `;

  const handleContinue = () => {
    navigation.navigate('Main'); 
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* Header with Time */}
      <View style={styles.header}>
        <AppText style={styles.timeText}>9:41</AppText>
      </View>

      {/* Title */}
      <AppText style={styles.title}>Agreement</AppText>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('terms')}
        >
          <AppText style={activeTab === 'terms' ? styles.tabTextActive : styles.tabText}>
            Terms & Conditions
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('privacy')}
        >
          <AppText style={activeTab === 'privacy' ? styles.tabTextActive : styles.tabText}>
            Privacy Policy
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <AppText style={styles.contentText}>
          {activeTab === 'terms' ? termsContent : privacyContent}
        </AppText>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <AppText style={styles.continueButtonText}>Continue</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  timeText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    paddingBottom: 10,
    marginHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});