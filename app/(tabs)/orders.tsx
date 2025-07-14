import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Package, Clock, CircleCheck as CheckCircle, Truck } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/orderSlice';
import { RootState, AppDispatch } from '../../store';
import { OrderDetailsModal } from '../../components/OrderDetailsModal';
import axios from 'axios';
import { BASE_URL } from '../../store/api';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import OrderSkeleton from '../../components/OrderSkeleton';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
  const dispatch: AppDispatch = useDispatch();
  const { language, t } = useApp();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const error = useSelector((state: RootState) => state.orders.error);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleOrderPress = async (order: any) => {
    setModalVisible(true);
    setDetailsLoading(true);
    setOrderDetails(null);
    try {
      const res = await axios.get(`${BASE_URL}/orders/${order._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrderDetails(res.data.order);
    } catch (err) {
      setOrderDetails({ error: 'Failed to load order details.' });
    }
    setDetailsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyOrders());
    setRefreshing(false);
  };

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus?.toLowerCase()) {
      case 'pending':
        return Colors.warning;
      case 'approved':
        return Colors.amcBlue;
      case 'ready for pickup':
      case 'ready':
        return Colors.primary;
      case 'delivered':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textGrey;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Requested':
        return <Clock size={16} color={Colors.white} />;
      case 'Approved':
        return <CheckCircle size={16} color={Colors.white} />;
      case 'Ready for Pickup':
        return <Package size={16} color={Colors.white} />;
      case 'Delivered':
        return <Truck size={16} color={Colors.white} />;
      default:
        return <Clock size={16} color={Colors.white} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Requested': return t('order_status_requested');
      case 'Approved': return t('order_status_approved');
      case 'Ready for Pickup': return t('order_status_ready');
      case 'Delivered': return t('order_status_delivered');
      default: return status;
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    // console.log('Order orderStatus:', item.orderStatus);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeaderRow}>
          <Text style={styles.orderId}>
            Order #{item.orderNumber || item._id}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) }]}> 
            {getStatusIcon(item.orderStatus)}
            <Text style={styles.statusText}>{item.orderStatus}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>
          Booking Date: {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <View style={styles.plantsContainer}>
          {item.items.map((orderItem: any, index: number) => (
            <View key={index} style={styles.plantRow}>
              <Text style={styles.plantName}>
                Plant: {orderItem.item?.name || orderItem.item?._id || orderItem.item || 'Unknown Plant'}
              </Text>
              <Text style={styles.plantQuantity}>
                Quantity: {orderItem.quantity}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.orderFooter}>
          <Text style={styles.totalPlants}>
            Total Plants: {item.items.reduce((total: number, plant: any) => total + plant.quantity, 0)}
          </Text>
        </View>
        {item.orderStatus === 'Ready for Pickup' && (
          <View style={styles.pickupInfo}>
            <Text style={styles.pickupText}>
              Please pick up your order at the designated location.
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (showSkeleton) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            My Orders
          </Text>
        </View>
        <View style={styles.ordersList}>
          {[...Array(3)].map((_, idx) => (
            <OrderSkeleton key={idx} />
          ))}
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error loading data</Text>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }
  if (!orders || orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            My Orders
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Package size={80} color={Colors.textGrey} />
          <Text style={styles.emptyText}>
            No orders found.
          </Text>
          <Text style={styles.emptySubtext}>
            You have not placed any orders yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          My Orders
        </Text>
        <Text style={styles.orderCount}>
          {orders.length} orders
        </Text>
      </View>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <AnimatedPressable
            onPress={() => handleOrderPress(item)}
            style={({ pressed }: { pressed: boolean }) => [
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            {renderOrderItem({ item })}
          </AnimatedPressable>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.lightGreen}
            tintColor={Colors.primary}
            title="Pull to refresh"
            titleColor={Colors.primary}
          />
        }
      />
      <OrderDetailsModal
        visible={modalVisible}
        order={orderDetails}
        loading={detailsLoading}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  orderCount: {
    fontSize: 16,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textGrey,
    marginBottom: 8,
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // allow badge to align to top
    flexWrap: 'wrap',         // allow wrapping if needed
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,                  // take available space
    minWidth: 0,              // allow text to shrink
    marginRight: 8,           // space between order number and badge
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexShrink: 0,
    alignSelf: 'flex-start',  // keep badge at top right
    marginTop: 2,
    maxWidth: 120,
  },
  statusText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  plantsContainer: {
    marginBottom: 12,
  },
  plantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.lightGreen,
    padding: 8,
    borderRadius: 12,
  },
  plantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,
  },
  plantQuantity: {
    fontSize: 12,
    color: Colors.textGrey,
    marginLeft: 12,
    flexShrink: 0,
  },
  freeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    fontFamily: 'Poppins-SemiBold',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  totalPlants: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  pickupInfo: {
    backgroundColor: Colors.amcBlue,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  pickupText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});