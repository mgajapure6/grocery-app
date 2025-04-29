import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
  StyleSheet, // Needed for chart kit styles if not using className directly
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit'; // Added PieChart
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker
import { BlurView } from 'expo-blur';
// import DatePicker from 'react-native-date-picker'

// --- Dummy Data (Replace with your API calls) ---
// Use numbers for chart data
const DUMMY_SALES_DATA = {
  totalRevenue: 15450.75, // Use number
  numOrders: 185,
  averageOrderValue: 83.52, // Use number
  salesTrendData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2000, 4500, 2800, 8000, 9900, 4300],
      }
    ],
  },
};

const DUMMY_ORDER_STATS = {
  newOrders: 12,
  pendingOrders: 8,
  processingOrders: 25,
  shippedOrders: 140,
  cancelledOrders: 5,
  returnOrders: 10,
  // Data for Pie Chart
  orderStatusDistribution: [
    { name: 'New', count: 12, color: '#4ade80', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // green-400
    { name: 'Pending', count: 8, color: '#facc15', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // yellow-400
    { name: 'Processing', count: 25, color: '#60a5fa', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // blue-400
    { name: 'Shipped', count: 140, color: '#a78bfa', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // purple-400
    { name: 'Cancelled', count: 5, color: '#f87171', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // red-400
    { name: 'Return', count: 10, color: '#26A69A', legendFontColor: '#7F7F7F', legendFontSize: 10 }, // orange-400
  ]
};

const DUMMY_CUSTOMER_INSIGHTS = {
  totalCustomers: 1250,
  newCustomersCount: 15, // Renamed for clarity
  activeCustomersLast30Days: 480,
  customerGrowthData: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [50, 65, 70, 85],
      }
    ]
  }
};

const DUMMY_PRODUCT_PERFORMANCE = {
  topSellingProducts: [
    { id: 'p1', name: 'Apples', sold: 150, revenue: 300 },
    { id: 'p2', name: 'Bread', sold: 120, revenue: 240 },
    { id: 'p3', name: 'Almond Milk', sold: 98, revenue: 196 },
    { id: 'p4', name: 'Chicken', sold: 95, revenue: 570 },
    { id: 'p5', name: 'Yogurt', sold: 88, revenue: 176 },
  ],
  lowStockProducts: [
    { id: 'p10', name: 'Honey (500g)', stock: 10 },
    { id: 'p11', name: 'Olive Oil (750ml)', stock: 5 },
  ],
  recentlyAddedProducts: [
    { id: 'p20', name: 'Spicy Kimchi', date: '2023-10-20' },
    { id: 'p21', name: 'Vegan Cheese Slices', date: '2023-10-18' },
  ],
};

const DUMMY_WEBSITE_PERFORMANCE = {
  visits: 5870,
  conversionRate: '3.5%',
  bounceRate: '25%',
  // Add trend data if needed for charts
  // visitsTrendData: { labels: ['Mon', 'Tue', 'Wed'], datasets: [{ data: [100, 150, 120] }] },
};

const DUMMY_RECENT_ACTIVITIES = {
  recentOrders: [
    { id: 'ORD1001', customer: 'Alice Smith', date: '2023-10-25', total: '$55.20', status: 'Shipped' },
    { id: 'ORD1002', customer: 'Bob Johnson', date: '2023-10-25', total: '$32.10', status: 'Processing' },
    { id: 'ORD1003', customer: 'Charlie Brown', date: '2023-10-24', total: '$120.50', status: 'Pending' },
  ],
  newCustomers: [
    { id: 'CUST501', name: 'Diana Prince', date: '2023-10-25' },
    { id: 'CUST502', name: 'Steve Trevor', date: '2023-10-24' },
  ],
  lowStockAlerts: [
    { id: 'ALERT001', product: 'Honey (500g)', stock: 10 },
    { id: 'ALERT002', product: 'Olive Oil (750ml)', stock: 5 },
  ],
  // Add dummy data for reviews, payments if needed
};


// --- Helper function to render metric cards ---
const MetricCard = ({ title, value, iconName, iconColor = 'text-gray-500' }) => (
  <View className="bg-white rounded-lg p-4 shadow-sm flex-1 m-1 items-center">
    {iconName && <Feather name={iconName} size={24} className={`${iconColor} mb-2`} />}
    {/* Format numbers for display */}
    <Text className="text-xl font-bold text-gray-800">{typeof value === 'number' ? (title.includes('Revenue') || title.includes('Value') ? `$${value.toFixed(2)}` : value) : value}</Text>
    <Text className="text-sm text-gray-500 mt-1">{title}</Text>
  </View>
);

// --- Helper function to render list items ---
const ListItem = ({ label, value }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200">
    <Text className="text-gray-700">{label}</Text>
    <Text className="font-semibold text-gray-800">{value}</Text>
  </View>
);


export default function AdminDashboard2({ navigation }) {
  const [salesData, setSalesData] = useState(DUMMY_SALES_DATA);
  const [orderStats, setOrderStats] = useState(DUMMY_ORDER_STATS);
  const [customerInsights, setCustomerInsights] = useState(DUMMY_CUSTOMER_INSIGHTS);
  const [productPerformance, setProductPerformance] = useState(DUMMY_PRODUCT_PERFORMANCE);
  const [websitePerformance, setWebsitePerformance] = useState(DUMMY_WEBSITE_PERFORMANCE);
  const [recentActivities, setRecentActivities] = useState(DUMMY_RECENT_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Date Picker State and Handlers ---
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Default: last 7 days
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSettingStartDate, setIsSettingStartDate] = useState(true); // True if setting start date, false for end date

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60; // Account for p-4 (16 units padding on each side)

  // In a real app, you would fetch data based on selectedStartDate and selectedEndDate
  useEffect(() => {
    console.log("Fetching data for range:", selectedStartDate.toDateString(), "to", selectedEndDate.toDateString());
    // Example: fetchData(selectedStartDate, selectedEndDate).then(data => updateState(data));
    // For now, using dummy data loaded initially, ignoring the date range in data itself.
    // You would typically make API calls here and update the state variables (setSalesData, setOrderStats, etc.)
  }, [selectedStartDate, selectedEndDate]); // Re-run effect when dates change

  const handleDateChange = (event, date) => {
    setShowDatePicker(false); // Hide picker on Android after selection
    if (date) {
      if (isSettingStartDate) {
        setSelectedStartDate(date);
        // Automatically prompt for end date after selecting start on Android
        if (Platform.OS === 'android') {
          setIsSettingStartDate(false);
          // Need a slight delay or logic to show end date picker
          // For simplicity, we'll let the user tap the button again for the end date
          // A more complex implementation might involve a modal or sequence
          console.log("Start Date set:", date);
        }
      } else {
        // Ensure end date is not before start date
        if (date >= selectedStartDate) {
          setSelectedEndDate(date);
          console.log("End Date set:", date);
        } else {
          // Handle error or just set it to start date
          setSelectedEndDate(selectedStartDate);
          console.log("End date cannot be before start date. Setting End Date to Start Date.");
        }
        setIsSettingStartDate(true); // Reset for next selection cycle
      }
    }
  };

  const showStartDatePicker = () => {
    setIsSettingStartDate(true);
    setShowDatePicker(true);
  };

  const showEndDatePicker = () => {
    setIsSettingStartDate(false);
    setShowDatePicker(true);
  };


  // --- Render Sections ---

  const renderSalesOverview = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-50 pb-3">
        <View className="flex-row items-center">
          <Feather name="dollar-sign" size={20} className="text-green-600 mr-2" />
          <Text className="text-lg font-bold text-gray-800">Sales Overview</Text>
        </View>
        {/* Date Range Selector */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={showStartDatePicker} className="px-2 py-1 border border-gray-300 rounded-md mr-2">
            <Text className="text-sm text-gray-700">{selectedStartDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">To</Text>
          <TouchableOpacity onPress={showEndDatePicker} className="px-2 py-1 border border-gray-300 rounded-md ml-2">
            <Text className="text-sm text-gray-700">{selectedEndDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row justify-between flex-wrap">
        <MetricCard title="Total Revenue" value={salesData.totalRevenue} iconName="dollar-sign" iconColor="text-green-600" />
        <MetricCard title="Total Orders" value={salesData.numOrders} iconName="shopping-bag" iconColor="text-blue-600" />
        <MetricCard title="Avg. Order Value" value={salesData.averageOrderValue} iconName="tag" iconColor="text-purple-600" />
      </View>
      {/* Sales Trend Chart */}
      {salesData.salesTrendData && (
        <View className="mt-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">Sales Trends ({selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={salesData.salesTrendData}
              width={Math.max(chartWidth, salesData.salesTrendData.labels.length * 50)} // Ensure minimum width for many labels
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
                formatYLabel: (y) => `$${y}`, // Format Y-axis labels as currency
              }}
              bezier // Makes the line curved
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderOrderStatistics = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-50 pb-3">
        <View className="flex-row items-center">
          <Feather name="package" size={20} className="text-blue-600 mr-2" />
          <Text className="text-lg font-bold text-gray-800">Order Statistics</Text>
        </View>
        {/* Using the global date range display */}
        <Text className="text-sm text-gray-600">{selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}</Text>
      </View>
      <View className="flex-row flex-wrap m-1">
        <View className="w-1/3 p-1"><MetricCard title="New" value={orderStats.newOrders} iconName="plus-circle" iconColor="text-green-500" /></View>
        <View className="w-1/3 p-1"><MetricCard title="Pending" value={orderStats.pendingOrders} iconName="clock" iconColor="text-yellow-500" /></View>
        <View className="w-1/3 p-1"><MetricCard title="Processing" value={orderStats.processingOrders} iconName="settings" iconColor="text-blue-500" /></View>
        <View className="w-1/3 p-1"><MetricCard title="Shipped" value={orderStats.shippedOrders} iconName="truck" iconColor="text-purple-500" /></View>
        <View className="w-1/3 p-1"><MetricCard title="Cancelled" value={orderStats.cancelledOrders} iconName="x-circle" iconColor="text-red-500" /></View>
        <View className="w-1/3 p-1"><MetricCard title="Return" value={orderStats.cancelledOrders} iconName="shuffle" iconColor="text-red-500" /></View>
        {/* Add a filler if needed to make rows even, adjust based on number of metrics */}
        {/* <View className="w-1/2 p-1 opacity-0"></View> */}
      </View>

      {/* Order Status Distribution Pie Chart */}
      {orderStats.orderStatusDistribution && orderStats.orderStatusDistribution.reduce((sum, item) => sum + item.count, 0) > 0 && (
        <View className="mt-6 items-center">
          <Text className="text-base font-semibold text-gray-800 mb-2">Order Status Distribution</Text>
          <PieChart
            data={orderStats.orderStatusDistribution}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Used for legend text
            }}
            accessor="count" // Key in data objects for pie slice size
            backgroundColor="transparent"
            paddingLeft="15" // Adjust as needed
            absolute // Show absolute values in tooltips (if hover worked)
          />
        </View>
      )}
    </View>
  );

  const renderCustomerInsights = () => (
    <View className="bg-white rounded-lg p-4 mb-6 ">
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-50 pb-3">
        <View className="flex-row items-center">
          <Feather name="users" size={20} className="text-indigo-600 mr-2" />
          <Text className="text-lg font-bold text-gray-800">Customer Insights</Text>
        </View>
        {/* Using the global date range display */}
        <Text className="text-sm text-gray-600">{selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}</Text>
      </View>
      <View className="flex-row justify-between flex-wrap">
        <MetricCard title="Total Customers" value={customerInsights.totalCustomers} iconName="user" iconColor="text-indigo-600" />
        <MetricCard title="New Customers" value={customerInsights.newCustomersCount} iconName="user-plus" iconColor="text-teal-600" />
        <MetricCard title="Active (30D)" value={customerInsights.activeCustomersLast30Days} iconName="activity" iconColor="text-orange-600" />
      </View>
      {/* Customer Growth Chart */}
      {customerInsights.customerGrowthData && (
        <View className="mt-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">Customer Growth ({selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={customerInsights.customerGrowthData}
              width={Math.max(chartWidth, customerInsights.customerGrowthData.labels.length * 50)} // Ensure minimum width
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderProductPerformance = () => {
    // Data for Top Selling Products Bar Chart (Example: based on revenue)
    const topSellingChartData = {
      labels: productPerformance.topSellingProducts.map(p => p.name.split(' ')[0]), // Use first word for shorter labels
      datasets: [
        {
          data: productPerformance.topSellingProducts.map(p => p.revenue),
        }
      ]
    };

    return (
      <View className="bg-white rounded-lg p-4 mb-6 ">
        <View className="flex-row items-center mb-4 border-b border-gray-50 pb-3">
          <Feather name="shopping-cart" size={20} className="text-teal-600 mr-2" />
          <Text className="text-lg font-bold text-gray-800">Product Performance</Text>
        </View>

        {/* Top Selling Products Bar Chart */}
        {topSellingChartData.datasets[0].data.length > 0 && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">Top Selling Products (by Revenue)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={topSellingChartData}
                width={Math.max(chartWidth, topSellingChartData.labels.length * 50)} // Adjust width based on number of bars
                height={220}
                yAxisLabel="$"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0, // Show whole numbers for revenue
                  color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`, // Teal color
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </ScrollView>
          </View>
        )}

        {/* Recently Added Products List */}
        <View>
          <Text className="text-base font-semibold text-gray-800 mb-2">Recently Added Products</Text>
          {productPerformance.recentlyAddedProducts.map((product) => (
            <ListItem key={product.id} label={product.name} value={`Added: ${product.date}`} />
          ))}
        </View>
      </View>
    );
  };


  const renderWebsitePerformance = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <View className="flex-row items-center justify-between mb-4 border-b border-gray-50 pb-3">
        <View className="flex-row items-center">
          <Feather name="activity" size={20} className="text-pink-600 mr-2" />
          <Text className="text-lg font-bold text-gray-800">Website/App Performance</Text>
        </View>
        {/* Using the global date range display */}
        <Text className="text-sm text-gray-600">{selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}</Text>
      </View>
      <View className="flex-row justify-between flex-wrap">
        <MetricCard title="Visits" value={websitePerformance.visits} iconName="eye" iconColor="text-pink-600" />
        <MetricCard title="Conversion Rate" value={websitePerformance.conversionRate} iconName="percent" iconColor="text-violet-600" />
        <MetricCard title="Bounce Rate" value={websitePerformance.bounceRate} iconName="corner-up-right" iconColor="text-red-600" />
      </View>
      {/* Add Charts for Trends Here if you have data */}
      {/* Example: Visits Trend Line Chart */}
      {/* {websitePerformance.visitsTrendData && (
         <View className="mt-6">
           <Text className="text-base font-semibold text-gray-800 mb-2">Visits Trend</Text>
           <LineChart data={websitePerformance.visitsTrendData} ... />
         </View>
       )} */}
    </View>
  );

  const renderRecentActivities = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <View className="flex-row items-center mb-4 border-b border-gray-50 pb-3">
        <Feather name="bell" size={20} className="text-red-600 mr-2" />
        <Text className="text-lg font-bold text-gray-800">Recent Activities & Notifications</Text>
      </View>

      {/* Recent Orders */}
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">Recent Orders (Last 10 or 20)</Text>
        {recentActivities.recentOrders.map((order) => (
          <View key={order.id} className="py-2 border-b border-gray-200">
            <Text className="text-gray-700 font-semibold">{order.id}</Text>
            <Text className="text-sm text-gray-600">Customer: {order.customer}</Text>
            <Text className="text-sm text-gray-600">Date: {order.date}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-green-600">{order.total}</Text>
              <Text className={`text-sm font-semibold ${order.status === 'Pending' ? 'text-yellow-600' : order.status === 'Shipped' ? 'text-blue-600' : order.status === 'Processing' ? 'text-purple-600' : 'text-gray-600'}`}>{order.status}</Text>
            </View>
          </View>
        ))}
        {recentActivities.recentOrders.length === 0 && <Text className="text-gray-500 italic">No recent orders.</Text>}

      </View>

      {/* New Customer Registrations */}
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">New Customer Registrations</Text>
        {recentActivities.newCustomers.map((customer) => (
          <ListItem key={customer.id} label={customer.name} value={`Joined: ${customer.date}`} />
        ))}
        {recentActivities.newCustomers.length === 0 && <Text className="text-gray-500 italic">No new registrations.</Text>}
      </View>

      {/* Low Stock Alerts (Linked to Product Performance data, could be separate) */}
      <View>
        <Text className="text-base font-semibold text-gray-800 mb-2 text-orange-600">Low Stock Alerts</Text>
        {recentActivities.lowStockAlerts.map((alert) => (
          <ListItem key={alert.id} label={`Product: ${alert.product}`} value={`Stock: ${alert.stock}`} />
        ))}
        {recentActivities.lowStockAlerts.length === 0 && <Text className="text-gray-500 italic">No low stock alerts.</Text>}
      </View>

      {/* Add Recent Reviews, Payment Notifications here if applicable */}
    </View>
  );

  const renderQuickActions = () => (
    <View className="bg-white rounded-lg p-4 mb-6">
      <View className="flex-row items-center border-b border-gray-50 pb-3">
        <Feather name="bookmark" size={20} className="text-green-600 mr-2" />
        <Text className="text-lg font-bold text-gray-800">Quick Actons</Text>
      </View>
      {/* <Text className="text-lg font-bold text-gray-800 mb-4 mt-3">Quick Actions</Text> */}
      <View className="flex-row flex-wrap justify-between mt-4">
        <TouchableOpacity
          className="w-1/2 p-2 items-center"
          onPress={() => { /* navigation.navigate('AddProduct') */ }}
        >
          <View className="bg-blue-100 rounded-full p-3 mb-2">
            <Feather name="plus" size={24} className="text-blue-600" />
          </View>
          <Text className="text-sm font-semibold text-center text-gray-700">Add New Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-1/2 p-2 items-center"
          onPress={() => { /* navigation.navigate('AllOrders') */ }}
        >
          <View className="bg-green-100 rounded-full p-3 mb-2">
            <Feather name="list" size={24} className="text-green-600" />
          </View>
          <Text className="text-sm font-semibold text-center text-gray-700">View All Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-1/2 p-2 items-center mt-2"
          onPress={() => { /* navigation.navigate('ManageUsers') */ }}
        >
          <View className="bg-purple-100 rounded-full p-3 mb-2">
            <Feather name="users" size={24} className="text-purple-600" />
          </View>
          <Text className="text-sm font-semibold text-center text-gray-700">Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-1/2 p-2 items-center mt-2"
          onPress={() => { /* navigation.navigate('ProcessOrders') */ }}
        >
          <View className="bg-yellow-100 rounded-full p-3 mb-2">
            <Feather name="play" size={24} className="text-yellow-600" />
          </View>
          <Text className="text-sm font-semibold text-center text-gray-700">Process Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['left', 'right']}>
      <View className='flex-row items-center p-3 bg-white border-b border-gray-200'>
        {/* Search Bar */}
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
          <Feather name="search" size={20} className="text-gray-500 mr-2" />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search orders, customers, products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <ScrollView className="flex-1 p-4">
        {renderQuickActions()}
        {renderSalesOverview()}
        {renderOrderStatistics()}
        {renderCustomerInsights()}
        {renderProductPerformance()}
        {renderWebsitePerformance()}
        {renderRecentActivities()}

        {/* Add some bottom padding to the scroll view */}
        <View className="h-5"></View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker}
      >
        <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', }}>
            <View style={{ width: '85%', backgroundColor: '#000', padding: 20, borderRadius: 12, alignItems: 'center', }}>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={isSettingStartDate ? selectedStartDate : selectedEndDate}
                  mode="date" // Can be 'date', 'time', 'datetime'
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'inline' : 'default'} // 'spinner' or 'default' for Android, 'spinner', 'calendar', 'clock' for iOS
                  onChange={handleDateChange}
                  maximumDate={new Date()} // Prevent selecting future dates
                />
              )}
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Date Picker Modal/View */}
      {/* {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={isSettingStartDate ? selectedStartDate : selectedEndDate}
          mode="date" // Can be 'date', 'time', 'datetime'
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'compact' : 'default'} // 'spinner' or 'default' for Android, 'spinner', 'calendar', 'clock' for iOS
          onChange={handleDateChange}
          maximumDate={new Date()} // Prevent selecting future dates
        />
      )} */}
      {/* <DatePicker
          modal
          open={showDatePicker}
          date={isSettingStartDate ? selectedStartDate : selectedEndDate}
          onConfirm={handleDateChange}
          onCancel={() => {
            setShowDatePicker(false)
          }}
        /> */}
    </SafeAreaView>
  );
}

// You might still need a StyleSheet for Chart Kit if you want complex styles,
// or manage them via chartConfig props and inline styles.
// For NativeWind classes, you use the className prop directly.
// const styles = StyleSheet.create({});