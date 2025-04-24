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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import { addresses, banner, suggestedItems, bestDealItems, mainCategories, subCategories, categories } from '../data/staticData';

export default function Homepage({ navigation }) {
  console.log("Homepage called");
  const { cart, addToCart } = useContext(CartContext);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedMainCategory, setSelectedMainCategory] = useState(categories.groceryAndKitchen);

  const renderSubCategory = ({ item}) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryItems', { mainCategory: selectedMainCategory, subCategoryId: item.id })}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBestDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetail', { item })}>
        <Image source={item.image} style={styles.dealImage} />
        <Text style={styles.dealName}>{item.name}</Text>
        <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
        {item.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        )}
      </TouchableOpacity>

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
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetail', { item })}>
        <Image source={item.image} style={styles.dealImage} />
        <Text style={styles.dealName}>{item.name}</Text>
        <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
        {item.tag && (
          <View style={[styles.tagBadge, styles.suggestedTag]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
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
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="grid" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Shop By Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedMainCategory.subcategories}
              renderItem={({ item }) => renderSubCategory({ item })}
              keyExtractor={(item) => item.id.toString()}
              numColumns={4}
              columnWrapperStyle={styles.categoryRow}
              scrollEnabled={false}
            />
          </View>

          {/* Banner */}
          <View style={styles.bannerContainer}>
            <Image source={banner.image} style={styles.bannerImage} />
            {/* <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View> */}
          </View>

          {/* Suggested Items */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="star" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Suggested for You</Text>
              <TouchableOpacity onPress={() => console.log('See All Suggested')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={suggestedItems}
              renderItem={renderSuggestedItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dealsList}
            />
          </View>

          {/* Best Deals */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="tag" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Best Deals</Text>
              <TouchableOpacity onPress={() => console.log('See All Deals')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={bestDealItems}
              renderItem={renderBestDealItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dealsList}
            />
          </View>
        </ScrollView>
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  addressIcon: {
    marginRight: 8,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    padding: 20,
    paddingBottom: 100
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
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5ac268',
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '22%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,

  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    flexWrap: 'wrap',
  },
  bannerContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    resizeMode: 'stretch',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginTop: 6,
  },
  dealsList: {
    paddingVertical: 10,
  },
  dealCard: {
    width: 160,
    marginRight: 10,
    marginLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dealImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
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
    fontWeight: '500',
    color: '#5ac268',
    marginVertical: 6,
  },
  tagBadge: {
    backgroundColor: '#ffebee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestedTag: {
    backgroundColor: '#e6f4ea',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
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
});