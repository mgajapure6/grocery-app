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

export default function SavedGstDetails({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');

  // Demo GST details
  const gstDetails = [
    {
      id: 'gst1',
      gstin: '29ABCDE1234F1Z5',
      businessName: 'ABC Enterprises',
    },
  ];

  const renderGstDetail = ({ item, index }) => (
    <View
      key={`saved-gst-detail-${index}`}
      style={[
        styles.gstItem,
        index === gstDetails.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.gstDetails}>
        <Text style={styles.gstGstin}>{item.gstin}</Text>
        <Text style={styles.gstBusinessName}>{item.businessName}</Text>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => console.log(`Edit GST ${item.id}`)}
      >
        <Feather name="edit" size={20} color="#5ac268" />
      </TouchableOpacity>
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
            <Text style={styles.title}>GST Details</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>GST Information</Text>
            </View>
            {gstDetails.length > 0 ? (
              gstDetails.map((item, index) => renderGstDetail({ item, index }))
            ) : (
              <Text style={styles.emptyText}>No GST details saved</Text>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => console.log('Add new GST detail')}
            >
              <Text style={styles.addButtonText}>Add GST Detail</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Home');
              navigation.navigate('Homepage');
            }}
          >
            <Feather
              name="home"
              size={24}
              color={activeTab === 'Home' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Favorite');
              console.log('Favorite pressed');
            }}
          >
            <Feather
              name="heart"
              size={24}
              color={activeTab === 'Favorite' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Favorite' && styles.navTextActive]}>
              Favorite
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Categories');
              navigation.navigate('Categories');
            }}
          >
            <Feather
              name="grid"
              size={24}
              color={activeTab === 'Categories' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Categories' && styles.navTextActive]}>
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('User');
              navigation.navigate('UserProfile');
            }}
          >
            <Feather
              name="user"
              size={24}
              color={activeTab === 'User' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'User' && styles.navTextActive]}>User</Text>
          </TouchableOpacity>
        </View>
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
  gstItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  gstDetails: {
    flex: 1,
  },
  gstGstin: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  gstBusinessName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 5,
  },
  navTextActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
});