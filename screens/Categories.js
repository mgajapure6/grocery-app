import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import { categories } from '../data/staticData';

export default function Categories({ navigation }) {
  const { cart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('Categories');

  const renderCategoryItem = ({ item, mainCategory }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryItems', { mainCategory, subCategoryId: item.id })}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSection = (title, mainCategory, data, iconName) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name={iconName} size={20} color="#333" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => renderCategoryItem({ item, mainCategory })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={styles.categoryRow}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack('Homepage')}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Categories</Text>
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
          {renderSection('Grocery and Kitchen', 'groceryKitchen', categories.groceryKitchen, 'shopping-bag')}
          {renderSection('Snacks and Drinks', 'snacksDrinks', categories.snacksDrinks, 'coffee')}
          {renderSection('Beauty and Personal Care', 'beautyPersonalCare', categories.beautyPersonalCare, 'heart')}
          {renderSection('Household Essentials', 'householdEssentials', categories.householdEssentials, 'home')}
          {renderSection('Shop by Store', 'shopByStore', categories.shopByStore, 'bookmark')}
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
              setActiveTab('Categories');
              navigation.navigate('Categories');
            }}
          >
            <Feather
              name="grid"
              size={24}
              color={activeTab === 'Categories' ? '#5ac268' : '#666'}
            />
            <Text style={[styles.navText, activeTab === 'Categories' && styles.navTextActive]}>Categories</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 40
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
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
    paddingBottom: 100,
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
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '22%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    alignItems: 'center',
    marginBottom: 10
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
    fontWeight: '500',
  },
  navTextActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
});