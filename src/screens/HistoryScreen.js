import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(1); // Default to Dec 1
  const [showNotifications, setShowNotifications] = useState(true); // Notification badge state

  // Calendar data for December 2024
  const calendarWeeks = [
    [27, 28, 29, 30, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31]
  ];

  const attendanceRecords = [
    { id: "1", date: "09", day: "THU", color: "#7BC043", punchIn: "09:08 AM", punchOut: "06:00 PM", totalHours: "08:52" },
    { id: "2", date: "08", day: "WED", color: "#FFA500", punchIn: "-------", punchOut: "-------", totalHours: "00:00" },
    { id: "3", date: "07", day: "TUE", color: "#FF4B4B", punchIn: "10:08 AM", punchOut: "06:05 PM", totalHours: "08:13" },
    { id: "4", date: "06", day: "MON", color: "#7BC043", punchIn: "09:08 AM", punchOut: "06:05 PM", totalHours: "08:13" },
    { id: "5", date: "03", day: "FRI", color: "#4CAF50", punchIn: "09:10 AM", punchOut: "06:09 PM", totalHours: "08:13" },
  ];



  return (
    <Screen>
      {/* User Header with Notification */}
      <View style={styles.header}>
        <View style={styles.userInfo}>  
        <TouchableOpacity 
    style={styles.profileSection} 
    onPress={() => navigation.navigate('Profile')} 
    activeOpacity={0.7}
  >
          <Image 
            source={require('../../assets/avatar.png')} 
            style={styles.avatar}
          />
          <View>
            <AppText style={styles.userName}>Adam Bartford</AppText>
            <AppText style={styles.taskCount}>7 tasks for you today</AppText>
          </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.notificationIcon}
          onPress={() => setShowNotifications(false)}
        >
          <MaterialCommunityIcons name="bell" size={24} color={colors.textPrimary} />
          {showNotifications && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Calendar Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>December 2024</AppText>
          <View style={styles.calendar}>
            {/* Calendar Header */}
            <View style={styles.calendarRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <View key={day} style={styles.calendarDayHeader}>
                  <AppText style={styles.calendarDayText}>{day}</AppText>
                </View>
              ))}
            </View>

            {/* Calendar Days */}
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
        </View>

        <FlatList
  data={attendanceRecords}
  keyExtractor={(item) => item.id}
  scrollEnabled={false}
  contentContainerStyle={{ marginTop: 8 }}
  renderItem={({ item }) => (
    <View style={styles.card}>
      {/* Date Section */}
      <View style={[styles.dateContainer, { backgroundColor: item.color }]}>
        <AppText style={styles.dateNumber}>{item.date}</AppText>
        <AppText style={styles.dateDay}>{item.day}</AppText>
      </View>

      {/* Details Section */}
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
  )}
/>


      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1, // takes available space
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 22, fontWeight: "600", color: colors.textPrimary },
  taskCount: { fontSize: 14, color: colors.textSecondary },
  userInfo:{flexDirection:"row", textAlign:"center"},

  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  section: {
    marginBottom: 24,
    color:colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  calendar: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
  
  
});