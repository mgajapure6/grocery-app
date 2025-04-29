import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

// Mock Data
const CATEGORIES = [
  { id: 'cat1', name: 'Electronics', parentId: null },
  { id: 'cat2', name: 'Phones', parentId: 'cat1' },
  { id: 'cat3', name: 'Clothing', parentId: null },
  { id: 'cat4', name: 'Shirts', parentId: 'cat3' },
];
const BRANDS = ['Apple', 'Samsung', 'Nike', 'Adidas'];
const TAGS = ['New', 'Featured', 'Sale'];
const INITIAL_PRODUCTS = [
  {
    id: 'PROD001',
    name: 'Smartphone X',
    sku: 'SMX123',
    price: 699.99,
    salePrice: 649.99,
    saleStart: null,
    saleEnd: null,
    stock: 10,
    lowStockThreshold: 5,
    allowBackorders: 'no',
    status: 'Published',
    categories: ['cat1', 'cat2'],
    brand: 'Apple',
    tags: ['New', 'Featured'],
    image: 'https://via.placeholder.com/100',
    weight: 0.5,
    dimensions: { length: 15, width: 7, height: 0.8 },
    shortDescription: 'Latest smartphone with advanced features.',
    longDescription: 'A high-performance smartphone with a sleek design.',
    attributes: [
      { name: 'Color', values: ['Black', 'Silver'] },
      { name: 'Storage', values: ['128GB', '256GB'] },
    ],
    variations: [
      { id: 'VAR001', sku: 'SMX123-B128', attributes: { Color: 'Black', Storage: '128GB' }, price: 699.99, stock: 5, image: 'https://via.placeholder.com/100' },
      { id: 'VAR002', sku: 'SMX123-S256', attributes: { Color: 'Silver', Storage: '256GB' }, price: 799.99, stock: 5, image: 'https://via.placeholder.com/100' },
    ],
    seo: { title: 'Smartphone X', description: 'Buy Smartphone X', slug: 'smartphone-x' },
    reviews: [{ id: 'REV001', rating: 4, comment: 'Great phone!' }],
    history: [{ action: 'Created', timestamp: '2023-10-01T10:00:00Z', by: 'Admin' }],
  },
  {
    id: 'PROD002',
    name: 'T-Shirt',
    sku: 'TSH456',
    price: 29.99,
    salePrice: null,
    saleStart: null,
    saleEnd: null,
    stock: 2,
    lowStockThreshold: 5,
    allowBackorders: 'notify',
    status: 'Draft',
    categories: ['cat3', 'cat4'],
    brand: 'Nike',
    tags: ['Sale'],
    image: 'https://via.placeholder.com/100',
    weight: 0.2,
    dimensions: { length: 70, width: 50, height: 0.5 },
    shortDescription: 'Comfortable cotton t-shirt.',
    longDescription: 'A stylish t-shirt for everyday wear.',
    attributes: [],
    variations: [],
    seo: { title: 'T-Shirt', description: 'Buy T-Shirt', slug: 't-shirt' },
    reviews: [],
    history: [{ action: 'Created', timestamp: '2023-10-02T12:00:00Z', by: 'Admin' }],
  },
];

