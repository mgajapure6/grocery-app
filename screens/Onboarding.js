import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import DELIVERYBOY from '../assets/img/onboarding-delivery-boy.svg';
import BUTTONIMG from '../assets/img/Button.svg';
import RECTANGLEIMG from '../assets/img/Rectangle.svg';
import { PixelRatio, Dimensions } from 'react-native';
import { useState, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export function normalizeFont(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function Onboarding({ navigation }) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const carouselData = [
    {
      title: 'Buy Groceries Easily \nwith Us',
      subtitle: 'It is a long established fact that a \nreader will be distracted.',
    },
    {
      title: 'Fast Delivery to Your \nDoorstep',
      subtitle: 'Your groceries will arrive in no time, \nsafe and fresh.',
    },
    {
      title: 'Save Time and Money',
      subtitle: 'Shop smart, skip the line, and \nget the best deals.',
    },
  ];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <DELIVERYBOY width={300} height={500} style={styles.deliveryBoy} />
      <View style={styles.contentAera}>
        <RECTANGLEIMG width={350} height={360} style={styles.rect}></RECTANGLEIMG>
        <View style={styles.textDotBtnArea}>
          <View style={styles.dots}>
            {/* <View style={styles.dot}></View>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View> */}
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
          {/* <View style={styles.textArea}>
            <Text style={styles.title}>Buy Groceries Easily
              with Us</Text>
            <Text style={styles.subtitle}>It is a long established fact that a reader
              will be distracted by the readable.</Text>
          </View> */}
          <FlatList
            style={styles.list}
            data={carouselData}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            ref={flatListRef}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            snapToInterval={width}
            snapToAlignment="center"
            disableIntervalMomentum
            contentInsetAdjustmentBehavior="never"
            renderItem={({ item }) => (
              <View style={[styles.textArea, {width}]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            )}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btn}>
            <BUTTONIMG width={60} height={60}></BUTTONIMG>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(90, 194, 104, 0.1)',
    alignItems: 'center',
    flexDirection: 'column'
  },
  text: {
    fontSize: 24,
    fontWeight: 800,
  },
  deliveryBoy: {
    marginTop: '20%'
  },
  rect: {
    marginBottom: 0,
    marginTop: '-35%'
  },
  contentAera: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  textDotBtnArea: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '-22%',
    width: '100%'
  },
  dots: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: '6%'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#ccc'
  },
  activeDot: {
    backgroundColor: '#5AC268',
  },
  textArea: {
    width: 310,
    height: 120,
    textAlign: 'center',
  },
  btn: {
    marginTop: '5%'
  },
  title: {
    fontSize: normalizeFont(26),
    fontWeight: 800,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: normalizeFont(16),
    marginTop: 20,
    textAlign: 'center'
  },
});
