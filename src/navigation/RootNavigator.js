import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './tabs/MainTabs';
import TasksScreen from '../screens/TasksScreen';
import ProfileStack from './ProfileStack';
import SplashScreen from '../screens/AuthScreens/SplashScreen'
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPass from '../screens/AuthScreens/ForgotPass';
import VerificationCodeScreen from '../screens/AuthScreens/VerificationCodeScreen';
import ResetPasswordScreen from '../screens/AuthScreens/ResetPassw';
import EmpProfile from '../screens/admin/EmpProfile';
import AgreementScreen from '../screens/AgreementScreen';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component= {SplashScreen} />
      <Stack.Screen name="Login" component= {LoginScreen} />
      <Stack.Screen name="AgreementScreen" component= {AgreementScreen} />
      <Stack.Screen name="ForgotPass" component= {ForgotPass} />
      <Stack.Screen name="VerifScreen" component= {VerificationCodeScreen} />
      <Stack.Screen name="ResetPass" component={ResetPasswordScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="TaskScreen" component={TasksScreen}  />
      <Stack.Screen name="Profile" component={ProfileStack} />
      <Stack.Screen name="EmpProfile" component={EmpProfile} />
    </Stack.Navigator>
  );
}


