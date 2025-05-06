import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const AdminProductList = ({ navigation, route }) => {
  const { mainCategory, subCategoryId } = route.params;
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(subCategoryId);

  // Get subcategories and items
  const subCategories = mainCategory.subcategories || [];
  const selectedSubCategory = subCategories.find(sub => sub.id === selectedSubCategoryId);
  const products = selectedSubCategory ? selectedSubCategory.items : [];

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
  const [isInventoryView, setIsInventoryView] = useState(false);

  useEffect(() => {
    // Preload images
    Image.prefetch(
      products.map(item => item.image)
    );
  }, [products]);

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
          product.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filters
    if (filters.category.length > 0) {
      result = result.filter(product =>
        filters.category.includes(product.category)
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
      result = result.filter(product => filters.status.includes(product.isAvailable ? 'Published' : 'Draft'));
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter(product => {
        const price = product.discount ? product.price * (1 - product.discount / 100) : product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    if (filters.brand.length > 0) {
      result = result.filter(product => filters.brand.includes(product.brand));
    }
    if (filters.tags.length > 0) {
      result = result.filter(product => filters.tags.includes(product.tag));
    }
    if (filters.onSale) {
      result = result.filter(product => product.discount > 0);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'sku': return a.sku.localeCompare(b.sku);
        case 'price_asc': return (a.discount ? a.price * (1 - a.discount / 100) : a.price) - (b.discount ? b.price * (1 - b.discount / 100) : b.price);
        case 'price_desc': return (b.discount ? b.price * (1 - b.discount / 100) : b.price) - (a.discount ? a.price * (1 - a.discount / 100) : a.price);
        case 'stock_asc': return a.stock - b.stock;
        case 'stock_desc': return b.stock - b.stock;
        case 'date_asc': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date_desc': return new Date(b.createdAt) - new Date(a.createdAt);
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

  const navigateToProductDetail = (product = null) => {
    navigation.navigate('AdminProductDetail', {
      mainCategory,
      subCategoryId: selectedSubCategoryId,
      product,
    });
  };

  const handleToggleStatus = (product) => {
    Alert.alert(
      'Confirm Status Change',
      `Set ${product.name} to ${product.isAvailable ? 'Draft' : 'Published'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const updatedSubCategories = subCategories.map(sub => {
              if (sub.id === selectedSubCategoryId) {
                return {
                  ...sub,
                  items: sub.items.map(item =>
                    item.id === product.id
                      ? {
                          ...item,
                          isAvailable: !item.isAvailable,
                          updatedAt: new Date().toISOString(),
                        }
                      : item
                  ),
                };
              }
              return sub;
            });
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
    const updatedSubCategories = subCategories.map(sub => {
      if (sub.id === selectedSubCategoryId) {
        return {
          ...sub,
          items: sub.items.map(item =>
            selectedProductIds.includes(item.id)
              ? {
                  ...item,
                  [field === 'status' ? 'isAvailable' : 'price']:
                    field === 'status' ? value === 'Published' : item.price * (1 + value / 100),
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        };
      }
      return sub;
    });
    setSelectedProductIds([]);
    Toast.show({ type: 'success', text1: `Bulk edit applied to ${selectedProductIds.length} products` });
  };

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        const newProducts = content.split('\n').slice(1).map((row, i) => ({
          id: `item-${i + 1000}`,
          name: row.split(',')[0] || 'Imported Product',
          sku: row.split(',')[1] || `SKU${i + 1000}`,
          price: parseFloat(row.split(',')[2]) || 0,
          stock: parseInt(row.split(',')[3]) || 0,
          lowStockThreshold: 5,
          isAvailable: false,
          category: selectedSubCategory.name,
          brand: '',
          tag: 'default',
          image: require('../../assets/categories/image-placeholder.png'),
          weight: 0,
          hadDimension: true,
          dimensions: { length: 0, width: 0, height: 0 },
          description: '',
          image_url: [require('../../assets/categories/image-placeholder.png')],
          images: [require('../../assets/categories/image-placeholder.png')],
          reviews: [],
          minOrderQty: 1,
          maxOrderQty: 50,
          barcode: `SKU${i + 1000}`,
          other: { key: 'default', value: 'none' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        const updatedSubCategories = subCategories.map(sub => {
          if (sub.id === selectedSubCategoryId) {
            return { ...sub, items: [...sub.items, ...newProducts] };
          }
          return sub;
        });
        Toast.show({ type: 'success', text1: `${newProducts.length} products imported` });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to import CSV' });
    }
  };

  const handleExportCSV = () => {
    const csv = ['Name,SKU,Price,Stock', ...filteredAndSortedProducts.map(p => `${p.name},${p.sku},${p.price},${p.stock}`)].join('\n');
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
    return (
      <View className={`flex-row items-center border-b border-gray-200 py-3 px-4 bg-white ${isSelected ? 'bg-blue-100' : ''}`}>
        <Image source={item.image} contentFit="cover" style={{ width: 50, height: 50, marginRight: 10 }} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
        </View>
        <View className="w-1/4 items-center">
          <Text className="text-sm font-bold text-green-700">${(item.discount ? item.price * (1 - item.discount / 100) : item.price).toFixed(2)}</Text>
          {item.discount > 0 && <Text className="text-xs text-red-600 line-through">${item.price.toFixed(2)}</Text>}
        </View>
        <View className="w-1/6 items-center">
          <View className={`rounded-full px-2 py-1 ${stockStatus}`}>
            <Text className="text-xs text-white">{item.stock}</Text>
          </View>
        </View>
        <View className="w-1/6 items-center">
          <Text className={`text-xs ${item.isAvailable ? 'text-green-600' : 'text-gray-600'}`}>
            {item.isAvailable ? 'Published' : 'Draft'}
          </Text>
        </View>
        <View className="flex-row">
          <Menu>
            <MenuTrigger>
              <Feather name="more-vertical" size={25} color="#374151" />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 5,
                },
              }}
            >
              <MenuOption
                onSelect={() => navigateToProductDetail(item)}
              >
                <View className="flex-row items-center p-2 border-b border-gray-100">
                  <Feather name="edit" size={16} color="#2563eb" />
                  <Text className="ml-2 text-base text-gray-800">Edit</Text>
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => handleToggleStatus(item)}
              >
                <View className="flex-row items-center p-2 border-b border-gray-100">
                  <Feather name={item.isAvailable ? 'eye-off' : 'eye'} size={18} color="#6b7280" />
                  <Text className="ml-2 text-base text-gray-800">{item.isAvailable ? 'Draft' : 'Publish'}</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  };

  const renderInventoryItem = ({ item }) => (
    <View className="flex-row items-center border-b border-gray-200 py-3 px-4 bg-white">
      <Image source={item.image} className="w-12 h-12 rounded mr-3" contentFit="cover" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-600">SKU: {item.sku}</Text>
      </View>
      <TextInput
        className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-800"
        value={item.stock.toString()}
        keyboardType="numeric"
        onChangeText={(value) => {
          const updatedSubCategories = subCategories.map(sub => {
            if (sub.id === selectedSubCategoryId) {
              return {
                ...sub,
                items: sub.items.map(p =>
                  p.id === item.id
                    ? { ...p, stock: parseInt(value) || 0, updatedAt: new Date().toISOString() }
                    : p
                ),
              };
            }
            return sub;
          });
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
          {subCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              className={`flex-row items-center p-2 ${filters.category.includes(cat.name) ? 'bg-blue-100' : ''}`}
              onPress={() =>
                setFilters(prev => ({
                  ...prev,
                  category: prev.category.includes(cat.name)
                    ? prev.category.filter(c => c !== cat.name)
                    : [...prev.category, cat.name],
                }))
              }
            >
              <Feather name={filters.category.includes(cat.name) ? 'check-square' : 'square'} size={20} color="#2563eb" />
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
          {[...new Set(products.map(p => p.brand))].map(brand => (
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
          {[...new Set(products.map(p => p.tag))].map(tag => (
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['left', 'right']}>
      <View className='flex-row items-center justify-between bg-white p-4 border-b border-gray-100'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='mr-3'>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View className='flex-1 ml-auto items-center'>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>{selectedSubCategory.name}</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>Products ({products.length})</Text>
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
          <Feather name="chevrons-up" size={20} color="#374151" />
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
          <TouchableOpacity onPress={() => navigateToProductDetail()} className="px-3 py-1 bg-blue-600 rounded-md">
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
      <Toast />
    </SafeAreaView>
  );
};

export default AdminProductList;