import { Button, StyleSheet, Text, View } from 'react-native';

export default function MyOrders({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MyOrders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 800,
  }
});