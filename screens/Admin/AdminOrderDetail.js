import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { categories } from '../../data/staticData'; // Adjust path as needed

const AdminOrderDetail = ({ navigation, route }) => {
  const { order } = route.params || {};
  const placeholderImage = require('../../assets/categories/image-placeholder.png');

  const [orderForm, setOrderForm] = useState({
    id: order?.id || '',
    status: order?.status || 'Pending',
    trackingNumber: order?.trackingNumber || '',
    trackingCarrier: order?.trackingCarrier || '',
    internalNotes: order?.internalNotes || '',
    customer: {
      name: order?.customer?.name || '',
      email: order?.customer?.email || '',
      phone: order?.customer?.phone || '',
      shippingAddress: order?.customer?.shippingAddress || '',
      billingAddress: order?.customer?.billingAddress || '',
      notes: order?.customer?.notes || '',
    },
    items: order?.items || [],
    subtotal: order?.subtotal || 0,
    discounts: order?.discounts || 0,
    taxes: order?.taxes || 0,
    shippingCost: order?.shippingCost || 0,
    total: order?.total || 0,
    payment: {
      status: order?.payment?.status || 'Pending',
      method: order?.payment?.method || '',
      transactionId: order?.payment?.transactionId || '',
      date: order?.payment?.date || new Date().toISOString(),
    },
    statusHistory: order?.statusHistory || [{ status: 'Pending', date: new Date().toISOString(), by: 'System' }],
    refundHistory: order?.refundHistory || [],
  });

  const [loading, setLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Animation states
  const saveButtonScale = useSharedValue(1);
  const cancelButtonScale = useSharedValue(1);

  const animatedSaveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  const animatedCancelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelButtonScale.value }],
  }));

  // Calculate remaining refundable amount
  const calculateRemainingRefund = () => {
    const totalRefunded = orderForm.refundHistory.reduce((sum, refund) => sum + refund.amount, 0);
    const remaining = orderForm.total - totalRefunded;
    return remaining > 0 ? remaining.toFixed(2) : '0.00';
  };

  // Set initial refund amount
  useEffect(() => {
    setRefundAmount(calculateRemainingRefund());
  }, [orderForm.total, orderForm.refundHistory]);

  // Helper to get item image from categories
  const getItemImage = (item) => {
    try {
      const mainCategory = Object.values(categories).find(cat => cat.id === item.category.id);
      if (!mainCategory) return placeholderImage;
      const subcategory = mainCategory.subcategories.find(sub => sub.id === item.subCategoryId);
      if (!subcategory) return placeholderImage;
      const categoryItem = subcategory.items.find(i => i.id === item.id);
      return categoryItem ? categoryItem.image : placeholderImage;
    } catch (error) {
      console.warn(`Image not found for item ${item.id}:`, error);
      return placeholderImage;
    }
  };

  // Payment status color
  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Refunded': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const handleUpdateStatus = (newStatus) => {
    setOrderForm(prev => ({
      ...prev,
      status: newStatus,
      statusHistory: [...prev.statusHistory, { status: newStatus, date: new Date().toISOString(), by: 'Admin' }],
    }));
    Toast.show({ type: 'success', text1: `Order status updated to ${newStatus}` });
  };

  const handleSaveChanges = () => {
    if (!orderForm.trackingNumber && orderForm.status === 'Shipped') {
      Toast.show({ type: 'error', text1: 'Tracking number is required for Shipped status.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updatedOrder = {
        ...orderForm,
        updatedAt: new Date().toISOString(),
      };
      navigation.navigate('AdminOrdersList', { updatedOrder });
      setLoading(false);
      Toast.show({ type: 'success', text1: 'Order updated successfully' });
    }, 1000);
  };

  const handleIssueRefund = () => {
    const amount = parseFloat(refundAmount);
    const remainingRefund = parseFloat(calculateRemainingRefund());
    if (!amount || amount <= 0 || amount > remainingRefund) {
      Toast.show({
        type: 'error',
        text1: `Invalid refund amount. Must be between 0 and $${remainingRefund}.`,
      });
      return;
    }
    if (!refundReason) {
      Toast.show({ type: 'error', text1: 'Refund reason is required.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOrderForm(prev => ({
        ...prev,
        refundHistory: [
          ...prev.refundHistory,
          { amount, reason: refundReason, date: new Date().toISOString() },
        ],
        status: amount >= prev.total ? 'Refunded' : prev.status,
        statusHistory: [
          ...prev.statusHistory,
          { status: amount >= prev.total ? 'Refunded' : prev.status, date: new Date().toISOString(), by: 'Admin' },
        ],
      }));
      setRefundReason('');
      setLoading(false);
      Toast.show({ type: 'success', text1: 'Refund issued successfully' });
    }, 1000);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            handleUpdateStatus('Cancelled');
            handleSaveChanges();
          },
        },
      ]
    );
  };

  const handleContactCustomer = () => {
    Alert.alert('Contact Customer', `Email: ${orderForm.customer.email}\nPhone: ${orderForm.customer.phone}`, [
      { text: 'OK', style: 'cancel' },
    ]);
  };

  const handlePrintInvoice = () => {
    Alert.alert('Print Invoice', 'Generating invoice PDF (Simulated). Check LaTeX artifact for details.', [
      { text: 'OK' },
    ]);
  };

  const renderOrderItem = ({ item }) => (
    <View className="flex-row items-center border-b border-gray-200 py-3 px-2">
      <Image
        source={getItemImage(item)}
        className="w-12 h-12 rounded mr-3"
        contentFit="cover"
      />
      <View className="flex-1">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AdminProductDetail', {
              mainCategory: item.category,
              subCategoryId: item.subCategoryId,
              product: item,
            })
          }
        >
          <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        </TouchableOpacity>
        <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
        <Text className="text-xs text-gray-600">Qty: {item.quantity}</Text>
      </View>
      <Text className="text-sm font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderStatusHistory = ({ item }) => (
    <View className="flex-row justify-between py-2 border-b border-gray-200">
      <Text className="text-sm text-gray-800">{item.status} by {item.by}</Text>
      <Text className="text-sm text-gray-600">{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  const renderRefundHistory = ({ item }) => (
    <View className="py-2 border-b border-gray-200">
      <Text className="text-sm text-gray-800">Amount: ${item.amount.toFixed(2)}</Text>
      <Text className="text-sm text-gray-600">Reason: {item.reason}</Text>
      <Text className="text-sm text-gray-600">{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  // Data for FlatList sections
  const sections = [
    {
      id: 'order_summary',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="package" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Order Summary</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Order Date</Text>
            <Text className="text-sm text-gray-800">{new Date(order?.createdAt || new Date()).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Status</Text>
            <Text className="text-sm font-semibold text-blue-600">{orderForm.status}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Total</Text>
            <Text className="text-sm font-semibold text-green-600">${orderForm.total.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Payment Status</Text>
            <Text className={`text-sm font-semibold ${getPaymentStatusClass(orderForm.payment.status)}`}>
              {orderForm.payment.status}
            </Text>
          </View>
        </View>
      ),
    },
    {
      id: 'customer_details',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="user" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Customer Details</Text>
          </View>
          <Text className="text-sm font-semibold text-gray-800">{orderForm.customer.name}</Text>
          <Text className="text-sm text-gray-600">{orderForm.customer.email}</Text>
          <Text className="text-sm text-gray-600">{orderForm.customer.phone}</Text>
          <Text className="text-sm text-gray-600 mt-2">Shipping: {orderForm.customer.shippingAddress}</Text>
          <Text className="text-sm text-gray-600">Billing: {orderForm.customer.billingAddress}</Text>
          {orderForm.customer.notes && (
            <Text className="text-sm text-gray-600 mt-2">Notes: {orderForm.customer.notes}</Text>
          )}
          <TouchableOpacity
            className="mt-3 bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={handleContactCustomer}
          >
            <Feather name="phone" size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">Contact Customer</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 'order_items',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="shopping-cart" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Order Items</Text>
          </View>
          <FlatList
            data={orderForm.items}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No items in order</Text>}
            scrollEnabled={false}
          />
          <View className="mt-4 border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Subtotal</Text>
              <Text className="text-sm text-gray-800">${orderForm.subtotal.toFixed(2)}</Text>
            </View>
            {orderForm.discounts > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Discounts</Text>
                <Text className="text-sm text-red-600">-${orderForm.discounts.toFixed(2)}</Text>
              </View>
            )}
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Taxes</Text>
              <Text className="text-sm text-gray-800">${orderForm.taxes.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Shipping</Text>
              <Text className="text-sm text-gray-800">${orderForm.shippingCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-gray-800">Total</Text>
              <Text className="text-sm font-semibold text-green-600">${orderForm.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'status_management',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="clock" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Update Status</Text>
          </View>
          <View className="flex-row flex-wrap mb-3">
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map(status => (
              <TouchableOpacity
                key={status}
                className={`p-2 m-1 rounded-lg ${orderForm.status === status ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => handleUpdateStatus(status)}
              >
                <Text className={orderForm.status === status ? 'text-white' : 'text-gray-800'}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {orderForm.status === 'Shipped' && (
            <>
              <View className="flex-row items-center mb-2">
                <Feather name="truck" size={16} color="#6b7280" className="mr-2" />
                <Text className="text-sm text-gray-600">Shipping Carrier</Text>
              </View>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
                value={orderForm.trackingCarrier}
                onChangeText={value => setOrderForm(prev => ({ ...prev, trackingCarrier: value }))}
                placeholder="e.g., UPS"
                accessibilityLabel="Tracking carrier"
              />
              <View className="flex-row items-center mb-2">
                <Feather name="hash" size={16} color="#6b7280" className="mr-2" />
                <Text className="text-sm text-gray-600">Tracking Number</Text>
              </View>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
                value={orderForm.trackingNumber}
                onChangeText={value => setOrderForm(prev => ({ ...prev, trackingNumber: value }))}
                placeholder="Tracking Number"
                accessibilityLabel="Tracking number"
              />
            </>
          )}
          <Text className="text-sm font-semibold text-gray-800 mb-2">Status History</Text>
          <FlatList
            data={orderForm.statusHistory}
            renderItem={renderStatusHistory}
            keyExtractor={(item, index) => `${item.status}-${index}`}
            ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No status history</Text>}
            scrollEnabled={false}
          />
        </View>
      ),
    },
    {
      id: 'refund_management',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="dollar-sign" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Issue Refund</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Feather name="dollar-sign" size={16} color="#6b7280" className="mr-2" />
            <Text className="text-sm text-gray-600">Refund Amount</Text>
          </View>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={refundAmount}
            onChangeText={setRefundAmount}
            placeholder="Refund Amount"
            keyboardType="numeric"
            accessibilityLabel="Refund amount"
          />
          <View className="flex-row items-center mb-2">
            <Feather name="edit" size={16} color="#6b7280" className="mr-2" />
            <Text className="text-sm text-gray-600">Reason for Refund</Text>
          </View>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={refundReason}
            onChangeText={setRefundReason}
            placeholder="Reason for Refund"
            multiline
            accessibilityLabel="Refund reason"
          />
          <TouchableOpacity
            className="bg-red-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={handleIssueRefund}
            disabled={loading}
          >
            <Feather name="alert-circle" size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">Issue Refund</Text>
          </TouchableOpacity>
          {orderForm.refundHistory.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Refund History</Text>
              <FlatList
                data={orderForm.refundHistory}
                renderItem={renderRefundHistory}
                keyExtractor={(item, index) => `refund-${index}`}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      ),
    },
    {
      id: 'internal_notes',
      render: () => (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <View className="flex-row items-center mb-3">
            <Feather name="edit-2" size={20} color="#2563eb" className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">Internal Notes</Text>
          </View>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={orderForm.internalNotes}
            onChangeText={value => setOrderForm(prev => ({ ...prev, internalNotes: value }))}
            placeholder="Add internal notes..."
            multiline
            numberOfLines={4}
            accessibilityLabel="Internal notes"
          />
        </View>
      ),
    },
  ];

  const renderSection = ({ item }) => item.render();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100" edges={['left', 'right']}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Order #{orderForm.id}</Text>
        <TouchableOpacity
          onPress={handlePrintInvoice}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="printer" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Sticky Action Bar */}
      <View className="flex-row justify-between pb-6 p-4 bg-white border-t border-gray-200 shadow-md">
        <Animated.View style={[animatedCancelStyle, { flex: 1, marginRight: 8 }]}>
          <TouchableOpacity
            className="bg-gray-500 rounded-lg p-3 items-center"
            onPress={() => {
              cancelButtonScale.value = withSpring(0.95, {}, () => {
                cancelButtonScale.value = withSpring(1);
                navigation.goBack();
              });
            }}
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[animatedSaveStyle, { flex: 1, marginLeft: 8 }]}>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-3 items-center"
            onPress={() => {
              saveButtonScale.value = withSpring(0.95, {}, () => {
                saveButtonScale.value = withSpring(1);
                handleSaveChanges();
              });
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Save Changes</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminOrderDetail;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});