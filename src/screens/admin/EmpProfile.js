import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView, Platform 
} from 'react-native';
import AppText from '../../components/AppText';
import { colors } from '../../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginAccessTab = ({ employee }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View >
        <AppText style={styles.loginTitle}>Login & Access Panel</AppText>

        <View style={styles.inputGroup}>
          <AppText style={styles.inputLabel}>Email</AppText>
          <TextInput
            style={styles.inputField}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText style={styles.inputLabel}>Password</AppText>
          <TextInput
            style={styles.inputField}
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <AppText style={styles.saveButtonText}>Reset Password</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const AttendanceHistoryTab = () => {
  const [selectedDate, setSelectedDate] = useState(1);
  
  const calendarWeeks = [
    [27, 28, 29, 30, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31]
  ];

  const attendanceRecords = [
    { 
      id: "1", 
      date: "09", 
      day: "THU", 
      color: "#7BC043", 
      punchIn: "09:08 AM", 
      punchOut: "06:00 PM", 
      totalHours: "08:52" 
    },
    { 
      id: "2", 
      date: "08", 
      day: "WED", 
      color: "#FFA500", 
      punchIn: "-------", 
      punchOut: "-------", 
      totalHours: "00:00" 
    },
    { 
      id: "3", 
      date: "07", 
      day: "TUE", 
      color: "#FF4B4B", 
      punchIn: "10:08 AM", 
      punchOut: "06:05 PM", 
      totalHours: "08:13" 
    },
    { 
      id: "4", 
      date: "06", 
      day: "MON", 
      color: "#7BC043", 
      punchIn: "09:08 AM", 
      punchOut: "06:05 PM", 
      totalHours: "08:13" 
    },
    { 
      id: "5", 
      date: "03", 
      day: "FRI", 
      color: "#4CAF50", 
      punchIn: "09:10 AM", 
      punchOut: "06:09 PM", 
      totalHours: "08:13" 
    },
  ];

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.dateContainer, { backgroundColor: item.color }]}>
        <AppText style={styles.dateNumber}>{item.date}</AppText>
        <AppText style={styles.dateDay}>{item.day}</AppText>
      </View>

      <View style={styles.detailsHorizontal}>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{item.punchIn}</AppText>
          <AppText style={styles.label}>Punch In</AppText>
        </View>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{item.punchOut}</AppText>
          <AppText style={styles.label}>Punch Out</AppText>
        </View>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{item.totalHours}</AppText>
          <AppText style={styles.label}>Total Hours</AppText>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.sectionTitle}>December 2024</AppText>
      
      <View style={styles.calendar}>
        <View style={styles.calendarRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
  <View key={`${day}-${index}`} style={styles.calendarDayHeader}>
    <AppText style={styles.calendarDayText}>{day}</AppText>
  </View>
))}
        </View>

        {calendarWeeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.calendarRow}>
            {week.map((day) => (
              <TouchableOpacity
                key={`day-${day}`}
                style={[
                  styles.calendarDay,
                  day === selectedDate && styles.selectedDay
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <AppText style={[
                  styles.calendarDate,
                  day === selectedDate && styles.selectedDateText
                ]}>
                  {day}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={{ height: attendanceRecords.length * 100 }}> {/* Approximate height */}
    <FlatList
      data={attendanceRecords}
      renderItem={renderAttendanceItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  </View>
    </ScrollView>
  );
};

export default function EmpProfile({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Attendance');
  
  const employee = {
    name: 'Henry Arthur',
    role: 'UI/UX Designer',
    status: 'Active',
    email: 'henry.arthur@gmail.com',
    contact: '123 456 789',
    location: '927 Hornblend Street, San Diego, 92109',
    about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    avatar: require('../../../assets/avatar.png'),
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
  >
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Employee Profile</AppText>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeaderRow}>
          <Image source={employee.avatar} style={styles.profileAvatarLg} />
          <View style={{ flex: 1 }}>
            <AppText style={styles.employeeName}>{employee.name}</AppText>
            <AppText style={styles.employeeRole}>{employee.role}</AppText>
            <View style={[
              styles.statusBadge,
              { backgroundColor: employee.status === 'Active' ? '#D4F5E9' : '#FDE7E9' }
            ]}>
              <AppText style={[
                styles.statusText,
                { color: employee.status === 'Active' ? '#17A773' : '#E63946' }
              ]}>
                {employee.status}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={20} color={colors.primary} />
          <AppText style={styles.detailText}>{employee.email}</AppText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={20} color={colors.primary} />
          <AppText style={styles.detailText}>{employee.contact}</AppText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <AppText style={styles.detailText}>{employee.location}</AppText>
        </View>

        <View style={{ marginTop: 8 }}>
          <AppText style={styles.bioText}>{employee.about}</AppText>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Attendance' && styles.activeTab]}
          onPress={() => setActiveTab('Attendance')}
        >
          <AppText style={[styles.tabText, activeTab === 'Attendance' && styles.activeTabText]}>
            Attendance History
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Login' && styles.activeTab]}
          onPress={() => setActiveTab('Login')}
        >
          <AppText style={[styles.tabText, activeTab === 'Login' && styles.activeTabText]}>
            Login & Access
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'Attendance' ? (
          <AttendanceHistoryTab />
        ) : (
          <LoginAccessTab employee={employee} />
        )}
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.background,
    // paddingBottom: 16,
    paddingBottom: 20 ,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 1,
    borderRadius:20
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  employeeRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  bioText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 16,
    marginBottom: 8,
  },
  calendar: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom:10
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarDayHeader: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarDay: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  calendarDate: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  selectedDateText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateContainer: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    width: 55,
  },
  dateNumber: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  dateDay: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  detailsHorizontal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailColumn: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  loginCard: {
    backgroundColor: colors.white,
    padding: 10,
    // marginHorizontal: 16,
    elevation: 2,
    borderRadius:10
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor:colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 38,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#F0F4F8',
    fontWeight: '600',
    fontSize: 14,
  },
});