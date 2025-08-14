import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Switch,
  TouchableWithoutFeedback
} from 'react-native';
import AppText from '../../components/AppText';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmployeeScreen({ navigation }) {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Henry Arthur',
      status: 'Active',
      email: 'jones.simth@domain.com',
      role: 'Role Tile',
      avatar: require('../../../assets/avatar.png'),
      active: true,
    },
    {
      id: 2,
      name: 'Henry Arthur',
      status: 'Active',
      email: 'jones.simth@domain.com',
      role: 'Role Tile',
      avatar: require('../../../assets/avatar.png'),
      active: true,
    },
    {
      id: 3,
      name: 'Henry Arthur',
      status: 'Active',
      email: 'jones.simth@domain.com',
      role: 'Role Tile',
      avatar: require('../../../assets/avatar.png'),
      active: true,
    },
    {
      id: 4,
      name: 'Henry Arthur',
      status: 'Inactive',
      email: 'jones.simth@domain.com',
      role: 'Role Tile',
      avatar: require('../../../assets/avatar.png'),
      active: false,
    },
    {
      id: 5,
      name: 'Henry Arthur',
      status: 'Inactive',
      email: 'jones.simth@domain.com',
      role: 'Role Tile',
      avatar: require('../../../assets/avatar.png'),
      active: false,
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleStatus = id => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, active: !emp.active, status: emp.active ? 'Inactive' : 'Active' } : emp
      )
    );
  };

  const openOptionsMenu = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleEdit = () => {
    closeModal();
    // Navigate to edit screen or implement edit functionality
    navigation.navigate('EditEmployee', { employee: selectedEmployee });
  };

  const handleDelete = () => {
    closeModal();
    // Implement delete functionality
    setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
  };
  
  const navigateToProfile = (employee) => {
    navigation.navigate('EmpProfile', { employee });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Image source={require('../../../assets/avatar.png')} style={styles.avatar} />
          <View>
            <AppText style={styles.greetingHi}>Hi John</AppText>
            <AppText style={styles.greetingSub}>Good Morning!</AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bellWrap} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search Agents"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
          />
        </View>
		<TouchableOpacity style={styles.addNewBtn} activeOpacity={0.9} onPress={()=>{navigation.navigate('Employees')}}>
            <AppText style={styles.addNewText}>Add New +</AppText>
          </TouchableOpacity>

        {/* Employee Cards */}
     
           {employees.map(emp => (
			<TouchableOpacity 
			  key={emp.id} 
			  style={styles.card}
			  onPress={() => navigateToProfile(emp)}
			  activeOpacity={0.8}
			>
            <Image source={emp.avatar} style={styles.empAvatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <AppText style={styles.empName}>{emp.name}</AppText>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: emp.status === 'Active' ? '#D4F5E9' : '#FDE7E9' },
                  ]}
                >
                  <AppText
                    style={[
                      styles.statusText,
                      { color: emp.status === 'Active' ? '#17A773' : '#E63946' },
                    ]}
                  >
                    {emp.status}
                  </AppText>
                </View>
              </View>
              <AppText
                style={[
                  styles.email,
                  { color: emp.status === 'Inactive' ? colors.textSecondary : colors.textSecondary },
                ]}
              >
                {emp.email}
              </AppText>
              <AppText style={styles.role}>{emp.role}</AppText>
            </View>

            <Switch
              value={emp.active}
              onValueChange={() => toggleStatus(emp.id)}
              trackColor={{ false: '#DADADA', true: '#17A773' }}
              thumbColor="#fff"
            />
        <TouchableOpacity 
              style={styles.menuBtn} 
              onPress={() => openOptionsMenu(emp)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
			</TouchableOpacity>

        ))}
      </ScrollView>
	  {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Employee Options</AppText>
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <AppText style={styles.modalOptionText}>Edit Employee</AppText>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <AppText style={[styles.modalOptionText, { color: colors.danger }]}>
                Delete Employee
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  greetingHi: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  greetingSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bellWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  notificationDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.danger,
    position: 'absolute', top: 6, right: 6,
  },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 28 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
    marginBottom: 16,
  },
  addNewBtn: {
	flexDirection: 'row',
    // marginLeft: 10,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#E63B45',
	backgroundColor:colors.primary,
	marginBottom:15
  },
  addNewText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  searchInput: { flex: 1, fontSize: 13, color: colors.textPrimary, paddingVertical: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  empAvatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  empName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginRight: 6 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  email: { fontSize: 12, marginBottom: 2 },
  role: { fontSize: 12, color: '#2A6AF2', fontWeight: '500' },
  menuBtn: { marginLeft: 6, padding: 4 },

   // Modal styles
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '100%',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOption: {
    padding: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
});

