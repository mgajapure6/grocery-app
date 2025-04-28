import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Mock static data
const generateStaticData = () => {
  const now = new Date();
  const getRandomDate = (daysBack) => {
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString();
  };

  const orders = Array.from({ length: 50 }, (_, i) => ({
    id: `ORD${1000 + i}`,
    customerName: `Customer ${i + 1}`,
    orderDate: getRandomDate(30),
    totalAmount: Math.floor(Math.random() * 500) + 50,
    status: ['New', 'Pending', 'Processing', 'Shipped', 'Cancelled'][Math.floor(Math.random() * 5)],
  }));

  const users = Array.from({ length: 20 }, (_, i) => ({
    uid: `USER${100 + i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    registrationDate: getRandomDate(30),
    lastLogin: getRandomDate(30),
    orders: Math.floor(Math.random() * 5),
  }));

  const products = Array.from({ length: 30 }, (_, i) => ({
    id: `PROD${200 + i}`,
    name: `Product ${i + 1}`,
    stock: Math.floor(Math.random() * 20),
    price: Math.floor(Math.random() * 100) + 10,
    createdAt: getRandomDate(30),
    sales: Math.floor(Math.random() * 100),
    reviews: i % 3 === 0 ? [
      {
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Review for Product ${i + 1}`,
        createdAt: getRandomDate(30),
      }
    ] : [],
  }));

  return { orders, users, products };
};

const { orders, users, products } = generateStaticData();
const reviews = products
  .flatMap(product => product.reviews || [])
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 10);

const screenWidth = Dimensions.get('window').width;

