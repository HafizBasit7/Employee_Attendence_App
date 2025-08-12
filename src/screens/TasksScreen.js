import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { colors } from '../theme/colors';
import AppHeader from '../components/AppHeader';

export default function TaskDetailsScreen({ route, navigation }) {
  const { assignment } = route.params;

  return (
    <Screen>
      <AppHeader 
        title="Abc Task Details" 
        onBack={() => navigation.goBack()}
        showBackButton={true}
      />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section */}
        <View style={styles.progressContainer}>
              {/* <AppText style={styles.progressLabel}>Progress</AppText> */}
              {assignment.progress.includes('%') ? (
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: assignment.progress }
                    ]} 
                  />
                </View>
              ) : (
                <AppText style={styles.completedText}>{assignment.progress}</AppText>
              )}
            </View>
        <View style={styles.section}>
        <View style={styles.progressRow}>
  <AppText style={styles.sectionTitle}>Progress</AppText>
  <AppText style={styles.progressPercentage}>{assignment.progress}</AppText>
</View>

          <AppText style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit faucibus duis ante montes potenti, 
            aenean rhoncus gravida platea mus neque leo pretium dictum in ______.
          </AppText>
        </View>

        {/* Details Sections */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>Category:</AppText>
            <AppText style={styles.detailValue}>Lorem ipsum </AppText>
          </View>
          
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>Task Date:</AppText>
            <AppText style={styles.detailValue}>Feb 25, 2024</AppText>
          </View>
          
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>Start time:</AppText>
            <AppText style={styles.detailValue}>4:30 PM</AppText>
          </View>
          
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>End time:</AppText>
            <AppText style={styles.detailValue}>10:30 PM</AppText>
          </View>
          
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>Assigned by:</AppText>
            <AppText style={styles.detailValue}>Admin </AppText>
          </View>
          
          <View style={styles.detailItem}>
            <AppText style={styles.detailLabel}>Priority:</AppText>
            <AppText style={styles.detailValue}>Medium </AppText>
          </View>
        </View>

        {/* Complete Button */}
        {assignment.status !== 'Completed' && (
          <TouchableOpacity 
            style={styles.completeButton}
            activeOpacity={0.8}
          >
            <AppText style={styles.completeButtonText}>Mark as completed</AppText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // keep them vertically aligned
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign:'right'
  },
  description: {
    paddingTop:10,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  detailsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 16,
    width: 80,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});