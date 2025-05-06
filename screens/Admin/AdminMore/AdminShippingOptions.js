import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminShippingOptions = ({ navigation }) => {
  const [shippingOptions, setShippingOptions] = useState([
    { id: 'ship-1', method: 'Standard Shipping', cost: 5.99 },
    { id: 'ship-2', method: 'Express Shipping', cost: 15.99 },
    { id: 'ship-3', method: 'Overnight Shipping', cost: 29.99 },
    { id: 'ship-4', method: 'Free Shipping', cost: 0.00 },
    { id: 'ship-5', method: 'Priority Mail', cost: 9.99 },
    { id: 'ship-6', method: 'International Standard', cost: 19.99 },
    { id: 'ship-7', method: 'International Express', cost: 39.99 },
    { id: 'ship-8', method: 'Local Pickup', cost: 0.00 },
    { id: 'ship-9', method: 'Same-Day Delivery', cost: 24.99 },
    { id: 'ship-10', method: 'Economy Shipping', cost: 3.99 },
  ]);
  const [newMethod, setNewMethod] = useState('');
  const [newCost, setNewCost] = useState('');
  const [editingOption, setEditingOption] = useState(null);

  const handleAddOption = () => {
    if (!newMethod.trim() || !newCost) {
      Toast.show({ type: 'error', text1: 'Method and cost are required' });
      return;
    }
    const cost = parseFloat(newCost);
    if (isNaN(cost) || cost < 0) {
      Toast.show({ type: 'error', text1: 'Invalid cost value' });
      return;
    }
    if (shippingOptions.some(option => option.method.toLowerCase() === newMethod.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Shipping method already exists' });
      return;
    }
    const option = { id: `ship-${Date.now()}`, method: newMethod.trim(), cost };
    setShippingOptions([...shippingOptions, option]);
    setNewMethod('');
    setNewCost('');
    Toast.show({ type: 'success', text1: 'Shipping option added successfully' });
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    setNewMethod(option.method);
    setNewCost(option.cost.toString());
  };

  const handleUpdateOption = () => {
    if (!newMethod.trim() || !newCost) {
      Toast.show({ type: 'error', text1: 'Method and cost are required' });
      return;
    }
    const cost = parseFloat(newCost);
    if (isNaN(cost) || cost < 0) {
      Toast.show({ type: 'error', text1: 'Invalid cost value' });
      return;
    }
    if (shippingOptions.some(option => option.id !== editingOption.id && option.method.toLowerCase() === newMethod.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Shipping method already exists' });
      return;
    }
    setShippingOptions(shippingOptions.map(option => (option.id === editingOption.id ? { ...option, method: newMethod.trim(), cost } : option)));
    setEditingOption(null);
    setNewMethod('');
    setNewCost('');
    Toast.show({ type: 'success', text1: 'Shipping option updated successfully' });
  };

  const handleDeleteOption = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this shipping option?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setShippingOptions(shippingOptions.filter(option => option.id !== id));
            Toast.show({ type: 'success', text1: 'Shipping option deleted successfully' });
          },
        },
      ]
    );
  };

  const renderOption = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.method}</Text>
        <Text className="text-sm text-gray-600">${item.cost.toFixed(2)}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditOption(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.method} shipping option`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteOption(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.method} shipping option`}
        >
          <Feather name="trash-2" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100">
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Shipping Options</Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingOption ? 'Edit Shipping Option' : 'Add New Shipping Option'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newMethod}
            onChangeText={setNewMethod}
            placeholder="Enter shipping method (e.g., Standard Shipping)"
            accessibilityLabel="Shipping method"
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newCost}
            onChangeText={setNewCost}
            placeholder="Enter cost (e.g., 5.99)"
            keyboardType="numeric"
            accessibilityLabel="Shipping cost"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingOption ? handleUpdateOption : handleAddOption}
          >
            <Feather name={editingOption ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingOption ? 'Update Option' : 'Add Option'}</Text>
          </TouchableOpacity>
          {editingOption && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingOption(null);
                setNewMethod('');
                setNewCost('');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={shippingOptions}
          renderItem={renderOption}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No shipping options available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminShippingOptions;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});