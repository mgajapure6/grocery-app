import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Payment({ navigation }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [previousPaymentMethod] = useState({
    type: 'card',
    details: 'Visa ending in 1234',
    logo: require('../assets/img/image-placeholder.png'),
  });

  const paymentMethods = [
    {
      title: 'Recommended',
      data: previousPaymentMethod ? [{
        id: 'recommended',
        type: previousPaymentMethod.type,
        details: previousPaymentMethod.details,
        logo: previousPaymentMethod.logo,
      }] : [],
    },
    {
      title: 'Cards (Credit/Debit)',
      data: [
        { id: 'card-visa', type: 'card', details: 'Visa ending in 1234', logo: require('../assets/img/image-placeholder.png') },
        { id: 'card-mastercard', type: 'card', details: 'Mastercard ending in 5678', logo: require('../assets/img/image-placeholder.png') },
      ],
    },
    {
      title: 'Pay by UPI App',
      data: [
        { id: 'upi-gpay', type: 'upi', details: 'Google Pay', logo: require('../assets/img/image-placeholder.png') },
        { id: 'upi-phonepe', type: 'upi', details: 'PhonePe', logo: require('../assets/img/image-placeholder.png') },
      ],
    },
    {
      title: 'Wallet',
      data: [
        { id: 'wallet-paytm', type: 'wallet', details: 'Paytm Wallet', logo: require('../assets/img/image-placeholder.png') },
        { id: 'wallet-amazon', type: 'wallet', details: 'Amazon Pay', logo: require('../assets/img/image-placeholder.png') },
      ],
    },
    {
      title: 'Netbanking',
      data: [
        { id: 'netbanking-hdfc', type: 'netbanking', details: 'HDFC Bank', logo: require('../assets/img/image-placeholder.png') },
        { id: 'netbanking-sbi', type: 'netbanking', details: 'State Bank of India', logo: require('../assets/img/image-placeholder.png') },
      ],
    },
    {
      title: 'Cash on Delivery',
      data: [
        { id: 'cod', type: 'cod', details: 'Pay at delivery', logo: require('../assets/img/image-placeholder.png') },
      ],
    },
  ];

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.paymentItem, selectedPayment ? selectedPayment?.id === item.id && styles.paymentItemSelected : '']}
      onPress={() => {
        setSelectedPayment(item);
        console.log('Selected payment:', item);
      }}
    >
      <Image source={item.logo} style={styles.paymentLogo} />
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentDetailsText}>{item.details}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Payment Method</Text>
      </View>
      <SectionList
        sections={paymentMethods}
        renderItem={renderPaymentItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.paymentList}
        ListEmptyComponent={<Text style={styles.emptyText}>No payment methods available</Text>}
      />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          if (selectedPayment) {
            console.log('Confirm payment:', selectedPayment);
            // Navigate to order confirmation or back to Cart
          }
        }}
        disabled={!selectedPayment}
      >
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  paymentList: {
    padding: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  paymentItemSelected: {
    borderWidth: 2,
    borderColor: '#5ac268',
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentDetailsText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
    opacity: 1,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});