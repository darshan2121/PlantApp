import React from 'react';
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
} from 'react-native';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';
import { CartItem } from '../../types';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart, addOrder, language } = useApp();
  const router = useRouter();

  const handleBookPlants = () => {
    if (cart.length === 0) {
      Alert.alert(
        language === 'gujarati' ? 'ખાલી કાર્ટ' : 'Empty Cart', 
        language === 'gujarati' ? 'કૃપા કરીને પહેલા કાર્ટમાં છોડ ઉમેરો' : 'Please add some plants to your cart first'
      );
      return;
    }

    const order = {
      id: Date.now().toString(),
      plants: cart,
      bookingDate: new Date().toISOString(),
      status: 'Requested' as const,
      contactNumber: '1234567890',
    };

    addOrder(order);
    clearCart();
    router.push('/success');
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

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.plant.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {language === 'gujarati' ? item.plant.nameGujarati : item.plant.name}
        </Text>
        <Text style={styles.itemTag}>{item.plant.tag}</Text>
        <Text style={styles.freeText}>
          {language === 'gujarati' ? 'મફત' : 'FREE'}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.plant.id, item.quantity - 1)}
        >
          <Minus size={16} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.plant.id, item.quantity + 1)}
        >
          <Plus size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.plant.id)}
      >
        <Trash2 size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'gujarati' ? 'શોપિંગ કાર્ટ' : 'Shopping Cart'}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color={Colors.textGrey} />
          <Text style={styles.emptyText}>
            {language === 'gujarati' ? 'તમારું કાર્ટ ખાલી છે' : 'Your cart is empty'}
          </Text>
          <Text style={styles.emptySubtext}>
            {language === 'gujarati' ? 'શરૂ કરવા માટે કેટલાક છોડ ઉમેરો' : 'Add some plants to get started'}
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.shopButtonText}>
              {language === 'gujarati' ? 'શોપિંગ શરૂ કરો' : 'Start Shopping'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'gujarati' ? 'શોપિંગ કાર્ટ' : 'Shopping Cart'}
        </Text>
        <Text style={styles.itemCount}>
          {language === 'gujarati' 
            ? `${cart.length} આઇટમ${cart.length > 1 ? 'સ' : ''}` 
            : `${cart.length} item${cart.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.plant.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            {language === 'gujarati' ? 'કુલ છોડ:' : 'Total Plants:'}
          </Text>
          <Text style={styles.totalAmount}>
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookPlants}>
          <Text style={styles.bookButtonText}>
            {language === 'gujarati' ? 'છોડ બુક કરો' : 'Book Plants'}
          </Text>
        </TouchableOpacity>
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
    paddingTop: 10,
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
});