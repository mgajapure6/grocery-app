import { Button, StyleSheet, Text, View } from 'react-native';

export default function Signup({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup</Text>
      <Button 
      title="Go to Confirm Number"
      onPress={()=> navigation.navigate('ConfirmNumber')}></Button>
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