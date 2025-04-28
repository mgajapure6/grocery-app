import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Platform,
  Alert,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { categories as staticCategoriesData} from '../../data/staticData';

// Custom deep copy function
const deepCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  const copy = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// SubcategoryListItem component
const SubcategoryListItem = React.memo(({ item, mainCategory, onEdit, onViewProducts, onDelete }) => {
  const productCount = item.items ? item.items.length : 0;
  const imageSource = item.image;
  const placeholderSource = { uri: 'https://via.placeholder.com/40' }; // Fallback placeholder

  return (
    <View className="flex-row items-center justify-between bg-white border-b border-gray-200 py-3 px-4">
      <TouchableOpacity
        onPress={() => onViewProducts(mainCategory, item)}
        className="flex-1 flex-row items-center pr-2"
        accessibilityRole="button"
        accessibilityLabel={`View products for ${item.name}`}
      >
        <Image
          source={imageSource}
          className="w-12 h-12 rounded-md mr-4"
          placeholder={placeholderSource}
          contentFit="cover"
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{item.name}</Text>
          <View className="flex-row items-center mt-1">
            <Feather name="box" size={12} color="#6b7280" />
            <Text className="text-xs text-gray-600 ml-2">{productCount} Products</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onEdit(item, mainCategory)}
          className="p-2"
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
        >
          <Feather name="edit" size={18} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item, mainCategory)}
          className="p-2 ml-2"
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.name}`}
        >
          <Feather name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function AdminCategories({ navigation }) {
  const [allCategoriesData, setAllCategoriesData] = useState(deepCopy(staticCategoriesData));
  const [loading, setLoading] = useState(false);
  const [expandedMainCategories, setExpandedMainCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSortingModalVisible, setIsSortingModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [categoryData, setCategoryData] = useState({
    id: '',
    name: '',
    description: '',
    image: null,
    iconName: null,
    key: null,
  });
  const [parentMainCategoryForSub, setParentMainCategoryForSub] = useState(null);

  // Filter and sort main categories
  const filteredAndSortedMainCategories = useMemo(() => {
    let categoriesArray = Object.values(allCategoriesData);

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      categoriesArray = categoriesArray
        .map(mainCat => {
          const matchingSubcategories = mainCat.subcategories.filter(
            subCat =>
              subCat.name.toLowerCase().includes(lowerQuery) ||
              (subCat.description || '').toLowerCase().includes(lowerQuery) ||
              (subCat.items || []).some(item => item.name.toLowerCase().includes(lowerQuery))
          );
          if (mainCat.name.toLowerCase().includes(lowerQuery) || matchingSubcategories.length > 0) {
            return {
              ...mainCat,
              subcategories: mainCat.name.toLowerCase().includes(lowerQuery)
                ? mainCat.subcategories
                : matchingSubcategories,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    categoriesArray.sort((a, b) => {
      const aValue = a.name.toLowerCase();
      const bValue = b.name.toLowerCase();
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return categoriesArray.map(mainCat => {
      const sortedSubcategories = [...mainCat.subcategories].sort((a, b) => {
        const aValue = sortBy === 'productCount' ? (a.items ? a.items.length : 0) : a.name.toLowerCase();
        const bValue = sortBy === 'productCount' ? (b.items ? b.items.length : 0) : b.name.toLowerCase();
        let comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        if (sortBy === 'productCount' && sortOrder === 'desc') comparison *= -1;
        if (sortBy === 'name') comparison = sortOrder === 'asc' ? comparison : -comparison;
        return comparison;
      });
      return { ...mainCat, subcategories: sortedSubcategories };
    });
  }, [allCategoriesData, searchQuery, sortBy, sortOrder]);

  // Preload images (skip for local assets)
  useEffect(() => {
    // No prefetching needed for local assets (require)
  }, [allCategoriesData]);

  // Toggle collapse
  const handleToggleCollapse = (mainCategoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMainCategories(prev => ({
      ...prev,
      [mainCategoryId]: !prev[mainCategoryId],
    }));
  };

  // Open modal
  const openModal = (mode, category = null, parentMainCategory = null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setModalMode(mode);
    setParentMainCategoryForSub(parentMainCategory);

    if (mode.startsWith('add')) {
      setCategoryData({
        id: '',
        name: '',
        description: '',
        image: null,
        iconName: null,
        key: null,
      });
    } else if (mode.startsWith('edit') && category) {
      setCategoryData({
        id: category.id,
        name: category.name,
        description: category.description || '',
        image: category.image || null,
        iconName: category.iconName || null,
        key: category.key || null,
      });
    } else if (mode === 'confirm_delete' && category) {
      setCategoryData({
        id: category.id,
        name: category.name,
        parentMainCategoryName: parentMainCategory?.name,
        isMainCategory: !parentMainCategory,
        productCount: category.items
          ? category.items.length
          : category.subcategories
          ? category.subcategories.reduce((sum, sub) => sum + (sub.items ? sub.items.length : 0), 0)
          : 0,
        subCategoryCount: category.subcategories ? category.subcategories.length : 0,
      });
    }

    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setModalVisible(false);
    setModalMode(null);
    setCategoryData({ id: '', name: '', description: '', image: null, iconName: null, key: null });
    setParentMainCategoryForSub(null);
  };

  // Image picker
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
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

  // Icon picker (placeholder)
  const handleIconPick = () => {
    const dummyIcons = ['folder', 'shopping-bag', 'coffee', 'heart', 'home', 'zap', 'tool', 'watch', 'feather'];
    const randomIcon = dummyIcons[Math.floor(Math.random() * dummyIcons.length)];
    setCategoryData(prev => ({ ...prev, iconName: randomIcon }));
    Alert.alert('Icon Selected', `Selected icon: ${randomIcon}`);
  };

  // Save category
  const handleSave = () => {
    if (!categoryData.name.trim()) {
      Alert.alert('Validation Error', `${modalMode.includes('main') ? 'Main Category' : 'Category'} Name is required.`);
      return;
    }
    if (modalMode.includes('main') && !categoryData.iconName) {
      Alert.alert('Validation Error', 'Main Category Icon is required.');
      return;
    }
    if (modalMode.includes('sub') && !parentMainCategoryForSub) {
      Alert.alert('Error', 'Parent main category is missing for subcategory.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setAllCategoriesData(prevCategories => {
        const newCategories = { ...prevCategories };

        if (modalMode === 'add_main') {
          const newId = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const newKey = newId; // Use ID as key to avoid collisions
          if (newCategories[newKey]) {
            Alert.alert('Error', `Category key "${newKey}" already exists.`);
            setLoading(false);
            return prevCategories;
          }
          newCategories[newKey] = {
            ...categoryData,
            id: newId,
            key: newKey,
            subcategories: [],
          };
          Alert.alert('Success', `${categoryData.name} added.`);
        } else if (modalMode === 'edit_main') {
          const targetMainCategoryKey = Object.keys(newCategories).find(
            key => newCategories[key].id === categoryData.id
          );
          if (!targetMainCategoryKey) {
            Alert.alert('Error', 'Main category not found for editing.');
            setLoading(false);
            return prevCategories;
          }
          newCategories[targetMainCategoryKey] = {
            ...newCategories[targetMainCategoryKey],
            ...categoryData,
          };
          Alert.alert('Success', `${categoryData.name} updated.`);
        } else if (modalMode === 'add_sub') {
          const targetMainCategoryKey = Object.keys(newCategories).find(
            key => newCategories[key].id === parentMainCategoryForSub.id
          );
          if (!targetMainCategoryKey) {
            Alert.alert('Error', 'Parent category not found.');
            setLoading(false);
            return prevCategories;
          }
          const mainCat = newCategories[targetMainCategoryKey];
          const newId = `subcat-${parentMainCategoryForSub.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          mainCat.subcategories = [
            ...mainCat.subcategories,
            { ...categoryData, id: newId, items: [] },
          ];
          Alert.alert('Success', `${categoryData.name} added.`);
        } else if (modalMode === 'edit_sub') {
          const targetMainCategoryKey = Object.keys(newCategories).find(
            key => newCategories[key].id === parentMainCategoryForSub.id
          );
          if (!targetMainCategoryKey) {
            Alert.alert('Error', 'Parent category not found.');
            setLoading(false);
            return prevCategories;
          }
          const mainCat = newCategories[targetMainCategoryKey];
          const subcategories = [...mainCat.subcategories];
          const index = subcategories.findIndex(cat => cat.id === categoryData.id);
          if (index === -1) {
            Alert.alert('Error', 'Category not found for editing.');
            setLoading(false);
            return prevCategories;
          }
          subcategories[index] = { ...subcategories[index], ...categoryData, id: categoryData.id };
          mainCat.subcategories = subcategories;
          Alert.alert('Success', `${categoryData.name} updated.`);
        }

        setLoading(false);
        closeModal();
        return newCategories;
      });
    }, 500);
  };

  // Delete category
  const handleDelete = () => {
    const categoryToDeleteData = categoryData;
    let categoryName = categoryToDeleteData.name || 'this category';
    let type = categoryToDeleteData.isMainCategory ? 'main category' : 'category';
    let dependentItemsMessage = '';

    if (categoryToDeleteData.subCategoryCount > 0) {
      dependentItemsMessage += `\nIt contains ${categoryToDeleteData.subCategoryCount} subcategories.`;
    }
    if (categoryToDeleteData.productCount > 0) {
      dependentItemsMessage += `\nIt contains ${categoryToDeleteData.productCount} product(s).`;
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the ${type} "${categoryName}"? This cannot be undone.${dependentItemsMessage}\n\nIn a real app, products/subcategories would need to be handled.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setModalMode(categoryToDeleteData.isMainCategory ? 'edit_main' : 'edit_sub') },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setAllCategoriesData(prevCategories => {
                const newCategories = { ...prevCategories };

                if (categoryToDeleteData.isMainCategory) {
                  const targetMainCategoryKey = Object.keys(newCategories).find(
                    key => newCategories[key].id === categoryToDeleteData.id
                  );
                  if (!targetMainCategoryKey) {
                    Alert.alert('Error', 'Main category not found.');
                    setLoading(false);
                    return prevCategories;
                  }
                  delete newCategories[targetMainCategoryKey];
                  Alert.alert('Success', `${categoryToDeleteData.name || 'Main category'} deleted.`);
                } else {
                  const parentId = parentMainCategoryForSub?.id;
                  if (!parentId) {
                    Alert.alert('Error', 'Parent category context lost.');
                    setLoading(false);
                    return prevCategories;
                  }
                  const targetMainCategoryKey = Object.keys(newCategories).find(
                    key => newCategories[key].id === parentId
                  );
                  if (!targetMainCategoryKey) {
                    Alert.alert('Error', 'Parent category not found.');
                    setLoading(false);
                    return prevCategories;
                  }
                  const mainCat = newCategories[targetMainCategoryKey];
                  mainCat.subcategories = mainCat.subcategories.filter(
                    cat => cat.id !== categoryToDeleteData.id
                  );
                  Alert.alert('Success', `${categoryToDeleteData.name || 'Category'} deleted.`);
                }

                setLoading(false);
                closeModal();
                return newCategories;
              });
            }, 500);
          },
        },
      ]
    );
  };

  // View products
  const handleViewProducts = (mainCategory, subCategory) => {
    navigation.navigate('AdminProductList', { mainCategory, subCategoryId: subCategory.id });
  };

  // Sorting modal
  const renderSortingModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSortingModalVisible}
      onRequestClose={() => setIsSortingModalVisible(false)}
    >
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50 justify-center items-center"
        style={{backgroundColor: '#ccc'}}
        onPress={() => setIsSortingModalVisible(false)}
        activeOpacity={1}
      >
        <View className="bg-white rounded-lg p-4 w-64" onStartShouldSetResponder={() => true}>
          <Text className="text-lg font-bold text-gray-800 mb-4">Sort Subcategories By</Text>
          {['name', 'productCount'].map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setSortBy(option);
                setSortOrder('asc');
                setIsSortingModalVisible(false);
              }}
              className="py-2 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-base ${sortBy === option && sortOrder === 'asc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                {option === 'name' ? 'Name (A-Z)' : 'Product Count (Low to High)'}
              </Text>
            </TouchableOpacity>
          ))}
          {['name', 'productCount'].map(option => (
            <TouchableOpacity
              key={option + '_desc'}
              onPress={() => {
                setSortBy(option);
                setSortOrder('desc');
                setIsSortingModalVisible(false);
              }}
              className="py-2 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-base ${sortBy === option && sortOrder === 'desc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                {option === 'name' ? 'Name (Z-A)' : 'Product Count (High to Low)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render main category
  const renderMainCategoryItem = ({ item: mainCategory }) => {
    const isExpanded = expandedMainCategories[mainCategory.id];
    const hasSubcategories = mainCategory.subcategories && mainCategory.subcategories.length > 0;

    return (
      <View key={mainCategory.id} className="mb-3 bg-white rounded-lg shadow-sm overflow-hidden">
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleToggleCollapse(mainCategory.id)}
          accessibilityRole="button"
          accessibilityLabel={`Toggle ${mainCategory.name}`}
        >
          <View className="flex-row items-center flex-1 pr-2">
            <Feather name={mainCategory.iconName || 'folder'} size={22} color="#374151" />
            <Text className="text-base font-bold text-gray-800 flex-1 pr-2 ml-3">{mainCategory.name}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => openModal('add_sub', null, mainCategory)}
              className="p-2"
              accessibilityRole="button"
              accessibilityLabel={`Add subcategory to ${mainCategory.name}`}
            >
              <Feather name="plus-circle" size={20} color="#16a34a" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal('edit_main', mainCategory, null)}
              className="p-2 ml-2"
              accessibilityRole="button"
              accessibilityLabel={`Edit ${mainCategory.name}`}
            >
              <Feather name="edit" size={20} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal('confirm_delete', mainCategory, null)}
              className="p-2 ml-2"
              accessibilityRole="button"
              accessibilityLabel={`Delete ${mainCategory.name}`}
            >
              <Feather name="trash-2" size={20} color="#ef4444" />
            </TouchableOpacity>
            {hasSubcategories && (
              <Feather
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#6b7280"
                className="ml-3"
              />
            )}
          </View>
        </TouchableOpacity>
        {isExpanded && hasSubcategories && (
          <FlatList
            data={mainCategory.subcategories}
            renderItem={({ item }) => (
              <SubcategoryListItem
                item={item}
                mainCategory={mainCategory}
                onEdit={(subItem, parent) => openModal('edit_sub', subItem, parent)}
                onViewProducts={handleViewProducts}
                onDelete={(subItem, parent) => openModal('confirm_delete', subItem, parent)}
              />
            )}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            className="border-t border-gray-200"
          />
        )}
        {isExpanded && !hasSubcategories && (
          <View className="p-4">
            <Text className="text-gray-500 italic text-center">
              No subcategories in this section yet. Tap '+' above to add one.
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render modal
  const renderUnifiedModal = () => {
    const isAddMode = modalMode?.startsWith('add');
    const isEditMode = modalMode?.startsWith('edit');
    const isConfirmDeleteMode = modalMode === 'confirm_delete';
    const isMainCategoryOperation = modalMode?.includes('main');
    const categoryBeingDeleted = isConfirmDeleteMode ? categoryData : null;

    let modalTitle = 'Manage Category';
    if (isAddMode) modalTitle = `Add New ${isMainCategoryOperation ? 'Main Category' : 'Category'}`;
    else if (isEditMode) modalTitle = `Edit ${isMainCategoryOperation ? 'Main Category' : 'Category'}`;
    else if (isConfirmDeleteMode) modalTitle = 'Confirm Delete';

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView className="flex-1 bg-gray-100">
          <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">{modalTitle}</Text>
            <TouchableOpacity onPress={closeModal} className="p-1" accessibilityRole="button" accessibilityLabel="Close modal">
              <Feather name="x" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {isConfirmDeleteMode ? (
            <View className="flex-1 p-6 justify-center items-center">
              <Feather name="alert-triangle" size={60} color="#ef4444" />
              <Text className="text-xl font-bold text-gray-800 text-center mb-4">Are you sure?</Text>
              <Text className="text-gray-700 text-base text-center leading-relaxed">
                You are about to delete the {categoryBeingDeleted?.isMainCategory ? 'main category' : 'category'} "
                {categoryBeingDeleted?.name}".
                {categoryBeingDeleted?.subCategoryCount > 0 &&
                  `\nIt contains ${categoryBeingDeleted.subCategoryCount} subcategories.`}
                {categoryBeingDeleted?.productCount > 0 &&
                  `\nIt contains ${categoryBeingDeleted.productCount} product(s).`}
                {categoryBeingDeleted?.subCategoryCount > 0 || categoryBeingDeleted?.productCount > 0
                  ? '\n\nDeleting this may cause data loss or leave products/subcategories uncategorized.'
                  : '\n\nThis action cannot be undone.'}
              </Text>
            </View>
          ) : (
            <ScrollView className="flex-1 p-4">
              {!isMainCategoryOperation && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Parent Category</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base mb-4 bg-gray-200 text-gray-600"
                    value={parentMainCategoryForSub?.name || ''}
                    editable={false}
                    accessibilityLabel="Parent category"
                  />
                </>
              )}
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                {isMainCategoryOperation ? 'Main Category Name' : 'Category Name'}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base mb-4 bg-white text-gray-800"
                value={categoryData.name}
                onChangeText={text => setCategoryData({ ...categoryData, name: text })}
                placeholder={isMainCategoryOperation ? 'e.g. Electronics' : 'e.g. Smartphones'}
                placeholderTextColor="#999"
                accessibilityLabel="Category name"
              />
              {isMainCategoryOperation && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Icon</Text>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg p-3 text-base mb-4 bg-white flex-row items-center justify-between"
                    onPress={handleIconPick}
                    accessibilityRole="button"
                    accessibilityLabel="Select icon"
                  >
                    <Text className="text-gray-800">{categoryData.iconName || 'Select Icon'}</Text>
                    {categoryData.iconName && <Feather name={categoryData.iconName} size={20} color="#374151" />}
                    <Feather name="chevron-right" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </>
              )}
              <Text className="text-sm font-semibold text-gray-700 mb-2">Description (Optional)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base mb-4 bg-white text-gray-800 h-24"
                value={categoryData.description}
                onChangeText={text => setCategoryData({ ...categoryData, description: text })}
                placeholder="Brief description..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessibilityLabel="Category description"
              />
              <Text className="text-sm font-semibold text-gray-700 mb-2">Image (Optional)</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg h-32 justify-center items-center mb-6 bg-white overflow-hidden relative"
                onPress={handleImagePick}
                accessibilityRole="button"
                accessibilityLabel="Select image"
              >
                {categoryData.image ? (
                  <Image
                    source={typeof categoryData.image === 'string' ? { uri: categoryData.image } : categoryData.image}
                    className="w-full h-full"
                    contentFit="cover"
                    placeholder={{ uri: 'https://via.placeholder.com/128' }}
                  />
                ) : (
                  <View className="flex-col items-center">
                    <Feather name="camera" size={30} color="#6b7280" />
                    <Text className="text-gray-600 text-sm mt-2">Tap to Select Image</Text>
                  </View>
                )}
                {categoryData.image && (
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                    onPress={() => setCategoryData({ ...categoryData, image: null })}
                    accessibilityRole="button"
                    accessibilityLabel="Clear image"
                  >
                    <Feather name="x" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
          <View className="p-4 bg-white border-t border-gray-200 flex-row justify-between items-center">
            {isConfirmDeleteMode ? (
              <>
                <TouchableOpacity
                  className="flex-1 bg-gray-400 rounded-lg px-4 py-3 mr-2 items-center justify-center"
                  onPress={closeModal}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel deletion"
                >
                  <Text className="text-white text-base font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-red-600 rounded-lg px-4 py-3 ml-2 items-center justify-center"
                  onPress={handleDelete}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm deletion"
                >
                  <Text className="text-white text-base font-semibold">Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isEditMode && (
                  <TouchableOpacity
                    className="flex-1 bg-red-500 rounded-lg px-4 py-3 mr-2 items-center justify-center"
                    onPress={() => openModal('confirm_delete', categoryData, parentMainCategoryForSub)}
                    accessibilityRole="button"
                    accessibilityLabel="Delete category"
                  >
                    <Text className="text-white text-base font-semibold">Delete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className={`flex-1 ${isEditMode ? 'basis-1/3 mx-1' : 'basis-1/2 mr-1'} bg-gray-400 rounded-lg px-4 py-3 items-center justify-center`}
                  onPress={closeModal}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text className="text-white text-base font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 ${isEditMode ? 'basis-1/3 ml-1' : 'basis-1/2 ml-1'} bg-blue-600 rounded-lg px-4 py-3 items-center justify-center`}
                  onPress={handleSave}
                  accessibilityRole="button"
                  accessibilityLabel={isEditMode ? 'Update category' : 'Save category'}
                >
                  <Text className="text-white text-base font-semibold">{isEditMode ? 'Update' : 'Save'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {loading && (
            <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-200 shadow-sm">
        {/* <Text className="text-2xl font-bold text-gray-800 mb-4">Category Management</Text> */}
        <View className="flex-row items-center" style={{paddingVertical: 10}}>
          <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mr-2">
            <Feather name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 text-gray-800 ml-2"
              placeholder="Search categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              accessibilityLabel="Search categories"
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsSortingModalVisible(true)}
            className="p-2 rounded-lg bg-gray-200"
            accessibilityRole="button"
            accessibilityLabel="Sort options"
          >
            <Feather name="sort-alpha" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
      {loading && !modalVisible ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-600">Loading Categories...</Text>
        </View>
      ) : filteredAndSortedMainCategories.length === 0 && searchQuery ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="info" size={50} color="#9ca3af" />
          <Text className="text-gray-600 text-lg text-center">No categories match "{searchQuery}".</Text>
        </View>
      ) : filteredAndSortedMainCategories.length === 0 && !searchQuery ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="folder-plus" size={50} color="#9ca3af" />
          <Text className="text-gray-600 text-lg text-center mb-4">No categories found.</Text>
          <Text className="text-gray-500 text-center">Tap the '+' button below to add your first main category.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedMainCategories}
          renderItem={renderMainCategoryItem}
          keyExtractor={item => item.id}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        className="absolute bg-green-600 rounded-full p-4 shadow-lg z-10"
        onPress={() => openModal('add_main')}
        accessibilityRole="button"
        accessibilityLabel="Add new main category"
        style={{bottom: 6, right: 6}}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
      {renderUnifiedModal()}
      {renderSortingModal()}
    </SafeAreaView>
  );
}