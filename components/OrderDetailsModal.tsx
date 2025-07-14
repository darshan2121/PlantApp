import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { X, Package, Truck, Clock, CheckCircle } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.85;
const HEADER_HEIGHT = 60;

export const OrderDetailsModal = ({ visible, order, loading, onClose }: {
  visible: boolean;
  order: any;
  loading: boolean;
  onClose: () => void;
}) => {
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: MODAL_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 60 || gestureState.vy > 0.3) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]}> 
          <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}> 
          {/* Drag Handle */}
          <View style={styles.dragHandle} {...panResponder.panHandlers}>
            <View style={styles.dragBar} />
          </View>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Order Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <X size={24} color={Colors.textGrey} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 24 }}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            ) : order ? (
              <View>
                <Text style={styles.orderNumber}>Order #{order.orderNumber || order._id}</Text>
                <Text style={styles.status}>Status: {order.orderStatus}</Text>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <Text style={styles.address}>{order.fullDeliveryAddress}</Text>
                <Text style={styles.sectionTitle}>Contact</Text>
                <Text style={styles.address}>{order.deliveryAddress?.contactName} ({order.deliveryAddress?.contactPhone})</Text>
                <Text style={styles.sectionTitle}>Items</Text>
                {order.items.map((item: any, idx: number) => (
                  <Text key={idx} style={styles.itemText}>
                    - {item.item?.name || item.item?._id || item.item || 'Unknown'} x {item.quantity}
                  </Text>
                ))}
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{order.notes || 'None'}</Text>
                <Text style={styles.sectionTitle}>Estimated Delivery</Text>
                <Text style={styles.notes}>{order.estimatedDelivery?.slice(0, 10)}</Text>
                <Text style={styles.sectionTitle}>Tracking History</Text>
                {order.trackingHistory && order.trackingHistory.length > 0 ? (
                  order.trackingHistory.map((track: any, idx: number) => (
                    <Text key={idx} style={styles.trackingText}>
                      {track.status} - {track.description} ({new Date(track.timestamp).toLocaleString()})
                    </Text>
                  ))
                ) : (
                  <Text style={styles.notes}>No tracking history.</Text>
                )}
              </View>
            ) : (
              <Text style={styles.notes}>Failed to load order details.</Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  backdropTouch: { flex: 1 },
  modalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: MODAL_HEIGHT, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 16 },
  dragHandle: { width: 60, height: 24, alignSelf: 'center', marginTop: 12, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  dragBar: { width: 40, height: 6, backgroundColor: Colors.border, borderRadius: 3 },
  header: { height: HEADER_HEIGHT, borderBottomWidth: 1, borderBottomColor: Colors.border, justifyContent: 'center' },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.primary, fontFamily: 'Poppins-Bold' },
  closeButton: { padding: 8, borderRadius: 20, backgroundColor: Colors.lightGreen },
  content: { flex: 1 },
  orderNumber: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 8, fontFamily: 'Poppins-Bold' },
  status: { fontSize: 16, color: Colors.textGrey, marginBottom: 8, fontFamily: 'Poppins-SemiBold' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.black, marginTop: 16, marginBottom: 4, fontFamily: 'Poppins-SemiBold' },
  address: { fontSize: 15, color: Colors.textGrey, marginBottom: 4, fontFamily: 'Poppins-Regular' },
  itemText: { fontSize: 15, color: Colors.textGrey, marginLeft: 8, fontFamily: 'Poppins-Regular' },
  notes: { fontSize: 15, color: Colors.textGrey, marginBottom: 4, fontFamily: 'Poppins-Regular' },
  trackingText: { fontSize: 13, color: Colors.textGrey, marginLeft: 8, fontFamily: 'Poppins-Regular' },
}); 