import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AppText from './AppText';

export default function AppHeader({ title, right, onBack, showBackButton }) {
  return (
    <View style={styles.container}>
      {/* Left container */}
      <View style={styles.sideContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center title */}
      <AppText style={styles.title}>{title}</AppText>

      {/* Right container */}
      <View style={styles.sideContainer}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  sideContainer: {
    width: 50, // fixed width so left & right balance for centered title
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22, // optional for circular touch area
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
