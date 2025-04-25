import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import AdminDashboard from './Dashboard';
import AdminProducts from './AdminCategories';
import AdminOrders from './Orders';
import AdminUsers from './Users';
import AdminMore from './More';
import AdminProductAddUpdate from './ProductForm';
import AdminProductList from './AdminProductList';
import AdminItemDetail from './AdminItemDetail';


const AdminTab = createBottomTabNavigator();
const AdminStack = createStackNavigator();

const tabs = {
  dashboard: {name: "AdminDashboard", title: "Dashboard", icon: "pie-chart"},
  products: {name: "AdminProducts", title: "Products", icon: "archive"},
  orders: {name: "AdminOrders", title: "Orders", icon: "book-open"},
  users: {name: "AdminUsers", title: "Users", icon: "users"},
  more: {name: "AdminMore", title: "More", icon: "more-horizontal"},
}

const CustomHeader = ({ navigation, route }) => {
  const title = route.name;
  return (
    <View style={headerStyles.header}>
      <Text style={headerStyles.title}>{title}</Text>
    </View>);
}

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === tabs.dashboard.title) iconName = tabs.dashboard.icon;
          else if (route.name === tabs.products.title) iconName = tabs.products.icon;
          else if (route.name === tabs.orders.title) iconName = tabs.orders.icon;
          else if (route.name === tabs.users.title) iconName = tabs.users.icon;
          else if (route.name === tabs.more.title) iconName = tabs.more.icon;
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5ac268',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
        header: ({ navigation, route }) => <CustomHeader navigation={navigation} route={route} />,
      })}
    >
      <AdminTab.Screen name={tabs.dashboard.title} component={AdminDashboard} />
      <AdminTab.Screen name={tabs.products.title} component={AdminProducts} />
      <AdminTab.Screen name={tabs.orders.title} component={AdminOrders} />
      <AdminTab.Screen name={tabs.users.title} component={AdminUsers} />
      <AdminTab.Screen name={tabs.more.title} component={AdminMore} />
    </AdminTab.Navigator>
  );
}

export default function AdminNavigator({ navigation }) {
  return (
      <AdminStack.Navigator initialRouteName="AdminMain" screenOptions={{ headerShown: false }}>
        <AdminStack.Screen name="AdminMain" component={TabNavigator} />
        <AdminStack.Screen name="AdminProductAddUpdate" component={AdminProductAddUpdate} />
        <AdminStack.Screen name="AdminProductList" component={AdminProductList} />
        <AdminStack.Screen name="AdminItemDetail" component={AdminItemDetail} />
      </AdminStack.Navigator>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 75,
    maxHeight: 75,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },

});
