import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function OrderSuccess({ navigation, route }) {
  const { cart, selectedAddress, selectedPaymentMethod, selectedCoupon, grandTotal } = route.params || {};

  // Generate a simple order ID (for demo; in production, use backend-generated ID)
  const orderId = `ORD-${Math.floor(Date.now() / 1000)}`;

  // Validate cart items
  const validCart = Array.isArray(cart)
    ? cart.filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          item.image &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      )
    : [];

  // Validate other props
  const isValidAddress =
    selectedAddress &&
    typeof selectedAddress === 'object' &&
    typeof selectedAddress.title === 'string' &&
    typeof selectedAddress.address === 'string';
  const isValidPaymentMethod =
    selectedPaymentMethod &&
    typeof selectedPaymentMethod === 'object' &&
    typeof selectedPaymentMethod.details === 'string' &&
    selectedPaymentMethod.logo;
  const isValidCoupon =
    selectedCoupon &&
    typeof selectedCoupon === 'object' &&
    typeof selectedCoupon.code === 'string' &&
    typeof selectedCoupon.discount === 'number';
  const isValidTotal = typeof grandTotal === 'number' && grandTotal >= 0;

  // Log for debugging
  console.log('OrderSuccess route.params:', {
    cart,
    selectedAddress,
    selectedPaymentMethod,
    selectedCoupon,
    grandTotal,
  });
  console.log('Valid cart items:', validCart);
  console.log('Validations:', {
    isValidAddress,
    isValidPaymentMethod,
    isValidCoupon,
    isValidTotal,
  });

  // Render order item
  const renderOrderItem = ({ item, index }) => {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      !item.image ||
      typeof item.quantity !== 'number' ||
      item.quantity <= 0
    ) {
      console.warn('Invalid order item:', item);
      return null;
    }

    return (
      <View
        style={[
          styles.orderItem,
          index === validCart.length - 1 && { borderBottomWidth: 0 }, // No border for last item
        ]}
      >
        <Image source={item.image} style={styles.orderItemImage} />
        <View style={styles.orderItemDetails}>
          <Text style={styles.orderItemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.orderItemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.orderItemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    );
  };

  // Check if critical data is missing
  if (!validCart.length && !isValidAddress && !isValidPaymentMethod && !isValidTotal) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.statusBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Order Confirmed</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: No valid order details available.</Text>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Homepage')}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Order Confirmed</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Success Message */}
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={80} color="#5ac268" />
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>Order ID: {orderId}</Text>
            <Text style={styles.successMessage}>
              Thank you for your order. You'll receive a confirmation soon.
            </Text>
          </View>

          {/* Order Items */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="shopping-bag" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Ordered Items</Text>
            </View>
            <FlatList
              data={validCart}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => (item.id ? `${item.id}` : `order-item-${index}`)}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={styles.emptyText}>No items in order</Text>}
            />
          </View>

          {/* Delivery Address */}
          {isValidAddress && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Feather name="map-pin" size={20} color="#333" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Delivery Address</Text>
              </View>
              <View style={styles.addressCard}>
                <Feather name="map-pin" size={20} color="#5ac268" style={styles.addressIcon} />
                <View style={styles.addressDetails}>
                  <Text style={styles.addressTitle}>{selectedAddress.title}</Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {selectedAddress.address}
                  </Text>
                  {selectedAddress.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
                </View>
              </View>
            </View>
          )}

          {/* Payment Method */}
          {isValidPaymentMethod && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Feather name="credit-card" size={20} color="#333" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              <View style={styles.paymentCard}>
                <Image source={selectedPaymentMethod.logo} style={styles.paymentLogo} />
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentText}>{selectedPaymentMethod.details}</Text>
                  {selectedPaymentMethod.isDefault && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Coupon Details */}
          {isValidCoupon && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Feather name="tag" size={20} color="#333" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Coupon Applied</Text>
              </View>
              <View style={styles.couponCard}>
                <View style={styles.couponDetails}>
                  <Text style={styles.couponCode}>{selectedCoupon.code}</Text>
                  <Text style={styles.couponDiscount}>
                    Saved ${selectedCoupon.discount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Total */}
          {isValidTotal && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Feather name="file-text" size={20} color="#333" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Order Total</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate('OrderTracking', { orderId })}
            >
              <Feather name="map" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Homepage')}
            >
              <Feather name="home" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5ac268',
    marginTop: 8,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
  },
  orderItemQuantity: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  addressIcon: {
    marginRight: 10,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  defaultBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5ac268',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#e6f4ea',
    borderRadius: 8,
  },
  couponDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  couponDiscount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5ac268',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 5,
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
});