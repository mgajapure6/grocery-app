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

export default function SavedPaymentMethods({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');

  // Demo payment methods
  const paymentMethods = [
    {
      id: 'pm1',
      type: 'Visa',
      last4: '1234',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'Mastercard',
      last4: '5678',
      isDefault: false,
    },
  ];

  const renderPaymentMethod = ({ item, index }) => (
    <View
      key={`saved-payment-method-${index}`}
      style={[
        styles.paymentItem,
        index === paymentMethods.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentType}>{item.type} ****{item.last4}</Text>
        {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <View style={styles.paymentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log(`Edit payment method ${item.id}`)}
        >
          <Feather name="edit" size={20} color="#5ac268" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log(`Delete payment method ${item.id}`)}
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
            <Text style={styles.title}>Saved Payment Methods</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="credit-card" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payment Methods</Text>
            </View>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((item, index) => renderPaymentMethod({ item, index }))
            ) : (
              <Text style={styles.emptyText}>No payment methods saved</Text>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => console.log('Add new payment method')}
            >
              <Text style={styles.addButtonText}>Add Payment Method</Text>
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
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  defaultBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5ac268',
  },
  paymentActions: {
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