const AdminDashboard = ({ navigation }) => {
  const [salesTimeframe, setSalesTimeframe] = useState('This Month');
  const [orderTimeframe, setOrderTimeframe] = useState('This Month');
  const [customerTimeframe, setCustomerTimeframe] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');

  const calculateKPIs = (timeframe, type) => {
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case 'Today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'This Week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'Last 3 Days':
        startDate = new Date(now.setDate(now.getDate() - 3));
        break;
      case 'Last 15 Days':
        startDate = new Date(now.setDate(now.getDate() - 15));
        break;
      case 'This Month':
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
    }

    if (type === 'sales') {
      const filteredOrders = orders.filter(
        order => new Date(order.orderDate) >= startDate
      );
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const numberOfOrders = filteredOrders.length;
      const averageOrderValue = numberOfOrders ? (totalRevenue / numberOfOrders).toFixed(2) : 0;
      return { totalRevenue: totalRevenue.toFixed(2), numberOfOrders, averageOrderValue };
    }

    if (type === 'orders') {
      const filteredOrders = orders.filter(
        order => new Date(order.orderDate) >= startDate
      );
      return {
        new: filteredOrders.filter(order => order.status === 'New').length,
        pending: filteredOrders.filter(order => order.status === 'Pending').length,
        processing: filteredOrders.filter(order => order.status === 'Processing').length,
        shipped: filteredOrders.filter(order => order.status === 'Shipped').length,
        cancelled: filteredOrders.filter(order => order.status === 'Cancelled').length,
      };
    }

    if (type === 'customers') {
      const filteredUsers = users.filter(
        user => new Date(user.registrationDate) >= startDate
      );
      const totalCustomers = users.length;
      const newCustomers = filteredUsers.length;
      const activeCustomers = users.filter(
        user => new Date(user.lastLogin) >= startDate
      ).length;
      return { totalCustomers, newCustomers, activeCustomers };
    }

    return {};
  };

  const salesKPIs = calculateKPIs(salesTimeframe, 'sales');
  const orderKPIs = calculateKPIs(orderTimeframe, 'orders');
  const customerKPIs = calculateKPIs(customerTimeframe, 'customers');

  // Chart data
  const salesChartData = {
    labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
    datasets: [{
      data: orders
        .filter(order => new Date(order.orderDate) >= new Date(new Date().setDate(new Date().getDate() - 30)))
        .reduce((acc, order) => {
          const day = Math.floor((new Date() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24));
          acc[29 - day] = (acc[29 - day] || 0) + order.totalAmount;
          return acc;
        }, Array(30).fill(0))
        .slice(-7),
    }],
  };

  const orderChartData = {
    labels: ['New', 'Pending', 'Processing', 'Shipped', 'Cancelled'],
    datasets: [{
      data: [
        orderKPIs.new,
        orderKPIs.pending,
        orderKPIs.processing,
        orderKPIs.shipped,
        orderKPIs.cancelled,
      ],
    }],
  };

  const customerChartData = {
    data: [
      { name: 'Active', value: customerKPIs.activeCustomers, color: '#007bff' },
      { name: 'Inactive', value: customerKPIs.totalCustomers - customerKPIs.activeCustomers, color: '#6c757d' },
    ],
  };

  const conversionChartData = {
    data: [0.025], // 2.5% conversion rate
  };

  // Product Performance
  const topSellingProducts = products
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5);
  const lowStockProducts = products
    .filter(product => product.stock <= 5)
    .slice(0, 5);
  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent Activities
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);
  const newCustomers = users
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
    .slice(0, 5);
  const lowStockAlerts = lowStockProducts;

  // Mock Website/App Performance
  const websitePerformance = {
    visits: 10000,
    conversionRate: '2.5%',
    bounceRate: '40%',
  };

  const showTimeframeDialog = (type, setTimeframe) => {
    Alert.alert(
      'Select Timeframe',
      '',
      [
        { text: 'Today', onPress: () => setTimeframe('Today') },
        { text: 'This Week', onPress: () => setTimeframe('This Week') },
        { text: 'This Month', onPress: () => setTimeframe('This Month') },
        { text: 'Last 3 Days', onPress: () => setTimeframe('Last 3 Days') },
        { text: 'Last 15 Days', onPress: () => setTimeframe('Last 15 Days') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const orderResults = orders.filter(
      order => order.id.includes(searchQuery) || order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const userResults = users.filter(
      user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const productResults = products.filter(
      product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Search Results:', { orders: orderResults, users: userResults, products: productResults });
    Toast.show({
      type: 'success',
      text1: `Found ${orderResults.length} orders, ${userResults.length} users, ${productResults.length} products`,
      position: 'bottom',
    });
    setSearchQuery('');
  };

  const renderKPI = ({ title, value, unit = '' }) => (
    <View className="bg-gray-50 rounded-lg p-4 flex-1 mx-1 shadow-sm">
      <Text className="text-sm font-semibold text-gray-600">{title}</Text>
      <Text className="text-xl font-bold text-gray-800 mt-2">{value} {unit}</Text>
    </View>
  );

  const renderListItem = ({ item, type, onPress }) => (
    <TouchableOpacity
      className="py-3 border-b border-gray-200"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-base text-gray-800">
            {type === 'order' && `${item.id} - ${item.customerName} - $${item.totalAmount} (${item.status})`}
            {type === 'user' && `${item.name} (${item.email})`}
            {type === 'product' && `${item.name} (Stock: ${item.stock})`}
            {type === 'review' && `${item.rating}/5 - ${item.comment}`}
          </Text>
          <Text className="text-sm text-gray-600">
            {type !== 'review' ? new Date(item.orderDate || item.registrationDate || item.createdAt).toLocaleString() : ''}
          </Text>
        </View>
        {type === 'product' && item.stock <= 5 && (
          <View className="bg-red-600 text-white rounded-full px-2 py-1">
            <Text className="text-xs">Low Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <View className="flex-1 bg-gray-100">
        <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 50 }}>
          {/* Sales Overview */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Sales Overview</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-2"
                onPress={() => showTimeframeDialog('sales', setSalesTimeframe)}
              >
                <Text className="text-base text-gray-800">{salesTimeframe}</Text>
                <Feather name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              {renderKPI({ title: 'Total Revenue', value: salesKPIs.totalRevenue, unit: '$' })}
              {renderKPI({ title: 'Number of Orders', value: salesKPIs.numberOfOrders })}
              {renderKPI({ title: 'Average Order Value', value: salesKPIs.averageOrderValue, unit: '$' })}
            </View>
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Sales Trends</Text>
            <LineChart
              data={salesChartData}
              width={screenWidth - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                propsForDots: { r: '6', strokeWidth: '2', stroke: '#007bff' },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          {/* Order Statistics */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Order Statistics</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-2"
                onPress={() => showTimeframeDialog('orders', setOrderTimeframe)}
              >
                <Text className="text-base text-gray-800">{orderTimeframe}</Text>
                <Feather name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {renderKPI({ title: 'New Orders', value: orderKPIs.new })}
              {renderKPI({ title: 'Pending Orders', value: orderKPIs.pending })}
              {renderKPI({ title: 'Processing Orders', value: orderKPIs.processing })}
              {renderKPI({ title: 'Shipped Orders', value: orderKPIs.shipped })}
              {renderKPI({ title: 'Cancelled/Returned', value: orderKPIs.cancelled })}
            </View>
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Order Status Breakdown</Text>
            <BarChart
              data={orderChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          {/* Customer Insights */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Customer Insights</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-2"
                onPress={() => showTimeframeDialog('customers', setCustomerTimeframe)}
              >
                <Text className="text-base text-gray-800">{customerTimeframe}</Text>
                <Feather name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              {renderKPI({ title: 'Total Customers', value: customerKPIs.totalCustomers })}
              {renderKPI({ title: 'New Customers', value: customerKPIs.newCustomers })}
              {renderKPI({ title: 'Active Customers', value: customerKPIs.activeCustomers })}
            </View>
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Customer Activity</Text>
            <PieChart
              data={customerChartData.data}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              style={{ marginVertical: 8 }}
            />
          </View>

          {/* Product Performance */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Product Performance</Text>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Top Selling Products</Text>
            <FlatList
              data={topSellingProducts}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'product',
                onPress: () => navigation.navigate('AdminItemDetail', { item })
              })}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No products</Text>}
            />
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Low Stock/Out of Stock</Text>
            <FlatList
              data={lowStockProducts}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'product',
                onPress: () => navigation.navigate('AdminItemDetail', { item })
              })}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No products</Text>}
            />
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Recently Added Products</Text>
            <FlatList
              data={recentProducts}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'product',
                onPress: () => navigation.navigate('AdminItemDetail', { item })
              })}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No products</Text>}
            />
          </View>

          {/* Website/App Performance */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Website/App Performance</Text>
            <View className="flex-row justify-between">
              {renderKPI({ title: 'Visits', value: websitePerformance.visits })}
              {renderKPI({ title: 'Conversion Rate', value: websitePerformance.conversionRate })}
              {renderKPI({ title: 'Bounce Rate', value: websitePerformance.bounceRate })}
            </View>
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Conversion Rate</Text>
            <ProgressChart
              data={conversionChartData}
              width={screenWidth - 80}
              height={220}
              strokeWidth={16}
              radius={60}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              }}
              hideLegend={false}
              style={{ marginVertical: 8 }}
            />
          </View>

          {/* Recent Activities and Notifications */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Recent Activities</Text>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Recent Orders</Text>
            <FlatList
              data={recentOrders}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'order',
                onPress: () => navigation.navigate('AdminOrders', { order: item })
              })}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No orders</Text>}
            />
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">New Customers</Text>
            <FlatList
              data={newCustomers}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'user',
                onPress: () => navigation.navigate('AdminUserDetail', { user: item, users, setUsers: () => {} })
              })}
              keyExtractor={item => item.uid}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No customers</Text>}
            />
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">Low Stock Alerts</Text>
            <FlatList
              data={lowStockAlerts}
              renderItem={({ item }) => renderListItem({
                item,
                type: 'product',
                onPress: () => navigation.navigate('AdminItemDetail', { item })
              })}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No alerts</Text>}
            />
            <Text className="text-sm font-semibold text-gray-800 mt-4 mb-2">New Reviews/Ratings</Text>
            <FlatList
              data={reviews}
              renderItem={({ item }) => renderListItem({ item, type: 'review' })}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<Text className="text-gray-600 text-center">No reviews</Text>}
            />
          </View>

          {/* Quick Actions and Shortcuts */}
          <View className="bg-white rounded-xl p-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-4">
              <TextInput
                className="flex-1 text-base text-gray-800"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search orders, customers, products..."
                accessibilityLabel="Search input"
              />
              <TouchableOpacity onPress={handleSearch}>
                <Feather name="search" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg items-center mx-1 mb-2"
                onPress={() => navigation.navigate('AdminItemDetail', {})}
              >
                <Text className="text-white text-base font-semibold">Add New Product</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg items-center mx-1 mb-2"
                onPress={() => navigation.navigate('AdminOrders')}
              >
                <Text className="text-white text-base font-semibold">View All Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg items-center mx-1 mb-2"
                onPress={() => navigation.navigate('AdminUserDetail', { users, setUsers: () => {} })}
              >
                <Text className="text-white text-base font-semibold">Manage Users</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg items-center mx-1 mb-2"
                onPress={() => navigation.navigate('AdminOrders', { filter: 'New' })}
              >
                <Text className="text-white text-base font-semibold">Process New Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminDashboard;