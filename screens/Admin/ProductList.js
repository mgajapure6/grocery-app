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
import { Picker } from '@react-native-picker/picker';

const ProductList = ({ route, navigation }) => {
  const { mainCategory, subCategoryId, mainCategories, setMainCategories } = route.params;
  const subCategory = mainCategories[mainCategory].find(
    (subCat) => subCat.id === subCategoryId
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: null,
    price: '',
    tag: '',
    description: '',
    unit: '',
    brand: '',
    stock: '',
    isAvailable: 'Yes',
    sku: '',
    weight: '',
    isDimension: 'No',
    length: '',
    width: '',
    height: '',
    barcode: '',
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
    if (!formData.name || !formData.image || !formData.price) {
      Alert.alert('Error', 'Name, image, and price are required.');
      return;
    }

    const newId = `${subCategoryId}-${Date.now()}`;
    const newItem = {
      id: newId,
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      image: formData.image || require('../../assets/img/image-placeholder.png'),
      tag: formData.tag,
      description: formData.description,
      unit: formData.unit,
      brand: formData.brand,
      stock: parseInt(formData.stock) || 0,
      isAvailable: formData.isAvailable === 'Yes',
      sku: formData.sku,
      weight: formData.weight,
      dimensions:
        formData.isDimension === 'Yes'
          ? {
              length: parseFloat(formData.length) || 0,
              width: parseFloat(formData.width) || 0,
              height: parseFloat(formData.height) || 0,
            }
          : null,
      barcode: formData.barcode,
    };

    const updatedCategories = {
      ...mainCategories,
      [mainCategory]: mainCategories[mainCategory].map((subCat) =>
        subCat.id === subCategoryId
          ? { ...subCat, items: [...subCat.items, newItem] }
          : subCat
      ),
    };

    setMainCategories(updatedCategories);
    setModalVisible(false);
    setFormData({
      id: '',
      name: '',
      image: null,
      price: '',
      tag: '',
      description: '',
      unit: '',
      brand: '',
      stock: '',
      isAvailable: 'Yes',
      sku: '',
      weight: '',
      isDimension: 'No',
      length: '',
      width: '',
      height: '',
      barcode: '',
    });
  };

  const handleDelete = (itemId) => {
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
              [mainCategory]: mainCategories[mainCategory].map((subCat) =>
                subCat.id === subCategoryId
                  ? {
                      ...subCat,
                      items: subCat.items.filter((item) => item.id !== itemId),
                    }
                  : subCat
              ),
            };
            setMainCategories(updatedCategories);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.itemTag}>{item.tag || 'No Tag'}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteItemButton}
        onPress={() => handleDelete(item.id)}
      >
        <Feather name="trash-2" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subCategory.name}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <Feather name="plus-circle" size={25} color="#007bff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <FlatList
              data={subCategory.items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyStateText}>No items in this subcategory</Text>
              }
            />
          </View>
        </ScrollView>

        {/* Fullscreen Modal for Adding Item */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContainerFull}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Product</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Feather name="x" size={24} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                  <Text style={styles.inputLabel}>Product Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />

                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter product description"
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    multiline
                    numberOfLines={4}
                  />

                  <Text style={styles.inputLabel}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., kg, liters"
                    value={formData.unit}
                    onChangeText={(text) => setFormData({ ...formData, unit: text })}
                  />

                  <Text style={styles.inputLabel}>Brand</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter brand name"
                    value={formData.brand}
                    onChangeText={(text) => setFormData({ ...formData, brand: text })}
                  />

                  <Text style={styles.inputLabel}>Price *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    keyboardType="numeric"
                  />

                  <Text style={styles.inputLabel}>Stock</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter stock quantity"
                    value={formData.stock}
                    onChangeText={(text) => setFormData({ ...formData, stock: text })}
                    keyboardType="numeric"
                  />

                  <Text style={styles.inputLabel}>Is Available</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.isAvailable}
                      onValueChange={(value) =>
                        setFormData({ ...formData, isAvailable: value })
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Yes" value="Yes" />
                      <Picker.Item label="No" value="No" />
                    </Picker>
                  </View>

                  <Text style={styles.inputLabel}>SKU</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter SKU"
                    value={formData.sku}
                    onChangeText={(text) => setFormData({ ...formData, sku: text })}
                  />

                  <Text style={styles.inputLabel}>Weight</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 500g"
                    value={formData.weight}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  />

                  <Text style={styles.inputLabel}>Has Dimensions</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.isDimension}
                      onValueChange={(value) =>
                        setFormData({ ...formData, isDimension: value })
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="No" value="No" />
                      <Picker.Item label="Yes" value="Yes" />
                    </Picker>
                  </View>

                  {formData.isDimension === 'Yes' && (
                    <>
                      <Text style={styles.inputLabel}>Length (cm)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter length"
                        value={formData.length}
                        onChangeText={(text) => setFormData({ ...formData, length: text })}
                        keyboardType="numeric"
                      />

                      <Text style={styles.inputLabel}>Width (cm)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter width"
                        value={formData.width}
                        onChangeText={(text) => setFormData({ ...formData, width: text })}
                        keyboardType="numeric"
                      />

                      <Text style={styles.inputLabel}>Height (cm)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter height"
                        value={formData.height}
                        onChangeText={(text) => setFormData({ ...formData, height: text })}
                        keyboardType="numeric"
                      />
                    </>
                  )}

                  <Text style={styles.inputLabel}>Barcode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter barcode"
                    value={formData.barcode}
                    onChangeText={(text) => setFormData({ ...formData, barcode: text })}
                  />

                  <Text style={styles.inputLabel}>Tag</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Best Deals"
                    value={formData.tag}
                    onChangeText={(text) => setFormData({ ...formData, tag: text })}
                  />

                  <Text style={styles.inputLabel}>Product Image *</Text>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    <Text style={styles.imagePickerText}>
                      {formData.image ? 'Image Selected' : 'Pick an Image'}
                    </Text>
                  </TouchableOpacity>
                  {formData.image && (
                    <Image source={{ uri: formData.image }} style={styles.previewImage} />
                  )}

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                      <Text style={styles.saveButtonText}>Save Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginHorizontal: 12,
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 12,
    color: '#007bff',
  },
  itemTag: {
    fontSize: 12,
    color: '#666',
  },
  deleteItemButton: {
    padding: 5,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContainerFull: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:40
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 10,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductList;