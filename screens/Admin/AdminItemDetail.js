import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { categories, mainCategoryList, subCategories } from '../../data/staticData';

const AdminItemDetail = ({ route, navigation }) => {
  const { mainCategory, subCategoryId, item } = route.params;
  const subCategories = mainCategory.subcategories || [];
  const subCategory = subCategories.find(sub => sub.id === subCategoryId) || {};
  const isNewProduct = !item;

  const [isEditing, setIsEditing] = useState(isNewProduct);
  const [mainCategories, setMainCategories] = useState(mainCategoryList);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    id: item?.id || `${subCategoryId}-${Date.now()}`,
    name: item?.name || '',
    image: item?.image || null,
    images: item?.images || [],
    price: item?.price?.toString() || '',
    unit: item?.unit || '',
    description: item?.description || '',
    stock: item?.stock?.toString() || '',
    brand: item?.brand || '',
    discount: item?.discount?.toString() || '',
    tag: item?.tag || '',
    isAvailable: item?.isAvailable ? 'Yes' : 'No',
    sku: item?.sku || '',
    weight: item?.weight || '',
    hasDimension: item?.dimensions ? 'Yes' : 'No',
    length: item?.dimensions?.length?.toString() || '',
    width: item?.dimensions?.width?.toString() || '',
    height: item?.dimensions?.height?.toString() || '',
    minOrderQty: item?.minOrderQty?.toString() || '',
    maxOrderQty: item?.maxOrderQty?.toString() || '',
    categoryId: subCategoryId,
    mainCategory: mainCategory.name,
    reviews: item?.reviews || [],
    createdAt: item?.createdAt || new Date().toISOString(),
    updatedAt: item?.updatedAt || new Date().toISOString(),
  });

  useEffect(() => {
    if (isNewProduct) {
      setIsEditing(true);
    }
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Photo library permissions required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...formData.images, result.assets[0].uri].slice(0, 5);
      setFormData({
        ...formData,
        images: newImages,
        image: formData.image || result.assets[0].uri,
      });
    }
  };

  const selectMainImage = (uri) => {
    setFormData({ ...formData, image: uri });
  };

  const removeImage = (uri) => {
    const newImages = formData.images.filter(img => img !== uri);
    setFormData({
      ...formData,
      images: newImages,
      image: formData.image === uri ? (newImages[0] || null) : formData.image,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.image || !formData.price) {
      Alert.alert('Error', 'Name, main image, and price are required.');
      return;
    }

    const updatedItem = {
      id: formData.id,
      name: formData.name,
      image: formData.image,
      images: formData.images,
      price: parseFloat(formData.price) || 0,
      unit: formData.unit,
      description: formData.description,
      stock: parseInt(formData.stock) || 0,
      brand: formData.brand,
      discount: parseFloat(formData.discount) || 0,
      tag: formData.tag,
      isAvailable: formData.isAvailable === 'Yes',
      sku: formData.sku,
      weight: formData.weight,
      dimensions: formData.hasDimension === 'Yes' ? {
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
      } : null,
      minOrderQty: parseInt(formData.minOrderQty) || 1,
      maxOrderQty: parseInt(formData.maxOrderQty) || 100,
      categoryId: formData.categoryId,
      mainCategory: formData.mainCategory,
      reviews: formData.reviews,
      createdAt: formData.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const updatedCategories = {
      ...mainCategories,
      [mainCategory.id]: mainCategories[mainCategory.id].map((subCat) =>
        subCat.id === subCategoryId
          ? {
            ...subCat,
            items: isNewProduct
              ? [...subCat.items, updatedItem]
              : subCat.items.map(i => i.id === formData.id ? updatedItem : i),
          }
          : subCat
      ),
    };

    setMainCategories(updatedCategories);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCategories = {
              ...mainCategories,
              [mainCategory.id]: mainCategories[mainCategory.id].map((subCat) =>
                subCat.id === subCategoryId
                  ? {
                    ...subCat,
                    items: subCat.items.filter((i) => i.id !== formData.id),
                  }
                  : subCat
              ),
            };
            setMainCategories(updatedCategories);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.thumbnailImage} />
      <View style={styles.imageActionButtonContainer}>
        <TouchableOpacity
          style={styles.imageActionButton}
          onPress={() => selectMainImage(item)}
          disabled={!isEditing}
        >
          <Text style={styles.imageActionText}>
            {formData.image === item ? 'Main' : 'Set Main'}
          </Text>
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => removeImage(item)}
          >
            <Feather name="x-circle" size={22} color="#ff4d4d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const openModal = (field) => {
    if (isEditing) {
      setActiveField(field);
      setModalVisible(true);
    }
  };

  const selectOption = (value) => {
    if (activeField === 'category') {
      setFormData({ ...formData, categoryId: value });
    } else if (activeField === 'isAvailable') {
      setFormData({ ...formData, isAvailable: value });
    } else if (activeField === 'hasDimension') {
      setFormData({ ...formData, hasDimension: value });
    }
    setModalVisible(false);
    setActiveField(null);
  };

  const getModalOptions = () => {
    if (activeField === 'category') {
      return subCategories.map(sub => ({ label: sub.name, value: sub.id }));
    } else if (activeField === 'isAvailable' || activeField === 'hasDimension') {
      return [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ];
    }
    return [];
  };

  const getDisplayValue = (field) => {
    if (field === 'category') {
      const selectedCategory = subCategories.find(sub => sub.id === formData.categoryId);
      return selectedCategory ? selectedCategory.name : 'Select Category';
    } else if (field === 'isAvailable') {
      return formData.isAvailable || 'Select Availability';
    } else if (field === 'hasDimension') {
      return formData.hasDimension || 'Select Dimension Option';
    }
    return 'Select';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isNewProduct ? 'Add New Product' : formData.name}
          </Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <Text style={styles.label}>Main Category</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.mainCategory}
              editable={false}
            />
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={[styles.pickerButton, !isEditing && styles.disabledPicker]}
              onPress={() => openModal('category')}
              disabled={!isEditing}
            >
              <Text style={[styles.pickerText, !isEditing && styles.disabledPickerText]}>
                {getDisplayValue('category')}
              </Text>
              <Feather name="chevron-down" size={20} color={isEditing ? '#333' : '#666'} />
            </TouchableOpacity>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter product name"
              editable={isEditing}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter product description"
              multiline
              numberOfLines={4}
              editable={isEditing}
            />
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.brand}
              onChangeText={(text) => setFormData({ ...formData, brand: text })}
              placeholder="Enter brand name"
              editable={isEditing}
            />
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.unit}
              onChangeText={(text) => setFormData({ ...formData, unit: text })}
              placeholder="e.g., kg, liters"
              editable={isEditing}
            />

            <Text style={styles.sectionTitle}>Pricing & Inventory</Text>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Enter price"
              keyboardType="numeric"
              editable={isEditing}
            />
            <Text style={styles.label}>Discount (%)</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.discount}
              onChangeText={(text) => setFormData({ ...formData, discount: text })}
              placeholder="Enter discount percentage"
              keyboardType="numeric"
              editable={isEditing}
            />
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              placeholder="Enter stock quantity"
              keyboardType="numeric"
              editable={isEditing}
            />
            <Text style={styles.label}>Is Available</Text>
            <TouchableOpacity
              style={[styles.pickerButton, !isEditing && styles.disabledPicker]}
              onPress={() => openModal('isAvailable')}
              disabled={!isEditing}
            >
              <Text style={[styles.pickerText, !isEditing && styles.disabledPickerText]}>
                {getDisplayValue('isAvailable')}
              </Text>
              <Feather name="chevron-down" size={20} color={isEditing ? '#333' : '#666'} />
            </TouchableOpacity>
            <Text style={styles.label}>Minimum Order Quantity</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.minOrderQty}
              onChangeText={(text) => setFormData({ ...formData, minOrderQty: text })}
              placeholder="Enter minimum order quantity"
              keyboardType="numeric"
              editable={isEditing}
            />
            <Text style={styles.label}>Maximum Order Quantity</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.maxOrderQty}
              onChangeText={(text) => setFormData({ ...formData, maxOrderQty: text })}
              placeholder="Enter maximum order quantity"
              keyboardType="numeric"
              editable={isEditing}
            />

            <Text style={styles.sectionTitle}>Images</Text>
            <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              style={[styles.imagePickerButton, !isEditing && styles.disabledButton]}
              onPress={pickImage}
              disabled={!isEditing || formData.images.length >= 5}
            >
              <Text style={styles.imagePickerText}>
                {formData.images.length >= 5 ? 'Max Images Reached' : 'Add Image'}
              </Text>
            </TouchableOpacity>
            <FlatList
              data={formData.images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              style={styles.imageList}
              ListEmptyComponent={
                <Text style={styles.emptyImagesText}>No images uploaded</Text>
              }
            />
            </View>
            

            <Text style={styles.sectionTitle}>Additional Details</Text>
            <Text style={styles.label}>SKU</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.sku}
              onChangeText={(text) => setFormData({ ...formData, sku: text })}
              placeholder="Enter SKU"
              editable={isEditing}
            />
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              placeholder="e.g., 500g"
              editable={isEditing}
            />
            <Text style={styles.label}>Has Dimensions</Text>
            <TouchableOpacity
              style={[styles.pickerButton, !isEditing && styles.disabledPicker]}
              onPress={() => openModal('hasDimension')}
              disabled={!isEditing}
            >
              <Text style={[styles.pickerText, !isEditing && styles.disabledPickerText]}>
                {getDisplayValue('hasDimension')}
              </Text>
              <Feather name="chevron-down" size={20} color={isEditing ? '#333' : '#666'} />
            </TouchableOpacity>
            {formData.hasDimension === 'Yes' && (
              <>
                <Text style={styles.label}>Length (cm)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={formData.length}
                  onChangeText={(text) => setFormData({ ...formData, length: text })}
                  placeholder="Enter length"
                  keyboardType="numeric"
                  editable={isEditing}
                />
                <Text style={styles.label}>Width (cm)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={formData.width}
                  onChangeText={(text) => setFormData({ ...formData, width: text })}
                  placeholder="Enter width"
                  keyboardType="numeric"
                  editable={isEditing}
                />
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={formData.height}
                  onChangeText={(text) => setFormData({ ...formData, height: text })}
                  placeholder="Enter height"
                  keyboardType="numeric"
                  editable={isEditing}
                />
              </>
            )}
            <Text style={styles.label}>Tag</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.tag}
              onChangeText={(text) => setFormData({ ...formData, tag: text })}
              placeholder="e.g., Best Deals"
              editable={isEditing}
            />
            <Text style={styles.label}>Reviews</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.reviews.length ? `${formData.reviews.length} reviews` : 'No reviews'}
              editable={false}
            />
            <Text style={styles.label}>Created At</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={new Date(formData.createdAt).toLocaleString()}
              editable={false}
            />
            <Text style={styles.label}>Updated At</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={new Date(formData.updatedAt).toLocaleString()}
              editable={false}
            />
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select {activeField === 'category' ? 'Category' : activeField === 'isAvailable' ? 'Availability' : 'Dimension Option'}
              </Text>
              <ScrollView style={styles.modalScroll}>
                {getModalOptions().map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => selectOption(option.value)}
                  >
                    <Text style={styles.modalOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.bottomNav}>
          {!isNewProduct && (
            <>
              <TouchableOpacity
                style={[styles.navButton, isEditing && styles.updateButton]}
                onPress={() => setIsEditing(true)}
                disabled={isEditing}
              >
                <Text style={styles.navButtonText}>
                  {isEditing ? 'Update' : 'Edit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.navButtonText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={[styles.navButton, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.navButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
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
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#666',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  disabledPicker: {
    backgroundColor: '#e0e0e0',
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
  },
  disabledPickerText: {
    color: '#666',
  },
  imagePickerContainer:{
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageList: {
    marginBottom: 20,
  },
  imageContainer: {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  thumbnailImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imageActionButtonContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    height: 30
  },
  imageActionButton: {
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 5,
    //marginRight: 'auto'
  },
  imageActionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center'
  },
  removeImageButtonContainer:{
    //marginLeft: 'auto'
  },
  removeImageButton:{
    //marginLeft: 'auto'
  },
  emptyImagesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    paddingBottom: 30
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#4b4c48',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  modalScroll: {
    maxHeight: '80%',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancelButton: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 20,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default AdminItemDetail;