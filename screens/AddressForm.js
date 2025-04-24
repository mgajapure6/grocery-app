import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AddressForm({ navigation, route }) {
  const { mode = 'add', addressObject, paymentMethod } = route.params || {};
  const isAddressMode = mode === 'add' || mode === 'edit';
  const isPaymentMode = mode === 'addPayment' || mode === 'editPayment';

  // Address fields
  const [title, setTitle] = useState(addressObject?.title || '');
  const [address, setAddress] = useState(addressObject?.address || '');
  const [isDefaultAddress, setIsDefaultAddress] = useState(addressObject?.isDefault || false);

  // Payment fields
  const [paymentType, setPaymentType] = useState(paymentMethod?.type || '');
  const [paymentDetails, setPaymentDetails] = useState(paymentMethod?.details || '');
  const [isDefaultPayment, setIsDefaultPayment] = useState(paymentMethod?.isDefault || false);

  const handleSave = () => {
    if (isAddressMode) {
      if (!title.trim() || !address.trim()) {
        Alert.alert('Error', 'Please fill in all address fields');
        return;
      }
      const addressData = {
        id: mode === 'add' ? `addr-${Date.now()}` : addressObject.id,
        title: title.trim(),
        address: address.trim(),
        isDefault: isDefaultAddress,
      };
      console.log(`Saving ${mode === 'add' ? 'new' : 'updated'} address:`, addressData);
      navigation.navigate('Cart', mode === 'add' ? { newAddress: addressData } : { updatedAddress: addressData });
    } else {
      if (!paymentType.trim() || !paymentDetails.trim()) {
        Alert.alert('Error', 'Please fill in all payment fields');
        return;
      }
      const paymentData = {
        id: mode === 'addPayment' ? `pm-${Date.now()}` : paymentMethod.id,
        type: paymentType.trim(),
        details: paymentDetails.trim(),
        isDefault: isDefaultPayment,
        logo: require('../assets/img/visa.png'), // Replace with actual logo based on type
      };
      console.log(`Saving ${mode === 'addPayment' ? 'new' : 'updated'} payment method:`, paymentData);
      navigation.navigate('Cart', mode === 'addPayment' ? { newPaymentMethod: paymentData } : { updatedPaymentMethod: paymentData });
    }
  };

  const handleDelete = () => {
    if (mode !== 'edit' && mode !== 'editPayment') return;
    Alert.alert(
      `Delete ${isAddressMode ? 'Address' : 'Payment Method'}`,
      `Are you sure you want to delete this ${isAddressMode ? 'address' : 'payment method'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isAddressMode) {
              console.log('Deleting address:', addressObject);
              navigation.navigate('Cart', { deletedAddressId: addressObject.id });
            } else {
              console.log('Deleting payment method:', paymentMethod);
              navigation.navigate('Cart', { deletedPaymentMethodId: paymentMethod.id });
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    console.log(`Cancelling ${isAddressMode ? 'address' : 'payment'} ${mode.includes('add') ? 'addition' : 'edit'}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAddressMode ? (mode === 'add' ? 'Add New Address' : 'Edit Address') : (mode === 'addPayment' ? 'Add Payment Method' : 'Edit Payment Method')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {isAddressMode ? (
          <>
            <Text style={styles.label}>Address Title (e.g., Home, Work)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address title"
              placeholderTextColor="#bbb"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Address Details</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter full address (street, city, state, zip)"
              placeholderTextColor="#bbb"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Set as Default Address</Text>
              <Switch
                value={isDefaultAddress}
                onValueChange={setIsDefaultAddress}
                trackColor={{ false: '#ddd', true: '#5ac268' }}
                thumbColor={isDefaultAddress ? '#fff' : '#f4f3f4'}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Payment Type (e.g., Card, UPI)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter payment type"
              placeholderTextColor="#bbb"
              value={paymentType}
              onChangeText={setPaymentType}
            />
            <Text style={styles.label}>Payment Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter payment details (e.g., Card ending in 1234)"
              placeholderTextColor="#bbb"
              value={paymentDetails}
              onChangeText={setPaymentDetails}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Set as Default Payment Method</Text>
              <Switch
                value={isDefaultPayment}
                onValueChange={setIsDefaultPayment}
                trackColor={{ false: '#ddd', true: '#5ac268' }}
                thumbColor={isDefaultPayment ? '#fff' : '#f4f3f4'}
              />
            </View>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {(mode === 'edit' || mode === 'editPayment') && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerPlaceholder: {
    width: 24,
  },
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});