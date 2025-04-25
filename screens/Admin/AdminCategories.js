import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { categories, mainCategories, subCategories } from '../../data/staticData';

export default function AdminCategories({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({
    id: '',
    name: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    // Preload images
    Image.prefetch(
      Object.values(categories).flatMap((category) =>
        category.subcategories.map((subcategory) => subcategory.image)
      )
    );
  }, []);

  const openModal = (mainCategory, category = null) => {
    setSelectedMainCategory(mainCategory);
    if (category) {
      // Editing existing category
      setIsEditing(true);
      setCategoryData({
        id: category.id,
        name: category.name,
        description: category.description || '',
        image: category.image,
      });
    } else {
      // Creating new category
      setIsEditing(false);
      setCategoryData({
        id: '',
        name: '',
        description: '',
        image: null,
      });
    }
    setModalVisible(true);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCategoryData({ ...categoryData, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    // Here you would typically save the categoryData to your backend or state
    console.log('Saving category:', {
      mainCategory: selectedMainCategory.name,
      ...categoryData,
    });
    setModalVisible(false);
  };

  const renderCategoryItem = ({ item, mainCategory }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('AdminProductList', { mainCategory, subCategoryId: item.id })}
    >
      <Image
        source={item.image}
        style={styles.categoryImage}
        placeholder={require('../../assets/img/image-placeholder.png')}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSection = (mainCategory) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderIconText}>
          <Feather name={mainCategory.iconName} size={20} color="#333" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{mainCategory.name}</Text>
        </View>
        <TouchableOpacity onPress={() => openModal(mainCategory)}>
          <Feather name="plus-circle" size={20} color="#333" style={styles.sectionIcon} />
        </TouchableOpacity>
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderSection(categories.groceryAndKitchen)}
          {renderSection(categories.snacksAndDrinks)}
          {renderSection(categories.beautyAndWellness)}
          {renderSection(categories.householdAndLifestyle)}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={modalStyles.modalContainer}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={modalStyles.modalContent}>
              <Text style={modalStyles.label}>Main Category</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.disabledInput]}
                value={selectedMainCategory?.name || ''}
                editable={false}
              />
              <Text style={modalStyles.label}>Category Name</Text>
              <TextInput
                style={modalStyles.input}
                value={categoryData.name}
                onChangeText={(text) => setCategoryData({ ...categoryData, name: text })}
                placeholder="Enter category name"
              />
              <Text style={modalStyles.label}>Description</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                value={categoryData.description}
                onChangeText={(text) => setCategoryData({ ...categoryData, description: text })}
                placeholder="Enter category description"
                multiline
                numberOfLines={4}
              />
              <Text style={modalStyles.label}>Category Image</Text>
              <TouchableOpacity style={modalStyles.imagePicker} onPress={handleImagePick}>
                {categoryData.image ? (
                  <Image source={{ uri: categoryData.image }} style={modalStyles.imagePreview} />
                ) : (
                  <Text style={modalStyles.imagePickerText}>Select Image</Text>
                )}
              </TouchableOpacity>
              <View style={modalStyles.buttonContainer}>
                <Button
                  title={isEditing ? 'Update' : 'Save'}
                  onPress={handleSave}
                  color={Platform.OS === 'ios' ? '#007AFF' : '#6200EE'}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color={Platform.OS === 'ios' ? '#FF3B30' : '#B00020'}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  sectionHeaderIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
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
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#e5e5e5',
    color: '#666',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});