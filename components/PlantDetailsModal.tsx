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
  const { addToCart, language } = useApp();
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
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
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
    if (language === 'gujarati') {
      switch (difficulty) {
        case 'Easy': return 'સરળ';
        case 'Medium': return 'મધ્યમ';
        case 'Hard': return 'મુશ્કેલ';
        default: return difficulty;
      }
    }
    return difficulty;
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
          {...panResponder.panHandlers}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>
                {language === 'gujarati' ? 'છોડની વિગતો' : 'Plant Details'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.textGrey} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Plant Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: plant.image }} style={styles.image} />
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
                {language === 'gujarati' ? plant.nameGujarati : plant.name}
              </Text>
              
              <View style={styles.tagContainer}>
                <Leaf size={18} color={Colors.primary} />
                <Text style={styles.tag}>{plant.tag}</Text>
              </View>

              {/* Free Badge */}
              <View style={styles.freeBadge}>
                <Heart size={20} color={Colors.error} fill={Colors.error} />
                <Text style={styles.freeText}>
                  {language === 'gujarati' ? 'AMC તરફથી મફત' : 'FREE from AMC'}
                </Text>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>
                  {language === 'gujarati' ? 'વર્ણન:' : 'Description:'}
                </Text>
                <Text style={styles.description}>
                  {language === 'gujarati' ? plant.descriptionGujarati : plant.description}
                </Text>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>
                  {language === 'gujarati' ? 'ફાયદાઓ:' : 'Benefits:'}
                </Text>
                <View style={styles.benefitsList}>
                  {(language === 'gujarati' ? plant.benefitsGujarati : plant.benefits).map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Pickup Location */}
              <View style={styles.pickupContainer}>
                <MapPin size={18} color={Colors.amcBlue} />
                <Text style={styles.pickupText}>
                  {language === 'gujarati' 
                    ? 'AMC નર્સરી, નવરંગપુરા થી લો' 
                    : 'Pickup from AMC Nursery, Navrangpura'}
                </Text>
              </View>

              {/* Quantity Selector */}
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>
                  {language === 'gujarati' ? 'સંખ્યા પસંદ કરો:' : 'Select Quantity:'}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                  >
                    <Minus size={20} color={quantity === 1 ? Colors.textGrey : Colors.primary} />
                  </TouchableOpacity>
                  
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{quantity}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.quantityButton, quantity === 10 && styles.quantityButtonDisabled]}
                    onPress={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity === 10}
                  >
                    <Plus size={20} color={quantity === 10 ? Colors.textGrey : Colors.primary} />
                  </TouchableOpacity>
                </View>
                
                {quantity === 10 && (
                  <Text style={styles.maxQuantityText}>
                    {language === 'gujarati' ? 'મહત્તમ 10 છોડ' : 'Maximum 10 plants'}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <ShoppingCart size={20} color={Colors.white} />
              <Text style={styles.addToCartText}>
                {language === 'gujarati' ? 'કાર્ટમાં ઉમેરો' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
              <Text style={styles.bookButtonText}>
                {language === 'gujarati' ? 'હવે બુક કરો' : 'Book Now'}
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
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
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
  pickupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.amcBlue,
  },
  pickupText: {
    fontSize: 14,
    color: Colors.amcBlue,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
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