import { Button, StyleSheet, Text, View } from 'react-native';

export default function Homepage({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Homepage</Text>
      <Button 
      title="Go to Categories"
      onPress={()=> navigation.navigate('Categories')}></Button>
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