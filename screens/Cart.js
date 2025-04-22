import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Platform,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import { suggestedItems, tipOptions, addresses, paymentMethods, coupons } from '../data/staticData';

export default function Cart({ navigation }) {
  const { cart, setCart, addToCart } = useContext(CartContext);
  const [selectedTip, setSelectedTip] = useState(0);
  const [activeTab, setActiveTab] = useState('Cart');
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isCouponModalVisible, setCouponModalVisible] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState(addresses);
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(addr => addr.isDefault) || null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState(paymentMethods);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods.find(pm => pm.isDefault) || null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const { newAddress, updatedAddress, deletedAddressId, newPaymentMethod, updatedPaymentMethod, deletedPaymentMethodId } = navigation.getState().routes.find(r => r.name === 'Cart')?.params || {};
      if (newAddress) {
        setSavedAddresses(prev => {
          const updated = prev.map(addr => ({ ...addr, isDefault: newAddress.isDefault ? false : addr.isDefault }));
          return [...updated, newAddress];
        });
        setSelectedAddress(newAddress);
        console.log('Added new address:', newAddress);
      }
      if (updatedAddress) {
        setSavedAddresses(prev => {
          const updated = prev.map(addr => ({
            ...addr,
            isDefault: updatedAddress.id === addr.id ? updatedAddress.isDefault : (updatedAddress.isDefault ? false : addr.isDefault),
          }));
          return updated.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr);
        });
        if (selectedAddress?.id === updatedAddress.id) {
          setSelectedAddress(updatedAddress);
        }
        console.log('Updated address:', updatedAddress);
      }
      if (deletedAddressId) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== deletedAddressId));
        if (selectedAddress?.id === deletedAddressId) {
          setSelectedAddress(savedAddresses.find(addr => addr.isDefault && addr.id !== deletedAddressId) || null);
        }
        console.log('Deleted address ID:', deletedAddressId);
      }
      if (newPaymentMethod) {
        setSavedPaymentMethods(prev => {
          const updated = prev.map(pm => ({ ...pm, isDefault: newPaymentMethod.isDefault ? false : pm.isDefault }));
          return [...updated, newPaymentMethod];
        });
        setSelectedPaymentMethod(newPaymentMethod);
        console.log('Added new payment method:', newPaymentMethod);
      }
      if (updatedPaymentMethod) {
        setSavedPaymentMethods(prev => {
          const updated = prev.map(pm => ({
            ...pm,
            isDefault: updatedPaymentMethod.id === pm.id ? updatedPaymentMethod.isDefault : (updatedPaymentMethod.isDefault ? false : pm.isDefault),
          }));
          return updated.map(pm => pm.id === updatedPaymentMethod.id ? updatedPaymentMethod : pm);
        });
        if (selectedPaymentMethod?.id === updatedPaymentMethod.id) {
          setSelectedPaymentMethod(updatedPaymentMethod);
        }
        console.log('Updated payment method:', updatedPaymentMethod);
      }
      if (deletedPaymentMethodId) {
        setSavedPaymentMethods(prev => prev.filter(pm => pm.id !== deletedPaymentMethodId));
        if (selectedPaymentMethod?.id === deletedPaymentMethodId) {
          setSelectedPaymentMethod(savedPaymentMethods.find(pm => pm.isDefault && pm.id !== deletedPaymentMethodId) || null);
        }
        console.log('Deleted payment method ID:', deletedPaymentMethodId);
      }
    });
    return unsubscribe;
  }, [navigation, selectedAddress, selectedPaymentMethod, savedAddresses, savedPaymentMethods]);

  const validCart = Array.isArray(cart) ? cart.filter(
    (item) => item && typeof item === 'object' && item.id && item.name && item.price && item.image
  ) : [];

  const validSuggestedItems = Array.isArray(suggestedItems) ? suggestedItems.filter(
    (item) => item && typeof item === 'object' && item.id && item.name && item.price && item.image
  ) : [];

  const validCoupons = Array.isArray(coupons) ? coupons.filter(
    (coupon) => coupon && typeof coupon === 'object' && coupon.id && coupon.code && coupon.discount && coupon.description
  ) : [];

  const validTipOptions = Array.isArray(tipOptions) ? tipOptions.filter((tip) => typeof tip === 'number') : [];

  const subtotal = validCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const gst = subtotal * 0.05;
  const handlingCharge = 1.00;
  const deliveryCharge = 3.00;
  const couponDiscount = selectedCoupon?.discount || 0;
  const grandTotal = subtotal + gst + handlingCharge + deliveryCharge - couponDiscount + selectedTip;

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity + delta > 0 ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const removeItem = (id) => {
    console.log(`Removing item: ${id}`);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const selectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponModalVisible(false);
    console.log('Selected coupon:', coupon);
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
    console.log('Removed coupon');
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
    setAddressModalVisible(false);
    console.log('Selected address:', address);
  };

  const selectPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setPaymentModalVisible(false);
    console.log('Selected payment method:', paymentMethod);
  };

  const addNewAddress = () => {
    setAddressModalVisible(false);
    navigation.navigate('AddressForm', { mode: 'add' });
    console.log('Navigating to AddressForm (add)');
  };

  const editAddress = (addressObject) => {
    setAddressModalVisible(false);
    navigation.navigate('AddressForm', { mode: 'edit', addressObject });
    console.log('Navigating to AddressForm (edit):', addressObject);
  };

  const addNewPaymentMethod = () => {
    setPaymentModalVisible(false);
    navigation.navigate('AddressForm', { mode: 'addPayment' });
    console.log('Navigating to AddressForm (add payment)');
  };

  const editPaymentMethod = (paymentMethod) => {
    setPaymentModalVisible(false);
    navigation.navigate('AddressForm', { mode: 'editPayment', paymentMethod });
    console.log('Navigating to AddressForm (edit payment):', paymentMethod);
  };

  const renderCartItem = ({ item, index }) => {
    if (!item || typeof item !== 'object' || !item.id || !item.name || !item.price || !item.image) {
      console.warn('Invalid cart item at index', index, ':', item);
      return null;
    }

    return (
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.cartImage} />
        <View style={styles.cartDetails}>
          <Text style={styles.cartName}>{item.name}</Text>
          <Text style={styles.cartPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity || 1}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cartActions}>
          <Text style={styles.cartSubtotal}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Feather name="trash-2" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSuggestedItem = ({ item, index }) => {
    if (!item || typeof item !== 'object' || !item.id || !item.name || !item.price || !item.image) {
      console.warn('Invalid suggested item at index', index, ':', item);
      return null;
    }

    return (
      <View style={styles.suggestedCard}>
        <Image source={item.image} style={styles.suggestedImage} />
        <Text style={styles.suggestedName}>{item.name}</Text>
        <Text style={styles.suggestedPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            console.log('Adding suggested item to cart:', item);
            addToCart(item);
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.addressItem, selectedAddress?.id === item.id && styles.addressItemSelected]}
      onPress={() => selectAddress(item)}
    >
      <View style={styles.addressDetails}>
        <Text style={styles.addressName}>{item.title}</Text>
        <Text style={styles.addressText}>{item.address}</Text>
        {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <TouchableOpacity onPress={() => editAddress(item)}>
        <Feather name="edit" size={20} color="#007bff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.paymentItem, selectedPaymentMethod?.id === item.id && styles.paymentItemSelected]}
      onPress={() => selectPaymentMethod(item)}
    >
      <Image source={item.logo} style={styles.paymentLogo} />
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentName}>{item.details}</Text>
        {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <TouchableOpacity onPress={() => editPaymentMethod(item)}>
        <Feather name="edit" size={20} color="#007bff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCouponItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.couponItem, selectedCoupon?.id === item.id && styles.couponItemSelected]}
      onPress={() => selectCoupon(item)}
    >
      <View style={styles.couponDetails}>
        <Text style={styles.couponCode}>{item.code}</Text>
        <Text style={styles.couponDescription}>{item.description}</Text>
        <Text style={styles.couponDiscount}>Save ${item.discount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Image
        source={require('../assets/img/empty-cart.png')}
        style={styles.emptyCartImage}
      />
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartSubtitle}>Explore our delicious items and start shopping!</Text>
      <View style={[styles.shopNowButton, { backgroundColor: '#5ac268' }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity style={styles.cartContainer} onPress={() => console.log('Cart icon pressed')}>
          <Feather name="shopping-cart" size={24} color="#5ac268" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{validCart.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <View style={styles.deliveryTime}>
            <Feather name="clock" size={20} color="#5ac268" style={styles.sectionIcon} />
            <Text style={styles.deliveryText}>Estimated Delivery: 30-45 mins</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="shopping-cart" size={20} color="#333" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Cart Items</Text>
          </View>
          <FlatList
            data={validCart}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => item.id ? `${item.id}` : `cart-${index}`}
            scrollEnabled={false}
            ListEmptyComponent={renderEmptyCart}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="tag" size={20} color="#333" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Coupon</Text>
          </View>
          <TouchableOpacity
            style={styles.selectCouponButton}
            onPress={() => setCouponModalVisible(true)}
          >
            <Text style={styles.selectCouponText}>
              {selectedCoupon ? selectedCoupon.code : 'Select Coupon'}
            </Text>
            <Feather name="chevron-right" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>

        {selectedCoupon && (
          <View style={styles.selectedCouponContainer}>
            <View style={styles.couponCard}>
              <View style={styles.couponDetails}>
                <Text style={styles.couponCode}>{selectedCoupon.code}</Text>
                <Text style={styles.couponDescription}>{selectedCoupon.description}</Text>
                <Text style={styles.couponDiscount}>Saved ${selectedCoupon.discount.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Feather name="x-circle" size={20} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="star" size={20} color="#333" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>You Might Like</Text>
          </View>
          <FlatList
            data={validSuggestedItems}
            renderItem={renderSuggestedItem}
            keyExtractor={(item, index) => item.id ? `${item.id}` : `suggested-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedList}
            ListEmptyComponent={<Text style={styles.emptyText}>No suggested items available</Text>}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#333" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Bill Details</Text>
          </View>
          <View style={styles.billContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (5%)</Text>
              <Text style={styles.billValue}>${gst.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Handling Charge</Text>
              <Text style={styles.billValue}>${handlingCharge.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Charge</Text>
              <Text style={styles.billValue}>${deliveryCharge.toFixed(2)}</Text>
            </View>
            {selectedCoupon && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Coupon Discount</Text>
                <Text style={[styles.billValue, styles.discount]}>-${couponDiscount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tip</Text>
              <Text style={styles.billValue}>${selectedTip.toFixed(2)}</Text>
            </View>
            <View style={[styles.billRow, styles.grandTotal]}>
              <Text style={styles.billLabel}>Grand Total</Text>
              <Text style={styles.billValue}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color="#333" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Tip Your Delivery Partner</Text>
          </View>
          <View style={styles.tipOptions}>
            {validTipOptions.map((tip, index) => (
              <TouchableOpacity
                key={`tip-${index}`}
                style={[styles.tipButton, selectedTip === tip && styles.tipButtonSelected]}
                onPress={() => {
                  setSelectedTip(tip);
                  console.log(`Tip selected: $${tip}`);
                }}
              >
                <Text style={[styles.tipText, selectedTip === tip && styles.tipTextSelected]}>
                  ${tip.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedAddress && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <View style={styles.addressCard}>
              <Feather name="map-pin" size={20} color="#5ac268" style={styles.addressIcon} />
              <View style={styles.addressDetails}>
                <Text style={styles.addressName}>{selectedAddress.title}</Text>
                <Text style={styles.addressText}>{selectedAddress.address}</Text>
                {selectedAddress.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => setAddressModalVisible(true)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedPaymentMethod && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="credit-card" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <View style={styles.paymentCard}>
              <Image source={selectedPaymentMethod.logo} style={styles.paymentLogo} />
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentName}>{selectedPaymentMethod.details}</Text>
                {selectedPaymentMethod.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => setPaymentModalVisible(true)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <View
            style={[styles.proceedButton, (!selectedAddress || !selectedPaymentMethod) && styles.proceedButtonDisabled, { backgroundColor: '#5ac268' }]}
          >
            <TouchableOpacity
              onPress={() => {
                if (!selectedAddress) {
                  setAddressModalVisible(true);
                  console.log('No address selected, opening address modal');
                } else if (!selectedPaymentMethod) {
                  setPaymentModalVisible(true);
                  console.log('No payment method selected, opening payment modal');
                } else {
                  console.log('Proceeding with order:', { address: selectedAddress, payment: selectedPaymentMethod, coupon: selectedCoupon });
                }
              }}
              disabled={!selectedAddress || !selectedPaymentMethod}
            >
              <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={savedAddresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>No addresses saved</Text>}
              contentContainerStyle={styles.addressList}
            />
            <View style={[styles.addAddressButton, { backgroundColor: '#5ac268' }]}>
              <TouchableOpacity onPress={addNewAddress}>
                <Text style={styles.addAddressButtonText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={savedPaymentMethods}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>No payment methods saved</Text>}
              contentContainerStyle={styles.paymentList}
            />
            <View style={[styles.addPaymentButton, { backgroundColor: '#5ac268' }]}>
              <TouchableOpacity onPress={addNewPaymentMethod}>
                <Text style={styles.addPaymentButtonText}>Add New Payment Method</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCouponModalVisible}
        onRequestClose={() => setCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Coupon</Text>
              <TouchableOpacity onPress={() => setCouponModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={validCoupons}
              renderItem={renderCouponItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>No coupons available</Text>}
              contentContainerStyle={styles.couponList}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Home');
            navigation.navigate('Homepage');
          }}
        >
          <Feather
            name="home"
            size={24}
            color={activeTab === 'Home' ? '#5ac268' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Favorite');
            console.log('Favorite pressed');
          }}
        >
          <Feather
            name="heart"
            size={24}
            color={activeTab === 'Favorite' ? '#5ac268' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'Favorite' && styles.navTextActive]}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Categories');
            navigation.navigate('Categories');
          }}
        >
          <Feather
            name="grid"
            size={24}
            color={activeTab === 'Categories' ? '#5ac268' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'Categories' && styles.navTextActive]}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('User');
            console.log('User pressed');
          }}
        >
          <Feather
            name="user"
            size={24}
            color={activeTab === 'User' ? '#5ac268' : '#666'}
          />
          <Text style={[styles.navText, activeTab === 'User' && styles.navTextActive]}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#5ac268',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
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
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  cartDetails: {
    flex: 1,
  },
  cartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartPrice: {
    fontSize: 14,
    color: '#5ac268',
    marginVertical: 6,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#eee',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12,
    color: '#333',
    fontWeight: '500',
  },
  cartActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cartSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  shopNowButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectCouponButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  selectCouponText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedCouponContainer: {
    marginBottom: 20,
  },
  couponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    borderRadius: 12,
    padding: 15,
  },
  couponDetails: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  couponDiscount: {
    fontSize: 14,
    color: '#5ac268',
    fontWeight: '500',
  },
  suggestedList: {
    paddingVertical: 10,
  },
  suggestedCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  suggestedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  suggestedPrice: {
    fontSize: 14,
    color: '#5ac268',
    marginVertical: 6,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  billContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  discount: {
    color: '#5ac268',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
  },
  tipOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    width: 80,
    alignItems: 'center',
  },
  tipButtonSelected: {
    borderColor: '#5ac268',
    backgroundColor: '#e6f4ea',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tipTextSelected: {
    color: '#5ac268',
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressIcon: {
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 6,
    fontWeight: '400',
  },
  defaultBadge: {
    fontSize: 12,
    color: '#5ac268',
    fontWeight: '600',
  },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  changeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    marginVertical: 20,
  },
  proceedButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  addressList: {
    paddingBottom: 20,
  },
  paymentList: {
    paddingBottom: 20,
  },
  couponList: {
    paddingBottom: 20,
  },
  addressItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    alignItems: 'center',
  },
  addressItemSelected: {
    borderWidth: 2,
    borderColor: '#5ac268',
  },
  paymentItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    alignItems: 'center',
  },
  paymentItemSelected: {
    borderWidth: 2,
    borderColor: '#5ac268',
  },
  couponItem: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  couponItemSelected: {
    borderWidth: 2,
    borderColor: '#5ac268',
    backgroundColor: '#e6f4ea',
  },
  couponDetails: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  couponDiscount: {
    fontSize: 14,
    color: '#5ac268',
    fontWeight: '500',
  },
  addAddressButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addAddressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addPaymentButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addPaymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '400',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#5ac268',
    fontWeight: '600',
  },
});