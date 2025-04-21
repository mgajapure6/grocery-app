import { Button, Image, StyleSheet, Text, View } from 'react-native';
import LogoIMG from '../assets/img/splash-logo.svg';
import VEGETABLEIMG from '../assets/img/splash-vegetables.svg';

export default function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.imgView}>
        <LogoIMG width={100} height={100} style={styles.image} />
        <Button
          title="Go to Onboarding"
          onPress={() => navigation.navigate('Onboarding')}></Button>
          <Button
          title="Go to Homepage"
          onPress={() => navigation.navigate('Homepage')}></Button>
      </View>
      <VEGETABLEIMG width={500} height={500} style={styles.imageVegetable} />
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
  },
  imgView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  image: {
    marginBottom: 10
  },
  imageVegetable: {
    marginBottom: -70,
    marginRight:-20,
    transform: [{ rotate: '-14.82deg' }], // 🔄 rotation
  },
});