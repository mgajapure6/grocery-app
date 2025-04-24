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
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
} = require('react-native');
const { SafeAreaView } = require('react-native-safe-area-context');
const { Feather } = require('@expo/vector-icons');

const { width } = Dimensions.get('window');

module.exports = function ItemDetail({ navigation, route }) {
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

  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Dummy similar items
  const similarItems = [
    { id: '102-1', name: 'Tomato', price: 2.49, image: require('../assets/img/image-placeholder.png') },
    { id: '103-1', name: 'Cucumber', price: 1.29, image: require('../assets/img/image-placeholder.png') },
    { id: '104-1', name: 'Spinach', price: 1.99, image: require('../assets/img/image-placeholder.png') },
    { id: '105-1', name: 'Carrot', price: 1.59, image: require('../assets/img/image-placeholder.png') },
  ];

  // Handle image slider scroll
  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveImageIndex(index);
  };

  // Animate button press
  const animateButton = () => {
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
  };

  // Handle add to cart
  const handleAddToCart = () => {
    setIsAdded(true);
    setQuantity(1);
    animateButton();
    console.log('Added to Cart:', { id: item.id, quantity: 1 });
  };

  // Render pagination dots
  const renderPagination = () => (
    <View style={styles.pagination}>
      {item.images.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            activeImageIndex === index ? styles.activeDot : styles.inactiveDot,
            {
              transform: [{
                scale: activeImageIndex === index ? 1.2 : 1,
              }],
              opacity: activeImageIndex === index ? 1 : 0.6,
            },
          ]}
        />
      ))}
    </View>
  );

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={18}
          color={i <= Math.round(rating) ? '#f5c518' : '#ccc'}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  // Render similar item
  const renderSimilarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.similarItemCard}
      onPress={() => console.log('View item:', item.id)}
    >
      <Image source={item.image} style={styles.similarItemImage} resizeMode="cover" />
      <Text style={styles.similarItemName}>{item.name}</Text>
      <Text style={styles.similarItemPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // Render quantity selector
  const renderQuantitySelector = () => (
    <View style={styles.quantitySelector}>
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
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
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
          <TouchableOpacity onPress={() => console.log('View Cart')}>
            <View style={styles.cartContainer}>
              <Feather name="shopping-cart" size={24} color="#333" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
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
                <Image source={image} style={styles.image} resizeMode="cover" />
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
              <Text style={styles.price}>${item.price.toFixed(2)} / {item.unit}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(item.rating)}
                <Text style={styles.reviews}>({item.reviews})</Text>
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
              <Text style={[styles.infoValue, { color: item.isAvailable ? '#5ac268' : '#ff3b30' }]}>
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
                {item.dimensions.length} x {item.dimensions.width} x {item.dimensions.height} cm
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
              data={similarItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderSimilarItem}
              contentContainerStyle={styles.similarItemsList}
            />
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
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
            onPress={() => console.log('View Cart')}
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
    backgroundColor: '#ff3b30',
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
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(s0, 0, 0, 0.3)',
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 16,
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
  },
  star: {
    marginRight: 4,
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
    padding: 15,
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
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
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
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
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