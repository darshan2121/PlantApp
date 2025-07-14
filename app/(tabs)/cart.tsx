import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';
import { CartItem } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../store/orderSlice';
import { RootState, AppDispatch } from '../../store';
import MatureToast from '../../components/MatureToast';
import { IMAGE_BASE_URL } from '../../store/api';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart, language, t } = useApp();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const orderLoading = useSelector((state: RootState) => state.orders.loading);
  const orderError = useSelector((state: RootState) => state.orders.error);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');

  const emptyAddress = {
    area: '',
    ward: '',
    pinCode: '',
    city: '',
    state: '',
    country: '',
    contactPhone: '',
    contactName: '',
  };

  const [address, setAddress] = useState(emptyAddress);
  const [notes, setNotes] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleInputChange = (field: keyof typeof emptyAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleBookPlants = () => {
    if (cart.length === 0) {
      setToastMessage(language === 'gujarati' ? 'કૃપા કરીને પહેલા કાર્ટમાં છોડ ઉમેરો' : 'Please add some plants to your cart first');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!user) {
      setToastMessage('You must be logged in to place an order.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    // Validate address fields with specific messages and format
    if (!address.contactName.trim()) {
      setToastMessage('Contact name is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.contactPhone.trim()) {
      setToastMessage('Contact phone is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!/^[0-9]{10}$/.test(address.contactPhone.trim())) {
      setToastMessage('Contact phone must be a valid 10-digit number.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.area.trim()) {
      setToastMessage('Area is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.ward.trim()) {
      setToastMessage('Ward is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.pinCode.trim()) {
      setToastMessage('Pin code is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!/^[0-9]{6}$/.test(address.pinCode.trim())) {
      setToastMessage('Pin code must be a valid 6-digit number.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.city.trim()) {
      setToastMessage('City is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.state.trim()) {
      setToastMessage('State is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    if (!address.country.trim()) {
      setToastMessage('Country is required.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    handleConfirmOrder(address, notes);
  };

  const handleConfirmOrder = async (address: typeof emptyAddress, notes: string) => {
    if (!user) {
      setToastMessage('You must be logged in to place an order.');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    const orderPayload = {
      paymentMethod: null,
      deliveryAddress: {
        area: address.area,
        ward: address.ward,
        pinCode: address.pinCode,
        city: address.city,
        state: address.state,
        country: address.country,
        contactPhone: address.contactPhone,
        contactName: address.contactName,
      },
      items: cart.map(item => ({
        item: item.plant.id,
        quantity: item.quantity,
        price: 0,
      })),
      notes: notes,
      orderNumber: 'ORD-' + Date.now(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      user: user.id,
    };
    console.log('Order payload:', orderPayload);
    try {
      await dispatch(createOrder(orderPayload)).unwrap();
      setShowAddressModal(false);
      setToastMessage('Order placed successfully!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        router.push('/success');
        clearCart(); // moved here, after navigation
      }, 1000);
    } catch (err: any) {
      let backendMsg = err?.response?.data?.message || err?.message || orderError || 'Could not place order.';
      setToastMessage(backendMsg);
      setToastType('error');
      setToastVisible(true);
    }
  };

  const handleRemoveItem = (plantId: string) => {
    Alert.alert(
      language === 'gujarati' ? 'આઇટમ દૂર કરો' : 'Remove Item',
      language === 'gujarati' ? 'શું તમે ખરેખર આ આઇટમ કાર્ટમાંથી દૂર કરવા માંગો છો?' : 'Are you sure you want to remove this item from your cart?',
      [
        { text: language === 'gujarati' ? 'રદ કરો' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'gujarati' ? 'દૂર કરો' : 'Remove', 
          style: 'destructive', 
          onPress: () => removeFromCart(plantId) 
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // If you fetch cart from backend, do it here. For now, just simulate delay.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{
          uri:
            (item.plant as any).imageUrlFull ||
            ((item.plant as any).imageUrl ? `${IMAGE_BASE_URL}${(item.plant as any).imageUrl}` : item.plant.image)
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
          {language === 'gujarati' ? item.plant.nameGujarati : item.plant.name}
        </Text>
        <Text style={styles.itemTag} numberOfLines={1} ellipsizeMode="tail">{item.plant.tag}</Text>
        <Text style={styles.freeText} numberOfLines={1} ellipsizeMode="tail">
          {t('free')}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.plant.id, item.quantity - 1)}
          activeOpacity={0.7}
          accessible
          accessibilityLabel="Decrease Quantity"
          testID={`decrease-quantity-${item.plant.id}`}
        >
          <Minus size={16} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText} accessibilityLabel="Quantity Display" testID={`quantity-display-${item.plant.id}`}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.plant.id, item.quantity + 1)}
          activeOpacity={0.7}
          accessible
          accessibilityLabel="Increase Quantity"
          testID={`increase-quantity-${item.plant.id}`}
        >
          <Plus size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.plant.id)}
        activeOpacity={0.7}
        accessible
        accessibilityLabel="Remove Item"
        testID={`remove-item-${item.plant.id}`}
      >
        <Trash2 size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} accessible accessibilityLabel="Cart Screen Empty State">
        <View style={styles.header}>
          <Text style={styles.title} accessibilityLabel="Cart Title">
            {t('shopping_cart')}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color={Colors.textGrey} />
          <Text style={styles.emptyText} accessibilityLabel="Cart Empty Text">
            {t('cart_empty')}
          </Text>
          <Text style={styles.emptySubtext} accessibilityLabel="Cart Empty Subtext">
            {t('cart_empty_subtext')}
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.7}
            accessible
            accessibilityLabel="Start Shopping Button"
            testID="start-shopping"
          >
            <Text style={styles.shopButtonText} accessibilityLabel="Start Shopping Text">
              {t('start_shopping')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} accessible accessibilityLabel="Cart Screen">
      <View style={styles.header}>
        <Text style={styles.title} accessibilityLabel="Cart Title">
          {t('shopping_cart')}
        </Text>
        <Text style={styles.itemCount} accessibilityLabel="Cart Item Count">
          {t('cart_items_count', { count: cart.length })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Cart Items */}
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.plant.id}
          contentContainerStyle={styles.cartList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // FlatList inside ScrollView: disable its own scroll
          accessibilityLabel="Cart List"
          testID="cart-list"
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

        {/* Address Fields below cart cards */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: Colors.primary }}>Delivery Address</Text>
          <TextInput style={styles.input} placeholder="Contact Name" value={address.contactName} onChangeText={v => handleInputChange('contactName', v)} />
          <TextInput style={styles.input} placeholder="Contact Phone" value={address.contactPhone} onChangeText={v => handleInputChange('contactPhone', v)} keyboardType="phone-pad" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Area" value={address.area} onChangeText={v => handleInputChange('area', v)} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Ward" value={address.ward} onChangeText={v => handleInputChange('ward', v)} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Pin Code" value={address.pinCode} onChangeText={v => handleInputChange('pinCode', v)} keyboardType="numeric" />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="City" value={address.city} onChangeText={v => handleInputChange('city', v)} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="State" value={address.state} onChangeText={v => handleInputChange('state', v)} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Country" value={address.country} onChangeText={v => handleInputChange('country', v)} />
          </View>
          <TextInput style={styles.input} placeholder="Notes (optional)" value={notes} onChangeText={setNotes} multiline />
        </View>
      </ScrollView>

      {/* Footer: Total and Book Plants Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel} accessibilityLabel="Total Plants Label">
            {t('total_plants_label')}
          </Text>
          <Text style={styles.totalAmount} accessibilityLabel="Total Plants Amount">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookPlants} activeOpacity={0.7} accessible accessibilityLabel="Book Plants Button" testID="book-plants" disabled={orderLoading}>
          <Text style={styles.bookButtonText} accessibilityLabel="Book Plants Text">
            {orderLoading ? t('loading') : t('book_plants')}
          </Text>
        </TouchableOpacity>
        <MatureToast
          message={toastMessage}
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
          type={toastType}
          duration={2000}
        />
      </View>
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
  itemCount: {
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
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  shopButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  cartList: {
    padding: 20,
  },
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  itemTag: {
    fontSize: 12,
    color: Colors.textGrey,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  freeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.success,
    fontFamily: 'Poppins-Bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    minWidth: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  bookButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: Colors.lightGreen,
  },
});