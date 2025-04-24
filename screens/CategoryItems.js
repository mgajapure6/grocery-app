import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import { categories } from '../data/staticData';
import { FontAwesome } from '@expo/vector-icons'

export default function CategoryItems({ navigation, route }) {
  const { addToCart, cart } = useContext(CartContext);
  const { mainCategory, subCategoryId } = route.params;
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(subCategoryId);

  // Get subcategories and items
  const subCategories = mainCategory.subcategories || [];
  const selectedSubCategory = subCategories.find(sub => sub.id === selectedSubCategoryId);
  const items = selectedSubCategory ? selectedSubCategory.items : [];

  // Render subcategory in left column
  const renderSubCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.subCategoryCard,
        item.id === selectedSubCategoryId && styles.subCategoryCardActive,
      ]}
      onPress={() => setSelectedSubCategoryId(item.id)}
    >
      <Image source={item.image} style={styles.subCategoryImage} />
      <Text
        style={[
          styles.subCategoryName,
          item.id === selectedSubCategoryId && styles.subCategoryNameActive,
        ]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render item in right column
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetail', { item })}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => {
          console.log('Adding item to cart:', item);
          addToCart(item);
        }}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{mainCategory.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => console.log('Search pressed')}
          >
            <Feather name="search" size={24} color="#5ac268" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Left Column: Subcategories */}
          <View style={styles.leftColumn}>
            <FlatList
              data={subCategories}
              renderItem={renderSubCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.subCategoryList}
            />
          </View>

          {/* Right Column: Items */}
          <View style={styles.rightColumn}>
            {/* Filter and Sort Options */}
            <View style={styles.filterSortContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => console.log('Filter pressed')}
              >
                <FontAwesome name='filter' size={15} color="#5ac268"/>
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => console.log('Sort pressed')}
              >
                <FontAwesome name='sort' size={15} color="#5ac268"/>
                <Text style={styles.sortText}>Sort</Text>
              </TouchableOpacity>
            </View>

            {/* Items Grid */}
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.itemRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.itemList}
              ListEmptyComponent={<Text style={styles.emptyText}>No items available</Text>}
            />
          </View>
        </View>

        {/* Floating Cart Button */}
        <TouchableOpacity
          style={styles.floatingCartButton}
          onPress={() => {
            console.log('Navigating to Cart, cart state:', JSON.stringify(cart, null, 2));
            navigation.navigate('Cart');
          }}
        >
          <Feather name="shopping-cart" size={24} color="#fff" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Match statusBar background
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
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
  searchButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '30%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subCategoryList: {
    padding: 15,
  },
  subCategoryCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subCategoryCardActive: {
    backgroundColor: '#e6f4ea',
    borderWidth: 2,
    borderColor: '#5ac268',
  },
  subCategoryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 8,
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  subCategoryNameActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
  rightColumn: {
    width: '70%',
    // padding: 15,
    backgroundColor: '#fff',
    // borderRadius: 12,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 10,
    padding: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5ac268',
    marginLeft: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5ac268',
    marginLeft: 8,
  },
  itemList: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  itemRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 5,
    // borderWidth: 1
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
    // borderWidth: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5ac268',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5ac268',
  },
  cartBadgeText: {
    color: '#5ac268',
    fontSize: 12,
    fontWeight: 'bold',
  },
});