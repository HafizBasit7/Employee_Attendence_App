import React from 'react';
import { Text } from 'react-native';
import { colors } from '../theme/colors';

export default function AppText({ children, style, ...rest }) {
  return (
    <Text style={[{ color: colors.textPrimary }, style]} {...rest}>
      {children}
    </Text>
  );
}


