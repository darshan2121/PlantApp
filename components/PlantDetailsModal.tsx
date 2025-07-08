import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { X, Plus, Minus, ShoppingCart, Leaf, Heart, MapPin } from 'lucide-react-native';
import { Plant } from '../types';
import { Colors } from '../constants/Colors';
import { useApp } from '../contexts/AppContext';

interface PlantDetailsModalProps {
  visible: boolean;
  plant: Plant | null;
  onClose: () => void;
  onBook: () => void;
}

const { width, height } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.85;
const HEADER_HEIGHT = 60;

export const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({
  visible,
  plant,
  onClose,
  onBook,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, language, t } = useApp();
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
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
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

  if (!plant) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(plant);
    }
    onClose();
  };

  const handleBookNow = () => {
    handleAddToCart();
    onBook();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Hard': return Colors.error;
      default: return Colors.textGrey;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return t('easy');
      case 'Medium': return t('medium');
      case 'Hard': return t('hard');
      default: return difficulty;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <TouchableOpacity 
            style={styles.backdropTouch} 
            activeOpacity={1} 
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY }] }
          ]}
        >
          {/* Drag Handle */}
          <View 
            style={styles.dragHandle} 
            {...panResponder.panHandlers}
            accessible
            accessibilityLabel="Drag Handle"
            testID="modal-drag-handle"
          >
            <View style={styles.dragBar} />
          </View>
          
          {/* Header */}
          <View style={styles.header} accessible accessibilityLabel="Modal Header" testID="modal-header">
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle} accessibilityLabel="Modal Title">
                {t('plant_details')}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7} accessible accessibilityLabel="Close Modal Button" testID="modal-close-button">
                <X size={24} color={Colors.textGrey} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            accessible
            accessibilityLabel="Modal Content"
            testID="modal-content"
          >
            {/* Plant Images Gallery */}
            <View style={styles.imageContainer}>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                {(plant.images && plant.images.length > 0 ? plant.images : [plant.image]).map((img: string, idx: number) => (
                  <Image key={idx} source={{ uri: img }} style={styles.image} />
                ))}
              </ScrollView>
              <View style={styles.imageOverlay}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plant.difficulty) }]}> 
                  <Text style={styles.difficultyText}>
                    {getDifficultyText(plant.difficulty)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Plant Info */}
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>
                {t('plant_name', { name: language === 'gujarati' ? plant.nameGujarati : plant.name })}
              </Text>
              
              <View style={styles.tagContainer}>
                <Leaf size={18} color={Colors.primary} />
                <Text style={styles.tag}>{plant.tag}</Text>
              </View>

              {/* Free Badge */}
              <View style={styles.freeBadge}>
                <Heart size={20} color={Colors.error} fill={Colors.error} />
                <Text style={styles.freeText}>
                  {t('free_from_amc')}
                </Text>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>
                  {t('description')}
                </Text>
                <Text style={styles.description}>
                  {t('plant_description', { description: language === 'gujarati' ? plant.descriptionGujarati : plant.description })}
                </Text>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>
                  {t('benefits')}
                </Text>
                <View style={styles.benefitsList}>
                  {(language === 'gujarati' ? plant.benefitsGujarati : plant.benefits).map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.benefitText}>{t('plant_benefit', { benefit })}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Quantity Selector */}
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>
                  {t('select_quantity')}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    activeOpacity={0.7}
                    accessible
                    accessibilityLabel="Decrease Quantity"
                    testID="decrease-quantity"
                  >
                    <Minus size={20} color={quantity === 1 ? Colors.textGrey : Colors.primary} />
                  </TouchableOpacity>
                  
                  <View style={styles.quantityDisplay} accessible accessibilityLabel="Quantity Display" testID="quantity-display">
                    <Text style={styles.quantityText}>{quantity}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.quantityButton, quantity === 10 && styles.quantityButtonDisabled]}
                    onPress={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity === 10}
                    activeOpacity={0.7}
                    accessible
                    accessibilityLabel="Increase Quantity"
                    testID="increase-quantity"
                  >
                    <Plus size={20} color={quantity === 10 ? Colors.textGrey : Colors.primary} />
                  </TouchableOpacity>
                </View>
                
                {quantity === 10 && (
                  <Text style={styles.maxQuantityText}>
                    {t('max_10_plants')}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} activeOpacity={0.7} accessible accessibilityLabel="Add to Cart Button" testID="add-to-cart-modal">
              <ShoppingCart size={20} color={Colors.white} />
              <Text style={styles.addToCartText} accessibilityLabel="Add to Cart Text">
                {t('add_to_cart')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow} activeOpacity={0.7} accessible accessibilityLabel="Book Now Button" testID="book-now-modal">
              <Text style={styles.bookButtonText} accessibilityLabel="Book Now Text">
                {t('book_now')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: MODAL_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandle: {
    width: 60,
    height: 24,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragBar: {
    width: 40,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  header: {
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGreen,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  plantInfo: {
    padding: 20,
  },
  plantName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
    lineHeight: 34,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tag: {
    fontSize: 16,
    color: Colors.textGrey,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  freeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    fontSize: 16,
    color: Colors.textGrey,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  benefitsList: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 12,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textGrey,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGreen,
    borderRadius: 16,
    padding: 16,
  },
  quantityButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.border,
  },
  quantityDisplay: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  maxQuantityText: {
    fontSize: 12,
    color: Colors.textGrey,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
    backgroundColor: Colors.white,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  bookButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});