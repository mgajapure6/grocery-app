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
import { categories, mainCategories, subCategories } from '../data/staticData';

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

  // const renderSection = (title, mainCategory, data, iconName) => (
  //   <View style={styles.sectionContainer}>
  //     <View style={styles.sectionHeader}>
  //       <Feather name={iconName} size={20} color="#333" style={styles.sectionIcon} />
  //       <Text style={styles.sectionTitle}>{data}</Text>
  //     </View>
  //     <FlatList
  //       data={data}
  //       renderItem={({ item }) => renderCategoryItem({ item, mainCategory })}
  //       keyExtractor={(item) => item.id.toString()}
  //       numColumns={4}
  //       columnWrapperStyle={styles.categoryRow}
  //       scrollEnabled={false}
  //     />
  //   </View>
  // );

  const renderSection = (mainCategory) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name={mainCategory.iconName} size={20} color="#333" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>{mainCategory.name}</Text>
      </View>
      <FlatList
        data={mainCategory.subcategories}
        renderItem={({ item }) => renderCategoryItem({ item, mainCategory })}
        keyExtractor={(item) => item.id}
        numColumns={4}
        columnWrapperStyle={styles.categoryRow}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* {renderSection('Grocery and Kitchen', 'groceryKitchen', categories.groceryAndKitchen, 'shopping-bag')}
          {renderSection('Snacks and Drinks', 'snacksDrinks', categories.snacksAndDrinks, 'coffee')}
          {renderSection('Beauty and Personal Care', 'beautyPersonalCare', categories.beautyAndWellness, 'heart')}
          {renderSection('Household Essentials', 'householdEssentials', categories.householdAndLifestyle, 'home')} */}
          {renderSection(categories.groceryAndKitchen)}
          {renderSection(categories.snacksAndDrinks)}
          {renderSection(categories.beautyAndWellness)}
          {renderSection(categories.householdAndLifestyle)}
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
});