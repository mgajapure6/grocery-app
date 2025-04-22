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

export default function EditAddress({ navigation, route }) {
  const { addressObject } = route.params;
  const [title, setTitle] = useState(addressObject.title);
  const [address, setAddress] = useState(addressObject.address);
  const [isDefault, setIsDefault] = useState(addressObject.isDefault);

  const handleSave = () => {
    if (!title.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedAddress = {
      ...addressObject,
      title: title.trim(),
      address: address.trim(),
      isDefault,
    };

    console.log('Saving updated address:', updatedAddress);
    navigation.navigate('Cart', { updatedAddress });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting address:', addressObject);
            navigation.navigate('Cart', { deletedAddressId: addressObject.id });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    console.log('Cancelling address edit');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Address</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Address Name (e.g., Home, Work)</Text>
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
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: '#ddd', true: '#5ac268' }}
            thumbColor={isDefault ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Address</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Address</Text>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerPlaceholder: {
    width: 24, // Match back button width for symmetry
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