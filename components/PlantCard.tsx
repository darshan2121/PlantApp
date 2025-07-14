import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Plus, Leaf } from 'lucide-react-native';
import { Plant } from '../types';
import { Colors } from '../constants/Colors';
import { useApp } from '../contexts/AppContext';
import { IMAGE_BASE_URL } from '../store/api';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  onAddToCart: () => void;
  testID?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress, onAddToCart, testID }) => {
  const { language, t } = useApp();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Hard': return Colors.error;
      default: return Colors.textGrey;
    }
  };

  const getDifficultyKey = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return t('easy');
      case 'Medium': return t('medium');
      case 'Hard': return t('hard');
      default: return difficulty;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={`Plant Card: ${t('greeting', { name: language === 'gujarati' ? plant.nameGujarati : plant.name })}`}
      testID={testID}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              (plant as any).imageUrlFull ||
              ((plant as any).imageUrl ? `${IMAGE_BASE_URL}${(plant as any).imageUrl}` : plant.image)
          }}
          style={styles.image}
        />
        {/* <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plant.difficulty) }]}>
          <Text style={styles.difficultyText} numberOfLines={1} ellipsizeMode="tail">
            {getDifficultyKey(plant.difficulty)}
          </Text>
        </View> */}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {t('plant_name', { name: language === 'gujarati' ? plant.nameGujarati : plant.name })}
        </Text>
        
        <View style={styles.tagContainer}>
          <Leaf size={14} color={Colors.primary} />
          <Text style={styles.tag} numberOfLines={1} ellipsizeMode="tail">
            {plant.tag}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.freeText} numberOfLines={1} ellipsizeMode="tail">
            {t('free')}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddToCart}
            activeOpacity={0.7}
            accessible
            accessibilityLabel={`Add ${language === 'gujarati' ? plant.nameGujarati : plant.name} to cart`}
            testID={`add-to-cart-${plant.id}`}
          >
            <Plus size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 6,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: Colors.textGrey,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
    fontFamily: 'Poppins-Bold',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});