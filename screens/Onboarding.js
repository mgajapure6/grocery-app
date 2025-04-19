import { Button, StyleSheet, Text, View } from 'react-native';

export default function Onboarding({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding</Text>
      <Button 
      title="Go to Login"
      onPress={()=> navigation.navigate('Login')}></Button>
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