import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { addresses} from './data/staticData';

// Import screens
import Homepage from './screens/Homepage';
import Categories from './screens/Categories';
import UserProfile from './screens/UserProfile';
import Favorites from './screens/Favorites';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import Onboarding from './screens/Onboarding';
import Splash from './screens/Splash';
import ItemDetail from './screens/ItemDetail';
import Cart from './screens/Cart';
import AddressForm from './screens/AddressForm';
import OrderSummary from './screens/OrderSummary';
import OrderSuccess from './screens/OrderSuccess';
import OrderTracking from './screens/OrderTracking';
import OrderHistory from './screens/OrderHistory';
import SavedAddresses from './screens/SavedAddresses';
import SavedPaymentMethods from './screens/SavedPaymentMethods';
import SavedGstDetails from './screens/SavedGstDetails';
import AboutUs from './screens/AboutUs';
import AccountPrivacy from './screens/AccountPrivacy';
import Payment from './screens/Payment';
import CategoryItems from './screens/CategoryItems';
import { CartProvider, CartContext } from './contexts/CartContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeHeader = ({ title,  selectedAddress}) => {
  return (
    <TouchableOpacity
      style={headerStyles.addressContainer}
      onPress={() => console.log('Select address')}
    >
      <Feather name="map-pin" size={20} color="#5ac268" style={headerStyles.addressIcon} />
      <Text style={headerStyles.addressText} numberOfLines={1}>
        {selectedAddress.title}: {selectedAddress.address}
      </Text>
      <Feather name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  );
}

const FavoritesHeader = ({ title }) => {
  return (
    <Text style={headerStyles.title}>{title}</Text>
  );
}

const CategoriesHeader = ({ title }) => {
  return (
    <Text style={headerStyles.title}>{title}</Text>
  );
}

const ProfileHeader = ({ title }) => {
  return (
    <Text style={headerStyles.title}>{title}</Text>
  );
}

// Custom Header Component
const CustomHeader = ({ navigation, route }) => {
  const { cart, addToCart } = useContext(CartContext);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const title = route.name === 'Home' ? 'Home' :
    route.name === 'Favorites' ? 'Favorites' :
      route.name === 'Categories' ? 'Categories' :
        route.name === 'Profile' ? 'Profile' : 'App';

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.titleContainer}>
        {
          title === 'Home' ? <HomeHeader title={title} selectedAddress={selectedAddress}/> :
          title === 'Favorites' ? <FavoritesHeader title={title} /> :
          title === 'Categories' ? <CategoriesHeader title={title} /> :
          title === 'Profile' ? <ProfileHeader title={title} /> : <Text style={headerStyles.title}>{title}</Text>
        }
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <Feather name="shopping-cart" size={24} color="#333" />
        <View style={headerStyles.cartBadge}>
          <Text style={headerStyles.cartBadgeText}>{cart.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Categories') iconName = 'grid';
          else if (route.name === 'Profile') iconName = 'user';
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
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function AppNavigator() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/* Auth Screens */}
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          {/* Tab Navigator */}
          <Stack.Screen name="Main" component={TabNavigator} />
          {/* Other Screens */}
          <Stack.Screen name="ItemDetail" component={ItemDetail} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="AddressForm" component={AddressForm} />
          <Stack.Screen name="OrderSummary" component={OrderSummary} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
          <Stack.Screen name="OrderTracking" component={OrderTracking} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
          <Stack.Screen name="SavedPaymentMethods" component={SavedPaymentMethods} />
          <Stack.Screen name="SavedGstDetails" component={SavedGstDetails} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="AccountPrivacy" component={AccountPrivacy} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="CategoryItems" component={CategoryItems} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}


const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    maxHeight: 75
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
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#5ac268',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addressIcon: {
    marginRight: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
    flex: 1,
  },
});