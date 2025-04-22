import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Signup2 from './screens/Signup2';
import ForgotPassword from './screens/ForgotPassword';
import Homepage from './screens/Homepage';
import ItemDetail from './screens/ItemDetail';
import Categories from './screens/Categories';
import CategoryItems from './screens/CategoryItems';
import Search from './screens/Search';
import Cart from './screens/Cart';
import Coupons from './screens/Coupons';
import Deals from './screens/Deals';
import Payment from './screens/Payment';
import AddressForm from './screens/AddressForm';
import EditAddress from './screens/EditAddress';
import OrderTracking from './screens/OrderTracking';
import OrderDetail from './screens/OrderDetail';
import MyOrders from './screens/MyOrders';
import MyProfile from './screens/MyProfile';
import AdminNavigator from './screens/Admin/AdminNavigator';
import { CartProvider } from './contexts/CartContext';

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup2} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }} />
          <Stack.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
          <Stack.Screen name="CategoryItems" component={CategoryItems} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Coupons" component={Coupons} />
          <Stack.Screen name="Deals" component={Deals} />
          <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }}/>
          <Stack.Screen name="AddressForm" component={AddressForm} options={{ headerShown: false }}/>
          <Stack.Screen name="OrderTracking" component={OrderTracking} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="MyOrders" component={MyOrders} />

          <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