const AdminProductList = ({ navigation, route }) => {
  const { mainCategory, subCategoryId } = route.params;
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(subCategoryId);

  // Get subcategories and items
  const subCategories = mainCategory.subcategories || [];
  const selectedSubCategory = subCategories.find(sub => sub.id === selectedSubCategoryId);
  const items = selectedSubCategory ? selectedSubCategory.items : [];

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: [],
    stockStatus: [],
    status: [],
    priceRange: [0, 1000],
    brand: [],
    tags: [],
    onSale: false,
  });
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isInventoryView, setIsInventoryView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSaleDatePicker, setShowSaleDatePicker] = useState(false);
  const [isSettingSaleStart, setIsSettingSaleStart] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Preload images
    Image.prefetch(
      Object.values(subCategories).map((category) => category.image)
    );
  }, []);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    salePrice: '',
    saleStart: null,
    saleEnd: null,
    stock: '',
    lowStockThreshold: '5',
    allowBackorders: 'no',
    status: 'Draft',
    categories: [],
    brand: '',
    tags: [],
    image: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shortDescription: '',
    longDescription: '',
    attributes: [],
    variations: [],
    seo: { title: '', description: '', slug: '' },
  });

  // Filtered and Sorted Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.sku.toLowerCase().includes(lowerQuery) ||
          product.shortDescription.toLowerCase().includes(lowerQuery)
      );
    }

    // Filters
    if (filters.category.length > 0) {
      result = result.filter(product =>
        filters.category.some(cat => product.categories.includes(cat))
      );
    }
    if (filters.stockStatus.length > 0) {
      result = result.filter(product => {
        if (filters.stockStatus.includes('In Stock') && product.stock > product.lowStockThreshold) return true;
        if (filters.stockStatus.includes('Low Stock') && product.stock > 0 && product.stock <= product.lowStockThreshold) return true;
        if (filters.stockStatus.includes('Out of Stock') && product.stock === 0) return true;
        return false;
      });
    }
    if (filters.status.length > 0) {
      result = result.filter(product => filters.status.includes(product.status));
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter(product => {
        const price = product.salePrice || product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    if (filters.brand.length > 0) {
      result = result.filter(product => filters.brand.includes(product.brand));
    }
    if (filters.tags.length > 0) {
      result = result.filter(product => filters.tags.some(tag => product.tags.includes(tag)));
    }
    if (filters.onSale) {
      result = result.filter(product => product.salePrice && product.salePrice < product.price);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'sku': return a.sku.localeCompare(b.sku);
        case 'price_asc': return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price_desc': return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'stock_asc': return a.stock - b.stock;
        case 'stock_desc': return b.stock - a.stock;
        case 'date_asc': return new Date(a.history[0].timestamp) - new Date(b.history[0].timestamp);
        case 'date_desc': return new Date(b.history[0].timestamp) - new Date(a.history[0].timestamp);
        default: return 0;
      }
    });

    return result;
  }, [products, searchQuery, filters, sortBy]);

  // Low Stock Alerts
  const lowStockProducts = useMemo(() => {
    return products.filter(product => product.stock > 0 && product.stock <= product.lowStockThreshold);
  }, [products]);

  // Handlers
  const toggleViewMode = () => setViewMode(viewMode === 'list' ? 'grid' : 'list');

  const handleSelectProduct = (id) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredAndSortedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredAndSortedProducts.map(p => p.id));
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        saleStart: product.saleStart ? new Date(product.saleStart) : null,
        saleEnd: product.saleEnd ? new Date(product.saleEnd) : null,
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        allowBackorders: product.allowBackorders,
        status: product.status,
        categories: product.categories,
        brand: product.brand,
        tags: product.tags,
        image: product.image,
        weight: product.weight.toString(),
        dimensions: {
          length: product.dimensions.length.toString(),
          width: product.dimensions.width.toString(),
          height: product.dimensions.height.toString(),
        },
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        attributes: product.attributes,
        variations: product.variations,
        seo: { ...product.seo },
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        sku: '',
        price: '',
        salePrice: '',
        saleStart: null,
        saleEnd: null,
        stock: '',
        lowStockThreshold: '5',
        allowBackorders: 'no',
        status: 'Draft',
        categories: [],
        brand: '',
        tags: [],
        image: '',
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        shortDescription: '',
        longDescription: '',
        attributes: [],
        variations: [],
        seo: { title: '', description: '', slug: '' },
      });
    }
    setIsProductModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.sku || !productForm.price) {
      Toast.show({ type: 'error', text1: 'Name, SKU, and Price are required.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newProduct = {
        ...productForm,
        id: editingProduct ? editingProduct.id : `PROD${Math.random().toString(36).substr(2, 9)}`,
        price: parseFloat(productForm.price) || 0,
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        stock: parseInt(productForm.stock) || 0,
        lowStockThreshold: parseInt(productForm.lowStockThreshold) || 5,
        weight: parseFloat(productForm.weight) || 0,
        dimensions: {
          length: parseFloat(productForm.dimensions.length) || 0,
          width: parseFloat(productForm.dimensions.width) || 0,
          height: parseFloat(productForm.dimensions.height) || 0,
        },
        history: editingProduct
          ? [...editingProduct.history, { action: 'Updated', timestamp: new Date().toISOString(), by: 'Admin' }]
          : [{ action: 'Created', timestamp: new Date().toISOString(), by: 'Admin' }],
      };
      setProducts(prev =>
        editingProduct
          ? prev.map(p => (p.id === editingProduct.id ? newProduct : p))
          : [...prev, newProduct]
      );
      setIsProductModalVisible(false);
      setLoading(false);
      Toast.show({ type: 'success', text1: editingProduct ? 'Product updated' : 'Product added' });
    }, 1000);
  };

  const handleToggleStatus = (product) => {
    Alert.alert(
      'Confirm Status Change',
      `Set ${product.name} to ${product.status === 'Published' ? 'Draft' : 'Published'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setProducts(prev =>
              prev.map(p =>
                p.id === product.id
                  ? {
                    ...p,
                    status: p.status === 'Published' ? 'Draft' : 'Published',
                    history: [...p.history, { action: 'Status Changed', timestamp: new Date().toISOString(), by: 'Admin' }],
                  }
                  : p
              )
            );
            Toast.show({ type: 'success', text1: `Status updated for ${product.name}` });
          },
        },
      ]
    );
  };

  const handleBulkEdit = () => {
    if (selectedProductIds.length === 0) {
      Toast.show({ type: 'error', text1: 'No products selected' });
      return;
    }
    Alert.alert(
      'Bulk Edit',
      'Select action to apply to selected products',
      [
        {
          text: 'Set Status',
          onPress: () =>
            Alert.alert('Set Status', 'Choose status', [
              { text: 'Published', onPress: () => applyBulkEdit('status', 'Published') },
              { text: 'Draft', onPress: () => applyBulkEdit('status', 'Draft') },
              { text: 'Cancel', style: 'cancel' },
            ]),
        },
        {
          text: 'Adjust Price',
          onPress: () =>
            Alert.prompt(
              'Adjust Price',
              'Enter percentage change (e.g., 10 for +10%, -10 for -10%)',
              (value) => {
                const percentage = parseFloat(value);
                if (!isNaN(percentage)) {
                  applyBulkEdit('price', percentage);
                } else {
                  Toast.show({ type: 'error', text1: 'Invalid percentage' });
                }
              }
            ),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const applyBulkEdit = (field, value) => {
    setProducts(prev =>
      prev.map(p =>
        selectedProductIds.includes(p.id)
          ? {
            ...p,
            [field]: field === 'price' ? p.price * (1 + value / 100) : value,
            history: [...p.history, { action: `Bulk ${field} Update`, timestamp: new Date().toISOString(), by: 'Admin' }],
          }
          : p
      )
    );
    setSelectedProductIds([]);
    Toast.show({ type: 'success', text1: `Bulk edit applied to ${selectedProductIds.length} products` });
  };

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        // Mock CSV parsing
        const newProducts = content.split('\n').slice(1).map((row, i) => ({
          id: `PROD${i + 1000}`,
          name: row.split(',')[0] || 'Imported Product',
          sku: row.split(',')[1] || `SKU${i + 1000}`,
          price: parseFloat(row.split(',')[2]) || 0,
          stock: parseInt(row.split(',')[3]) || 0,
          lowStockThreshold: 5,
          allowBackorders: 'no',
          status: 'Draft',
          categories: [],
          brand: '',
          tags: [],
          image: 'https://via.placeholder.com/100',
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          shortDescription: '',
          longDescription: '',
          attributes: [],
          variations: [],
          seo: { title: '', description: '', slug: '' },
          history: [{ action: 'Imported', timestamp: new Date().toISOString(), by: 'Admin' }],
        }));
        setProducts(prev => [...prev, ...newProducts]);
        Toast.show({ type: 'success', text1: `${newProducts.length} products imported` });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to import CSV' });
    }
  };

  const handleExportCSV = () => {
    const csv = ['Name,SKU,Price,Stock', ...filteredAndSortedProducts.map(p => `${p.name},${p.sku},${p.price},${p.stock}`)].join('\n');
    // Mock export (in production, save to file)
    console.log('Exported CSV:', csv);
    Toast.show({ type: 'success', text1: 'Products exported as CSV' });
  };

  // Render Functions
  const renderProductItem = ({ item }) => {
    const isSelected = selectedProductIds.includes(item.id);
    const stockStatus =
      item.stock === 0 ? 'bg-red-600' :
        item.stock <= item.lowStockThreshold ? 'bg-yellow-600' :
          'bg-green-600';
    return viewMode === 'list' ? (
      <View className={`flex-row items-center border-b border-gray-200 py-3 px-4 bg-white ${isSelected ? 'bg-blue-100' : ''}`}>
        <TouchableOpacity onPress={() => handleSelectProduct(item.id)} className="p-2">
          <Feather name={isSelected ? 'check-square' : 'square'} size={20} color={isSelected ? '#2563eb' : '#6b7280'} />
        </TouchableOpacity>
        <Image source={{ uri: item.image }} className="w-12 h-12 rounded mr-3" contentFit="cover" />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
          <Text className="text-xs text-gray-600">
            Categories: {item.categories.map(id => CATEGORIES.find(c => c.id === id)?.name).join(', ')}
          </Text>
        </View>
        <View className="w-1/4 items-center">
          <Text className="text-sm font-bold text-green-700">${(item.salePrice || item.price).toFixed(2)}</Text>
          {item.salePrice && <Text className="text-xs text-red-600 line-through">${item.price.toFixed(2)}</Text>}
        </View>
        <View className="w-1/6 items-center">
          <View className={`rounded-full px-2 py-1 ${stockStatus}`}>
            <Text className="text-xs text-white">{item.stock}</Text>
          </View>
        </View>
        <View className="w-1/6 items-center">
          <Text className={`text-xs ${item.status === 'Published' ? 'text-green-600' : 'text-gray-600'}`}>
            {item.status}
          </Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity onPress={() => openProductModal(item)} className="p-2">
            <Feather name="edit" size={18} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleToggleStatus(item)} className="p-2">
            <Feather name={item.status === 'Published' ? 'eye-off' : 'eye'} size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View className={`w-1/2 p-2 ${isSelected ? 'bg-blue-100' : 'bg-white'} rounded-lg m-1 shadow-sm`}>
        <TouchableOpacity onPress={() => handleSelectProduct(item.id)} className="absolute top-2 left-2 z-10">
          <Feather name={isSelected ? 'check-square' : 'square'} size={20} color={isSelected ? '#2563eb' : '#6b7280'} />
        </TouchableOpacity>
        <Image source={{ uri: item.image }} className="w-full h-32 rounded-t-lg" contentFit="cover" />
        <View className="p-2">
          <Text className="text-sm font-semibold text-gray-800 truncate">{item.name}</Text>
          <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
          <Text className="text-sm font-bold text-green-700">${(item.salePrice || item.price).toFixed(2)}</Text>
          <View className={`rounded-full px-2 py-1 ${stockStatus} w-12 mt-1`}>
            <Text className="text-xs text-white text-center">{item.stock}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <TouchableOpacity onPress={() => openProductModal(item)}>
              <Feather name="edit" size={18} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleToggleStatus(item)}>
              <Feather name={item.status === 'Published' ? 'eye-off' : 'eye'} size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderInventoryItem = ({ item }) => (
    <View className="flex-row items-center border-b border-gray-200 py-3 px-4 bg-white">
      <Image source={{ uri: item.image }} className="w-12 h-12 rounded mr-3" contentFit="cover" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
      </View>
      <TextInput
        className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-800"
        value={item.stock.toString()}
        keyboardType="numeric"
        onChangeText={(value) => {
          setProducts(prev =>
            prev.map(p =>
              p.id === item.id
                ? { ...p, stock: parseInt(value) || 0, history: [...p.history, { action: 'Stock Updated', timestamp: new Date().toISOString(), by: 'Admin' }] }
                : p
            )
          );
        }}
        accessibilityLabel={`Stock for ${item.name}`}
      />
    </View>
  );

  const renderFilterModal = () => (
    <Modal animationType="slide" transparent={false} visible={isFilterModalVisible}>
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">Filter Products</Text>
          <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
            <Feather name="x" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <ScrollView className="p-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">Categories</Text>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              className={`flex-row items-center p-2 ${filters.category.includes(cat.id) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  category: prev.category.includes(cat.id)
                    ? prev.category.filter(c => c !== cat.id)
                    : [...prev.category, cat.id],
                }))
              }
            >
              <Feather name={filters.category.includes(cat.id) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{cat.name}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">Stock Status</Text>
          {['In Stock', 'Low Stock', 'Out of Stock'].map(status => (
            <TouchableOpacity
              key={status}
              className={`flex-row items-center p-2 ${filters.stockStatus.includes(status) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  stockStatus: prev.stockStatus.includes(status)
                    ? prev.stockStatus.filter(s => s !== status)
                    : [...prev.stockStatus, status],
                }))
              }
            >
              <Feather name={filters.stockStatus.includes(status) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{status}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">Status</Text>
          {['Published', 'Draft'].map(status => (
            <TouchableOpacity
              key={status}
              className={`flex-row items-center p-2 ${filters.status.includes(status) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  status: prev.status.includes(status)
                    ? prev.status.filter(s => s !== status)
                    : [...prev.status, status],
                }))
              }
            >
              <Feather name={filters.status.includes(status) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{status}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">Price Range</Text>
          <View className="flex-row justify-between">
            <TextInput
              className="flex-1 border border-gray-300 rounded px-2 py-1 mr-2"
              value={filters.priceRange[0].toString()}
              keyboardType="numeric"
              onChangeText={value =>
                setFilters(prev => ({ ...prev, priceRange: [parseFloat(value) || 0, prev.priceRange[1]] }))
              }
              placeholder="Min"
              accessibilityLabel="Minimum price"
            />
            <TextInput
              className="flex-1 border border-gray-300 rounded px-2 py-1 ml-2"
              value={filters.priceRange[1].toString()}
              keyboardType="numeric"
              onChangeText={value =>
                setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseFloat(value) || 1000] }))
              }
              placeholder="Max"
              accessibilityLabel="Maximum price"
            />
          </View>
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">Brands</Text>
          {BRANDS.map(brand => (
            <TouchableOpacity
              key={brand}
              className={`flex-row items-center p-2 ${filters.brand.includes(brand) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  brand: prev.brand.includes(brand)
                    ? prev.brand.filter(b => b !== brand)
                    : [...prev.brand, brand],
                }))
              }
            >
              <Feather name={filters.brand.includes(brand) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{brand}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">Tags</Text>
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              className={`flex-row items-center p-2 ${filters.tags.includes(tag) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  tags: prev.tags.includes(tag)
                    ? prev.tags.filter(t => t !== tag)
                    : [...prev.tags, tag],
                }))
              }
            >
              <Feather name={filters.tags.includes(tag) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{tag}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-base font-semibold text-gray-800 mt-4 mb-2">On Sale</Text>
          <TouchableOpacity
            className={`flex-row items-center p-2 ${filters.onSale ? 'bg-blue-100' : ''}`}
            onPress={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
          >
            <Feather name={filters.onSale ? 'check-square' : 'square'} size={20} color="#2563eb" />
            <Text className="ml-2 text-gray-800">Show only products on sale</Text>
          </TouchableOpacity>
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="flex-1 bg-gray-400 rounded-lg p-3 mr-2 items-center"
              onPress={() =>
                setFilters({
                  category: [],
                  stockStatus: [],
                  status: [],
                  priceRange: [0, 1000],
                  brand: [],
                  tags: [],
                  onSale: false,
                })
              }
            >
              <Text className="text-white font-semibold">Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-blue-600 rounded-lg p-3 ml-2 items-center"
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal animationType="fade" transparent={true} visible={isSortModalVisible}>
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50 justify-center items-center"
        activeOpacity={1}
        onPress={() => setIsSortModalVisible(false)}
      >
        <View className="bg-white rounded-lg p-4 w-64" onStartShouldSetResponder={() => true}>
          <Text className="text-lg font-bold text-gray-800 mb-4">Sort By</Text>
          {[
            { label: 'Name (A-Z)', value: 'name_asc' },
            { label: 'Name (Z-A)', value: 'name_desc' },
            { label: 'SKU', value: 'sku' },
            { label: 'Price (Low to High)', value: 'price_asc' },
            { label: 'Price (High to Low)', value: 'price_desc' },
            { label: 'Stock (Low to High)', value: 'stock_asc' },
            { label: 'Stock (High to Low)', value: 'stock_desc' },
            { label: 'Date Created (Newest)', value: 'date_desc' },
            { label: 'Date Created (Oldest)', value: 'date_asc' },
          ].map(option => (
            <TouchableOpacity
              key={option.value}
              className="py-2 border-b border-gray-200"
              onPress={() => {
                setSortBy(option.value);
                setIsSortModalVisible(false);
              }}
            >
              <Text className={`text-base ${sortBy === option.value ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderProductModal = () => (
    <Modal animationType="slide" transparent={false} visible={isProductModalVisible}>
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200 pt-4">
          <Text className="text-lg font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add Product'}</Text>
          <TouchableOpacity onPress={() => setIsProductModalVisible(false)}>
            <Feather name="x" size={24} color="#6b7280" />
          </TouchableOpacity>
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
            placeholder="Short Description"
            multiline
            accessibilityLabel="Short description"
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={productForm.longDescription}
            onChangeText={value => setProductForm(prev => ({ ...prev, longDescription: value }))}
            placeholder="Long Description"
            multiline
            numberOfLines={4}
            accessibilityLabel="Long description"
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
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded-lg p-3 mr-2"
              onPress={() => {
                setIsSettingSaleStart(true);
                setShowSaleDatePicker(true);
              }}
            >
              <Text className="text-gray-800">
                {productForm.saleStart ? productForm.saleStart.toLocaleDateString() : 'Sale Start Date'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded-lg p-3 ml-2"
              onPress={() => {
                setIsSettingSaleStart(false);
                setShowSaleDatePicker(true);
              }}
            >
              <Text className="text-gray-800">
                {productForm.saleEnd ? productForm.saleEnd.toLocaleDateString() : 'Sale End Date'}
              </Text>
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            onPress={() => Alert.alert('Image Upload', 'Image upload not implemented in mock')}
          >
            <Text className="text-gray-800">Upload Image</Text>
          </TouchableOpacity>
          {productForm.image && (
            <Image source={{ uri: productForm.image }} className="w-24 h-24 rounded mb-3" contentFit="cover" />
          )}
          <Text className="text-base font-semibold text-gray-800 mb-2">Organization</Text>
          <Text className="text-sm text-gray-600 mb-2">Categories</Text>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              className={`flex-row items-center p-2 ${productForm.categories.includes(cat.id) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setProductForm(prev => ({
                  ...prev,
                  categories: prev.categories.includes(cat.id)
                    ? prev.categories.filter(c => c !== cat.id)
                    : [...prev.categories, cat.id],
                }))
              }
            >
              <Feather name={productForm.categories.includes(cat.id) ? 'check-square' : 'square'} size={20} color="#2563eb" />
              <Text className="ml-2 text-gray-800">{cat.name}</Text>
            </TouchableOpacity>
          ))}
          <Text className="text-sm text-gray-600 mt-2 mb-2">Brand</Text>
          <View className="flex-row flex-wrap mb-3">
            {BRANDS.map(brand => (
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
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              className={`flex-row items-center p-2 ${productForm.tags.includes(tag) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setProductForm(prev => ({
                  ...prev,
                  tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
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
          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-3 mb-3 items-center"
            onPress={handleSaveProduct}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">{editingProduct ? 'Update Product' : 'Add Product'}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['left', 'right']}>
      <View className='flex-row items-center justify-between bg-white p-4 border-b border-gray-100'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-le
          ft" size={24} color="#333" />
        </TouchableOpacity>
        <View className='flex-1 ml-auto'>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>Products</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>Products</Text>
        </View>
        <View></View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mr-2">
          <Feather name="search" size={20} color="#6b7280" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search products"
          />
        </View>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)} className="p-2 bg-gray-200 rounded-md mr-2">
          <Feather name="filter" size={20} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSortModalVisible(true)} className="p-2 bg-gray-200 rounded-md mr-2">
          <Feather name="sort-desc" size={20} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleViewMode} className="p-2 bg-gray-200 rounded-md">
          <Feather name={viewMode === 'list' ? 'grid' : 'list'} size={20} color="#374151" />
        </TouchableOpacity>
      </View>
      {selectedProductIds.length > 0 && (
        <View className="flex-row items-center justify-between p-3 bg-blue-500">
          <Text className="text-white font-semibold">{selectedProductIds.length} Selected</Text>
          <TouchableOpacity onPress={handleBulkEdit} className="px-3 py-1 bg-blue-700 rounded-md">
            <Text className="text-white text-sm">Bulk Edit</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row items-center justify-between p-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => setIsInventoryView(!isInventoryView)} className="px-3 py-1 bg-blue-600 rounded-md">
          <Text className="text-white text-sm">{isInventoryView ? 'Product View' : 'Inventory View'}</Text>
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity onPress={handleImportCSV} className="px-3 py-1 bg-green-600 rounded-md mr-2">
            <Text className="text-white text-sm">Import CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportCSV} className="px-3 py-1 bg-purple-600 rounded-md mr-2">
            <Text className="text-white text-sm">Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openProductModal()} className="px-3 py-1 bg-blue-600 rounded-md">
            <Text className="text-white text-sm">Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
      {lowStockProducts.length > 0 && (
        <View className="p-3 bg-yellow-100 flex-row items-center">
          <Feather name="alert-triangle" size={20} color="#d97706" style={{ marginRight: 8 }} />
          <Text className="text-yellow-800">
            {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} with low stock
          </Text>
        </View>
      )}
      {isInventoryView ? (
        <FlatList
          data={filteredAndSortedProducts}
          renderItem={renderInventoryItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No products found</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <FlatList
          data={filteredAndSortedProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No products found</Text>}
          key={viewMode}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {renderFilterModal()}
      {renderSortModal()}
      {renderProductModal()}
      <Toast />
    </SafeAreaView>
  );
};

export default AdminProductList;