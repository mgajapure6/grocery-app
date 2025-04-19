import { Button, StyleSheet, Text, View } from 'react-native';

export default function Coupons({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coupons</Text>
      <Button 
      title="Go to Deals"
      onPress={()=> navigation.navigate('Deals')}></Button>
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