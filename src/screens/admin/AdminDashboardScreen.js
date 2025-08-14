import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  
  ScrollView,
  TextInput,
} from 'react-native';
import AppText from '../../components/AppText';
import { colors } from '../../theme/colors';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

const chartData = {
	Weekly: {
	  percentages: [30, 50, 70, 90, 60, 40, 20],
	  completed: "1,850.75",
	  inProgress: "2,120.50",
	  months: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	},
	Monthly: {
	  percentages: [10, 30, 50, 70, 90, 60, 40, 20, 30, 50, 70, 90],
	  completed: "2,540.02",
	  inProgress: "2,540.02",
	  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	},
	Annual: {
	  percentages: [20, 40, 60, 80],
	  completed: "12,450.80",
	  inProgress: "10,320.40",
	  months: ['Q1', 'Q2', 'Q3', 'Q4']
	}
  };


export default function AdminDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Monthly');
  const [searchQuery, setSearchQuery] = useState('');

  const currentData = chartData[activeTab];

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
          <View style={{ flex: 1 }}>
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
        {/* Search + Add New */}
        <View style={styles.row}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Find your employees and tasks"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.addNewBtn} activeOpacity={0.9} onPress={()=>{navigation.navigate('Employees')}}>
            <AppText style={styles.addNewText}>Add New</AppText>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          {['Weekly', 'Monthly', 'Annual'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabBtn}
              activeOpacity={0.7}
            >
              <AppText style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </AppText>
              {activeTab === tab && <View style={styles.activeUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Card (styled to look like the mock) */}
        <View style={styles.chartCard}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            {['100%', '80%', '60%', '40%', '20%', '10%'].map((t, i) => (
              <AppText key={i} style={styles.yTick}>{t}</AppText>
            ))}
          </View>

          {/* Plot area */}
          <View style={styles.plotArea}>
            {/* faint grid */}
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[styles.gridLine, { top: (i * 20) + '%' }]} />
            ))}

			  {/* Dynamic bars based on selected period */}
			  <View style={styles.barsContainer}>
              {currentData.percentages.map((percent, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={[styles.bar, { height: `${percent}%` }]} />
                </View>
              ))}
            </View>

            {/* “area” shape (solid with opacity to avoid extra deps) */}
            {/* <View style={styles.areaShape} /> */}

            {/* dashed vertical guide near Jun */}
            {/* <View style={styles.dashGuide} /> */}

            {/* markers + callouts */}
            <View style={[styles.dot, { left: '38%', top: '42%' }]} />
            <View style={[styles.dotBlue, { left: '36%', top: '60%' }]} />

            <View style={[styles.callout, { left: '44%', top: '32%' }]}>
              <AppText style={styles.calloutTitle}>Completed</AppText>
              {/* <AppText style={styles.calloutValue}>2,540.02</AppText> */}
			  <AppText style={styles.calloutValue}>{currentData.completed}</AppText>
			</View>

            <View style={[styles.calloutBlue, { left: '34%', top: '64%' }]}>
              <AppText style={styles.calloutTitle}>In-progress</AppText>
              {/* <AppText style={styles.calloutValue}>2,540.02</AppText> */}
			  <AppText style={styles.calloutValue}>{currentData.inProgress}</AppText>
            </View>

           {/* Dynamic X-axis labels */}
		   <View style={styles.monthsRow}>
              {currentData.months.map(m => (
                <AppText key={m} style={styles.monthTxt}>{m}</AppText>
              ))}
            </View>
          </View>
        </View>

        {/* Four metric cards (2x2) */}
        <View style={styles.cardsGrid}>
          <MetricCard
            accentColor="#E63946"
            title="Total Employees"
            value="54,20.01"
            delta="+2,04% this month"
          />
          <MetricCard
            accentColor="#F4A100"
            title="Pending Assignments"
            value="54,20.01"
            delta="+2,04% this month"
          />
          <MetricCard
            accentColor="#2A6AF2"
            title="in-progress Assignments"
            value="54,20.01"
            delta="+2,04% this month"
          />
          <MetricCard
            accentColor="#17A773"
            title="Completed Assignments"
            value="54,20.01"
            delta="+2,04% this month"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ title, value, delta, accentColor }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />
      <View style={{ padding: 14 }}>
        <AppText style={styles.metricTitle}>{title}</AppText>
        <AppText style={styles.metricValue}>{value}</AppText>

        <View style={styles.deltaRow}>
          <Feather name="arrow-up-right" size={14} color={colors.textSecondary} />
          <AppText style={styles.deltaText}>{delta}</AppText>
        </View>
      </View>
    </View>
  );
}

const CARD_RADIUS = 16;

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

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.textPrimary, paddingVertical: 0 },

  addNewBtn: {
    marginLeft: 10,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#E63B45',
	backgroundColor:colors.primary
  },
  addNewText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  tabsWrap: {
    flexDirection: 'row',
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary, fontWeight: '700' },
  activeUnderline: { height: 2, width: '50%', backgroundColor: '#E63B45', marginTop: 8, borderRadius: 2 },

  chartCard: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  yAxis: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 56,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  yTick: { fontSize: 10, color: colors.textSecondary },

  plotArea: {
    marginLeft: 40,
    height: 180,
    borderRadius: 14,
    backgroundColor: '#F7FAF8',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
  },
  areaShape: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '65%',
    backgroundColor: 'rgba(23,167,115,0.25)', // soft green fill
    borderTopLeftRadius: 12,
    borderTopRightRadius: 220,
    transform: [{ skewX: '-8deg' }],
  },
  dashGuide: {
    position: 'absolute',
    top: 0, bottom: 24,
    left: '45%',
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  dot: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#17A773',
    borderWidth: 2, borderColor: '#fff',
    elevation: 2,
  },
  dotBlue: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#2A6AF2',
    borderWidth: 2, borderColor: '#fff',
    elevation: 2,
  },
  callout: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  calloutBlue: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  calloutTitle: { fontSize: 11, color: colors.textPrimary, fontWeight: '700' },
  calloutValue: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },

  monthsRow: {
    position: 'absolute',
    left: 0, right: 0, bottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  monthTxt: { fontSize: 10, color: colors.textSecondary },

  cardsGrid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: CARD_RADIUS,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accentStrip: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 6,
    borderTopLeftRadius: CARD_RADIUS,
    borderBottomLeftRadius: CARD_RADIUS,
  },
  metricTitle: { fontSize: 12, color: colors.textSecondary },
  metricValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  deltaText: { fontSize: 12, color: colors.textSecondary, marginLeft: 6 },


   barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 24,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: 12,
    backgroundColor: '#17A773',
    borderRadius: 6,
    marginBottom: 5,
  },
});
