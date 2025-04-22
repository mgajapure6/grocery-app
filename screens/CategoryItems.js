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
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import { categories } from '../data/staticData';

export default function CategoryItems({ navigation, route }) {
  const { addToCart, cart } = useContext(CartContext);
  const { mainCategory, subCategoryId } = route.params; // e.g., mainCategory: 'householdEssentials', subCategoryId: '401'
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(subCategoryId);

  // Get subcategories and items
  const subCategories = categories[mainCategory] || [];
  const selectedSubCategory = subCategories.find(sub => sub.id === selectedSubCategoryId);
  const items = selectedSubCategory ? selectedSubCategory.items : [];

  // Main category name for title
  const mainCategoryName = {
    groceryKitchen: 'Grocery & Kitchen',
    snacksDrinks: 'Snacks & Drinks',
    beautyPersonalCare: 'Beauty & Personal Care',
    householdEssentials: 'Household Essentials',
  }[mainCategory] || 'Categories';

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
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{mainCategoryName}</Text>
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
            keyExtractor={(item) => item.id}
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
              <Feather name="filter" size={20} color="#5ac268" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => console.log('Sort pressed')}
            >
              <Feather name="sort-desc" size={20} color="#5ac268" />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Items Grid */}
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  subCategoryList: {
    padding: 10,
  },
  subCategoryCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subCategoryCardActive: {
    backgroundColor: '#e6f4ea',
  },
  subCategoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  subCategoryName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  subCategoryNameActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
  rightColumn: {
    width: '70%',
    padding: 10,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 14,
    color: '#5ac268',
    marginLeft: 5,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortText: {
    fontSize: 14,
    color: '#5ac268',
    marginLeft: 5,
  },
  itemList: {
    paddingBottom: 20,
  },
  itemRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#5ac268',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
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
    shadowRadius: 3,
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