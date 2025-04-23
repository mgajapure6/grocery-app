import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function AccountPrivacy({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');
  const [dataSharing, setDataSharing] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Account Privacy</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="lock" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Data Sharing</Text>
                <Text style={styles.settingDescription}>
                  Allow sharing of your data with third-party partners for personalized ads.
                </Text>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={(value) => {
                  setDataSharing(value);
                  console.log('Data sharing set to:', value);
                }}
                trackColor={{ false: '#ddd', true: '#5ac268' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive promotional emails and app notifications.
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  setNotifications(value);
                  console.log('Notifications set to:', value);
                }}
                trackColor={{ false: '#ddd', true: '#5ac268' }}
                thumbColor="#fff"
              />
            </View>
            <TouchableOpacity
              style={styles.policyButton}
              onPress={() => console.log('View privacy policy')}
            >
              <Text style={styles.policyButtonText}>View Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  policyButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  policyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});