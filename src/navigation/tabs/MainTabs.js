import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../../screens/DashboardScreen';
import AssignmentsScreen from '../../screens/AssignmentsScreen';
import HistoryScreen from '../../screens/HistoryScreen';
import { colors } from '../../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: colors.card, 
          borderTopColor: colors.border,
          height: 60 + insets.bottom, // Add bottom inset to height
          paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let iconSize = 24;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Assignments') {
            iconName = 'assignment';
          } else if (route.name === 'History') {
            iconName = 'history';
          }

          return <MaterialIcons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarLabel: 'HOME' }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={AssignmentsScreen} 
        options={{ tabBarLabel: 'ASSIGNMENTS' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarLabel: 'HISTORY' }}
      />
    </Tab.Navigator>
  );
}