import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminStoreSettings = ({ navigation }) => {
  const [settings, setSettings] = useState({
    storeName: 'GroceryMart',
    currency: 'USD',
    taxRate: '8.5',
    shippingFlatRate: '5.00',
    storeHours: '9:00 AM - 9:00 PM',
    paymentMethods: {
      creditCard: true,
      upi: true,
      cod: false,
    },
    notifications: {
      orderConfirmationEmail: true,
      orderStatusUpdateEmail: true,
      orderConfirmationSMS: false,
    },
  });

  const handleSave = () => {
    Toast.show({ type: 'success', text1: 'Store settings saved successfully' });
    // TODO: Save to API or local storage
  };

  const togglePaymentMethod = (method) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  const toggleNotification = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

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
        <Text className="text-xl font-bold text-gray-800">Store Settings</Text>
        <TouchableOpacity
          onPress={handleSave}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="save" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Store Details */}
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="store" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Store Details</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">Store Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={settings.storeName}
            onChangeText={value => setSettings(prev => ({ ...prev, storeName: value }))}
            placeholder="Enter store name"
            accessibilityLabel="Store name"
          />
          <Text className="text-sm text-gray-600 mb-2">Currency</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={settings.currency}
            onChangeText={value => setSettings(prev => ({ ...prev, currency: value }))}
            placeholder="e.g., USD"
            accessibilityLabel="Currency"
          />
          <Text className="text-sm text-gray-600 mb-2">Default Tax Rate (%)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={settings.taxRate}
            onChangeText={value => setSettings(prev => ({ ...prev, taxRate: value }))}
            placeholder="e.g., 8.5"
            keyboardType="numeric"
            accessibilityLabel="Tax rate"
          />
          <Text className="text-sm text-gray-600 mb-2">Flat Shipping Rate ($)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={settings.shippingFlatRate}
            onChangeText={value => setSettings(prev => ({ ...prev, shippingFlatRate: value }))}
            placeholder="e.g., 5.00"
            keyboardType="numeric"
            accessibilityLabel="Shipping rate"
          />
          <Text className="text-sm text-gray-600 mb-2">Store Hours</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={settings.storeHours}
            onChangeText={value => setSettings(prev => ({ ...prev, storeHours: value }))}
            placeholder="e.g., 9:00 AM - 9:00 PM"
            accessibilityLabel="Store hours"
          />
        </View>

        {/* Payment Methods */}
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="credit-card" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Payment Methods</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-600">Credit Card</Text>
            <Switch
              value={settings.paymentMethods.creditCard}
              onValueChange={() => togglePaymentMethod('creditCard')}
              accessibilityLabel="Toggle Credit Card"
            />
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-600">UPI</Text>
            <Switch
              value={settings.paymentMethods.upi}
              onValueChange={() => togglePaymentMethod('upi')}
              accessibilityLabel="Toggle UPI"
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Cash on Delivery</Text>
            <Switch
              value={settings.paymentMethods.cod}
              onValueChange={() => togglePaymentMethod('cod')}
              accessibilityLabel="Toggle Cash on Delivery"
            />
          </View>
        </View>

        {/* Notifications */}
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="bell" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Notifications</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-600">Order Confirmation Email</Text>
            <Switch
              value={settings.notifications.orderConfirmationEmail}
              onValueChange={() => toggleNotification('orderConfirmationEmail')}
              accessibilityLabel="Toggle Order Confirmation Email"
            />
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-600">Order Status Update Email</Text>
            <Switch
              value={settings.notifications.orderStatusUpdateEmail}
              onValueChange={() => toggleNotification('orderStatusUpdateEmail')}
              accessibilityLabel="Toggle Order Status Update Email"
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Order Confirmation SMS</Text>
            <Switch
              value={settings.notifications.orderConfirmationSMS}
              onValueChange={() => toggleNotification('orderConfirmationSMS')}
              accessibilityLabel="Toggle Order Confirmation SMS"
            />
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminStoreSettings;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});