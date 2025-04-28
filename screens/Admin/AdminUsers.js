import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { initialUsers, userRoleOptions, userStatusOptions } from '../../data/adminData';
import Svg, { Polygon } from 'react-native-svg';

const AdminUsers = ({ navigation }) => {
  const [users, setUsers] = useState(initialUsers);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'bulk', 'filter', 'sort'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    registrationStart: null,
    registrationEnd: null,
    lastLoginStart: null,
    lastLoginEnd: null,
  });
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState({ type: '', value: '' });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const loadMoreCount = 10;

  useEffect(() => {
    applyFiltersAndSort();
  }, [users, searchQuery, filters, sortBy, sortOrder, displayCount]);

  const applyFiltersAndSort = () => {
    setLoading(true);
    let filteredUsers = [...users] || [];
    console.log('Applying filters, users:', filteredUsers.length);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.uid?.toLowerCase().includes(query)
      );
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    if (filters.registrationStart) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.registrationDate) >= filters.registrationStart
      );
    }
    if (filters.registrationEnd) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.registrationDate) <= filters.registrationEnd
      );
    }
    if (filters.lastLoginStart) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.lastLogin) >= filters.lastLoginStart
      );
    }
    if (filters.lastLoginEnd) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.lastLogin) <= filters.lastLoginEnd
      );
    }

    filteredUsers.sort((a, b) => {
      const valueA = a[sortBy] || '';
      const valueB = b[sortBy] || '';
      const isAsc = sortOrder === 'asc';
      if (sortBy.includes('Date')) {
        return isAsc
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      return isAsc
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    const paginatedUsers = filteredUsers.slice(0, displayCount);
    console.log('paginatedUsers:', paginatedUsers.length);
    setDisplayUsers(paginatedUsers);
    setHasMore(filteredUsers.length > displayCount);
    setSelectAll(false);
    setSelectedUsers([]);
    setLoading(false);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + loadMoreCount);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to permanently delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.uid !== user.uid));
            setSelectedUsers(selectedUsers.filter(uid => uid !== user.uid));
            Toast.show({ type: 'success', text1: 'User deleted successfully', position: 'bottom' });
          },
        },
      ]
    );
  };

  const handlePasswordReset = (user) => {
    Alert.alert(
      'Send Password Reset',
      `Send a password reset email to ${user.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Toast.show({ type: 'success', text1: 'Password reset email sent', position: 'bottom' });
          },
        },
      ]
    );
  };

  const handleRevokeSessions = (user) => {
    Alert.alert(
      'Revoke Sessions',
      `Revoke all active sessions for ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          onPress: () => {
            Toast.show({ type: 'success', text1: 'All sessions revoked', position: 'bottom' });
          },
        },
      ]
    );
  };

  const handleBulkAction = () => {
    if (!selectedUsers.length) {
      Toast.show({ type: 'error', text1: 'Select at least one user', position: 'bottom' });
      return;
    }
    if (!bulkAction.type || !bulkAction.value) {
      Toast.show({ type: 'error', text1: 'Select action type and value', position: 'bottom' });
      return;
    }
    setUsers(
      users.map(user =>
        selectedUsers.includes(user.uid)
          ? { ...user, [bulkAction.type]: bulkAction.value }
          : user
      )
    );
    setModalVisible(false);
    setSelectedUsers([]);
    setSelectAll(false);
    setBulkAction({ type: '', value: '' });
    Toast.show({ type: 'success', text1: 'Bulk action completed', position: 'bottom' });
  };

  const toggleSelectUser = (uid) => {
    setSelectedUsers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(displayUsers.map(user => user.uid));
    }
    setSelectAll(!selectAll);
  };

  const openModal = (type) => {
    console.log('Opening modal:', type);
    setModalType(type);
    setModalVisible(true);
  };

  const handleDateChange = (event, selectedDate, field) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(null);
      return;
    }
    setShowDatePicker(null);
    if (selectedDate) {
      setFilters({ ...filters, [field]: selectedDate });
    }
  };

  const renderUserItem = ({ item }) => {
    const initials = item.name ? item.name.charAt(0).toUpperCase() : 'U';
    return (
      <View className="flex-row items-center bg-white p-4 my-2 mx-4 rounded-lg shadow-8">
        <View className='absolute top-0 left-0' style={{width: 0, height: 0, borderTopLeftRadius: 8, borderTopWidth: 45, borderTopColor: '#ccc', borderRightWidth: 45, borderRightColor: 'transparent'}}/>
        <Feather className='absolute top-[4] left-[4]' name='check' size={18} color={'#000'} />
        <View className="bg-gray-200 items-center justify-center" style={{ width: 60, height: 60, borderRadius: 60, marginEnd: 20 }}>
          <Text className="text-gray-500" style={{ fontSize: 34, textAlign: 'center', fontWeight: '700' }}>{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{item.name || 'N/A'}</Text>
          <Text className="text-sm text-gray-600">Email: {item.email}</Text>
          <Text className="text-sm text-gray-600">
            Registered: {moment(item.registrationDate).format('MMM DD, YYYY')}
          </Text>
          <Text className="text-sm text-gray-600">
            Last Login: {moment(item.lastLogin).format('MMM DD, YYYY HH:mm')}
          </Text>
          <Text className="text-sm text-gray-600">Role: {item.role}</Text>
          <Text
            className={`text-sm ${item.status === 'Active'
                ? 'text-success'
                : item.status === 'Inactive'
                  ? 'text-warning'
                  : 'text-error'
              }`}
          >
            Status: {item.status}
          </Text>
        </View>
        <View className="flex-col justify-center items-center gap-2">
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
              <MenuOption>
                <View className="flex-row items-center p-2 border-b border-gray-100 bg-primaryLight rounded">
                  <Feather name="user" size={16} color="#000" />
                  <Text className="ml-2 text-base text-gray-800">{item.name}</Text>
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => navigation.navigate('AdminUserDetail', { users, setUsers })}
              >
                <View className="flex-row items-center p-2 border-b border-gray-100">
                  <Feather name="edit" size={16} color="#007bff" />
                  <Text className="ml-2 text-base text-gray-800">Edit</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => handleDeleteUser(item)}>
                <View className="flex-row items-center p-2 border-b border-gray-100">
                  <Feather name="trash-2" size={16} color="#ef4444" />
                  <Text className="ml-2 text-base text-gray-800">Delete</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => handlePasswordReset(item)}>
                <View className="flex-row items-center p-2 border-b border-gray-100">
                  <Feather name="lock" size={16} color="#10b981" />
                  <Text className="ml-2 text-base text-gray-800">Send Password Reset</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => handleRevokeSessions(item)}>
                <View className="flex-row items-center p-2">
                  <Feather name="log-out" size={16} color="#f59e0b" />
                  <Text className="ml-2 text-base text-gray-800">Revoke Sessions</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  };

  const renderPicker = (options, value, onSelect, placeholder) => {
    if (!options || !Array.isArray(options)) {
      console.warn('Picker options are invalid:', options);
      return null;
    }
    return (
      <View className="border border-gray-300 rounded-lg mb-3 bg-white">
        <FlatList
          data={options}
          keyExtractor={item => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`p-3 ${value === item.value ? 'bg-blue-100' : ''}`}
              onPress={() => {
                onSelect(item.value);
                if (modalType === 'sort') setModalVisible(false);
              }}
            >
              <Text
                className={`text-base ${value === item.value ? 'font-semibold text-primary' : 'text-gray-800'
                  }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          className="max-h-32"
        />
      </View>
    );
  };

  const renderModalContent = () => {
    console.log('Rendering modal, type:', modalType);
    if (!modalType) {
      return (
        <View className="bg-white rounded-xl p-6 m-6 shadow-lg max-h-[80%] flex-col">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-error">Invalid modal type</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} />
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (modalType === 'bulk') {
      const actionTypes = [
        { label: 'Status', value: 'status' },
        { label: 'Role', value: 'role' },
      ];
      const values =
        bulkAction.type === 'status'
          ? [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'Blocked', value: 'Blocked' },
          ]
          : [
            { label: 'Customer', value: 'Customer' },
            { label: 'Moderator', value: 'Moderator' },
            { label: 'Admin', value: 'Admin' },
          ];

      return (
        <View className="bg-white rounded-xl p-6 m-6 shadow-lg max-h-[80%] flex-col">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Bulk Action</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Action Type</Text>
            {renderPicker(
              actionTypes,
              bulkAction.type,
              value => setBulkAction({ ...bulkAction, type: value }),
              'Select Action'
            )}
            {bulkAction.type && (
              <>
                <Text className="text-sm font-semibold text-gray-800 mb-2">Value</Text>
                {renderPicker(
                  values,
                  bulkAction.value,
                  value => setBulkAction({ ...bulkAction, value: value }),
                  'Select Value'
                )}
              </>
            )}
          </ScrollView>
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#007bff', '#00d4ff']}
              className="flex-1"
              style={{ borderRadius: 8 }}
            >
              <TouchableOpacity onPress={handleBulkAction} className="p-3 rounded-lg items-center">
                <Text className="text-base font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      );
    }

    if (modalType === 'filter') {
      const statusOptions = [
        { label: 'All', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Blocked', value: 'Blocked' },
      ];
      const roleOptions = [
        { label: 'All', value: '' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Moderator', value: 'Moderator' },
        { label: 'Admin', value: 'Admin' },
      ];

      return (
        <View className="bg-white rounded-xl p-6 m-6 shadow-lg max-h-[80%] flex-col">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Filter Users</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Status</Text>
            {renderPicker(
              statusOptions,
              filters.status,
              value => setFilters({ ...filters, status: value }),
              'All'
            )}
            <Text className="text-sm font-semibold text-gray-800 mb-2">Role</Text>
            {renderPicker(
              roleOptions,
              filters.role,
              value => setFilters({ ...filters, role: value }),
              'All'
            )}
            <Text className="text-sm font-semibold text-gray-800 mb-2">Registration Start Date</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => setShowDatePicker('registrationStart')}
            >
              <Text className="text-base text-gray-800">
                {filters.registrationStart
                  ? moment(filters.registrationStart).format('MMM DD, YYYY')
                  : 'Select Date'}
              </Text>
              <Feather name="calendar" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Registration End Date</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => setShowDatePicker('registrationEnd')}
            >
              <Text className="text-base text-gray-800">
                {filters.registrationEnd
                  ? moment(filters.registrationEnd).format('MMM DD, YYYY')
                  : 'Select Date'}
              </Text>
              <Feather name="calendar" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Last Login Start Date</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => setShowDatePicker('lastLoginStart')}
            >
              <Text className="text-base text-gray-800">
                {filters.lastLoginStart
                  ? moment(filters.lastLoginStart).format('MMM DD, YYYY')
                  : 'Select Date'}
              </Text>
              <Feather name="calendar" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Last Login End Date</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => setShowDatePicker('lastLoginEnd')}
            >
              <Text className="text-base text-gray-800">
                {filters.lastLoginEnd
                  ? moment(filters.lastLoginEnd).format('MMM DD, YYYY')
                  : 'Select Date'}
              </Text>
              <Feather name="calendar" size={20} color="#374151" />
            </TouchableOpacity>
          </ScrollView>
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#007bff', '#00d4ff']}
              className="flex-1"
              style={{ borderRadius: 8 }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-3 rounded-lg items-center"
              >
                <Text className="text-base font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={filters[showDatePicker] || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange(event, date, showDatePicker)}
            />
          )}
        </View>
      );
    }

    if (modalType === 'sort') {
      const sortOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Email', value: 'email' },
        { label: 'Registration Date', value: 'registrationDate' },
        { label: 'Last Login', value: 'lastLogin' },
      ];
      const orderOptions = [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' },
      ];

      return (
        <View className="bg-white rounded-xl p-6 m-6 shadow-lg max-h-[80%] flex-col">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Sort Users</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <Text className="text-sm font-semibold text-gray-800 mb-2">Sort By</Text>
            {renderPicker(sortOptions, sortBy, setSortBy, 'Select Sort Field')}
            <Text className="text-sm font-semibold text-gray-800 mb-2">Order</Text>
            {renderPicker(orderOptions, sortOrder, setSortOrder, 'Select Sort Order')}
          </ScrollView>
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#007bff', '#00d4ff']}
              className="flex-1"
              style={{ borderRadius: 8 }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-3 rounded-lg items-center"
              >
                <Text className="text-base font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Feather name="users" size={60} color="#9ca3af" />
      <Text className="text-lg font-semibold text-gray-600 mt-4">No users found</Text>
      <Text className="text-sm text-gray-500 mt-2 text-center">Try adjusting your search or filters</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <View className="flex-1 bg-gray-50">
        <View className="flex-row p-4 bg-white border-b border-gray-200">
          <View className="flex-1 flex-row items-center border border-gray-300 rounded-lg bg-white px-3">
            <Feather name="search" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 py-3 text-base text-gray-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by Name, Email, or UID"
              accessibilityLabel="Search users"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                className="p-1"
                onPress={() => setSearchQuery('')}
                accessible
                accessibilityLabel="Clear search"
              >
                <Feather name="x-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            className="p-3 ml-3 bg-success rounded-lg"
            onPress={() => openModal('filter')}
            accessible
            accessibilityLabel="Open filters"
          >
            <FontAwesome name="filter" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 ml-3 bg-primary rounded-lg"
            onPress={() => openModal('sort')}
            accessible
            accessibilityLabel="Open sort options"
          >
            <FontAwesome name="sort" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center p-3 bg-white border-b border-gray-200">
          <TouchableOpacity
            className="flex-row items-center p-2"
            onPress={toggleSelectAll}
            accessible
            accessibilityLabel={selectAll ? 'Deselect all users' : 'Select all users'}
          >
            <Feather
              name={selectAll ? 'check-square' : 'square'}
              size={20}
              color="#374151"
            />
            <Text className="text-sm font-semibold text-gray-800 ml-2">Select All</Text>
          </TouchableOpacity>
        </View>
        {loading && displayUsers.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : displayUsers.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={displayUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.uid}
            ListFooterComponent={
              hasMore ? (
                <TouchableOpacity
                  className="bg-primary py-3 rounded-lg items-center mx-4 my-4"
                  onPress={handleLoadMore}
                  disabled={loading}
                >
                  <Text className="text-base font-semibold text-white">
                    {loading ? 'Loading...' : 'Load More'}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}
        <View className="flex-row gap-3 p-4 bg-white border-t border-gray-200">
          <LinearGradient
            colors={['#007bff', '#00d4ff']}
            className="flex-1"
            style={{ borderRadius: 8 }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminUserDetail', { users, setUsers })}
              accessible
              accessibilityLabel="Add new user"
              className="p-3 rounded-lg items-center"
            >
              <Text className="text-base font-semibold text-white">Add User</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={selectedUsers.length ? ['#007bff', '#00d4ff'] : ['#d1d5db', '#d1d5db']}
            className="flex-1"
            style={{ borderRadius: 8 }}
          >
            <TouchableOpacity
              onPress={() => openModal('bulk')}
              disabled={!selectedUsers.length}
              accessible
              accessibilityLabel="Bulk actions"
              className="p-3 rounded-lg items-center"
            >
              <Text className="text-base font-semibold text-white">Bulk Action</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/60 justify-center">
            {renderModalContent()}
          </View>
        </Modal>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default AdminUsers;