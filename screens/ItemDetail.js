import React, { useState, useEffect, useRef, useCallback,useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { categories, suggestedItems } from '../data/staticData';
import { CartContext } from '../contexts/CartContext';

const { width } = Dimensions.get('window');

export default function ItemDetail({ navigation, route }) {
  const item = route.params?.item || {
    id: '101-1',
    name: 'Lettuce',
    price: 1.89,
    image: require('../assets/img/image-placeholder.png'),
    images: [
      require('../assets/img/image-placeholder.png'),
      require('../assets/img/image-placeholder.png'),
    ],
    tag: '',
    description: 'Crisp and fresh lettuce, perfect for salads and sandwiches.',
    unit: 'head',
    rating: 4.4,
    reviews: 80,
    brand: 'Green Valley',
    category: 'Vegetables and Fruits',
    stock: 100,
    isAvailable: true,
    sku: 'LETTUCE-GRN-001',
    weight: 0.3,
    dimensions: { length: 15, width: 15, height: 10 },
    barcode: '123456789101',
    createdAt: '2025-04-23T00:00:00.000Z',
    updatedAt: '2025-04-23T00:00:00.000Z',
  };
  const { cart, setCart, addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Preload images
    Image.prefetch([item.image]);
    Image.prefetch(item.images);
    Image.prefetch(Object.values(suggestedItems).map((item) => item.image));
  }, [item.image, item.images]);

  // Handle image slider scroll
  const onScroll = useCallback((event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveImageIndex(index);
  }, []);

  // Animate button press
  const animateButton = useCallback(() => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonScale]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    setIsAdded(true);
    setQuantity(1);
    addToCart(item);
    animateButton();
    console.log('Added to Cart:', { id: item.id, quantity: 1 });
  }, [animateButton, item.id]);

  const handleMinQuantity = useCallback(() => {
    console.log("quantity:", quantity)
    if (quantity == 1) {
      setIsAdded(false);
      setQuantity(0);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setQuantity(quantity - 1);
    }
  });

  const handlePlusQuantity = useCallback(()=>{
    setQuantity(quantity+1)
  });

  // Render pagination dots
  const renderPagination = useCallback(
    () => (
      <View style={styles.pagination}>
        {item.images.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              activeImageIndex === index ? styles.activeDot : styles.inactiveDot,
              {
                transform: [{ scale: activeImageIndex === index ? 1.2 : 1 }],
                opacity: activeImageIndex === index ? 1 : 0.6,
              },
            ]}
          />
        ))}
      </View>
    ),
    [activeImageIndex, item.images]
  );

  // Render similar item
  const renderSuggestedItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.similarItemCard}
        onPress={() => console.log('View item:', item.id)}
      >
        <Image
          source={item.image}
          style={styles.similarItemImage}
          contentFit="cover"
        />
        <Text style={styles.similarItemName}>{item.name}</Text>
        <Text style={styles.similarItemPrice}>${item.price.toFixed(2)}</Text>
      </TouchableOpacity>
    ),
    []
  );

  // Render quantity selector
  const renderQuantitySelector = useCallback(
    () => (
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButtonMinus}
          onPress={() => handleMinQuantity()}
        >
          <Feather name="minus" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButtonPlus}
          onPress={() => handlePlusQuantity()}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    ),
    [quantity]
  );

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
            <Text style={styles.title}>Item Details</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartContainer}>
              <Feather name="shopping-cart" size={24} color="#333" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Slider */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={item.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item: image }) => (
                <Image
                  source={image}
                  style={styles.image}
                  contentFit="cover"
                />
              )}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
            <View style={styles.gradientOverlay} />
            {renderPagination()}
          </View>

          {/* Main Details */}
          <View style={styles.detailsCard}>
            <View style={styles.nameRatingRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                <Feather
                  name="heart"
                  size={24}
                  color={isFavorite ? '#ff3b30' : '#666'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.priceRatingRow}>
              <Text style={styles.price}>
                ${item.price.toFixed(2)} / {item.unit}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{item.rating}</Text>
                <Feather
                  name="star"
                  size={18}
                  style={styles.star}
                />
                <Text style={styles.reviews}>({item.reviews.length})</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Brand:</Text>
              <Text style={styles.infoValue}>{item.brand}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{item.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Availability:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: item.isAvailable ? '#5ac268' : '#ff3b30' },
                ]}
              >
                {item.isAvailable ? `In Stock (${item.stock})` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.additionalDetailsCard}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SKU:</Text>
              <Text style={styles.detailValue}>{item.sku}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>{item.weight} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dimensions:</Text>
              <Text style={styles.detailValue}>
                {item.dimensions.length} x {item.dimensions.width} x{' '}
                {item.dimensions.height} cm
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Barcode:</Text>
              <Text style={styles.detailValue}>{item.barcode}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Updated:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Similar Items */}
          <View style={styles.similarItemsCard}>
            <Text style={styles.sectionTitle}>Similar Items</Text>
            <FlatList
              data={suggestedItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderSuggestedItem}
              contentContainerStyle={styles.similarItemsList}
            />
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}
          >
            {isAdded ? (
              renderQuantitySelector()
            ) : (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !item.isAvailable && styles.addButtonDisabled,
                ]}
                disabled={!item.isAvailable}
                onPress={handleAddToCart}
              >
                <Text style={styles.addButtonText}>
                  {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#5ac268',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#5ac268',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nameRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5ac268',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rating:{
    marginRight: 4
  },
  star: {
    marginRight: 0,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  additionalDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  similarItemsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  similarItemsList: {
    paddingVertical: 10,
  },
  similarItemCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  similarItemImage: {
    width: '100%',
    height: 100,
  },
  similarItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 8,
  },
  similarItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 22,
    // paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#fff',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  viewCartButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007aff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 15,
  },
  viewCartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007aff',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  quantityButtonMinus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityButtonPlus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
});
