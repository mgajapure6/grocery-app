import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function SavedAddresses({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');

  // Demo addresses
  const addresses = [
    {
      id: 'addr1',
      title: 'Home',
      address: '123 Main St, City, Country',
      isDefault: true,
    },
    {
      id: 'addr2',
      title: 'Work',
      address: '456 Office Rd, City, Country',
      isDefault: false,
    },
  ];

  const renderAddress = ({ item, index }) => (
    <View
      key={`saved-address-${index}`}
      style={[
        styles.addressItem,
        index === addresses.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.addressDetails}>
        <Text style={styles.addressTitle}>{item.title}</Text>
        <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
        {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log(`Edit address ${item.id}`)}
        >
          <Feather name="edit" size={20} color="#5ac268" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log(`Delete address ${item.id}`)}
        >
          <Feather name="trash-2" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <Text style={styles.title}>Saved Addresses</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Addresses</Text>
            </View>
            {addresses.length > 0 ? (
              addresses.map((item, index) => renderAddress({ item, index }))
            ) : (
              <Text style={styles.emptyText}>No addresses saved</Text>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => console.log('Add new address')}
            >
              <Text style={styles.addButtonText}>Add Address</Text>
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
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  defaultBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5ac268',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  addButton: {
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
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});