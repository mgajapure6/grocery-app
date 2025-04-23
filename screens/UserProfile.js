import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function UserProfile({ navigation }) {
  // Hardcoded user data (replace with AuthContext or backend data)
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null, // Placeholder for profile picture
  };

  // App version
  const appVersion = '1.0.0';

  // Settings items
  const settingsItems = [
    { id: 'order-history', title: 'Order History', icon: 'shopping-bag', onPress: () => navigation.navigate('OrderHistory') },
    { id: 'saved-payment', title: 'Saved Payment Method', icon: 'credit-card', onPress: () => navigation.navigate('SavedPaymentMethods') },
    { id: 'saved-addresses', title: 'Saved Addresses', icon: 'map-pin', onPress: () => navigation.navigate('SavedAddresses') },
    { id: 'saved-gst', title: 'Saved GST Details', icon: 'file-text', onPress: () => navigation.navigate('GstDetails') },
    { id: 'about-us', title: 'About Us', icon: 'info', onPress: () => navigation.navigate('AboutUs') },
    { id: 'account-privacy', title: 'Account Privacy', icon: 'lock', onPress: () => navigation.navigate('AccountPrivacy') },
    { id: 'logout', title: 'Logout', icon: 'log-out', onPress: () => { console.log('Logging out...'); navigation.navigate('Homepage'); } },
  ];

  // Render settings item
  const renderSettingsItem = ({ id, title, icon, onPress }, index) => (
    <TouchableOpacity
      key={id}
      // style={styles.settingsItem}
      style={[
        styles.settingsItem,
        index === settingsItems.length - 1 && { borderBottomWidth: 0 }, // No border for last item
      ]}
      onPress={() => {
        try {
          onPress();
        } catch (error) {
          console.log(`Navigation to ${title} not implemented:`, error.message);
        }
      }}
    >
      <Feather name={icon} size={20} color="#333" style={styles.settingsIcon} />
      <Text style={styles.settingsTitle}>{title}</Text>
      <Feather name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={user.avatar} style={styles.avatar} />
              ) : (
                <Feather name="user" size={40} color="#666" style={styles.avatarPlaceholder} />
              )}
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => console.log('Edit Profile pressed')}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="settings" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Settings</Text>
            </View>
            {settingsItems.map(renderSettingsItem)}
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version {appVersion}</Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    // Centered within avatarContainer
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingsIcon: {
    marginRight: 10,
  },
  settingsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
});