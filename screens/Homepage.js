import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import LogoIMG from '../assets/img/splash-logo.svg'; // Adjust path


//Use this images, 1. Vegetables and Fruits: https://images.unsplash.com/photo-1488459716781-31db52582fe9, 
// 2.Dairy and Breakfast: https://images.unsplash.com/photo-1504754524776-8f4f37790ca0 
// 3.Cold Drinks and Juice: https://images.unsplash.com/photo-1682987210989-2cf712b07429 
// 4.Instant and Frozen Food: https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/Tgkiy3y6r1huJtRQ/image.jpg 
// 5.Tea and Coffee: https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/u65BdxRnVs1TQkHu/image.jpg 
// 6.Atta Rice and Dals: https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/P5MK3NpYFqQDzDI2/image.jpg 
// 7.Masalas Oils and Dry Fruits: https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/MZorng71SIa1Luvn/image.jpg 
// 8.Chicken Meat and Fish:https://images.unsplash.com/photo-1673436977947-0787164a9abc
// Static data
const addresses = ['123 Main St, City', '456 Oak Ave, Town', '789 Pine Rd, Village'];
const categories = [
  { id: '1', name: 'Vegetables and Fruits', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9' },
  { id: '2', name: 'Dairy and Breakfast', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0' },
  { id: '3', name: 'Cold Drinks and Juice', image: 'https://images.unsplash.com/photo-1682987210989-2cf712b07429' },
  { id: '4', name: 'Instant and Frozen Food', image: 'https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/Tgkiy3y6r1huJtRQ/image.jpg' },
  { id: '5', name: 'Tea and Coffee', image: 'https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/u65BdxRnVs1TQkHu/image.jpg' },
  { id: '6', name: 'Atta, Rice and Dals', image: 'https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/P5MK3NpYFqQDzDI2/image.jpg' },
  { id: '7', name: 'Masalas, Oils and Dry Fruits', image: 'https://assets.grok.com/users/c773460d-3fdb-4413-b386-5e6ae75d11d9/generated/MZorng71SIa1Luvn/image.jpg' },
  { id: '8', name: 'Chicken, Meat and Fish', image: 'https://images.unsplash.com/photo-1673436977947-0787164a9abc' },
];
const bestDeals = [
  { id: '1', name: 'Fresh Apples', price: 2.99, image: 'https://images.unsplash.com/photo-1581891203469-db5113e1e537' },
  { id: '2', name: 'Whole Milk', price: 3.49, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b' },
  { id: '3', name: 'Orange Juice', price: 1.99, image: 'https://images.unsplash.com/photo-1599360889420-da1afaba9edc' },
  { id: '4', name: 'Frozen Pizza', price: 4.99, image: 'https://images.unsplash.com/photo-1662043591509-25e91fc3e2a1' },
];
const bannerImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e';

export default function Homepage({ navigation }) {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [activeTab, setActiveTab] = useState('Home');

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => console.log(`Selected category: ${item.name}`)}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBestDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <Text style={styles.dealName}>{item.name}</Text>
      <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.addressContainer}>
          <Feather name="map-pin" size={20} color="#5ac268" />
          <Text style={styles.addressText} numberOfLines={1}>
            {selectedAddress}
          </Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </View>
        <TouchableOpacity style={styles.cartContainer} onPress={() => console.log('Cart pressed')}>
          <Feather name="shopping-cart" size={24} color="#5ac268" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for items..."
              placeholderTextColor="#bbb"
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter pressed')}>
            <Feather name="filter" size={24} color="#5ac268" />
          </TouchableOpacity>
        </View>

        {/* Shop By Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop By Categories</Text>
          <TouchableOpacity onPress={() => console.log('See All Categories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.categoryRow}
          scrollEnabled={false}
        />

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
        </View>

        {/* Best Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Deals</Text>
          <TouchableOpacity onPress={() => console.log('See All Deals')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bestDeals}
          renderItem={renderBestDealItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsList}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Home')}
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
          <Text style={[styles.navText, activeTab === 'Favorite' && styles.navTextActive]}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Cart');
            console.log('Cart pressed');
          }}
        >
          <Feather
            name="shopping-cart"
            size={24}
            color={activeTab === 'Cart' ? '#5ac268' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'Cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('User');
            console.log('User pressed');
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
    marginTop: 40
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 100,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
    flex: 1,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
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
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#5ac268',
    fontWeight: '600',
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    flexWrap: 'wrap',
  },
  bannerContainer: {
    marginVertical: 20,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  dealsList: {
    paddingVertical: 10,
  },
  dealCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  dealImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  dealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dealPrice: {
    fontSize: 14,
    color: '#5ac268',
    marginVertical: 5,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  navTextActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
});