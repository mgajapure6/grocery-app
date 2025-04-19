import { Button, StyleSheet, Text, View } from 'react-native';

export default function AccountSuccessfull({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AccountSuccessfull</Text>
      <Button 
      title="Go to Home Page"
      onPress={()=> navigation.navigate('Homepage')}></Button>
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