import { NavigationContainer } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ConfirmNumber from './screens/ConfirmNumber';
import ConfirmOtp from './screens/ConfirmOtp';
import AccountSuccessfull from './screens/AccountSuccessfull';
import Homepage from './screens/Homepage';
import ItemDetail from './screens/ItemDetail';
import Categories from './screens/Categories';
import Search from './screens/Search';
import Cart from './screens/Cart';
import Coupons from './screens/Coupons';
import Deals from './screens/Deals';
import OrderTracking from './screens/OrderTracking';
import OrderDetail from './screens/OrderDetail';
import MyOrders from './screens/MyOrders';
import MyProfile from './screens/MyProfile';
import AdminNavigator from './screens/Admin/AdminNavigator';

const Stack = createNativeStackNavigator();

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false}}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ConfirmNumber" component={ConfirmNumber} />
        <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
        <Stack.Screen name="AccountSuccessfull" component={AccountSuccessfull} />
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="ItemDetail" component={ItemDetail} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Coupons" component={Coupons} />
        <Stack.Screen name="Deals" component={Deals} />
        <Stack.Screen name="OrderTracking" component={OrderTracking} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="MyOrders" component={MyOrders} />

        <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
