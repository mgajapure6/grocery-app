import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { orders } from '../data/staticData';

export default function OrderHistory({ navigation }) {
  const [activeTab, setActiveTab] = useState('User');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const renderOrderItem = (item, index) => (
    <View style={styles.orderDetailItem} key={`order-history-order-item-${index}`}>
      <Image source={item.image} style={styles.orderDetailImage} />
      <View style={styles.orderDetailInfo}>
        <Text style={styles.orderDetailName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.orderDetailPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.orderDetailQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.orderDetailTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderOrder = ({ item, index }) => {
    const isExpanded = expandedOrderId === item.id;

    return (
      <View
        key={`order-history-order-${item.id}`}
        style={[
          styles.orderItem,
          index === orders.length - 1 && { borderBottomWidth: 0 },
        ]}
      >
        {/* Order Summary */}
        <TouchableOpacity
          style={styles.orderSummary}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.orderDetails}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
            <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
          </View>
          <View style={styles.orderStatusContainer}>
            <Text
              style={[
                styles.orderStatus,
                item.status === 'Delivered' && styles.orderStatusDelivered,
                item.status === 'Cancelled' && styles.orderStatusCancelled,
              ]}
            >
              {item.status}
            </Text>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {/* Order Details (Expandable) */}
        {isExpanded && (
          <View style={styles.orderDetailsContainer}>
            {/* Items */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Items</Text>
              {item.items.map(renderOrderItem)}
            </View>

            {/* Shipping Address */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Shipping Address</Text>
              <View style={styles.addressCard}>
                <View style={styles.addressTitleSection}>
                  <Feather name="map-pin" size={20} color="#333" style={styles.sectionIcon} />
                  <Text style={styles.addressTitle}>{item.address.title}</Text>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {item.address.address}
                </Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Payment Method</Text>
              <View style={styles.paymentCard}>
                <Image source={item.paymentMethod.logo} style={styles.paymentLogo} />
                <Text style={styles.paymentText}>
                  {item.paymentMethod.type} ****{item.paymentMethod.last4}
                </Text>
              </View>
            </View>

            {/* Total */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Order Total</Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Download Invoice */}
            <TouchableOpacity
              style={styles.invoiceButton}
              onPress={() => console.log(`Download invoice for order ${item.id}`)}
            >
              <Feather name="download" size={20} color="#fff" style={styles.invoiceIcon} />
              <Text style={styles.invoiceButtonText}>Download Invoice</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Order History</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Feather name="shopping-bag" size={20} color="#333" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Your Orders</Text>
            </View>
            {orders.length > 0 ? (
              orders.map((item, index) => renderOrder({ item, index }))
            ) : (
              <Text style={styles.emptyText}>No orders found</Text>
            )}
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
  header: {
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
  sectionContainer: {
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
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5ac268',
  },
  orderStatusContainer: {
    alignItems: 'flex-end',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderStatusDelivered: {
    color: '#5ac268',
  },
  orderStatusCancelled: {
    color: '#ff3b30',
  },
  orderDetailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  orderDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderDetailImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  orderDetailInfo: {
    flex: 1,
  },
  orderDetailName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderDetailPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5ac268',
  },
  orderDetailQuantity: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  orderDetailTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  addressTitleSection:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5ac268',
  },
  invoiceButton: {
    flexDirection: 'row',
    backgroundColor: '#5ac268',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  invoiceIcon: {
    marginRight: 8,
  },
  invoiceButtonText: {
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