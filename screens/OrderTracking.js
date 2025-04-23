const React = require('react');
const {
  useState,
  useEffect,
  useRef,
} = React;
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} = require('react-native');
const { SafeAreaView } = require('react-native-safe-area-context');
const { Feather } = require('@expo/vector-icons');
const { WebView } = require('react-native-webview');
const Location = require('expo-location');

module.exports = function OrderTracking({ navigation, route }) {
  const orderId = route.params?.orderId || `ORD-${Math.floor(Date.now() / 1000)}`;
  const [activeTab, setActiveTab] = useState('User');
  const [permissionError, setPermissionError] = useState(null);
  const webViewRef = useRef(null);

  // Pune location data
  const order = {
    id: orderId,
    status: 'In Transit',
    restaurant: { name: 'Pune Eats', lat: 18.5353, lng: 73.8939 }, // Koregaon Park
    user: { lat: 18.5590, lng: 73.7868 }, // Baner
    driver: { name: 'John', phone: '555-1234' },
  };

  // Simulated driver path in Pune
  const path = [
    { lat: 18.5353, lng: 73.8939 }, // Restaurant (Koregaon Park)
    { lat: 18.5400, lng: 73.8800 }, // North Main Road
    { lat: 18.5500, lng: 73.8500 }, // Near Aundh
    { lat: 18.5550, lng: 73.8200 }, // Aundh Road
    { lat: 18.5590, lng: 73.7868 }, // User (Baner)
  ];

  // State for driver position and ETA
  const [driverPosition, setDriverPosition] = useState(path[0]);
  const [eta, setEta] = useState(0);
  const [pathIndex, setPathIndex] = useState(0);

  // Request location permissions (optional)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionError('Location permission denied.');
          console.warn('Location permission denied');
          return;
        }
        setPermissionError(null);
      } catch (error) {
        setPermissionError('Error requesting location permissions.');
        console.error('Permission error:', error);
      }
    })();
  }, []);

  // Haversine formula to calculate distance (in km)
  const haversineDistance = (coord1, coord2) => {
    try {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371; // Earth's radius in km
      const dLat = toRad(coord2.lat - coord1.lat);
      const dLon = toRad(coord2.lng - coord1.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) *
          Math.cos(toRad(coord2.lat)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } catch (error) {
      console.error('Haversine error:', error);
      return 0;
    }
  };

  // Send initial location data to WebView
  const sendInitialLocationData = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'initLocation',
        data: {
          restaurant: order.restaurant,
          user: order.user,
          path: path,
        },
      }));
    }
  };

  // Update driver position and ETA
  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((prev) => {
        const next = prev + 1;
        if (next >= path.length - 1) {
          clearInterval(interval);
          setDriverPosition(path[path.length - 1]);
          setEta(0); // Arrived
          return prev;
        }
        const newPosition = path[next];
        setDriverPosition(newPosition);

        // Calculate ETA
        const distance = haversineDistance(newPosition, order.user);
        const speed = 30; // km/h
        const timeHours = distance / speed;
        const timeMinutes = Math.round(timeHours * 60);
        setEta(timeMinutes);

        // Send updated driver position to WebView
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateDriverPosition',
            position: newPosition,
          }));
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Order Tracking</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* WebView or Error */}
        {permissionError ? (
          <View style={styles.mapError}>
            <Text style={styles.errorText}>{permissionError}</Text>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            style={styles.map}
            source={Platform.OS === 'ios' ? require('../assets/map.html') : { uri: 'file:///android_asset/map.html' }}
            originWhitelist={['*']}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
            }}
            onLoad={() => {
              console.log('WebView loaded');
              sendInitialLocationData(); // Send initial location data on load
            }}
          />
        )}

        {/* Overlay Card */}
        <View style={styles.overlayCard}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <View style={styles.statusRow}>
            <Feather name="package" size={20} color="#333" style={styles.statusIcon} />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
          <View style={styles.etaRow}>
            <Feather name="clock" size={20} color="#5ac268" style={styles.etaIcon} />
            <Text style={styles.etaText}>
              {eta > 0 ? `Arrives in ${eta} mins` : 'Arrived'}
            </Text>
          </View>
          <View style={styles.driverRow}>
            <Feather name="user" size={20} color="#333" style={styles.driverIcon} />
            <Text style={styles.driverText}>
              Driver: {order.driver.name} ({order.driver.phone})
            </Text>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Home');
              navigation.navigate('Homepage');
            }}
          >
            <Feather
              name="home"
              size={24}
              color={activeTab === 'Home' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Favorite');
              console.log('Favorite pressed');
            }}
          >
            <Feather
              name="heart"
              size={24}
              color={activeTab === 'Favorite' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Favorite' && styles.navTextActive]}>
              Favorite
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('Categories');
              navigation.navigate('Categories');
            }}
          >
            <Feather
              name="grid"
              size={24}
              color={activeTab === 'Categories' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Categories' && styles.navTextActive]}>
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setActiveTab('User');
              navigation.navigate('UserProfile');
            }}
          >
            <Feather
              name="user"
              size={24}
              color={activeTab === 'User' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'User' && styles.navTextActive]}>User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  map: {
    flex: 1,
  },
  mapError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    textAlign: 'center',
  },
  overlayCard: {
    position: 'absolute',
    bottom: 90, // Above bottom nav
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007aff',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  etaIcon: {
    marginRight: 8,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5ac268',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverIcon: {
    marginRight: 8,
  },
  driverText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 5,
  },
  navTextActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
});