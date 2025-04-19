import { Button, StyleSheet, Text, View } from 'react-native';

export default function MyProfile({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MyProfile</Text>
      <Button 
      title="Go to My Orders"
      onPress={()=> navigation.navigate('MyOrders')}></Button>
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