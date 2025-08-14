import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { colors } from '../theme/colors';
import AppText from './AppText';

const Loader = ({ visible = false, text = 'Loading...' }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator 
            size="large" 
            color={colors.primary} 
            style={styles.spinner}
          />
          <AppText style={styles.text}>{text}</AppText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default Loader;
