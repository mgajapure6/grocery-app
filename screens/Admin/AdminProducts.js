import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { categories } from '../../data/staticData';

const AdminProducts = ({ navigation }) => {
  const [mainCategories, setMainCategories] = useState(categories);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'category', 'subcategory'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: null,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need photo library permissions to upload product images!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    let updatedCategories = { ...mainCategories };

    if (modalType === 'category') {
      const categoryKey = formData.name.toLowerCase().replace(/\s+/g, '');
      if (!categoryKey || updatedCategories[categoryKey]) {
        Alert.alert('Error', 'Please enter a unique category key.');
        return;
      }
      updatedCategories[categoryKey] = [];
    } else if (modalType === 'subcategory') {
      if (!formData.name || !formData.image) {
        Alert.alert('Error', 'Name and image are required.');
        return;
      }
      const newSubCategory = {
        id: newId,
        name: formData.name,
        image: formData.image || require('../../assets/img/image-placeholder.png'),
        items: [],
      };
      updatedCategories[selectedCategory] = [
        ...updatedCategories[selectedCategory],
        newSubCategory,
      ];
    }

    setMainCategories(updatedCategories);
    setModalVisible(false);
    setFormData({ id: '', name: '', image: null });
  };

  const handleDelete = (type, mainCatKey, subCatId) => {
    Alert.alert(
      `Delete ${type}`,
      `Are you sure you want to delete this ${type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            let updatedCategories = { ...mainCategories };
            if (type === 'category') {
              delete updatedCategories[mainCatKey];
            } else if (type === 'subcategory') {
              updatedCategories[mainCatKey] = updatedCategories[mainCatKey].filter(
                (subCat) => subCat.id !== subCatId
              );
            }
            setMainCategories(updatedCategories);
          },
        },
      ]
    );
  };

  const renderSubCategory = ({ item, mainCategory }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() =>
        navigation.navigate('ProductList', {
          mainCategory,
          subCategoryId: item.id,
          mainCategories,
          setMainCategories,
        })
      }
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteSubCategoryButton}
        onPress={() => handleDelete('subcategory', mainCategory, item.id)}
      >
        <Feather name="trash-2" size={16} color="#ff4d4d" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSection = (title, mainCategory, data, iconName) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name={iconName} size={20} color="#333" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          // style={styles.addSubCategoryButton}
          onPress={() => {
            setModalType('subcategory');
            setSelectedCategory(mainCategory);
            setModalVisible(true);
          }}
        >
          <Feather name="plus-circle" size={25} color="#007bff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => renderSubCategory({ item, mainCategory })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={styles.categoryRow}
        scrollEnabled={false}
      />
      <TouchableOpacity
        style={styles.deleteCategoryButton}
        onPress={() => handleDelete('category', mainCategory)}
      >
        <Feather name="trash-2" size={16} color="#ff4d4d" />
        <Text style={styles.deleteCategoryText}>Delete Category</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity
            // style={styles.addCategoryButton}
            onPress={() => {
              setModalType('category');
              setModalVisible(true);
            }}
          >
            <Feather name="plus-circle" size={25} color="#007bff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderSection(
            'Grocery and Kitchen',
            'groceryKitchen',
            mainCategories.groceryKitchen || [],
            'shopping-bag'
          )}
          {renderSection(
            'Snacks and Drinks',
            'snacksDrinks',
            mainCategories.snacksDrinks || [],
            'coffee'
          )}
          {renderSection(
            'Beauty and Personal Care',
            'beautyPersonalCare',
            mainCategories.beautyPersonalCare || [],
            'heart'
          )}
          {renderSection(
            'Household Essentials',
            'householdEssentials',
            mainCategories.householdEssentials || [],
            'home'
          )}
          {renderSection(
            'Shop by Store',
            'shopByStore',
            mainCategories.shopByStore || [],
            'bookmark'
          )}
          {Object.keys(mainCategories)
            .filter(
              (key) =>
                ![
                  'groceryKitchen',
                  'snacksDrinks',
                  'beautyPersonalCare',
                  'householdEssentials',
                  'shopByStore',
                ].includes(key)
            )
            .map((key) =>
              renderSection(
                key.charAt(0).toUpperCase() + key.slice(1),
                key,
                mainCategories[key],
                'shopping-bag'
              )
            )}
        </ScrollView>

        {/* Modal for Adding Category/Subcategory */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  modalType === 'category'
                    ? 'Category Key (e.g., newCategory)'
                    : 'Name'
                }
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              {modalType === 'subcategory' && (
                <>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    <Text style={styles.imagePickerText}>
                      {formData.image ? 'Image Selected' : 'Pick an Image'}
                    </Text>
                  </TouchableOpacity>
                  {formData.image && (
                    <Image source={{ uri: formData.image }} style={styles.previewImage} />
                  )}
                </>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addCategoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
    flex: 1,
  },
  addSubCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addSubCategoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '22%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
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
  deleteSubCategoryButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  deleteCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  deleteCategoryText: {
    color: '#ff4d4d',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminProducts;