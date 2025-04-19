import { Button, StyleSheet, Text, View } from 'react-native';

export default function ConfirmOtp({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ConfirmOtp</Text>
      <Button 
      title="Go to Account Successfull"
      onPress={()=> navigation.navigate('AccountSuccessfull')}></Button>
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