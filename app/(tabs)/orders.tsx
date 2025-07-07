import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Package, Clock, CircleCheck as CheckCircle, Truck } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
  const { orders, language } = useApp();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Requested':
        return Colors.warning;
      case 'Approved':
        return Colors.amcBlue;
      case 'Ready for Pickup':
        return Colors.primary;
      case 'Delivered':
        return Colors.success;
      default:
        return Colors.textGrey;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
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

  const getStatusText = (status: Order['status']) => {
    if (language === 'gujarati') {
      switch (status) {
        case 'Requested': return 'વિનંતી કરેલ';
        case 'Approved': return 'મંજૂર';
        case 'Ready for Pickup': return 'લેવા માટે તૈયાર';
        case 'Delivered': return 'પહોંચાડેલ';
        default: return status;
      }
    }
    return status;
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>
          {language === 'gujarati' ? `ઓર્ડર #${item.id}` : `Order #${item.id}`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          {getStatusIcon(item.status)}
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.orderDate}>
        {language === 'gujarati' ? 'બુકિંગ તારીખ: ' : 'Booking Date: '}
        {new Date(item.bookingDate).toLocaleDateString(
          language === 'gujarati' ? 'gu-IN' : 'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )}
      </Text>

      <View style={styles.plantsContainer}>
        {item.plants.map((cartItem, index) => (
          <View key={index} style={styles.plantItem}>
            <Image source={{ uri: cartItem.plant.image }} style={styles.plantImage} />
            <View style={styles.plantDetails}>
              <Text style={styles.plantName}>
                {language === 'gujarati' ? cartItem.plant.nameGujarati : cartItem.plant.name}
              </Text>
              <Text style={styles.plantQuantity}>
                {language === 'gujarati' ? `સંખ્યા: ${cartItem.quantity}` : `Quantity: ${cartItem.quantity}`}
              </Text>
            </View>
            <Text style={styles.freeText}>
              {language === 'gujarati' ? 'મફત' : 'FREE'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalPlants}>
          {language === 'gujarati' 
            ? `કુલ છોડ: ${item.plants.reduce((total, plant) => total + plant.quantity, 0)}` 
            : `Total Plants: ${item.plants.reduce((total, plant) => total + plant.quantity, 0)}`}
        </Text>
      </View>

      {item.status === 'Ready for Pickup' && (
        <View style={styles.pickupInfo}>
          <Text style={styles.pickupText}>
            {language === 'gujarati' 
              ? '📍 AMC નર્સરી, નવરંગપુરા થી લો' 
              : '📍 Pickup from AMC Nursery, Navrangpura'}
          </Text>
        </View>
      )}
    </View>
  );

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'gujarati' ? 'મારા ઓર્ડર' : 'My Orders'}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Package size={80} color={Colors.textGrey} />
          <Text style={styles.emptyText}>
            {language === 'gujarati' ? 'હજુ સુધી કોઈ ઓર્ડર નથી' : 'No orders yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {language === 'gujarati' ? 'તમારા બુક કરેલા છોડ અહીં દેખાશે' : 'Your booked plants will appear here'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'gujarati' ? 'મારા ઓર્ડર' : 'My Orders'}
        </Text>
        <Text style={styles.orderCount}>
          {language === 'gujarati' 
            ? `${orders.length} ઓર્ડર${orders.length > 1 ? 'સ' : ''}` 
            : `${orders.length} order${orders.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 10,
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
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
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
    fontFamily: 'Poppins-SemiBold',
  },
  plantQuantity: {
    fontSize: 12,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
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