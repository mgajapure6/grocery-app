import { Button, StyleSheet, Text, View } from 'react-native';

export default function Cart({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart</Text>
      <Button 
      title="Go to Cart"
      onPress={()=> navigation.navigate('Cart')}></Button>
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