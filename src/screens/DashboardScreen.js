import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, Animated } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

export default function DashboardScreen({ navigation }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({
    checkIn: null,
    checkOut: null,
    totalHours: null
  });

  // Format time in HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  // Handle check in/out
  const handleAttendance = () => {
    if (!isCheckedIn) {
      // Check In
      setIsCheckedIn(true);
      setIsPlaying(true);
      setAttendanceRecords({
        ...attendanceRecords,
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      // Check Out
      setIsCheckedIn(false);
      setIsPlaying(false);
      setAttendanceRecords({
        ...attendanceRecords,
        checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        totalHours: formatTime(elapsedTime)
      });
      setElapsedTime(0);
    }
  };

  // Update current time every second
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isCheckedIn) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity 
    style={styles.profileSection} 
    onPress={() => navigation.navigate('Profile')} // change to your screen name
    activeOpacity={0.7}
  >
        <Image
          source={require('../../assets/avatar.png')} 
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <AppText style={styles.userName}>Adam Bartford</AppText>
          <AppText style={styles.taskCount}>7 task for you today</AppText>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Current Time */}
      <View style={styles.datetimeContainer}>
        <AppText style={styles.time}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </AppText>
        <AppText style={styles.date}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </AppText>
      </View>

      {/* Circular Check In/Out Button */}
      <View style={styles.circleContainer}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={86400} // 24 hours in seconds
          colors={[
            isCheckedIn ? colors.warning : colors.success, // Yellow when checked in, green when not
            colors.danger // Red when checked out
          ]}
          colorsTime={[28800, 14400, 0]} // 8h, 4h, 0h
          strokeWidth={8}
          trailColor={colors.cardSecondary}
          size={170}
          onUpdate={(remainingTime) => {
            // Not using remainingTime since we track elapsedTime separately
          }}
        >
          {({ remainingTime }) => (
            <TouchableOpacity 
              style={styles.circleInner}
              onPress={handleAttendance}
              activeOpacity={0.7}
              
            >
              <Ionicons 
                name="finger-print-outline" 
                size={28} 
                color={isCheckedIn ? colors.danger : colors.success} 
              />
              <AppText style={styles.checkText}>
                {isCheckedIn ? 'CHECK OUT' : 'CHECK IN'}
              </AppText>
            </TouchableOpacity>
          )}
        </CountdownCircleTimer>
      </View>

      {/* Timer Display */}
      <View style={styles.noticeContainer}>
        {isCheckedIn ? (
          <>
            <View style={styles.dot} />
            <AppText style={styles.noticeText}>
              {formatTime(elapsedTime)}
            </AppText>
          </>
        ) : (
          <>
            <View style={styles.dot} />
            <AppText style={styles.noticeText}>
              {/* Minimum half day time required */}
            </AppText>
          </>
        )}
      </View>

      {/* Attendance Details */}
      <View style={styles.attendanceDetails}>
        <View style={styles.attendanceColumn}>
          <Ionicons name="log-in-outline" size={28} color={colors.primary} />
          <AppText style={styles.attendanceTime}>
            {attendanceRecords.checkIn || '--:--'}
          </AppText>
          <AppText style={styles.attendanceLabel}>Check In</AppText>
        </View>
        
        <View style={styles.attendanceColumn}>
          <Ionicons name="log-out-outline" size={28} color={colors.danger} />
          <AppText style={styles.attendanceTime}>
            {attendanceRecords.checkOut || '--:--'}
          </AppText>
          <AppText style={styles.attendanceLabel}>Check Out</AppText>
        </View>
        
        <View style={styles.attendanceColumn}>
          <Ionicons name="time-outline" size={28} color={colors.success} />
          <AppText style={styles.attendanceTime}>
            {attendanceRecords.totalHours || '--:--'}
          </AppText>
          <AppText style={styles.attendanceLabel}>Total Hours</AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // takes available space
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12 
  },
  userName: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: colors.textPrimary 
  },
  taskCount: { 
    fontSize: 14, 
    color: colors.textSecondary 
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  datetimeContainer: { 
    alignItems: 'center', 
    marginVertical: 36 
  },
  time: { 
    fontSize: 56, 
    fontWeight: '700', 
    color: colors.textPrimary 
  },
  date: { 
    fontSize: 16, 
    color: colors.textSecondary, 
    marginTop: 4,
    marginBottom:'40' 
  },
  circleContainer: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
  circleInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  checkText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  noticeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.warning,
    borderRadius: 4,
    marginRight: 6,
  },
  noticeText: { 
    fontSize: 14, 
    color: colors.textSecondary 
  },
  attendanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  attendanceColumn: { 
    alignItems: 'center' 
  },
  attendanceTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
  },
  attendanceLabel: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: 4 
  },
});