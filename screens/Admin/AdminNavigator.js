import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import AdminItems from './Items';
import AdminOrders from './Orders';

const AdminStack = createNativeStackNavigator();

export default function Splash({navigation}) {
  return (
    <AdminStack.Navigator>
        <AdminStack.Screen name="AdminItems" component={AdminItems} />
        <AdminStack.Screen name="AdminOrders" component={AdminOrders} />
    </AdminStack.Navigator>
  );
}
