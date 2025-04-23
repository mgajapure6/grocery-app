import React, { useContext, useState } from 'react';
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
import { CartContext } from '../contexts/CartContext';

export default function OrderSummary({ navigation, route }) {
  const { cart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('OrderSummary');
  const { selectedAddress, selectedPaymentMethod, selectedCoupon } = route.params || {};

  // Calculate order summary (aligned with Cart.js)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const handlingCharge = 1.00;
  const deliveryCharge = 3.00;
  const couponDiscount = selectedCoupon?.discount || 0;
  const selectedTip = 0; // Tip not passed; assume 0 for now
  const grandTotal = subtotal + gst + handlingCharge + deliveryCharge - couponDiscount + selectedTip;

  // Check if order can be placed
  const canPlaceOrder = cart.length > 0 && selectedAddress && selectedPaymentMethod;

  // Render cart item
  const renderCartItem = ({ item, index }) => (
    <View
      style={[
        styles.cartItem,
        index === cart.length - 1 && { borderBottomWidth: 0 }, // No border for last item
      ]}
    >
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.cartItemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.cartItemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

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
            <Text style={styles.title}>Order Summary</Text>
          </View>
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('Cart')}
          >
            <Feather name="shopping-cart" size={24} color="#5ac268" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cart Items */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="shopping-bag" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Order Items</Text>
            </View>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item, index) => (item.id ? `${item.id}` : `cart-items-${index}`)}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty</Text>}
            />
          </View>

          {/* Delivery Address */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            {selectedAddress ? (
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
            ) : (
              <Text style={styles.emptyText}>No address selected</Text>
            )}
          </View>

          {/* Payment Method */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="credit-card" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            {selectedPaymentMethod ? (
              <View style={styles.paymentCard}>
                <Image source={selectedPaymentMethod.logo} style={styles.paymentLogo} />
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentText}>{selectedPaymentMethod.details}</Text>
                  {selectedPaymentMethod.isDefault && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.emptyText}>No payment method selected</Text>
            )}
          </View>

          {/* Coupon Details (if applicable) */}
          {selectedCoupon && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Feather name="tag" size={20} color="#333" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Coupon</Text>
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

          {/* Order Summary */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (5%)</Text>
              <Text style={styles.summaryValue}>${gst.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Handling Charge</Text>
              <Text style={styles.summaryValue}>${handlingCharge.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={styles.summaryValue}>${deliveryCharge.toFixed(2)}</Text>
            </View>
            {selectedCoupon && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Coupon Discount</Text>
                <Text style={[styles.summaryValue, styles.discount]}>
                  -${couponDiscount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>${selectedTip.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryLabelTotal}>Grand Total</Text>
              <Text style={styles.summaryValueTotal}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[styles.placeOrderButton, !canPlaceOrder && styles.placeOrderButtonDisabled]}
            onPress={() => {
              if (canPlaceOrder) {
                navigation.navigate('OrderSuccess', {
                  cart,
                  selectedAddress,
                  selectedPaymentMethod,
                  selectedCoupon,
                  grandTotal,
                });
              }
            }}
            disabled={!canPlaceOrder}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
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
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5ac268',
  },
  cartBadgeText: {
    color: '#5ac268',
    fontSize: 12,
    fontWeight: 'bold',
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
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
  },
  cartItemQuantity: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  cartItemTotal: {
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
    paddingHorizontal:10
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  discount: {
    color: '#5ac268',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 5,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  summaryValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5ac268',
  },
  placeOrderButton: {
    backgroundColor: '#5ac268',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  placeOrderText: {
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
});