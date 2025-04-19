import { Button, StyleSheet, Text, View } from 'react-native';

export default function OrderDetail({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OrderDetail</Text>
      <Button 
      title="Go to My Profile"
      onPress={()=> navigation.navigate('MyProfile')}></Button>
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