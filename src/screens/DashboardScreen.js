import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { attendanceService } from "../services/attendanceService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import AlertModal from "../components/AlertModal";
import NotificationIcon from "../components/NotificationIcon";
import * as Device from 'expo-device';

export default function DashboardScreen({ navigation }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get today's attendance status
  const { data: todayStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['todayStatus'],
    queryFn: attendanceService.getTodayStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: ({ lat, lon }) => attendanceService.checkIn(lat, lon),
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Check-in successful',
      });
      queryClient.invalidateQueries(['todayStatus']);
    },
    onError: (error) => {

      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Check-in Failed',
        message: error.message || 'Failed to check in',
      });
    },
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: ({ lat, lon }) => attendanceService.checkOut(lat, lon),
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Check-out successful',
      });
      queryClient.invalidateQueries(['todayStatus']);
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Check-out Failed',
        message: error.message || 'Failed to check out',
      });
    },
  });

  const isLoading = checkInMutation.isPending || checkOutMutation.isPending;

  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAlertConfig({
            visible: true,
            type: 'warning',
            title: 'Permission Required',
            message: 'Location permission is required for attendance tracking',
          });
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setAlertConfig({
          visible: true,
          type: 'error',
          title: 'Location Error',
          message: 'Unable to get your current location',
        });
      }
    })();
  }, []);

  // Calculate elapsed time and check if user is currently checked in
  const todayRecord = todayStatus?.data?.records?.[0];
  const isCheckedIn = todayRecord && !todayRecord.checkOutAt;
  const isPlaying = isCheckedIn;

  // Format time in HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  // Calculate elapsed time if checked in
  useEffect(() => {
    if (isCheckedIn && todayRecord?.checkInAt) {
      const checkInTime = new Date(todayRecord.checkInAt).getTime();
      const updateElapsedTime = () => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - checkInTime) / 1000);
        setElapsedTime(elapsed);
      };
      
      updateElapsedTime();
      const interval = setInterval(updateElapsedTime, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [isCheckedIn, todayRecord]);

const securityCheck = async () => {
  if (Device.isDevice) { 
    const isRooted = await Device.isRootedExperimentalAsync();
    if (isRooted) {
     return {status: false, message: 'Sorry could not perform check-in/out, device is rooted/jailbroken.'}
    } 
  } 
  
  else {
    return {status: false, message: 'Emulator detected, Not running on a physical device!'}
  }
  return {status: true, message: 'Device is not rooted/jailbroken.'}
}

  // Handle check in/out
  const handleAttendance = async () => {
    setLoaderVisible(true);
    if (!currentLocation) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Location Required',
        message: 'Please enable location services to continue',
      });
      setLoaderVisible(false);
      return;
    }

   const security = await securityCheck();
   if (!security.status) {
    setAlertConfig({
      visible: true,
      type: 'error',
      title: 'Security Check Failed',
      message: security.message,
    });
    setLoaderVisible(false);
    return;
   }
    try {
      // Get fresh location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const coords = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
     

      if (!isCheckedIn) {
        // Check In
        checkInMutation.mutate(coords);
      } else {
        // Check Out
        checkOutMutation.mutate(coords);
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Location Error',
        message: 'Unable to get your current location. Please try again.',
      });
    } finally {
      setLoaderVisible(false);
    }
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  // Update current time every second
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get attendance display data
  const getAttendanceDisplayData = () => {
    if (todayRecord) {
      const checkInTime = todayRecord.checkInAt 
        ? new Date(todayRecord.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:--';
      
      const checkOutTime = todayRecord.checkOutAt
        ? new Date(todayRecord.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:--';
      
      let totalHours = '--:--';
      if (todayRecord.checkOutAt) {
        const checkIn = new Date(todayRecord.checkInAt);
        const checkOut = new Date(todayRecord.checkOutAt);
        const diffMs = checkOut - checkIn;
        const diffSeconds = Math.floor(diffMs / 1000);
        totalHours = formatTime(diffSeconds);
      } else if (isCheckedIn) {
        totalHours = formatTime(elapsedTime);
      }
      
      return { checkInTime, checkOutTime, totalHours };
    }
    
    return { checkInTime: '--:--', checkOutTime: '--:--', totalHours: '--:--' };
  };

  const { checkInTime, checkOutTime, totalHours } = getAttendanceDisplayData();

  if (statusLoading) {
    return <Loader visible={true} text="Loading dashboard..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity 
    style={styles.profileSection} 
    onPress={() => navigation.navigate('Profile')} // change to your screen name
    activeOpacity={0.7}
  >
        <Image
          source={
            user?.profilePicture 
              ? { uri: user.profilePicture }
              : require('../../assets/avatar.png')
          } 
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <AppText style={styles.userName}>{user?.name || 'User'}</AppText>
          <AppText style={styles.taskCount}>Welcome Back!!</AppText>
        </View>
        </TouchableOpacity>
        <NotificationIcon navigation={navigation} size={26} />
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
            {checkInTime}
          </AppText>
          <AppText style={styles.attendanceLabel}>Check In</AppText>
        </View>
        
        <View style={styles.attendanceColumn}>
          <Ionicons name="log-out-outline" size={28} color={colors.danger} />
          <AppText style={styles.attendanceTime}>
            {checkOutTime}
          </AppText>
          <AppText style={styles.attendanceLabel}>Check Out</AppText>
        </View>
        
        <View style={styles.attendanceColumn}>
          <Ionicons name="time-outline" size={28} color={colors.success} />
          <AppText style={styles.attendanceTime}>
            {totalHours}
          </AppText>
          <AppText style={styles.attendanceLabel}>Total Hours</AppText>
        </View>
      </View>

      <Loader visible={isLoading || loaderVisible} text={isCheckedIn ? "Checking out..." : "Checking in..."} />
      
      <AlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
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
    paddingTop: 0,
    
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