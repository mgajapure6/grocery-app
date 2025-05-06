import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AdminMoreOptions = () => {
  const navigation = useNavigation();

  // Options data
  const options = [
    {
      id: 'store_settings',
      title: 'Store Settings',
      icon: 'settings',
      description: 'Configure store name, currency, tax rates, and payment methods.',
      onPress: () => navigation.navigate('AdminStoreSettings'),
    },
    {
      id: 'product_tags',
      title: 'Product Tags',
      icon: 'tag',
      description: 'Manage tags like Organic or Gluten-Free for product filtering.',
      onPress: () => navigation.navigate('AdminProductTags'),
    },
    {
      id: 'product_brands',
      title: 'Product Brands',
      icon: 'award',
      description: 'Manage brands like Amul or Nestlé for product association.',
      onPress: () => navigation.navigate('AdminProductBrands'),
    },
    {
      id: 'tax_rates',
      title: 'Tax Rates',
      icon: 'percent',
      description: 'Define tax rates like GST 5% or 12% for products.',
      onPress: () => navigation.navigate('AdminTaxRates'),
    },
    {
      id: 'shipping_options',
      title: 'Shipping Options',
      icon: 'truck',
      description: 'Configure shipping methods and carriers like FedEx or UPS.',
      onPress: () => navigation.navigate('AdminShippingOptions'),
    },
    {
      id: 'inventory_locations',
      title: 'Inventory Locations',
      icon: 'map-pin',
      description: 'Manage warehouses or stores for inventory tracking.',
      onPress: () => navigation.navigate('AdminInventoryLocations'),
    },
    {
      id: 'promotions',
      title: 'Promotions',
      icon: 'gift',
      description: 'Create and manage discount codes or promotional campaigns.',
      onPress: () => navigation.navigate('AdminPromotions'),
    },
  ];

  const renderOption = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-4 border border-gray-200 flex-row items-center"
      onPress={item.onPress}
      accessibilityLabel={item.title}
    >
      <View className="mr-4">
        <Feather name={item.icon} size={24} color="#2563eb" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Options List */}
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AdminMoreOptions;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});