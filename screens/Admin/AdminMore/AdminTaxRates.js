import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminTaxRates = ({ navigation }) => {
  const [taxRates, setTaxRates] = useState([
    { id: 'tax-1', name: 'Federal GST', rate: 5.0 },
    { id: 'tax-2', name: 'State Sales Tax', rate: 6.5 },
    { id: 'tax-3', name: 'City Tax', rate: 1.5 },
    { id: 'tax-4', name: 'VAT Standard', rate: 20.0 },
    { id: 'tax-5', name: 'VAT Reduced', rate: 5.5 },
    { id: 'tax-6', name: 'County Tax', rate: 2.0 },
    { id: 'tax-7', name: 'Luxury Tax', rate: 10.0 },
    { id: 'tax-8', name: 'Import Duty', rate: 7.5 },
    { id: 'tax-9', name: 'Service Tax', rate: 4.0 },
    { id: 'tax-10', name: 'Excise Tax', rate: 3.0 },
  ]);
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');
  const [editingRate, setEditingRate] = useState(null);

  const handleAddRate = () => {
    if (!newName.trim() || !newRate) {
      Toast.show({ type: 'error', text1: 'Name and rate are required' });
      return;
    }
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0) {
      Toast.show({ type: 'error', text1: 'Invalid rate value' });
      return;
    }
    if (taxRates.some(rateObj => rateObj.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Tax rate already exists' });
      return;
    }
    const rateObj = { id: `tax-${Date.now()}`, name: newName.trim(), rate };
    setTaxRates([...taxRates, rateObj]);
    setNewName('');
    setNewRate('');
    Toast.show({ type: 'success', text1: 'Tax rate added successfully' });
  };

  const handleEditRate = (rateObj) => {
    setEditingRate(rateObj);
    setNewName(rateObj.name);
    setNewRate(rateObj.rate.toString());
  };

  const handleUpdateRate = () => {
    if (!newName.trim() || !newRate) {
      Toast.show({ type: 'error', text1: 'Name and rate are required' });
      return;
    }
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0) {
      Toast.show({ type: 'error', text1: 'Invalid rate value' });
      return;
    }
    if (taxRates.some(rateObj => rateObj.id !== editingRate.id && rateObj.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Tax rate already exists' });
      return;
    }
    setTaxRates(taxRates.map(rateObj => (rateObj.id === editingRate.id ? { ...rateObj, name: newName.trim(), rate } : rateObj)));
    setEditingRate(null);
    setNewName('');
    setNewRate('');
    Toast.show({ type: 'success', text1: 'Tax rate updated successfully' });
  };

  const handleDeleteRate = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tax rate?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTaxRates(taxRates.filter(rateObj => rateObj.id !== id));
            Toast.show({ type: 'success', text1: 'Tax rate deleted successfully' });
          },
        },
      ]
    );
  };

  const renderRate = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.rate.toFixed(1)}%</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditRate(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.name} tax rate`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteRate(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.name} tax rate`}
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
        <Text className="text-xl font-bold text-gray-800">Tax Rates</Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingRate ? 'Edit Tax Rate' : 'Add New Tax Rate'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter tax name (e.g., Federal GST)"
            accessibilityLabel="Tax name"
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newRate}
            onChangeText={setNewRate}
            placeholder="Enter rate (e.g., 5.0)"
            keyboardType="numeric"
            accessibilityLabel="Tax rate"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingRate ? handleUpdateRate : handleAddRate}
          >
            <Feather name={editingRate ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingRate ? 'Update Rate' : 'Add Rate'}</Text>
          </TouchableOpacity>
          {editingRate && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingRate(null);
                setNewName('');
                setNewRate('');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={taxRates}
          renderItem={renderRate}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No tax rates available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminTaxRates;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});