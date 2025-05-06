import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminInventoryLocations = ({ navigation }) => {
  const [locations, setLocations] = useState([
    { id: 'loc-1', name: 'Main Warehouse', address: '123 Industrial Rd, Anytown, USA' },
    { id: 'loc-2', name: 'Downtown Store', address: '456 Market St, Anytown, USA' },
    { id: 'loc-3', name: 'Northside Depot', address: '789 Elm St, Anytown, USA' },
    { id: 'loc-4', name: 'South Warehouse', address: '101 Pine Rd, Anytown, USA' },
    { id: 'loc-5', name: 'Eastside Hub', address: '202 Oak Ave, Anytown, USA' },
    { id: 'loc-6', name: 'West Store', address: '303 Cedar Ln, Anytown, USA' },
    { id: 'loc-7', name: 'Central Distribution', address: '404 Maple Dr, Anytown, USA' },
    { id: 'loc-8', name: 'Suburban Outlet', address: '505 Birch St, Anytown, USA' },
    { id: 'loc-9', name: 'Riverside Warehouse', address: '606 Spruce Rd, Anytown, USA' },
    { id: 'loc-10', name: 'Uptown Store', address: '707 Willow Ave, Anytown, USA' },
  ]);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);

  const handleAddLocation = () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) {
      Toast.show({ type: 'error', text1: 'Location name and address are required' });
      return;
    }
    if (locations.some(location => location.name.toLowerCase() === newLocationName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Location already exists' });
      return;
    }
    const location = { id: `loc-${Date.now()}`, name: newLocationName.trim(), address: newLocationAddress.trim() };
    setLocations([...locations, location]);
    setNewLocationName('');
    setNewLocationAddress('');
    Toast.show({ type: 'success', text1: 'Location added successfully' });
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setNewLocationName(location.name);
    setNewLocationAddress(location.address);
  };

  const handleUpdateLocation = () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) {
      Toast.show({ type: 'error', text1: 'Location name and address are required' });
      return;
    }
    if (locations.some(location => location.id !== editingLocation.id && location.name.toLowerCase() === newLocationName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Location already exists' });
      return;
    }
    setLocations(locations.map(location => (location.id === editingLocation.id ? { ...location, name: newLocationName.trim(), address: newLocationAddress.trim() } : location)));
    setEditingLocation(null);
    setNewLocationName('');
    setNewLocationAddress('');
    Toast.show({ type: 'success', text1: 'Location updated successfully' });
  };

  const handleDeleteLocation = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLocations(locations.filter(location => location.id !== id));
            Toast.show({ type: 'success', text1: 'Location deleted successfully' });
          },
        },
      ]
    );
  };

  const renderLocation = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.address}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditLocation(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.name} location`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteLocation(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.name} location`}
        >
          <Feather name="trash-2" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Inventory Locations</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingLocation ? 'Edit Location' : 'Add New Location'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newLocationName}
            onChangeText={setNewLocationName}
            placeholder="Enter location name (e.g., Main Warehouse)"
            accessibilityLabel="Location name"
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newLocationAddress}
            onChangeText={setNewLocationAddress}
            placeholder="Enter address (e.g., 123 Industrial Rd)"
            accessibilityLabel="Location address"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingLocation ? handleUpdateLocation : handleAddLocation}
          >
            <Feather name={editingLocation ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingLocation ? 'Update Location' : 'Add Location'}</Text>
          </TouchableOpacity>
          {editingLocation && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingLocation(null);
                setNewLocationName('');
                setNewLocationAddress('');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={locations}
          renderItem={renderLocation}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No locations available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminInventoryLocations;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});