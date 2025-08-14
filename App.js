import 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { StyleSheet } from "react-native";
 import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}> */}
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor={colors.surface} />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      {/* </SafeAreaView> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // Use your theme's background color
  },
});