import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';

export default function ItemDetail({ route, navigation }) {
  const { item } = route.params || {};
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Home');
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle missing item data
  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.navigate('Cart');
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    console.log(`Toggled favorite for item ${item.id}`); // Placeholder for Favorites.js
  };

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
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <TouchableOpacity onPress={handleFavoriteToggle}>
            <Feather
              name="heart"
              size={24}
              color={isFavorite ? '#5ac268' : '#666'}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/300' }}
              style={styles.image}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.description}>
              {item.description || 'No description available.'}
            </Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Feather name="minus" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Feather name="plus" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>
              Home
            </Text>
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
            <Text style={[styles.navText, activeTab === 'User' && styles.navTextActive]}>
              User
            </Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5ac268',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
  addButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNav: {
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