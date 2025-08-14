import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { colors } from '../theme/colors';
import AppText from '../components/AppText';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';

export default function TaskDetailsScreen({ navigation, route }) {
  const { task } = route.params || {};
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(task?.progress || 0);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const queryClient = useQueryClient();

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ taskId, progress }) => taskService.updateTaskProgress(taskId, progress),
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Task progress updated successfully',
      });
      queryClient.invalidateQueries(['myTasks']);
      setProgressModalVisible(false);
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update task progress',
      });
    },
  });

  // Mark completed mutation
  const markCompletedMutation = useMutation({
    mutationFn: (taskId) => taskService.markTaskCompleted(taskId),
    onSuccess: () => {
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Completed!',
        message: 'Task marked as completed successfully',
      });
      queryClient.invalidateQueries(['myTasks']);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to mark task as completed',
      });
    },
  });

  const isLoading = updateProgressMutation.isPending || markCompletedMutation.isPending;

  if (!task) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <AppText>No task data found.</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const handleUpdateProgress = () => {
    if (task.status === 'completed') {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Task Completed',
        message: 'This task is already completed',
      });
      return;
    }
    setProgressModalVisible(true);
  };

  const submitProgressUpdate = () => {
    if (progressValue < 0 || progressValue > 100) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Invalid Progress',
        message: 'Progress must be between 0 and 100',
      });
      return;
    }
    
    updateProgressMutation.mutate({
      taskId: task._id,
      progress: progressValue,
    });
  };

  const handleMarkCompleted = () => {
    if (task.status === 'completed') {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Already Completed',
        message: 'This task is already marked as completed',
      });
      return;
    }

    setAlertConfig({
      visible: true,
      type: 'warning',
      title: 'Confirm Completion',
      message: 'Are you sure you want to mark this task as completed?',
      showCancel: true,
      onConfirm: () => {
        markCompletedMutation.mutate(task._id);
        closeAlert();
      },
    });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const description = task.description || 'No description provided';
  const shouldTruncate = description.length > 150;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Task Details</AppText>
        </View>

        {/* Task Information */}
        <View style={styles.taskContainer}>
          <AppText style={styles.taskTitle}>{task.title}</AppText>
          
          {/* Description with See More/Less */}
          <View style={styles.descriptionContainer}>
            <AppText style={styles.taskDescription}>
              {shouldTruncate && !showFullDescription 
                ? truncateText(description, 150)
                : description
              }
            </AppText>
            {shouldTruncate && (
              <TouchableOpacity 
                onPress={() => setShowFullDescription(!showFullDescription)}
                style={styles.seeMoreButton}
              >
                <AppText style={styles.seeMoreText}>
                  {showFullDescription ? 'See Less' : 'See More'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Created:</AppText>
            <AppText style={styles.detailValue}>{formatDate(task.createdAt)}</AppText>
          </View>
          
          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Assigned By:</AppText>
            <AppText style={styles.detailValue}>Admin</AppText>
          </View>
          
          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Priority:</AppText>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <AppText style={styles.priorityText}>
                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}
              </AppText>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Status:</AppText>
            <AppText style={[styles.detailValue, { 
              color: task.status === 'completed' ? colors.success : colors.warning,
              fontWeight: '600'
            }]}>
              {task.status === 'inprogress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </AppText>
          </View>
          
          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Progress:</AppText>
            <AppText style={styles.detailValue}>
              {task.status === 'completed' ? '100%' : `${task.progress || 0}%`}
            </AppText>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${task.status === 'completed' ? 100 : task.progress || 0}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, task.status === 'completed' && styles.disabledButton]} 
            onPress={handleUpdateProgress}
            disabled={task.status === 'completed'}
          >
            <Ionicons name="create-outline" size={20} color="white" style={styles.buttonIcon} />
            <AppText style={styles.buttonText}>Update Progress</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.completeButton, task.status === 'completed' && styles.disabledButton]} 
            onPress={handleMarkCompleted}
            disabled={task.status === 'completed'}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" style={styles.buttonIcon} />
            <AppText style={[styles.buttonText, styles.completeButtonText]}>
              {task.status === 'completed' ? 'Already Completed' : 'Mark as Complete'}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Progress Update Modal */}
      <Modal
        visible={progressModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <AppText style={styles.modalTitle}>Update Progress</AppText>
            
            <View style={styles.progressInputContainer}>
              <AppText style={styles.progressLabel}>Progress: {Math.round(progressValue)}%</AppText>
              <TextInput
                style={styles.progressInput}
                value={progressValue.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  if (value >= 0 && value <= 100) {
                    setProgressValue(value);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter progress (0-100)"
                maxLength={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setProgressModalVisible(false)}
              >
                <AppText style={styles.cancelButtonText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.updateButton]} 
                onPress={submitProgressUpdate}
                disabled={updateProgressMutation.isPending}
              >
                <AppText style={styles.updateButtonText}>Update</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Loader visible={isLoading} text="Updating task..." />
      
      <AlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={alertConfig.showCancel}
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
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    color: colors.textPrimary,
  },
  taskContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  seeMoreButton: {
    marginTop: 8,
  },
  seeMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  actionContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    color: colors.white,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
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
  progressInputContainer: {
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: colors.background,
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
  updateButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
