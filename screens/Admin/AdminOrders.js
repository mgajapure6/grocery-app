import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Dummy Data (Replace with your API calls) ---
const ALL_ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const ALL_PAYMENT_METHODS = ['Credit Card', 'UPI', 'Cash on Delivery', 'Bank Transfer'];
const ALL_SHIPPING_METHODS = ['Standard Shipping', 'Express Shipping', 'Local Pickup'];

const DUMMY_ORDERS = [
  {
    id: 'ORD1001',
    customerName: 'Alice Smith',
    customerEmail: 'alice@example.com',
    customerPhone: '123-456-7890',
    date: '2023-10-25T10:30:00Z',
    total: 55.20,
    status: 'Shipped',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    shippingAddress: { street: '123 Maple St', city: 'Anytown', zip: '12345', country: 'USA' },
    billingAddress: { street: '123 Maple St', city: 'Anytown', zip: '12345', country: 'USA' },
    items: [
      { id: 'p1', name: 'Organic Apples (1kg)', sku: 'APL001', quantity: 2, price: 2.50, image: 'https://via.placeholder.com/60' },
      { id: 'p2', name: 'Whole Wheat Bread', sku: 'BREAD005', quantity: 1, price: 3.20, image: 'https://via.placeholder.com/60' },
      { id: 'p3', name: 'Almond Milk (1L)', sku: 'MLK010', quantity: 3, price: 4.50, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 22.70,
    tax: 3.50,
    shippingCost: 5.00,
    discount: 0.00,
    transactionId: 'txn_abc123',
    carrier: 'FedEx',
    trackingNumber: 'TRK789',
    history: [
      { status: 'Pending', timestamp: '2023-10-25T10:30:00Z', by: 'System' },
      { status: 'Processing', timestamp: '2023-10-25T11:00:00Z', by: 'Admin User 1' },
      { status: 'Shipped', timestamp: '2023-10-26T09:00:00Z', by: 'Admin User 2' },
    ],
    notes: 'Customer requested extra fragile packaging.',
  },
  {
    id: 'ORD1002',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    customerPhone: '987-654-3210',
    date: '2023-10-25T14:00:00Z',
    total: 32.10,
    status: 'Processing',
    paymentMethod: 'UPI',
    shippingMethod: 'Express Shipping',
    shippingAddress: { street: '456 Oak Ave', city: 'Otherville', zip: '67890', country: 'USA' },
    billingAddress: { street: '456 Oak Ave', city: 'Otherville', zip: '67890', country: 'USA' },
    items: [
      { id: 'p4', name: 'Chicken Breast (500g)', sku: 'MEAT003', quantity: 1, price: 8.50, image: 'https://via.placeholder.com/60' },
      { id: 'p5', name: 'Greek Yogurt (500g)', sku: 'DAIRY001', quantity: 2, price: 4.80, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 18.10,
    tax: 2.00,
    shippingCost: 12.00,
    discount: 0.00,
    transactionId: 'upi_xyz456',
    carrier: '',
    trackingNumber: '',
    history: [
      { status: 'Pending', timestamp: '2023-10-25T14:00:00Z', by: 'System' },
      { status: 'Processing', timestamp: '2023-10-25T14:30:00Z', by: 'Admin User 1' },
    ],
    notes: '',
  },
  {
    id: 'ORD1003',
    customerName: 'Charlie Brown',
    customerEmail: 'charlie@example.com',
    customerPhone: '555-123-4567',
    date: '2023-10-24T18:00:00Z',
    total: 120.50,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    shippingMethod: 'Standard Shipping',
    shippingAddress: { street: '789 Pine Ln', city: 'Smalltown', zip: '98765', country: 'USA' },
    billingAddress: { street: '789 Pine Ln', city: 'Smalltown', zip: '98765', country: 'USA' },
    items: [
      { id: 'p10', name: 'Honey (500g)', sku: 'SWEET001', quantity: 3, price: 7.00, image: 'https://via.placeholder.com/60' },
      { id: 'p11', name: 'Olive Oil (750ml)', sku: 'OIL002', quantity: 2, price: 15.00, image: 'https://via.placeholder.com/60' },
      { id: 'p20', name: 'Spicy Kimchi', sku: 'FERM001', quantity: 4, price: 6.50, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 73.00,
    tax: 7.50,
    shippingCost: 10.00,
    discount: 0.00,
    transactionId: null,
    carrier: '',
    trackingNumber: '',
    history: [
      { status: 'Pending', timestamp: '2023-10-24T18:00:00Z', by: 'System' },
    ],
    notes: '',
  },
  {
    id: 'ORD1004',
    customerName: 'Diana Prince',
    customerEmail: 'diana@example.com',
    customerPhone: '111-222-3333',
    date: '2023-10-23T09:00:00Z',
    total: 88.00,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    shippingAddress: { street: '101 Paradise Rd', city: 'Themyscira', zip: '00000', country: 'USA' },
    billingAddress: { street: '101 Paradise Rd', city: 'Themyscira', zip: '00000', country: 'USA' },
    items: [
      { id: 'p21', name: 'Vegan Cheese Slices', sku: 'VEGAN001', quantity: 5, price: 5.00, image: 'https://via.placeholder.com/60' },
      { id: 'p3', name: 'Almond Milk (1L)', sku: 'MLK010', quantity: 2, price: 4.50, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 34.00,
    tax: 4.00,
    shippingCost: 10.00,
    discount: 0.00,
    transactionId: 'txn_def456',
    carrier: 'UPS',
    trackingNumber: 'TRK101',
    history: [
      { status: 'Pending', timestamp: '2023-10-23T09:00:00Z', by: 'System' },
      { status: 'Processing', timestamp: '2023-10-23T09:30:00Z', by: 'Admin User 1' },
      { status: 'Shipped', timestamp: '2023-10-24T08:00:00Z', by: 'Admin User 2' },
      { status: 'Delivered', timestamp: '2023-10-25T15:00:00Z', by: 'Carrier' },
    ],
    notes: 'Delivered to reception.',
  },
  {
    id: 'ORD1005',
    customerName: 'Clark Kent',
    customerEmail: 'clark@example.com',
    customerPhone: '444-555-6666',
    date: '2023-10-23T11:00:00Z',
    total: 25.00,
    status: 'Cancelled',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    shippingAddress: { street: 'Daily Planet', city: 'Metropolis', zip: '54321', country: 'USA' },
    billingAddress: { street: 'Daily Planet', city: 'Metropolis', zip: '54321', country: 'USA' },
    items: [
      { id: 'p2', name: 'Whole Wheat Bread', sku: 'BREAD005', quantity: 1, price: 3.20, image: 'https://via.placeholder.com/60' },
      { id: 'p3', name: 'Almond Milk (1L)', sku: 'MLK010', quantity: 1, price: 4.50, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 7.70,
    tax: 1.00,
    shippingCost: 5.00,
    discount: 0.00,
    transactionId: 'txn_ghi789',
    carrier: '',
    trackingNumber: '',
    history: [
      { status: 'Pending', timestamp: '2023-10-23T11:00:00Z', by: 'System' },
      { status: 'Cancelled', timestamp: '2023-10-23T12:00:00Z', by: 'Customer' },
    ],
    notes: 'Customer cancelled, ordered wrong item.',
  },
];

// --- Helper Functions ---
const getStatusClass = (status) => {
  switch (status) {
    case 'Pending': return 'text-yellow-600';
    case 'Processing': return 'text-blue-600';
    case 'Shipped': return 'text-purple-600';
    case 'Delivered': return 'text-green-600';
    case 'Cancelled': return 'text-red-600';
    case 'Refunded': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return `$${amount.toFixed(2)}`;
};

export default function AdminOrders({ navigation }) {
  const [allOrders, setAllOrders] = useState(DUMMY_ORDERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortingOptionsVisible, setIsSortingOptionsVisible] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSettingStartDate, setIsSettingStartDate] = useState(true);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [inputModalType, setInputModalType] = useState(null); // 'tracking' or 'note'
  const [inputModalValue, setInputModalValue] = useState('');

  // --- Simulate Data Fetching ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllOrders(DUMMY_ORDERS);
      setLoading(false);
    }, 1000);
  }, []);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedOrders = useMemo(() => {
    let orders = [...allOrders];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(lowerQuery) ||
        order.customerName.toLowerCase().includes(lowerQuery) ||
        order.customerEmail.toLowerCase().includes(lowerQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(lowerQuery))
      );
    }

    // Filters
    orders = orders.filter(order => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) return false;
      if (filterStartDate && new Date(order.date) < filterStartDate) return false;
      if (filterEndDate) {
        const endDateInclusive = new Date(filterEndDate);
        endDateInclusive.setHours(23, 59, 59, 999);
        if (new Date(order.date) > endDateInclusive) return false;
      }
      if (selectedPaymentMethod && order.paymentMethod !== selectedPaymentMethod) return false;
      if (selectedShippingMethod && order.shippingMethod !== selectedShippingMethod) return false;
      return true;
    });

    // Sorting
    orders.sort((a, b) => {
      let aValue = sortBy === 'date' ? new Date(a.date) : (sortBy === 'total' ? a.total : (sortBy === 'status' ? a.status : a.id));
      let bValue = sortBy === 'date' ? new Date(b.date) : (sortBy === 'total' ? b.total : (sortBy === 'status' ? b.status : b.id));
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return orders;
  }, [allOrders, searchQuery, selectedStatuses, filterStartDate, filterEndDate, selectedPaymentMethod, selectedShippingMethod, sortBy, sortOrder]);

  // --- Bulk Actions ---
  const handleToggleSelectOrder = (orderId) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrderIds.length === filteredAndSortedOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredAndSortedOrders.map(order => order.id));
    }
  };

  const handleBulkAction = (actionType) => {
    if (selectedOrderIds.length === 0) {
      Alert.alert("No Orders Selected", "Please select orders first.");
      return;
    }
    Alert.alert(
      "Confirm Bulk Action",
      `Are you sure you want to perform "${actionType}" on ${selectedOrderIds.length} selected orders?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionType,
          onPress: () => {
            console.log(`Simulating Bulk Action: ${actionType} on IDs:`, selectedOrderIds);
            Alert.alert("Success", `${selectedOrderIds.length} orders marked as ${actionType}. (Simulated)`);
            setSelectedOrderIds([]);
          },
        },
      ]
    );
  };

  // --- Order Detail Modal Handlers ---
  const openOrderDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const closeOrderDetailModal = () => {
    setSelectedOrder(null);
    setIsDetailModalVisible(false);
  };

  // --- Order Detail Actions ---
  const handleStatusUpdate = (newStatus) => {
    if (!selectedOrder || !selectedOrder.id) return;
    Alert.alert(
      "Confirm Status Change",
      `Change status for Order ${selectedOrder.id} to "${newStatus}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change",
          onPress: () => {
            console.log(`Simulating Status Update for ${selectedOrder.id} to ${newStatus}`);
            setAllOrders(prevOrders => prevOrders.map(order =>
              order.id === selectedOrder.id ? {
                ...order,
                status: newStatus,
                history: [...order.history, { status: newStatus, timestamp: new Date().toISOString(), by: 'Admin' }],
              } : order
            ));
            setSelectedOrder(prev => prev ? {
              ...prev,
              status: newStatus,
              history: [...prev.history, { status: newStatus, timestamp: new Date().toISOString(), by: 'Admin' }],
            } : null);
            Alert.alert("Success", `Order ${selectedOrder.id} status updated to ${newStatus}. (Simulated)`);
          },
        },
      ]
    );
  };

  const openInputModal = (type) => {
    setInputModalType(type);
    setInputModalValue('');
    setIsInputModalVisible(true);
  };

  const closeInputModal = () => {
    setIsInputModalVisible(false);
    setInputModalType(null);
    setInputModalValue('');
  };

  const handleInputModalSubmit = () => {
    if (!inputModalValue.trim()) {
      Alert.alert("Error", "Input cannot be empty.");
      return;
    }
    if (!selectedOrder || !selectedOrder.id) return;

    if (inputModalType === 'tracking') {
      console.log(`Simulating Adding Tracking ${inputModalValue} for ${selectedOrder.id}`);
      setAllOrders(prevOrders => prevOrders.map(order =>
        order.id === selectedOrder.id ? {
          ...order,
          trackingNumber: inputModalValue,
          carrier: selectedOrder.carrier || 'Unknown Carrier',
        } : order
      ));
      setSelectedOrder(prev => prev ? {
        ...prev,
        trackingNumber: inputModalValue,
        carrier: prev.carrier || 'Unknown Carrier',
      } : null);
      Alert.alert("Success", `Tracking number added for ${selectedOrder.id}. (Simulated)`);
    } else if (inputModalType === 'note') {
      console.log(`Simulating Adding Note for ${selectedOrder.id}: "${inputModalValue}"`);
      const newNote = `[${formatDate(new Date().toISOString())}] ${inputModalValue}`;
      setAllOrders(prevOrders => prevOrders.map(order =>
        order.id === selectedOrder.id ? {
          ...order,
          notes: (order.notes ? order.notes + '\n' : '') + newNote,
        } : order
      ));
      setSelectedOrder(prev => prev ? {
        ...prev,
        notes: (prev.notes ? prev.notes + '\n' : '') + newNote,
      } : null);
      Alert.alert("Success", `Note added for ${selectedOrder.id}. (Simulated)`);
    }
    closeInputModal();
  };

  const handleInitiateRefund = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    Alert.alert("Refund Feature", `Simulating refund for Order ${selectedOrder.id}. Requires payment gateway integration.`, [
      { text: "OK" },
      { text: "Simulate Refunded", onPress: () => handleStatusUpdate('Refunded') },
    ]);
  };

  const handleGenerateShippingLabel = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    Alert.alert("Shipping Label Feature", `Simulating generating shipping label for Order ${selectedOrder.id}. Requires shipping carrier integration.`, [
      { text: "OK" },
    ]);
  };

  // --- Filter Modal Handlers ---
  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const handleStatusFilterToggle = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatuses([]);
    setFilterStartDate(null);
    setFilterEndDate(null);
    setSelectedPaymentMethod(null);
    setSelectedShippingMethod(null);
    setIsFilterModalVisible(false);
  };

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
  };

  // --- Date Picker Handlers ---
  const handleFilterDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      if (isSettingStartDate) {
        setFilterStartDate(date);
      } else {
        setFilterEndDate(date);
      }
    }
  };

  const showFilterStartDatePicker = () => {
    setIsSettingStartDate(true);
    setShowDatePicker(true);
  };

  const showFilterEndDatePicker = () => {
    setIsSettingStartDate(false);
    setShowDatePicker(true);
  };

  // --- Sorting Handlers ---
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'date' ? 'desc' : 'asc');
    }
    setIsSortingOptionsVisible(false);
  };

  // --- Render Functions ---
  const renderOrderListItem = ({ item }) => {
    const isSelected = selectedOrderIds.includes(item.id);
    return (
      <View className={`flex-row items-center border-b border-gray-200 py-3 px-4 bg-white ${isSelected ? 'bg-blue-100' : ''}`}>
        <TouchableOpacity onPress={() => handleToggleSelectOrder(item.id)} className="p-2 mr-2">
          <Feather
            name={isSelected ? 'check-square' : 'square'}
            size={20}
            color={isSelected ? '#2563eb' : '#6b7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openOrderDetailModal(item)} className="flex-1 flex-row items-center">
          <View className="w-1/3">
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{item.id}</Text>
            <Text className="text-xs text-gray-600 mt-1" numberOfLines={1}>{item.customerName}</Text>
          </View>
          <View className="ml-auto px-1 items-center">
            <Text className="text-xs text-gray-700">{formatDate(item.date).split(' ')[0]}</Text>
            <Text className="text-xs text-gray-700">{formatDate(item.date).split(' ')[1]}</Text>
          </View>
          <View className="ml-auto px-1 items-end">
            <Text className="text-sm font-bold text-green-700">{formatCurrency(item.total)}</Text>
          </View>
          <View className="ml-auto px-1 items-center">
            <Text className={`text-xs font-semibold ${getStatusClass(item.status)}`}>{item.status}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInputModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isInputModalVisible}
      onRequestClose={closeInputModal}
    >
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50 justify-center items-center"
        activeOpacity={1}
        onPress={closeInputModal}
      >
        <View className="bg-white rounded-lg p-4 w-80" onStartShouldSetResponder={() => true}>
          <Text className="text-lg font-bold text-gray-800 mb-4">
            {inputModalType === 'tracking' ? 'Add Tracking Number' : 'Add Admin Note'}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-white text-gray-800"
            value={inputModalValue}
            onChangeText={setInputModalValue}
            placeholder={inputModalType === 'tracking' ? 'Enter tracking number' : 'Enter note'}
            placeholderTextColor="#999"
            accessibilityLabel={inputModalType === 'tracking' ? 'Tracking number input' : 'Admin note input'}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 bg-gray-400 rounded-lg px-4 py-2 mr-2 items-center"
              onPress={closeInputModal}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-blue-600 rounded-lg px-4 py-2 ml-2 items-center"
              onPress={handleInputModalSubmit}
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderOrderDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isDetailModalVisible}
      onRequestClose={closeOrderDetailModal}
    >
      <SafeAreaView className="flex-1 bg-gray-100 mt-6" edges={['left', 'right']}>
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Order Details - {selectedOrder?.id}</Text>
          <TouchableOpacity onPress={closeOrderDetailModal} className="p-1">
            <Feather name="x" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Status:</Text>
              <Text className={`font-semibold ${getStatusClass(selectedOrder?.status)}`}>{selectedOrder?.status}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Order Date:</Text>
              <Text className="text-gray-800">{formatDate(selectedOrder?.date)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Payment Method:</Text>
              <Text className="text-gray-800">{selectedOrder?.paymentMethod}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Shipping Method:</Text>
              <Text className="text-gray-800">{selectedOrder?.shippingMethod}</Text>
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Customer</Text>
            <Text className="text-gray-800 font-semibold">{selectedOrder?.customerName}</Text>
            <Text className="text-gray-600 text-sm mt-1">Email: {selectedOrder?.customerEmail}</Text>
            <Text className="text-gray-600 text-sm">Phone: {selectedOrder?.customerPhone}</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("View Customer", "Navigate to customer profile (Simulated)")}
              className="mt-3 self-start px-3 py-1 bg-blue-500 rounded-md"
            >
              <Text className="text-white text-sm">View Customer</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row mb-4 -mx-1">
            <View className="flex-1 mx-1 bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-3">Shipping Address</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.shippingAddress.street}</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.shippingAddress.city}, {selectedOrder?.shippingAddress.zip}</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.shippingAddress.country}</Text>
            </View>
            <View className="flex-1 mx-1 bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-3">Billing Address</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.billingAddress.street}</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.billingAddress.city}, {selectedOrder?.billingAddress.zip}</Text>
              <Text className="text-gray-700 text-sm">{selectedOrder?.billingAddress.country}</Text>
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Items Ordered</Text>
            {selectedOrder?.items.map(item => (
              <View key={item.id} className="flex-row items-center border-b border-gray-100 py-2 last:border-b-0">
                <Image source={{ uri: item.image }} className="w-12 h-12 rounded mr-3" contentFit="cover" />
                <View className="flex-1 pr-2">
                  <Text className="text-gray-800 font-semibold text-sm">{item.name}</Text>
                  <Text className="text-gray-600 text-xs">SKU: {item.sku}</Text>
                </View>
                <Text className="text-gray-700 text-sm">Qty: {item.quantity}</Text>
                <Text className="text-green-700 font-semibold ml-4 text-sm">{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
            <View className="mt-4 border-t border-gray-200 pt-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-700">Subtotal:</Text>
                <Text className="text-gray-800">{formatCurrency(selectedOrder?.subtotal)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-700">Tax:</Text>
                <Text className="text-gray-800">{formatCurrency(selectedOrder?.tax)}</Text>
              </View>
              {selectedOrder?.discount > 0 && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-700">Discount:</Text>
                  <Text className="text-red-600">{formatCurrency(selectedOrder?.discount)}</Text>
                </View>
              )}
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-700">Shipping:</Text>
                <Text className="text-gray-800">{formatCurrency(selectedOrder?.shippingCost)}</Text>
              </View>
              <View className="flex-row justify-between mt-2 border-t border-gray-200 pt-2">
                <Text className="text-gray-800 font-bold">Order Total:</Text>
                <Text className="text-green-700 font-bold text-lg">{formatCurrency(selectedOrder?.total)}</Text>
              </View>
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-semibold text-gray-800">Payment Info</Text>
              {selectedOrder?.paymentMethod !== 'Cash on Delivery' && selectedOrder?.status !== 'Refunded' && (
                <TouchableOpacity onPress={handleInitiateRefund} className="px-3 py-1 bg-red-500 rounded-md">
                  <Text className="text-white text-sm">Initiate Refund</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-1">Method: <Text className="font-semibold text-gray-800">{selectedOrder?.paymentMethod}</Text></Text>
            {selectedOrder?.transactionId && (
              <Text className="text-gray-700">Transaction ID: <Text className="font-semibold text-gray-800">{selectedOrder?.transactionId}</Text></Text>
            )}
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-semibold text-gray-800">Shipping Info</Text>
              {!selectedOrder?.trackingNumber && selectedOrder?.status !== 'Cancelled' && (
                <TouchableOpacity onPress={() => openInputModal('tracking')} className="px-3 py-1 bg-blue-500 rounded-md">
                  <Text className="text-white text-sm">Add Tracking</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-1">Carrier: <Text className="font-semibold text-gray-800">{selectedOrder?.carrier || 'N/A'}</Text></Text>
            <Text className="text-gray-700 mb-1">Tracking Number: <Text className="font-semibold text-gray-800">{selectedOrder?.trackingNumber || 'N/A'}</Text></Text>
            {selectedOrder?.trackingNumber && (
              <TouchableOpacity
                onPress={() => Alert.alert("Track Order", `Open tracking link for ${selectedOrder.trackingNumber} (Simulated)`)}
                className="mt-2 self-start px-3 py-1 bg-green-500 rounded-md"
              >
                <Text className="text-white text-sm">Track Shipment</Text>
              </TouchableOpacity>
            )}
            {selectedOrder?.status === 'Processing' && (
              <TouchableOpacity onPress={handleGenerateShippingLabel} className="mt-2 self-start px-3 py-1 bg-purple-500 rounded-md">
                <Text className="text-white text-sm">Generate Shipping Label</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Order History</Text>
            {selectedOrder?.history.map((entry, index) => (
              <View key={index} className="flex-row items-center border-b border-gray-100 py-2 last:border-b-0">
                <Feather name="clock" size={14} color="#6b7280" style={{ marginRight: 8 }} />
                <View className="flex-1">
                  <Text className="text-gray-800 text-sm"><Text className="font-semibold">{entry.status}</Text> by {entry.by}</Text>
                  <Text className="text-gray-600 text-xs">{formatDate(entry.timestamp)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-semibold text-gray-800">Admin Notes</Text>
              <TouchableOpacity onPress={() => openInputModal('note')} className="px-3 py-1 bg-gray-500 rounded-md">
                <Text className="text-white text-sm">Add Note</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-700 text-sm italic leading-relaxed">{selectedOrder?.notes || 'No admin notes yet.'}</Text>
          </View>
          <View className="flex-row justify-around mt-4 mb-8">
            {selectedOrder?.status === 'Pending' && (
              <TouchableOpacity onPress={() => handleStatusUpdate('Processing')} className="flex-1 mx-1 bg-blue-600 rounded-lg px-4 py-3 items-center">
                <Text className="text-white font-semibold text-base">Mark as Processing</Text>
              </TouchableOpacity>
            )}
            {selectedOrder?.status === 'Processing' && (
              <TouchableOpacity onPress={() => handleStatusUpdate('Shipped')} className="flex-1 mx-1 bg-purple-600 rounded-lg px-4 py-3 items-center">
                <Text className="text-white font-semibold text-base">Mark as Shipped</Text>
              </TouchableOpacity>
            )}
            {selectedOrder?.status === 'Shipped' && (
              <TouchableOpacity onPress={() => handleStatusUpdate('Delivered')} className="flex-1 mx-1 bg-green-600 rounded-lg px-4 py-3 items-center">
                <Text className="text-white font-semibold text-base">Mark as Delivered</Text>
              </TouchableOpacity>
            )}
            {(selectedOrder?.status === 'Pending' || selectedOrder?.status === 'Processing') && (
              <TouchableOpacity onPress={() => handleStatusUpdate('Cancelled')} className="flex-1 mx-1 bg-red-600 rounded-lg px-4 py-3 items-center">
                <Text className="text-white font-semibold text-base">Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="h-20"></View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isFilterModalVisible}
      onRequestClose={closeFilterModal}
    >
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Filter Orders</Text>
          <TouchableOpacity onPress={closeFilterModal} className="p-1">
            <Feather name="x" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Status</Text>
            <View className="flex-row flex-wrap -m-1">
              {ALL_ORDER_STATUSES.map(status => (
                <TouchableOpacity
                  key={status}
                  className={`m-1 px-3 py-1.5 border rounded-full ${selectedStatuses.includes(status) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-gray-100'}`}
                  onPress={() => handleStatusFilterToggle(status)}
                >
                  <Text className={`${selectedStatuses.includes(status) ? 'text-white' : 'text-gray-700'} text-sm font-semibold`}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Order Date Range</Text>
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={showFilterStartDatePicker} className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-md">
                <Text className="text-gray-700 text-center">{filterStartDate ? filterStartDate.toLocaleDateString() : 'Select Start Date'}</Text>
              </TouchableOpacity>
              <Text className="text-gray-600">to</Text>
              <TouchableOpacity onPress={showFilterEndDatePicker} className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-md">
                <Text className="text-gray-700 text-center">{filterEndDate ? filterEndDate.toLocaleDateString() : 'Select End Date'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Payment Method</Text>
            <View className="flex-row flex-wrap -m-1">
              {ALL_PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method}
                  className={`m-1 px-3 py-1.5 border rounded-full ${selectedPaymentMethod === method ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-gray-100'}`}
                  onPress={() => setSelectedPaymentMethod(selectedPaymentMethod === method ? null : method)}
                >
                  <Text className={`${selectedPaymentMethod === method ? 'text-white' : 'text-gray-700'} text-sm font-semibold`}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-800 mb-3">Shipping Method</Text>
            <View className="flex-row flex-wrap -m-1">
              {ALL_SHIPPING_METHODS.map(method => (
                <TouchableOpacity
                  key={method}
                  className={`m-1 px-3 py-1.5 border rounded-full ${selectedShippingMethod === method ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-gray-100'}`}
                  onPress={() => setSelectedShippingMethod(selectedShippingMethod === method ? null : method)}
                >
                  <Text className={`${selectedShippingMethod === method ? 'text-white' : 'text-gray-700'} text-sm font-semibold`}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex-row justify-between mt-6 mb-8">
            <TouchableOpacity onPress={handleClearFilters} className="flex-1 mx-1 bg-gray-400 rounded-lg px-4 py-3 items-center">
              <Text className="text-white font-semibold text-base">Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApplyFilters} className="flex-1 mx-1 bg-green-600 rounded-lg px-4 py-3 items-center">
              <Text className="text-white font-semibold text-base">Apply Filters</Text>
            </TouchableOpacity>
          </View>
          <View className="h-10"></View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSortingOptions = () => (
    isSortingOptionsVisible && (
      <TouchableOpacity
        className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 justify-center items-center z-50"
        activeOpacity={1}
        onPress={() => setIsSortingOptionsVisible(false)}
      >
        <View className="bg-white rounded-lg p-4 w-64" onStartShouldSetResponder={() => true}>
          <Text className="text-lg font-bold text-gray-800 mb-4">Sort By</Text>
          {['date', 'total', 'status', 'id'].map(option => (
            <TouchableOpacity key={option} onPress={() => handleSortChange(option)} className="py-2 border-b border-gray-200 last:border-b-0">
              <Text className={`text-base ${sortBy === option ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
                {sortBy === option && (
                  <Feather name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color="#2563eb" style={{ marginLeft: 4 }} />
                )}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setIsSortingOptionsVisible(false)}
            className="mt-4 self-end px-3 py-1 border border-gray-300 rounded-md"
          >
            <Text className="text-gray-700">Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mr-2">
          <Feather name="search" size={20} color="#6b7280" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            accessibilityLabel="Search orders"
          />
        </View>
        <TouchableOpacity onPress={openFilterModal} className="p-2 rounded-md bg-gray-200 mr-2">
          <Feather
            name="filter"
            size={20}
            color={selectedStatuses.length > 0 || filterStartDate || filterEndDate || selectedPaymentMethod || selectedShippingMethod ? '#2563eb' : '#374151'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSortingOptionsVisible(true)} className="p-2 rounded-md bg-gray-200">
          <Feather name="sort-desc" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
      {selectedOrderIds.length > 0 && (
        <View className="flex-row items-center justify-between p-3 bg-blue-500">
          <Text className="text-white font-semibold">{selectedOrderIds.length} Selected</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={() => handleBulkAction('Processing')} className="ml-4 px-3 py-1 bg-blue-700 rounded-md">
              <Text className="text-white text-sm">Mark as Processing</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleBulkAction('Shipped')} className="ml-2 px-3 py-1 bg-blue-700 rounded-md">
              <Text className="text-white text-sm">Mark as Shipped</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View className="flex-row items-center border-b border-gray-200 py-2 px-4 bg-gray-100">
        <TouchableOpacity onPress={handleSelectAllOrders} className="p-2 mr-2">
          <Feather
            name={selectedOrderIds.length === filteredAndSortedOrders.length && filteredAndSortedOrders.length > 0 ? 'check-square' : 'square'}
            size={20}
            color={selectedOrderIds.length > 0 ? '#2563eb' : '#6b7280'}
          />
        </TouchableOpacity>
        <View className="flex-1 flex-row">
          <Text className="w-1/4 text-xs font-semibold text-gray-600">Order | Customer</Text>
          <Text className="text-xs font-semibold text-gray-600 px-0 text-center ml-auto">Date | Time</Text>
          <Text className="text-xs font-semibold text-gray-600 px-1 text-right ml-auto">Total</Text>
          <Text className="text-xs font-semibold text-gray-600 px-1 text-center ml-auto">Status</Text>
        </View>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-600">Loading Orders...</Text>
        </View>
      ) : filteredAndSortedOrders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Feather name="box" size={50} color="#9ca3af" style={{ marginBottom: 16 }} />
          <Text className="text-gray-600 text-lg">No orders found.</Text>
          {(searchQuery || selectedStatuses.length > 0 || filterStartDate || filterEndDate || selectedPaymentMethod || selectedShippingMethod) && (
            <Text className="text-gray-500 mt-2">Try adjusting your filters or search query.</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedOrders}
          renderItem={renderOrderListItem}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {renderOrderDetailModal()}
      {renderFilterModal()}
      {renderSortingOptions()}
      {renderInputModal()}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={isSettingStartDate ? (filterStartDate || new Date()) : (filterEndDate || new Date())}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleFilterDateChange}
        />
      )}
    </SafeAreaView>
  );
}