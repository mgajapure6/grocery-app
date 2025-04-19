import { Button, StyleSheet, Text, View } from 'react-native';

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Button 
      title="Go to Signup"
      onPress={()=> navigation.navigate('Signup')}></Button>
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