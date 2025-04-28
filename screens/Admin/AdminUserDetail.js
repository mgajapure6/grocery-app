import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { userRoleOptions, userStatusOptions } from '../../data/adminData';

const AdminUserDetail = ({ route, navigation }) => {
  const { users, setUsers, user } = route.params || {};
  const isNewUser = !user;

  const [isEditing, setIsEditing] = useState(isNewUser);
  const [formData, setFormData] = useState({
    uid: user?.uid || `user-${Date.now()}`,
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: user?.phone || '',
    address: user?.address || '',
    role: user?.role || 'Customer',
    status: user?.status || 'Active',
    avatar: user?.avatar || null,
    emailVerified: user?.emailVerified ? 'Yes' : 'No',
    mfaEnabled: user?.mfaEnabled ? 'Yes' : 'No',
    registrationDate: user?.registrationDate || new Date().toISOString(),
    lastLogin: user?.lastLogin || new Date().toISOString(),
    orders: user?.orders || [],
    logins: user?.logins || [],
  });

  useEffect(() => {
    if (isNewUser) {
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
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, avatar: null });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }
    if (isNewUser && !formData.password) {
      Alert.alert('Error', 'Password is required for new users.');
      return;
    }
    if (isNewUser && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      Alert.alert('Error', 'Password must be 8+ characters with letters and numbers.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }

    const updatedUser = {
      uid: formData.uid,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: formData.role,
      status: formData.status,
      avatar: formData.avatar,
      emailVerified: formData.emailVerified === 'Yes',
      mfaEnabled: formData.mfaEnabled === 'Yes',
      registrationDate: formData.registrationDate,
      lastLogin: formData.lastLogin,
      orders: formData.orders,
      logins: formData.logins,
      updatedAt: new Date().toISOString(),
    };

    if (isNewUser) {
      setUsers([...users, updatedUser]);
    } else {
      setUsers(users.map(u => (u.uid === formData.uid ? updatedUser : u)));
    }

    navigation.goBack();
    Toast.show({
      type: 'success',
      text1: isNewUser ? 'User created successfully' : 'User updated successfully',
      position: 'bottom',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${formData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.uid !== formData.uid));
            navigation.goBack();
            Toast.show({
              type: 'success',
              text1: 'User deleted successfully',
              position: 'bottom',
            });
          },
        },
      ]
    );
  };

  const showPickerDialog = (field) => {
    if (!isEditing) return;

    const options = field === 'role' ? userRoleOptions : userStatusOptions;
    const buttons = options.map(option => ({
      text: option.label,
      onPress: () => setFormData({ ...formData, [field]: option.value }),
    }));
    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      `Select ${field === 'role' ? 'Role' : 'Status'}`,
      '',
      buttons,
      { cancelable: true }
    );
  };

  const getDisplayValue = (field) => {
    if (field === 'role') {
      const selectedRole = userRoleOptions.find(option => option.value === formData.role);
      return selectedRole ? selectedRole.label : 'Select Role';
    } else if (field === 'status') {
      const selectedStatus = userStatusOptions.find(option => option.value === formData.status);
      return selectedStatus ? selectedStatus.label : 'Select Status';
    }
    return 'Select';
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <View className="flex-1">
        <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            {isNewUser ? 'Add New User' : formData.name}
          </Text>
          <View className="w-6" />
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <View className="bg-white">
            <Text className="text-lg font-bold text-gray-800 mb-4">General Information</Text>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Name</Text>
            <TextInput
              className={`border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800 ${
                !isEditing ? 'bg-gray-200 text-gray-600' : 'bg-white'
              }`}
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              placeholder="Enter name"
              editable={isEditing}
              accessibilityLabel="Name input"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Email</Text>
            <TextInput
              className={`border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800 ${
                !isEditing ? 'bg-gray-200 text-gray-600' : 'bg-white'
              }`}
              value={formData.email}
              onChangeText={text => setFormData({ ...formData, email: text })}
              placeholder="Enter email"
              keyboardType="email-address"
              editable={isEditing}
              accessibilityLabel="Email input"
            />
            {isNewUser && (
              <>
                <Text className="text-sm font-semibold text-gray-800 mb-2">Password</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800 bg-white"
                  value={formData.password}
                  onChangeText={text => setFormData({ ...formData, password: text })}
                  placeholder="Enter password"
                  secureTextEntry
                  editable={isEditing}
                  accessibilityLabel="Password input"
                />
              </>
            )}
            <Text className="text-sm font-semibold text-gray-800 mb-2">Phone Number</Text>
            <TextInput
              className={`border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800 ${
                !isEditing ? 'bg-gray-200 text-gray-600' : 'bg-white'
              }`}
              value={formData.phone}
              onChangeText={text => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              editable={isEditing}
              accessibilityLabel="Phone number input"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Address</Text>
            <TextInput
              className={`border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800 ${
                !isEditing ? 'bg-gray-200 text-gray-600' : 'bg-white'
              } h-24 text-start`}
              value={formData.address}
              onChangeText={text => setFormData({ ...formData, address: text })}
              placeholder="Enter address"
              multiline
              numberOfLines={4}
              editable={isEditing}
              accessibilityLabel="Address input"
            />

            <Text className="text-lg font-bold text-gray-800 mb-4 mt-4">Account Details</Text>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Role</Text>
            <TouchableOpacity
              className={`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-4 ${
                !isEditing ? 'bg-gray-200' : 'bg-white'
              }`}
              onPress={() => showPickerDialog('role')}
              disabled={!isEditing}
            >
              <Text
                className={`text-base ${!isEditing ? 'text-gray-600' : 'text-gray-800'}`}
              >
                {getDisplayValue('role')}
              </Text>
              <Feather name="chevron-down" size={20} color={isEditing ? '#333' : '#666'} />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Status</Text>
            <TouchableOpacity
              className={`flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-4 ${
                !isEditing ? 'bg-gray-200' : 'bg-white'
              }`}
              onPress={() => showPickerDialog('status')}
              disabled={!isEditing}
            >
              <Text
                className={`text-base ${!isEditing ? 'text-gray-600' : 'text-gray-800'}`}
              >
                {getDisplayValue('status')}
              </Text>
              <Feather name="chevron-down" size={20} color={isEditing ? '#333' : '#666'} />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Email Verified</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={formData.emailVerified}
              editable={false}
              accessibilityLabel="Email verified status"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">MFA Enabled</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={formData.mfaEnabled}
              editable={false}
              accessibilityLabel="MFA enabled status"
            />

            <Text className="text-lg font-bold text-gray-800 mb-4 mt-4">Avatar</Text>
            <View className="border border-gray-300 rounded-xl p-3 mb-4">
              <TouchableOpacity
                className={`bg-blue-600 py-3 px-5 rounded-lg items-center mb-4 ${
                  !isEditing ? 'bg-gray-400' : ''
                }`}
                onPress={pickImage}
                disabled={!isEditing}
              >
                <Text className="text-white text-base font-semibold">
                  {formData.avatar ? 'Change Avatar' : 'Add Avatar'}
                </Text>
              </TouchableOpacity>
              {formData.avatar ? (
                <View className="mt-3 mr-3 mb-5">
                  <Image
                    source={{ uri: formData.avatar }}
                    className="w-32 h-32 rounded-lg"
                  />
                  {isEditing && (
                    <View className="flex-row items-center justify-between mt-2 h-8">
                      <TouchableOpacity
                        className="bg-green-600 py-1 px-2 rounded-md"
                        onPress={() => setFormData({ ...formData, avatar: formData.avatar })}
                      >
                        <Text className="text-white text-xs text-center">Main</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="ml-auto"
                        onPress={removeImage}
                      >
                        <Feather name="x-circle" size={22} color="#ff4d4d" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <Text className="text-gray-600 text-base text-center mb-5">
                  No avatar uploaded
                </Text>
              )}
            </View>

            <Text className="text-lg font-bold text-gray-800 mb-4 mt-4">Additional Details</Text>
            <Text className="text-sm font-semibold text-gray-800 mb-2">UID</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={formData.uid}
              editable={false}
              accessibilityLabel="User ID"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Registration Date</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={new Date(formData.registrationDate).toLocaleString()}
              editable={false}
              accessibilityLabel="Registration date"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Last Login</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={new Date(formData.lastLogin).toLocaleString()}
              editable={false}
              accessibilityLabel="Last login date"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Orders</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={formData.orders.length ? `${formData.orders.length} orders` : 'No orders'}
              editable={false}
              accessibilityLabel="Order count"
            />
            <Text className="text-sm font-semibold text-gray-800 mb-2">Logins</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-600 bg-gray-200"
              value={formData.logins.length ? `${formData.logins.length} logins` : 'No logins'}
              editable={false}
              accessibilityLabel="Login count"
            />
          </View>
        </ScrollView>

        <View className="flex-row justify-between p-4 bg-white border-t border-gray-200 shadow-md pb-8">
          {!isNewUser && (
            <>
              <TouchableOpacity
                className={`flex-1 ${
                  isEditing ? 'bg-gray-700' : 'bg-blue-600'
                } py-3 rounded-lg items-center mx-1`}
                onPress={() => setIsEditing(true)}
                disabled={isEditing}
              >
                <Text className="text-white text-base font-semibold">
                  {isEditing ? 'Update' : 'Edit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-600 py-3 rounded-lg items-center mx-1"
                onPress={handleDelete}
              >
                <Text className="text-white text-base font-semibold">Delete</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            className="flex-1 bg-gray-300 py-3 rounded-lg items-center mx-1"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white text-base font-semibold">Cancel</Text>
          </TouchableOpacity>
          {(isEditing || isNewUser) && (
            <TouchableOpacity
              className="flex-1 bg-blue-600 py-3 rounded-lg items-center mx-1"
              onPress={handleSave}
            >
              <Text className="text-white text-base font-semibold">Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminUserDetail;