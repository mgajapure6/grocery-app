import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import AdminDashboard from './AdminDashboard';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminMore from './AdminMore';
import AdminProductList from './AdminProductList';
import AdminItemDetail from './AdminItemDetail';
import AdminUserDetail from './AdminUserDetail';


const AdminTab = createBottomTabNavigator();
const AdminStack = createStackNavigator();

const tabs = {
  dashboard: {name: "AdminDashboard", title: "Dashboard", icon: "pie-chart"},
  categories: {name: "AdminCategories", title: "Categories", icon: "archive"},
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
          else if (route.name === tabs.categories.title) iconName = tabs.categories.icon;
          else if (route.name === tabs.orders.title) iconName = tabs.orders.icon;
          else if (route.name === tabs.users.title) iconName = tabs.users.icon;
          else if (route.name === tabs.more.title) iconName = tabs.more.icon;
          return <Feather name={iconName} size={20} color={color} />;
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
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 10,
        },
        header: ({ navigation, route }) => <CustomHeader navigation={navigation} route={route} />,
      })}
    >
      
      <AdminTab.Screen name={tabs.dashboard.title} component={AdminDashboard} />
      <AdminTab.Screen name={tabs.categories.title} component={AdminCategories} />
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
        <AdminStack.Screen name="AdminProductList" component={AdminProductList} />
        <AdminStack.Screen name="AdminItemDetail" component={AdminItemDetail} />
        <AdminStack.Screen name="AdminUserDetail" component={AdminUserDetail} />
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
    height: 50,
    maxHeight: 50,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

});
