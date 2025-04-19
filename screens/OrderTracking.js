import { Button, StyleSheet, Text, View } from 'react-native';

export default function OrderTracking({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OrderTracking</Text>
      <Button 
      title="Go to Order Detail"
      onPress={()=> navigation.navigate('OrderDetail')}></Button>
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