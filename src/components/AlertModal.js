import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';

const AlertModal = ({ 
  visible = false, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  title, 
  message, 
  onClose,
  onConfirm,
  showCancel = false,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: colors.success };
      case 'error':
        return { name: 'close-circle', color: colors.danger };
      case 'warning':
        return { name: 'warning', color: colors.warning };
      default:
        return { name: 'information-circle', color: colors.info };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={iconConfig.name} 
              size={48} 
              color={iconConfig.color} 
            />
          </View>
          
          {title && <AppText style={styles.title}>{title}</AppText>}
          {message && <AppText style={styles.message}>{message}</AppText>}
          
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <AppText style={styles.cancelButtonText}>{cancelText}</AppText>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={onConfirm || onClose}
            >
              <AppText style={styles.confirmButtonText}>{confirmText}</AppText>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AlertModal;
