import { Button, StyleSheet, Text, View } from 'react-native';

export default function ConfirmNumber({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ConfirmNumber</Text>
      <Button 
      title="Go to Confirm OTP"
      onPress={()=> navigation.navigate('ConfirmOtp')}></Button>
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