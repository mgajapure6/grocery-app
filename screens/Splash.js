import { Button, StyleSheet, Text, View } from 'react-native';

export default function Splash({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash</Text>
      <Button 
      title="Go to Onboarding"
      onPress={()=> navigation.navigate('Onboarding')}></Button>
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