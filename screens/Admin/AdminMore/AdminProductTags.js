import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AdminProductTags = ({ navigation }) => {
  const [tags, setTags] = useState([
    { id: 'tag-1', name: 'Organic' },
    { id: 'tag-2', name: 'Vegan' },
    { id: 'tag-3', name: 'Gluten-Free' },
    { id: 'tag-4', name: 'Sustainable' },
    { id: 'tag-5', name: 'Handmade' },
    { id: 'tag-6', name: 'Eco-Friendly' },
    { id: 'tag-7', name: 'Fair Trade' },
    { id: 'tag-8', name: 'Non-GMO' },
    { id: 'tag-9', name: 'Cruelty-Free' },
    { id: 'tag-10', name: 'Locally Sourced' },
  ]);
  const [newName, setNewName] = useState('');
  const [editingTag, setEditingTag] = useState(null);

  const handleAddTag = () => {
    if (!newName.trim()) {
      Toast.show({ type: 'error', text1: 'Tag name is required' });
      return;
    }
    if (tags.some(tag => tag.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Tag already exists' });
      return;
    }
    const tag = { id: `tag-${Date.now()}`, name: newName.trim() };
    setTags([...tags, tag]);
    setNewName('');
    Toast.show({ type: 'success', text1: 'Tag added successfully' });
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setNewName(tag.name);
  };

  const handleUpdateTag = () => {
    if (!newName.trim()) {
      Toast.show({ type: 'error', text1: 'Tag name is required' });
      return;
    }
    if (tags.some(tag => tag.id !== editingTag.id && tag.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Tag already exists' });
      return;
    }
    setTags(tags.map(tag => (tag.id === editingTag.id ? { ...tag, name: newName.trim() } : tag)));
    setEditingTag(null);
    setNewName('');
    Toast.show({ type: 'success', text1: 'Tag updated successfully' });
  };

  const handleDeleteTag = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tag?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTags(tags.filter(tag => tag.id !== id));
            Toast.show({ type: 'success', text1: 'Tag deleted successfully' });
          },
        },
      ]
    );
  };

  const renderTag = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl p-4 mb-2 border border-gray-200">
      <View>
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleEditTag(item)}
          className="p-2"
          accessibilityLabel={`Edit ${item.name} tag`}
        >
          <Feather name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTag(item.id)}
          className="p-2"
          accessibilityLabel={`Delete ${item.name} tag`}
        >
          <Feather name="trash-2" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100">
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Product Tags</Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-sm text-gray-600 mb-2">{editingTag ? 'Edit Tag' : 'Add New Tag'}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter tag name (e.g., Organic)"
            accessibilityLabel="Tag name"
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={editingTag ? handleUpdateTag : handleAddTag}
          >
            <Feather name={editingTag ? 'save' : 'plus'} size={16} color="#fff" className="mr-2" />
            <Text className="text-white font-semibold">{editingTag ? 'Update Tag' : 'Add Tag'}</Text>
          </TouchableOpacity>
          {editingTag && (
            <TouchableOpacity
              className="mt-2 bg-gray-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
              onPress={() => {
                setEditingTag(null);
                setNewName('');
              }}
            >
              <Feather name="x" size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold">Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className="text-gray-600 text-center p-4">No tags available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminProductTags;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});