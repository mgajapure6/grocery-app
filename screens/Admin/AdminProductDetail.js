import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AdminProductDetail = ({ navigation, route }) => {
  const { mainCategory, subCategoryId, product } = route.params;
  const selectedSubCategory = mainCategory.subcategories.find(sub => sub.id === subCategoryId);
  const products = selectedSubCategory ? selectedSubCategory.items : [];

  // Log product for debugging
  useEffect(() => {
    if (product) {
      console.log('Product data:', JSON.stringify(product, null, 2));
    }
  }, [product]);

  const [productForm, setProductForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price != null ? product.price.toString() : '',
    salePrice: product?.discount ? (product.price * (1 - product.discount / 100)).toString() : '',
    saleStart: null,
    saleEnd: null,
    stock: product?.stock != null ? product.stock.toString() : '',
    lowStockThreshold: product?.lowStockThreshold != null ? product.lowStockThreshold.toString() : '5',
    allowBackorders: product?.allowBackorders || 'no',
    status: product?.isAvailable ? 'Published' : 'Draft',
    categories: [subCategoryId],
    brand: product?.brand || '',
    tags: product?.tag ? [product.tag] : [],
    images: product?.images || product?.image ? [product?.image] : [],
    mainImage: product?.image || '',
    weight: product?.weight != null ? product.weight.toString() : '',
    dimensions: {
      length: product?.dimensions?.length != null ? product.dimensions.length.toString() : '',
      width: product?.dimensions?.width != null ? product.dimensions.width.toString() : '',
      height: product?.dimensions?.height != null ? product.dimensions.height.toString() : '',
    },
    shortDescription: product?.description || '',
    longDescription: product?.description || '',
    attributes: product?.attributes || [], // [{ name: string, values: string[] }]
    variations: product?.variations || [],
    seo: {
      title: product?.name || '',
      description: product?.description || '',
      slug: product?.name ? product.name.toLowerCase().replace(/\s+/g, '-') : '',
    },
  });

  const [showSaleDatePicker, setShowSaleDatePicker] = useState(false);
  const [isSettingSaleStart, setIsSettingSaleStart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      }
    })();
  }, []);

  const pickImage = async () => {
    if (productForm.images.length >= 5) {
      Toast.show({ type: 'error', text1: 'Maximum 5 images allowed.' });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = result.assets[0].uri;
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, newImage],
        mainImage: prev.mainImage || newImage, // Set as main if first image
      }));
    }
  };

  const setMainImage = (imageUri) => {
    setProductForm(prev => ({ ...prev, mainImage: imageUri }));
  };

  const removeImage = (imageUri) => {
    setProductForm(prev => {
      const updatedImages = prev.images.filter(uri => uri !== imageUri);
      const updatedMainImage = prev.mainImage === imageUri ? (updatedImages[0] || '') : prev.mainImage;
      return { ...prev, images: updatedImages, mainImage: updatedMainImage };
    });
  };

  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) {
      Toast.show({ type: 'error', text1: 'Attribute name and value are required.' });
      return;
    }

    setProductForm(prev => {
      const existingAttribute = prev.attributes.find(attr => attr.name.toLowerCase() === newAttribute.name.toLowerCase());
      if (existingAttribute) {
        return {
          ...prev,
          attributes: prev.attributes.map(attr =>
            attr.name.toLowerCase() === newAttribute.name.toLowerCase()
              ? { ...attr, values: [...attr.values, newAttribute.value] }
              : attr
          ),
        };
      }
      return {
        ...prev,
        attributes: [...prev.attributes, { name: newAttribute.name, values: [newAttribute.value] }],
      };
    });
    setNewAttribute({ name: '', value: '' });
  };

  const removeAttributeValue = (attrName, value) => {
    setProductForm(prev => {
      const updatedAttributes = prev.attributes
        .map(attr =>
          attr.name === attrName
            ? { ...attr, values: attr.values.filter(val => val !== value) }
            : attr
        )
        .filter(attr => attr.values.length > 0);
      return { ...prev, attributes: updatedAttributes };
    });
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.sku || !productForm.price) {
      Toast.show({ type: 'error', text1: 'Name, SKU, and Price are required.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newProduct = {
        id: product ? product.id : `item-${Math.random().toString(36).substr(2, 9)}`,
        name: productForm.name,
        sku: productForm.sku,
        price: parseFloat(productForm.price) || 0,
        discount: productForm.salePrice ? Math.round((1 - parseFloat(productForm.salePrice) / parseFloat(productForm.price)) * 100) : 0,
        stock: parseInt(productForm.stock) || 0,
        lowStockThreshold: parseInt(productForm.lowStockThreshold) || 5,
        isAvailable: productForm.status === 'Published',
        category: selectedSubCategory.name,
        brand: productForm.brand,
        tag: productForm.tags[0] || 'default',
        image: productForm.mainImage || productForm.images[0] || require('../../assets/categories/image-placeholder.png'),
        images: productForm.images.length > 0 ? productForm.images : [require('../../assets/categories/image-placeholder.png')],
        weight: parseFloat(productForm.weight) || 0,
        hadDimension: true,
        dimensions: {
          length: parseFloat(productForm.dimensions.length) || 0,
          width: parseFloat(productForm.dimensions.width) || 0,
          height: parseFloat(productForm.dimensions.height) || 0,
        },
        description: productForm.shortDescription,
        image_url: productForm.images.length > 0 ? productForm.images : [require('../../assets/categories/image-placeholder.png')],
        reviews: product ? product.reviews : [],
        minOrderQty: 1,
        maxOrderQty: 50,
        barcode: productForm.sku,
        other: { key: 'default', value: 'none' },
        attributes: productForm.attributes,
        createdAt: product ? product.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update mainCategory.subcategories
      const updatedSubCategories = mainCategory.subcategories.map(sub => {
        if (sub.id === subCategoryId) {
          return {
            ...sub,
            items: product
              ? sub.items.map(item => (item.id === product.id ? newProduct : item))
              : [...sub.items, newProduct],
          };
        }
        return sub;
      });

      // Update mainCategory with new subcategories
      const updatedMainCategory = { ...mainCategory, subcategories: updatedSubCategories };

      // Navigate back with updated mainCategory
      navigation.navigate('AdminProductList', {
        mainCategory: updatedMainCategory,
        subCategoryId,
      });

      setLoading(false);
      Toast.show({ type: 'success', text1: product ? 'Product updated' : 'Product added' });
    }, 1000);
  };

  const renderImageItem = ({ item }) => (
    <View className="relative m-1">
      <Image
        source={typeof item === 'string' ? { uri: item } : item}
        contentFit="cover"
        style={{width: 100, height: 100}}
      />
      <TouchableOpacity
        className="absolute top-1 right-1 bg-red-600 rounded-full p-1"
        onPress={() => removeImage(item)}
      >
        <Feather name="x" size={12} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute bottom-1 right-1 bg-blue-100 rounded-full p-1"
        onPress={() => setMainImage(item)}
      >
        <Feather name={productForm.mainImage === item ? 'star' : 'star'} size={12} color={productForm.mainImage === item ? 'black' : '#fff'} />
      </TouchableOpacity>
      {productForm.mainImage === item && (
        <Text className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded">Main</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['left', 'right']}>
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">{product ? 'Edit Product' : 'Add Product'}</Text>
        <View />
      </View>
      <ScrollView className="p-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">Basic Information</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.name}
          onChangeText={value => setProductForm(prev => ({ ...prev, name: value }))}
          placeholder="Product Name"
          accessibilityLabel="Product name"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.shortDescription}
          onChangeText={value => setProductForm(prev => ({ ...prev, shortDescription: value }))}
          placeholder="Description"
          multiline
          accessibilityLabel="Description"
        />
        <Text className="text-base font-semibold text-gray-800 mb-2">Identifiers</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.sku}
          onChangeText={value => setProductForm(prev => ({ ...prev, sku: value }))}
          placeholder="SKU"
          accessibilityLabel="SKU"
        />
        <Text className="text-base font-semibold text-gray-800 mb-2">Pricing</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.price}
          onChangeText={value => setProductForm(prev => ({ ...prev, price: value }))}
          placeholder="Regular Price"
          keyboardType="numeric"
          accessibilityLabel="Regular price"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.salePrice}
          onChangeText={value => setProductForm(prev => ({ ...prev, salePrice: value }))}
          placeholder="Sale Price"
          keyboardType="numeric"
          accessibilityLabel="Sale price"
        />
        <Text className="text-base font-semibold text-gray-800 mb-2">Inventory</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.stock}
          onChangeText={value => setProductForm(prev => ({ ...prev, stock: value }))}
          placeholder="Stock Quantity"
          keyboardType="numeric"
          accessibilityLabel="Stock quantity"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.lowStockThreshold}
          onChangeText={value => setProductForm(prev => ({ ...prev, lowStockThreshold: value }))}
          placeholder="Low Stock Threshold"
          keyboardType="numeric"
          accessibilityLabel="Low stock threshold"
        />
        <Text className="text-sm text-gray-600 mb-2">Allow Backorders</Text>
        <View className="flex-row mb-3">
          {['no', 'allow', 'notify'].map(option => (
            <TouchableOpacity
              key={option}
              className={`flex-1 p-2 rounded-lg mr-2 ${productForm.allowBackorders === option ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setProductForm(prev => ({ ...prev, allowBackorders: option }))}
            >
              <Text className={`text-center ${productForm.allowBackorders === option ? 'text-white' : 'text-gray-800'}`}>
                {option === 'no' ? 'No' : option === 'allow' ? 'Allow' : 'Notify'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-base font-semibold text-gray-800 mb-2">Shipping</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.weight}
          onChangeText={value => setProductForm(prev => ({ ...prev, weight: value }))}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          accessibilityLabel="Weight"
        />
        <View className="flex-row mb-3">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 mr-2 bg-white"
            value={productForm.dimensions.length}
            onChangeText={value =>
              setProductForm(prev => ({ ...prev, dimensions: { ...prev.dimensions, length: value } }))
            }
            placeholder="Length (cm)"
            keyboardType="numeric"
            accessibilityLabel="Length"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 mx-2 bg-white"
            value={productForm.dimensions.width}
            onChangeText={value =>
              setProductForm(prev => ({ ...prev, dimensions: { ...prev.dimensions, width: value } }))
            }
            placeholder="Width (cm)"
            keyboardType="numeric"
            accessibilityLabel="Width"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 ml-2 bg-white"
            value={productForm.dimensions.height}
            onChangeText={value =>
              setProductForm(prev => ({ ...prev, dimensions: { ...prev.dimensions, height: value } }))
            }
            placeholder="Height (cm)"
            keyboardType="numeric"
            accessibilityLabel="Height"
          />
        </View>
        <Text className="text-base font-semibold text-gray-800 mb-2">Images</Text>
        <View className="flex-row flex-wrap mb-3">
          <TouchableOpacity
            style={{width: 100, height: 100}}
            className="border border-dashed border-gray-400 m-1 flex items-center justify-center bg-white"
            onPress={pickImage}
          >
            <Feather name="plus" size={24} color="#6b7280" />
            <Text className="text-xs text-gray-600 mt-1">Add Image</Text>
          </TouchableOpacity>
          <FlatList
            data={productForm.images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Text className="text-sm text-gray-600 mb-3">Maximum 5 images. Select a star to set the main image.</Text>
        <Text className="text-base font-semibold text-gray-800 mb-2">Attributes</Text>
        <View className="flex-row mb-3">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 mr-2 bg-white"
            value={newAttribute.name}
            onChangeText={value => setNewAttribute(prev => ({ ...prev, name: value }))}
            placeholder="Attribute Name (e.g., Color)"
            accessibilityLabel="Attribute name"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 mx-2 bg-white"
            value={newAttribute.value}
            onChangeText={value => setNewAttribute(prev => ({ ...prev, value: value }))}
            placeholder="Value (e.g., Red)"
            accessibilityLabel="Attribute value"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-3"
            onPress={addAttribute}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {productForm.attributes.map(attr => (
          <View key={attr.name} className="mb-3">
            <Text className="text-sm font-semibold text-gray-800">{attr.name}</Text>
            <View className="flex-row flex-wrap">
              {attr.values.map(value => (
                <View key={value} className="flex-row items-center bg-gray-200 rounded-lg p-2 m-1">
                  <Text className="text-gray-800">{value}</Text>
                  <TouchableOpacity
                    className="ml-2"
                    onPress={() => removeAttributeValue(attr.name, value)}
                  >
                    <Feather name="x" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
        <Text className="text-base font-semibold text-gray-800 mb-2">Organization</Text>
        <Text className="text-sm text-gray-600 mb-2">Brand</Text>
        <View className="flex-row flex-wrap mb-3">
          {[...new Set(products.map(p => p.brand))].map(brand => (
            <TouchableOpacity
              key={brand}
              className={`p-2 m-1 rounded-lg ${productForm.brand === brand ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setProductForm(prev => ({ ...prev, brand }))}
            >
              <Text className={productForm.brand === brand ? 'text-white' : 'text-gray-800'}>{brand}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-sm text-gray-600 mb-2">Tags</Text>
        {[...new Set(products.map(p => p.tag))].map(tag => (
          <TouchableOpacity
            key={tag}
            className={`flex-row items-center p-2 ${productForm.tags.includes(tag) ? 'bg-blue-100' : ''}`}
            onPress={() =>
              setProductForm(prev => ({
                ...prev,
                tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [tag],
              }))
            }
          >
            <Feather name={productForm.tags.includes(tag) ? 'check-square' : 'square'} size={20} color="#2563eb" />
            <Text className="ml-2 text-gray-800">{tag}</Text>
          </TouchableOpacity>
        ))}
        <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">SEO</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.seo.title}
          onChangeText={value => setProductForm(prev => ({ ...prev, seo: { ...prev.seo, title: value } }))}
          placeholder="SEO Title"
          accessibilityLabel="SEO title"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.seo.description}
          onChangeText={value => setProductForm(prev => ({ ...prev, seo: { ...prev.seo, description: value } }))}
          placeholder="Meta Description"
          multiline
          accessibilityLabel="Meta description"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
          value={productForm.seo.slug}
          onChangeText={value => setProductForm(prev => ({ ...prev, seo: { ...prev.seo, slug: value } }))}
          placeholder="URL Slug"
          accessibilityLabel="URL slug"
        />
        <Text className="text-base font-semibold text-gray-800 mb-2">Status</Text>
        <View className="flex-row mb-3">
          {['Published', 'Draft'].map(status => (
            <TouchableOpacity
              key={status}
              className={`flex-1 p-2 rounded-lg mr-2 ${productForm.status === status ? 'bg-blue-600' : 'bg-gray-200'}`}
              onPress={() => setProductForm(prev => ({ ...prev, status }))}
            >
              <Text className={`text-center ${productForm.status === status ? 'text-white' : 'text-gray-800'}`}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View className="flex-row justify-between pb-6 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="flex-1 bg-gray-400 rounded-lg p-3 mr-2 items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-blue-600 rounded-lg p-3 ml-2 items-center"
          onPress={handleSaveProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">{product ? 'Update Product' : 'Add Product'}</Text>
          )}
        </TouchableOpacity>
      </View>
      {showSaleDatePicker && (
        <DateTimePicker
          value={isSettingSaleStart ? (productForm.saleStart || new Date()) : (productForm.saleEnd || new Date())}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowSaleDatePicker(false);
            if (date) {
              setProductForm(prev => ({
                ...prev,
                [isSettingSaleStart ? 'saleStart' : 'saleEnd']: date,
              }));
            }
          }}
        />
      )}
      <Toast />
    </SafeAreaView>
  );
};

export default AdminProductDetail;