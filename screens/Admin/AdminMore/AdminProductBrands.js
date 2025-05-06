import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminProductBrands = ({ navigation }) => {
  const [brands, setBrands] = useState([
    { id: 'brand-1', name: 'Nike' },
    { id: 'brand-2', name: 'Adidas' },
    { id: 'brand-3', name: 'Puma' },
    { id: 'brand-4', name: 'Under Armour' },
    { id: 'brand-5', name: 'Reebok' },
    { id: 'brand-6', name: 'New Balance' },
    { id: 'brand-7', name: 'Asics' },
    { id: 'brand-8', name: 'Vans' },
    { id: 'brand-9', name: 'Converse' },
    { id: 'brand-10', name: 'Skechers' },
  ]);
  const [newName, setNewName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  const handleAddBrand = () => {
    if (!newName.trim()) {
      Toast.show({ type: 'error', text1: 'Brand name is required' });
      return;
    }
    if (brands.some(brand => brand.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Brand already exists' });
      return;
    }
    const brand = { id: `brand-${Date.now()}`, name: newName.trim() };
    setBrands([...brands, brand]);
    setNewName('');
    Toast.show({ type: 'success', text1: 'Brand added successfully' });
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setNewName(brand.name);
  };

  const handleUpdateBrand = () => {
    if (!newName.trim()) {
      Toast.show({ type: 'error', text1: 'Brand name is required' });
      return;
    }
    if (brands.some(brand => brand.id !== editingBrand.id && brand.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Brand already exists' });
      return;
    }
    setBrands(brands.map(brand => (brand.id === editingBrand.id ? { ...brand, name: newName.trim() } : brand)));
    setEditingBrand(null);
    setNewName('');
    Toast.show({ type: 'success', text1: 'Brand updated successfully' });
  };

  const handleDeleteBrand = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this brand?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBrands(brands.filter(brand => brand.id !== id));
            Toast.show({ type: 'success', text1: 'Brand deleted successfully' });
          },
        },
      ]
    );
  };

  const renderBrand = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditBrand(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.name} brand`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteBrand(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.name} brand`}
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
        <Text className="text-xl font-bold text-gray-800">Product Brands</Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter brand name (e.g., Nike)"
            accessibilityLabel="Brand name"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingBrand ? handleUpdateBrand : handleAddBrand}
          >
            <Feather name={editingBrand ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingBrand ? 'Update Brand' : 'Add Brand'}</Text>
          </TouchableOpacity>
          {editingBrand && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingBrand(null);
                setNewName('');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={brands}
          renderItem={renderBrand}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No brands available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminProductBrands;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});