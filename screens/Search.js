import { Button, StyleSheet, Text, View } from 'react-native';

export default function Search({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search</Text>
      <Button 
      title="Go to Coupons"
      onPress={()=> navigation.navigate('Coupons')}></Button>
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