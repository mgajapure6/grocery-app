import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator';
import Toast from 'react-native-toast-message';
import "./global.css";
import { verifyInstallation } from 'nativewind';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  //verifyInstallation();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <MenuProvider>
        <AppNavigator />
        <Toast />
      </MenuProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
