import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import Homepage from './screens/Homepage';
import Categories from './screens/Categories';
import CategoryItems from './screens/CategoryItems';
import ItemDetail from './screens/ItemDetail';

import Cart from './screens/Cart';
import Payment from './screens/Payment';
import AddressForm from './screens/AddressForm';
import OrderTracking from './screens/OrderTracking';
import AdminNavigator from './screens/Admin/AdminNavigator';
import OrderSummary from './screens/OrderSummary';
import OrderSuccess from './screens/OrderSuccess';
import UserProfile from './screens/UserProfile';
import OrderHistory from './screens/OrderHistory';
import SavedPaymentMethods from './screens/SavedPaymentMethods';
import SavedAddresses from './screens/SavedAddresses';
import GstDetails from './screens/GstDetails';
import AboutUs from './screens/AboutUs';
import AccountPrivacy from './screens/AccountPrivacy';
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
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }} />
          <Stack.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
          <Stack.Screen name="CategoryItems" component={CategoryItems} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
          <Stack.Screen name="AddressForm" component={AddressForm} options={{ headerShown: false }} />
          <Stack.Screen name="OrderSummary" component={OrderSummary} options={{ headerShown: false }} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: false }} />
          <Stack.Screen name="OrderTracking" component={OrderTracking} options={{ headerShown: false }} />
          <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false }}/>
          <Stack.Screen name="SavedPaymentMethods" component={SavedPaymentMethods} options={{ headerShown: false }}/>
          <Stack.Screen name="SavedAddresses" component={SavedAddresses} options={{ headerShown: false }}/>
          <Stack.Screen name="GstDetails" component={GstDetails} options={{ headerShown: false }}/>
          <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }}/>
          <Stack.Screen name="AccountPrivacy" component={AccountPrivacy} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
