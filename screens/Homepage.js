import React, { useContext, useState } from 'react';
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
import { CartContext } from '../contexts/CartContext';
import { addresses, categories, banner, suggestedItems, bestDealItems } from '../data/staticData';


export default function Homepage({ navigation }) {
  const { cart, addToCart } = useContext(CartContext);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [activeTab, setActiveTab] = useState('Home');

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => console.log(`Selected category: ${item.name}`)}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBestDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      <Image source={item.image} style={styles.dealImage} />
      <Text style={styles.dealName}>{item.name}</Text>
      <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
      {item.tag && (
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuggestedItem = ({ item }) => (
    <View style={styles.dealCard}>
      <Image source={item.image} style={styles.dealImage} />
      <Text style={styles.dealName}>{item.name}</Text>
      <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
      {item.tag && (
        <View style={[styles.tagBadge, styles.suggestedTag]}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={() => console.log('Select address')}
        >
          <Feather name="map-pin" size={20} color="#5ac268" />
          <Text style={styles.addressText} numberOfLines={1}>
            {selectedAddress.title}: {selectedAddress.address}
          </Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => navigation.navigate('Cart')}
        >
          <Feather name="shopping-cart" size={24} color="#5ac268" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.length}</Text>
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
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => console.log('Filter pressed')}
          >
            <Feather name="filter" size={24} color="#5ac268" />
          </TouchableOpacity>
        </View>

        {/* Shop By Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop By Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories.homepage}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.categoryRow}
          scrollEnabled={false}
        />

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={banner.image} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
          </View>
        </View>

        {/* Suggested Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          <TouchableOpacity onPress={() => console.log('See All Suggested')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={suggestedItems}
          renderItem={renderSuggestedItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsList}
        />

        {/* Best Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Deals</Text>
          <TouchableOpacity onPress={() => console.log('See All Deals')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bestDealItems}
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
          <Text
            style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}
          >
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
          <Text
            style={[
              styles.navText,
              activeTab === 'Favorite' && styles.navTextActive,
            ]}
          >
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
          <Text
            style={[
              styles.navText,
              activeTab === 'Categories' && styles.navTextActive,
            ]}
          >
            Categories
          </Text>
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
          <Text
            style={[styles.navText, activeTab === 'User' && styles.navTextActive]}
          >
            User
          </Text>
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
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
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
    width: '22%',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    flexWrap: 'wrap',
  },
  bannerContainer: {
    marginVertical: 20,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
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
  tagBadge: {
    backgroundColor: '#ffebee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestedTag: {
    backgroundColor: '#e8f5e9',
  },
  tagText: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
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