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
    StyleSheet
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

// --- Constants ---
const ALL_ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const ALL_PAYMENT_METHODS = ['Credit Card', 'UPI', 'Cash on Delivery', 'Bank Transfer'];
const ALL_SHIPPING_METHODS = ['Standard Shipping', 'Express Shipping', 'Local Pickup'];

// --- Dummy Data (Updated for AdminOrderDetail compatibility) ---
const DUMMY_ORDERS = [
    {
        id: 'ORD1001',
        status: 'Shipped',
        createdAt: '2023-10-25T10:30:00Z',
        customer: {
            name: 'Alice Smith',
            email: 'alice@example.com',
            phone: '123-456-7890',
            shippingAddress: '123 Maple St, Anytown, 12345, USA',
            billingAddress: '123 Maple St, Anytown, 12345, USA',
            notes: 'Customer requested extra fragile packaging.',
        },
        items: [
            {
                id: 'item-1-1-1',
                name: 'Wheat Atta',
                sku: 'SKU-item-1-1-1',
                quantity: 2,
                price: 5.00,
                image: require('../../assets/categories/aatta.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-1', name: 'Atta Rice and Dals', items: [] }] },
                subCategoryId: 'subcat-1-1',
            },
            {
                id: 'item-1-2-2',
                name: 'Bread - Brown',
                sku: 'SKU-item-1-2-2',
                quantity: 1,
                price: 2.50,
                image: require('../../assets/categories/bakary.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-2', name: 'Bakery', items: [] }] },
                subCategoryId: 'subcat-1-2',
            },
            {
                id: 'item-2-1-1',
                name: 'Gentle Baby Soap',
                sku: 'SKU-item-2-1-1',
                quantity: 3,
                price: 3.00,
                image: require('../../assets/categories/baby_care.png'),
                category: { id: 'cat-2', name: 'Beauty and Wellness', subcategories: [{ id: 'subcat-2-1', name: 'Baby Care', items: [] }] },
                subCategoryId: 'subcat-2-1',
            },
        ],
        subtotal: 18.50,
        discounts: 0.00,
        taxes: 3.50,
        shippingCost: 5.00,
        total: 27.00,
        payment: {
            status: 'Paid',
            method: 'Credit Card',
            transactionId: 'txn_abc123',
            date: '2023-10-25T10:30:00Z',
        },
        statusHistory: [
            { status: 'Pending', date: '2023-10-25T10:30:00Z', by: 'System' },
            { status: 'Processing', date: '2023-10-25T11:00:00Z', by: 'Admin User 1' },
            { status: 'Shipped', date: '2023-10-26T09:00:00Z', by: 'Admin User 2' },
        ],
        refundHistory: [],
        internalNotes: 'Checked packaging requirements.',
        trackingNumber: 'TRK789',
        trackingCarrier: 'FedEx',
    },
    {
        id: 'ORD1002',
        status: 'Processing',
        createdAt: '2023-10-25T14:00:00Z',
        customer: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '987-654-3210',
            shippingAddress: '456 Oak Ave, Otherville, 67890, USA',
            billingAddress: '456 Oak Ave, Otherville, 67890, USA',
            notes: '',
        },
        items: [
            {
                id: 'item-3-1-1',
                name: 'Potato Chips - Classic Salted',
                sku: 'SKU-item-3-1-1',
                quantity: 1,
                price: 2.50,
                image: require('../../assets/categories/chips.png'),
                category: { id: 'cat-3', name: 'Snacks and Drinks', subcategories: [{ id: 'subcat-3-1', name: 'Chips and Namkeens', items: [] }] },
                subCategoryId: 'subcat-3-1',
            },
            {
                id: 'item-1-1-2',
                name: 'Basmati Rice',
                sku: 'SKU-item-1-1-2',
                quantity: 2,
                price: 12.00,
                image: require('../../assets/categories/aatta.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-1', name: 'Atta Rice and Dals', items: [] }] },
                subCategoryId: 'subcat-1-1',
            },
        ],
        subtotal: 26.50,
        discounts: 0.00,
        taxes: 2.00,
        shippingCost: 12.00,
        total: 40.50,
        payment: {
            status: 'Paid',
            method: 'UPI',
            transactionId: 'upi_xyz456',
            date: '2023-10-25T14:00:00Z',
        },
        statusHistory: [
            { status: 'Pending', date: '2023-10-25T14:00:00Z', by: 'System' },
            { status: 'Processing', date: '2023-10-25T14:30:00Z', by: 'Admin User 1' },
        ],
        refundHistory: [],
        internalNotes: '',
        trackingNumber: '',
        trackingCarrier: '',
    },
    {
        id: 'ORD1003',
        status: 'Pending',
        createdAt: '2023-10-24T18:00:00Z',
        customer: {
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            phone: '555-123-4567',
            shippingAddress: '789 Pine Ln, Smalltown, 98765, USA',
            billingAddress: '789 Pine Ln, Smalltown, 98765, USA',
            notes: '',
        },
        items: [
            {
                id: 'item-1-2-1',
                name: 'Bread - White',
                sku: 'SKU-item-1-2-1',
                quantity: 3,
                price: 2.00,
                image: require('../../assets/categories/bakary.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-2', name: 'Bakery', items: [] }] },
                subCategoryId: 'subcat-1-2',
            },
            {
                id: 'item-4-1-1',
                name: 'Refrigerator',
                sku: 'SKU-item-4-1-1',
                quantity: 1,
                price: 500.00,
                image: require('../../assets/categories/appliances.png'),
                category: { id: 'cat-4', name: 'Household and Lifestyle', subcategories: [{ id: 'subcat-4-1', name: 'Home Appliances', items: [] }] },
                subCategoryId: 'subcat-4-1',
            },
        ],
        subtotal: 506.00,
        discounts: 10.00,
        taxes: 7.50,
        shippingCost: 10.00,
        total: 513.50,
        payment: {
            status: 'Pending',
            method: 'Cash on Delivery',
            transactionId: null,
            date: null,
        },
        statusHistory: [
            { status: 'Pending', date: '2023-10-24T18:00:00Z', by: 'System' },
        ],
        refundHistory: [],
        internalNotes: '',
        trackingNumber: '',
        trackingCarrier: '',
    },
    {
        id: 'ORD1004',
        status: 'Delivered',
        createdAt: '2023-10-23T09:00:00Z',
        customer: {
            name: 'Diana Prince',
            email: 'diana@example.com',
            phone: '111-222-3333',
            shippingAddress: '101 Paradise Rd, Themyscira, 00000, USA',
            billingAddress: '101 Paradise Rd, Themyscira, 00000, USA',
            notes: 'Deliver to reception.',
        },
        items: [
            {
                id: 'item-1-2-2',
                name: 'Bread - Brown',
                sku: 'SKU-item-1-2-2',
                quantity: 5,
                price: 2.50,
                image: require('../../assets/categories/bakary.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-2', name: 'Bakery', items: [] }] },
                subCategoryId: 'subcat-1-2',
            },
            {
                id: 'item-2-1-1',
                name: 'Gentle Baby Soap',
                sku: 'SKU-item-2-1-1',
                quantity: 2,
                price: 3.00,
                image: require('../../assets/categories/baby_care.png'),
                category: { id: 'cat-2', name: 'Beauty and Wellness', subcategories: [{ id: 'subcat-2-1', name: 'Baby Care', items: [] }] },
                subCategoryId: 'subcat-2-1',
            },
        ],
        subtotal: 18.50,
        discounts: 0.00,
        taxes: 4.00,
        shippingCost: 10.00,
        total: 32.50,
        payment: {
            status: 'Paid',
            method: 'Credit Card',
            transactionId: 'txn_def456',
            date: '2023-10-23T09:00:00Z',
        },
        statusHistory: [
            { status: 'Pending', date: '2023-10-23T09:00:00Z', by: 'System' },
            { status: 'Processing', date: '2023-10-23T09:30:00Z', by: 'Admin User 1' },
            { status: 'Shipped', date: '2023-10-24T08:00:00Z', by: 'Admin User 2' },
            { status: 'Delivered', date: '2023-10-25T15:00:00Z', by: 'Carrier' },
        ],
        refundHistory: [],
        internalNotes: 'Confirmed delivery with reception.',
        trackingNumber: 'TRK101',
        trackingCarrier: 'UPS',
    },
    {
        id: 'ORD1005',
        status: 'Cancelled',
        createdAt: '2023-10-23T11:00:00Z',
        customer: {
            name: 'Clark Kent',
            email: 'clark@example.com',
            phone: '444-555-6666',
            shippingAddress: 'Daily Planet, Metropolis, 54321, USA',
            billingAddress: 'Daily Planet, Metropolis, 54321, USA',
            notes: 'Customer cancelled, ordered wrong item.',
        },
        items: [
            {
                id: 'item-1-2-2',
                name: 'Bread - Brown',
                sku: 'SKU-item-1-2-2',
                quantity: 1,
                price: 2.50,
                image: require('../../assets/categories/bakary.png'),
                category: { id: 'cat-1', name: 'Grocery and Kitchen', subcategories: [{ id: 'subcat-1-2', name: 'Bakery', items: [] }] },
                subCategoryId: 'subcat-1-2',
            },
            {
                id: 'item-2-1-1',
                name: 'Gentle Baby Soap',
                sku: 'SKU-item-2-1-1',
                quantity: 1,
                price: 3.00,
                image: require('../../assets/categories/baby_care.png'),
                category: { id: 'cat-2', name: 'Beauty and Wellness', subcategories: [{ id: 'subcat-2-1', name: 'Baby Care', items: [] }] },
                subCategoryId: 'subcat-2-1',
            },
        ],
        subtotal: 5.50,
        discounts: 0.00,
        taxes: 1.00,
        shippingCost: 5.00,
        total: 11.50,
        payment: {
            status: 'Refunded',
            method: 'Credit Card',
            transactionId: 'txn_ghi789',
            date: '2023-10-23T11:00:00Z',
        },
        statusHistory: [
            { status: 'Pending', date: '2023-10-23T11:00:00Z', by: 'System' },
            { status: 'Cancelled', date: '2023-10-23T12:00:00Z', by: 'Customer' },
        ],
        refundHistory: [
            { amount: 11.50, reason: 'Order cancelled by customer', date: '2023-10-23T12:00:00Z' },
        ],
        internalNotes: 'Refund processed.',
        trackingNumber: '',
        trackingCarrier: '',
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

export default function AdminOrdersList({ navigation, route }) {
    const [allOrders, setAllOrders] = useState(DUMMY_ORDERS);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSortingOptionsVisible, setIsSortingOptionsVisible] = useState(false);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSettingStartDate, setIsSettingStartDate] = useState(true);
    const [isInputModalVisible, setIsInputModalVisible] = useState(false);
    const [inputModalType, setInputModalType] = useState(null);
    const [inputModalValue, setInputModalValue] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Handle updated order from AdminOrderDetail
    useEffect(() => {
        if (route.params?.updatedOrder) {
            setAllOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === route.params.updatedOrder.id ? route.params.updatedOrder : order
                )
            );
            Toast.show({ type: 'success', text1: `Order ${route.params.updatedOrder.id} updated` });
            navigation.setParams({ updatedOrder: null }); // Clear params
        }
    }, [route.params?.updatedOrder]);

    // Simulate Data Fetching
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAllOrders(DUMMY_ORDERS);
            setLoading(false);
        }, 1000);
    }, []);

    // Filtering and Sorting Logic
    const filteredAndSortedOrders = useMemo(() => {
        let orders = [...allOrders];

        // Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            orders = orders.filter(order =>
                order.id.toLowerCase().includes(lowerQuery) ||
                order.customer.name.toLowerCase().includes(lowerQuery) ||
                order.customer.email.toLowerCase().includes(lowerQuery) ||
                order.items.some(item => item.name.toLowerCase().includes(lowerQuery))
            );
        }

        // Filters
        orders = orders.filter(order => {
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) return false;
            if (filterStartDate && new Date(order.createdAt) < filterStartDate) return false;
            if (filterEndDate) {
                const endDateInclusive = new Date(filterEndDate);
                endDateInclusive.setHours(23, 59, 59, 999);
                if (new Date(order.createdAt) > endDateInclusive) return false;
            }
            if (selectedPaymentMethod && order.payment.method !== selectedPaymentMethod) return false;
            if (selectedShippingMethod && order.shippingMethod !== selectedShippingMethod) return false;
            return true;
        });

        // Sorting
        orders.sort((a, b) => {
            let aValue = sortBy === 'createdAt' ? new Date(a.createdAt) : (sortBy === 'total' ? a.total : (sortBy === 'status' ? a.status : a.id));
            let bValue = sortBy === 'createdAt' ? new Date(b.createdAt) : (sortBy === 'total' ? b.total : (sortBy === 'status' ? b.status : b.id));
            const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return orders;
    }, [allOrders, searchQuery, selectedStatuses, filterStartDate, filterEndDate, selectedPaymentMethod, selectedShippingMethod, sortBy, sortOrder]);

    // Bulk Actions
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
            Alert.alert('No Orders Selected', 'Please select orders first.');
            return;
        }
        Alert.alert(
            'Confirm Bulk Action',
            `Are you sure you want to perform "${actionType}" on ${selectedOrderIds.length} selected orders?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: actionType,
                    onPress: () => {
                        setAllOrders(prevOrders =>
                            prevOrders.map(order =>
                                selectedOrderIds.includes(order.id)
                                    ? {
                                        ...order,
                                        status: actionType,
                                        statusHistory: [
                                            ...order.statusHistory,
                                            { status: actionType, date: new Date().toISOString(), by: 'Admin' },
                                        ],
                                        updatedAt: new Date().toISOString(),
                                    }
                                    : order
                            )
                        );
                        Toast.show({
                            type: 'success',
                            text1: `Bulk Action: ${selectedOrderIds.length} orders marked as ${actionType}`,
                        });
                        setSelectedOrderIds([]);
                    },
                },
            ]
        );
    };

    // Navigation to Order Detail
    const openOrderDetail = (order) => {
        navigation.navigate('AdminOrderDetail', { order });
    };

    // Input Modal Handlers (for tracking and notes in list view)
    const openInputModal = (type, orderId) => {
        setInputModalType(type);
        setSelectedOrderId(orderId);
        setInputModalValue('');
        setIsInputModalVisible(true);
    };

    const closeInputModal = () => {
        setIsInputModalVisible(false);
        setInputModalType(null);
        setInputModalValue('');
        setSelectedOrderId(null);
    };

    const handleInputModalSubmit = () => {
        if (!inputModalValue.trim()) {
            Alert.alert('Error', 'Input cannot be empty.');
            return;
        }
        if (!selectedOrderId) return;

        setAllOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === selectedOrderId
                    ? {
                        ...order,
                        ...(inputModalType === 'tracking'
                            ? {
                                trackingNumber: inputModalValue,
                                trackingCarrier: order.trackingCarrier || 'Unknown Carrier',
                            }
                            : {
                                internalNotes: (order.internalNotes ? order.internalNotes + '\n' : '') +
                                    `[${formatDate(new Date().toISOString())}] ${inputModalValue}`,
                            }),
                        updatedAt: new Date().toISOString(),
                    }
                    : order
            )
        );
        Toast.show({
            type: 'success',
            text1: inputModalType === 'tracking'
                ? `Tracking number added for ${selectedOrderId}`
                : `Note added for ${selectedOrderId}`,
        });
        closeInputModal();
    };

    // Filter Modal Handlers
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

    // Date Picker Handlers
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

    // Sorting Handlers
    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder(newSortBy === 'createdAt' ? 'desc' : 'asc');
        }
        setIsSortingOptionsVisible(false);
    };

    // Render Functions
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
                <TouchableOpacity onPress={() => openOrderDetail(item)} className="flex-1 flex-row items-center">
                    <View className="w-1/3">
                        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{item.id}</Text>
                        <Text className="text-xs text-gray-600 mt-1" numberOfLines={1}>{item.customer.name}</Text>
                    </View>
                    <View className="ml-auto px-1 items-center">
                        <Text className="text-xs text-gray-700">{formatDate(item.createdAt).split(' ')[0]}</Text>
                        <Text className="text-xs text-gray-700">{formatDate(item.createdAt).split(' ')[1]}</Text>
                    </View>
                    <View className="ml-auto px-1 items-end">
                        <Text className="text-sm font-bold text-green-700">{formatCurrency(item.total)}</Text>
                    </View>
                    <View className="ml-auto px-1 items-center">
                        <Text className={`text-xs font-semibold ${getStatusClass(item.status)}`}>{item.status}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openInputModal('tracking', item.id)}
                    className="p-2"
                    disabled={item.status === 'Cancelled' || item.status === 'Delivered'}
                >
                    <Feather name="truck" size={20} color={item.trackingNumber ? '#2563eb' : '#6b7280'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openInputModal('note', item.id)} className="p-2">
                    <Feather name="edit" size={20} color={item.internalNotes ? '#2563eb' : '#6b7280'} />
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
        > <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill}>
                <TouchableOpacity
                    className="flex-1 justify-center items-center"
                    activeOpacity={1}
                    onPress={closeInputModal}
                >
                    <View className="bg-white rounded-lg p-4 w-80 border" onStartShouldSetResponder={() => true}>
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
            </BlurView>

        </Modal>
    );

    const renderFilterModal = () => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isFilterModalVisible}
            onRequestClose={closeFilterModal}
        >
            <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill}>
                <SafeAreaView className="flex-1 bg-gray-100" edges={['left', 'right']}>
                    <View style={{ paddingTop: 50 }} className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
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
            </BlurView>

        </Modal>
    );

    const renderSortingOptions = () => (
        isSortingOptionsVisible && (
            <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill}>
                <TouchableOpacity
                    className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center z-50"
                    activeOpacity={1}
                    onPress={() => setIsSortingOptionsVisible(false)}
                >
                    <View className="bg-white rounded-lg p-4 w-64 border" onStartShouldSetResponder={() => true}>
                        <Text className="text-lg font-bold text-gray-800 mb-4">Sort By</Text>
                        {['createdAt', 'total', 'status', 'id'].map(option => (
                            <TouchableOpacity key={option} onPress={() => handleSortChange(option)} className="py-2 border-b border-gray-200 last:border-b-0">
                                <Text className={`text-base ${sortBy === option ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                                    {option === 'createdAt' ? 'Date' : option.charAt(0).toUpperCase() + option.slice(1)}
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
            </BlurView>
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
                        <TouchableOpacity onPress={() => handleBulkAction('Delivered')} className="ml-2 px-3 py-1 bg-blue-700 rounded-md">
                            <Text className="text-white text-sm">Mark as Delivered</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBulkAction('Cancelled')} className="ml-2 px-3 py-1 bg-blue-700 rounded-md">
                            <Text className="text-white text-sm">Mark as Cancelled</Text>
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
            <Toast />
        </SafeAreaView>
    );
}