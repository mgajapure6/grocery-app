import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminPromotions = ({ navigation }) => {
  const [promotions, setPromotions] = useState([
    { id: 'promo-1', code: 'SAVE10', discount: 10, type: 'percentage', active: true },
    { id: 'promo-2', code: 'FREESHIP', discount: 5, type: 'fixed', active: true },
    { id: 'promo-3', code: 'SAVE10', discount: 10, type: 'percentage', active: true },
    { id: 'promo-4', code: 'FREESHIP', discount: 5, type: 'fixed', active: true },
    { id: 'promo-5', code: 'SAVE10', discount: 10, type: 'percentage', active: true },
    { id: 'promo-6', code: 'FREESHIP', discount: 5, type: 'fixed', active: true },
    { id: 'promo-7', code: 'SAVE10', discount: 10, type: 'percentage', active: true },
    { id: 'promo-8', code: 'FREESHIP', discount: 5, type: 'fixed', active: true },
    { id: 'promo-9', code: 'SAVE10', discount: 10, type: 'percentage', active: true },
    { id: 'promo-10', code: 'FREESHIP', discount: 5, type: 'fixed', active: true },
  ]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');
  const [newPromoType, setNewPromoType] = useState('percentage');
  const [editingPromo, setEditingPromo] = useState(null);

  const handleAddPromo = () => {
    if (!newPromoCode.trim() || !newPromoDiscount) {
      Toast.show({ type: 'error', text1: 'Promo code and discount are required' });
      return;
    }
    const discount = parseFloat(newPromoDiscount);
    if (isNaN(discount) || discount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid discount value' });
      return;
    }
    if (promotions.some(promo => promo.code.toLowerCase() === newPromoCode.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Promo code already exists' });
      return;
    }
    const promo = { id: `promo-${Date.now()}`, code: newPromoCode.trim().toUpperCase(), discount, type: newPromoType, active: true };
    setPromotions([...promotions, promo]);
    setNewPromoCode('');
    setNewPromoDiscount('');
    setNewPromoType('percentage');
    Toast.show({ type: 'success', text1: 'Promotion added successfully' });
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setNewPromoCode(promo.code);
    setNewPromoDiscount(promo.discount.toString());
    setNewPromoType(promo.type);
  };

  const handleUpdatePromo = () => {
    if (!newPromoCode.trim() || !newPromoDiscount) {
      Toast.show({ type: 'error', text1: 'Promo code and discount are required' });
      return;
    }
    const discount = parseFloat(newPromoDiscount);
    if (isNaN(discount) || discount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid discount value' });
      return;
    }
    if (promotions.some(promo => promo.id !== editingPromo.id && promo.code.toLowerCase() === newPromoCode.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Promo code already exists' });
      return;
    }
    setPromotions(promotions.map(promo => (promo.id === editingPromo.id ? { ...promo, code: newPromoCode.trim().toUpperCase(), discount, type: newPromoType } : promo)));
    setEditingPromo(null);
    setNewPromoCode('');
    setNewPromoDiscount('');
    setNewPromoType('percentage');
    Toast.show({ type: 'success', text1: 'Promotion updated successfully' });
  };

  const handleDeletePromo = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this promotion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPromotions(promotions.filter(promo => promo.id !== id));
            Toast.show({ type: 'success', text1: 'Promotion deleted successfully' });
          },
        },
      ]
    );
  };

  const togglePromoStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, active: !promo.active } : promo
    ));
    Toast.show({ type: 'success', text1: `Promotion ${promotions.find(promo => promo.id === id).active ? 'deactivated' : 'activated'}` });
  };

  const renderPromo = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.code}</Text>
        <Text className="text-sm text-gray-600">
          {item.type === 'percentage' ? `${item.discount}% off` : `$${item.discount.toFixed(2)} off`}
        </Text>
        <Text className="text-sm text-gray-600">{item.active ? 'Active' : 'Inactive'}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditPromo(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.code} promotion`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => togglePromoStatus(item.id)}
          className="p-2"
          accessibilityLabel={`${item.active ? 'Deactivate' : 'Activate'} ${item.code} promotion`}
        >
          <Feather name={item.active ? 'pause' : 'play'} size={20} color={item.active ? '#f59e0b' : '#22c55e'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletePromo(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.code} promotion`}
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
        <Text className="text-xl font-bold text-gray-800">Promotions</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingPromo ? 'Edit Promotion' : 'Add New Promotion'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newPromoCode}
            onChangeText={setNewPromoCode}
            placeholder="Enter promo code (e.g., SAVE10)"
            accessibilityLabel="Promo code"
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newPromoDiscount}
            onChangeText={setNewPromoDiscount}
            placeholder="Enter discount (e.g., 10)"
            keyboardType="numeric"
            accessibilityLabel="Discount value"
          />
          <View className="flex-row mb-3">
            <TouchableOpacity
              className={`flex-1 p-2 rounded-lg ${newPromoType === 'percentage' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setNewPromoType('percentage')}
            >
              <Text className={newPromoType === 'percentage' ? 'text-white text-center' : 'text-gray-800 text-center'}>Percentage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-2 rounded-lg ml-2 ${newPromoType === 'fixed' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setNewPromoType('fixed')}
            >
              <Text className={newPromoType === 'fixed' ? 'text-white text-center' : 'text-gray-800 text-center'}>Fixed Amount</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingPromo ? handleUpdatePromo : handleAddPromo}
          >
            <Feather name={editingPromo ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingPromo ? 'Update Promotion' : 'Add Promotion'}</Text>
          </TouchableOpacity>
          {editingPromo && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingPromo(null);
                setNewPromoCode('');
                setNewPromoDiscount('');
                setNewPromoType('percentage');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={promotions}
          renderItem={renderPromo}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No promotions available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminPromotions;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});