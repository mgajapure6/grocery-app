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

export default function AboutUs({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');

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
            <Text style={styles.title}>About Us</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>About Our App</Text>
            </View>
            <Text style={styles.sectionText}>
              Welcome to our e-commerce app, your one-stop shop for all your needs. We strive to
              provide a seamless shopping experience with a wide range of products, secure payment
              options, and fast delivery.
            </Text>
            <Text style={styles.sectionText}>
              Our mission is to make online shopping easy, affordable, and reliable. Founded in 2025,
              we are committed to customer satisfaction and continuous improvement.
            </Text>
            <Text style={styles.sectionText}>
              For inquiries, contact us at support@example.com or visit our website at
              www.example.com.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => console.log('Visit website')}
            >
              <Text style={styles.contactButtonText}>Visit Our Website</Text>
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
  sectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 10,
    lineHeight: 24,
  },
  contactButton: {
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
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
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