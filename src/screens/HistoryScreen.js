import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from '@tanstack/react-query';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';
import NotificationIcon from '../components/NotificationIcon';

export default function HistoryScreen({ navigation }) {
  const [showNotifications, setShowNotifications] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start'); // 'start' or 'end'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(null); // Temporary dates for modal
  const [tempEndDate, setTempEndDate] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { user } = useAuth();

  // Fetch attendance history - only when dates are applied or initial load
  const { 
    data: attendanceData, 
    isLoading, 
    refetch, 
    isRefetching 
  } = useQuery({
    queryKey: ['attendanceHistory', startDate, endDate],
    queryFn: () => attendanceService.getMyHistory({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      limit: 50,
    }),
    enabled: true, // Always enabled, but dates are only set on Apply Filter
  });

  const attendanceRecords = attendanceData?.data?.records || [];
  const totalHours = attendanceData?.data?.totalHours || 0;



  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '--:--';
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getAttendanceColor = (record) => {
    if (!record.checkInAt || !record.checkOutAt) return colors.danger; // Red for incomplete
    
    const diffMs = new Date(record.checkOutAt) - new Date(record.checkInAt);
    const hours = diffMs / (1000 * 60 * 60);
    
    if (hours >= 8) return colors.success; // Green for full day
    if (hours >= 4) return colors.warning; // Orange for half day
    return colors.danger; // Red for less than half day
  };

  const handleDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerMode === 'start') {
        setTempStartDate(selectedDate);
      } else {
        setTempEndDate(selectedDate);
      }
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setTempStartDate(null);
    setTempEndDate(null);
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    // Validate dates before applying filter
    if (!tempStartDate || !tempEndDate) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Validation Error',
        message: 'Please select both start date and end date.',
      });
      return;
    }

    if (tempStartDate > tempEndDate) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Invalid Date Range',
        message: 'Start date must be earlier than or equal to end date.',
      });
      return;
    }

    // Apply the dates and trigger the query
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowFilterModal(false);
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  const renderAttendanceItem = ({ item: record }) => (
    <View style={styles.card}>
      {/* Date Section */}
      <View style={[styles.dateContainer, { backgroundColor: getAttendanceColor(record) }]}>
        <AppText style={styles.dateNumber}>
          {new Date(record.checkInAt).getDate().toString().padStart(2, '0')}
        </AppText>
        <AppText style={styles.dateDay}>
          {new Date(record.checkInAt).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
        </AppText>
      </View>

      {/* Details Section */}
      <View style={styles.detailsHorizontal}>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{formatTime(record.checkInAt)}</AppText>
          <AppText style={styles.label}>Check In</AppText>
        </View>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{formatTime(record.checkOutAt)}</AppText>
          <AppText style={styles.label}>Check Out</AppText>
        </View>
        <View style={styles.detailColumn}>
          <AppText style={styles.time}>{formatDuration(record.checkInAt, record.checkOutAt)}</AppText>
          <AppText style={styles.label}>Duration</AppText>
        </View>
      </View>
    </View>
  );

  if (isLoading && !isRefetching) {
    return <Loader visible={true} text="Loading attendance history..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* User Header with Notification */}
      <View style={styles.header}>
        <View style={styles.userInfo}>  
        <TouchableOpacity 
    style={styles.profileSection} 
    onPress={() => navigation.navigate('Profile')} 
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
          <View>
              <AppText style={styles.userName}>{user?.name || 'User'}</AppText>
              <AppText style={styles.taskCount}>Total: {totalHours.toFixed(2)} hours</AppText>
          </View>
          </TouchableOpacity>
        </View>
        <NotificationIcon navigation={navigation} />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Initialize temp dates with current applied dates when opening modal
            setTempStartDate(startDate);
            setTempEndDate(endDate);
            setShowFilterModal(true);
          }}
        >
          <Ionicons name="filter" size={20} color={colors.primary} />
          <AppText style={styles.filterButtonText}>
            {startDate || endDate ? 'Filtered' : 'Filter by Date'}
          </AppText>
        </TouchableOpacity>

        {(startDate || endDate) && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <Ionicons name="close" size={16} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      {/* Current Filter Display */}
      {(startDate || endDate) && (
        <View style={styles.filterDisplay}>
          <AppText style={styles.filterText}>
            {startDate && endDate 
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : startDate 
                ? `From ${formatDate(startDate)}`
                : `Until ${formatDate(endDate)}`
            }
          </AppText>
        </View>
      )}

      {/* Total Hours Display */}
      <View style={styles.totalHoursContainer}>
        <AppText style={styles.totalHoursLabel}>Total Hours Worked</AppText>
        <AppText style={styles.totalHoursValue}>{totalHours.toFixed(2)} hrs</AppText>
      </View>

      {/* Attendance List */}
      <FlatList
      showsVerticalScrollIndicator={false}
        data={attendanceRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clock-outline" size={64} color={colors.textSecondary} />
            <AppText style={styles.emptyText}>No attendance records</AppText>
            <AppText style={styles.emptySubtext}>
              {startDate || endDate 
                ? 'No records found for the selected period'
                : 'Start checking in to see your attendance history'
              }
            </AppText>
                </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <AppText style={styles.modalTitle}>Filter by Date Range</AppText>
            
            <View style={styles.dateFilterContainer}>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  setDatePickerMode('start');
                  setShowDatePicker(true);
                }}
              >
                <AppText style={styles.dateButtonLabel}>Start Date</AppText>
                <AppText style={styles.dateButtonText}>
                  {tempStartDate ? formatDate(tempStartDate) : 'Select Date'}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  setDatePickerMode('end');
                  setShowDatePicker(true);
                }}
              >
                <AppText style={styles.dateButtonLabel}>End Date</AppText>
                <AppText style={styles.dateButtonText}>
                  {tempEndDate ? formatDate(tempEndDate) : 'Select Date'}
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowFilterModal(false)}
              >
                <AppText style={styles.cancelButtonText}>Cancel</AppText>
              </TouchableOpacity>
                  <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]} 
                onPress={applyFilters}
              >
                <AppText style={styles.applyButtonText}>Apply Filter</AppText>
                  </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
                    {showDatePicker && (
                <DateTimePicker
                  value={datePickerMode === 'start' ? (tempStartDate || new Date()) : (tempEndDate || new Date())}
                  mode="date"
                  display="default"
                  onChange={handleDatePickerChange}
                  maximumDate={new Date()}
                />
              )}

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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontSize: 22, fontWeight: "600", color: colors.textPrimary },
  taskCount: { fontSize: 14, color: colors.textSecondary },
  userInfo:{flexDirection:"row", textAlign:"center"},


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
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    flex: 1,
  },
  filterButtonText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '600',
  },
  clearButton: {
    marginLeft: 12,
    padding: 8,
  },
  filterDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  totalHoursContainer: {
    backgroundColor: colors.card,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  totalHoursLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalHoursValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateFilterContainer: {
    marginBottom: 24,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dateButtonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});