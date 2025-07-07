import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Plus, Leaf } from 'lucide-react-native';
import { Plant } from '../types';
import { Colors } from '../constants/Colors';
import { useApp } from '../contexts/AppContext';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  onAddToCart: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress, onAddToCart }) => {
  const { language } = useApp();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Hard': return Colors.error;
      default: return Colors.textGrey;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth }]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: plant.image }} style={styles.image} />
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plant.difficulty) }]}>
          <Text style={styles.difficultyText}>
            {language === 'gujarati' ? 
              (plant.difficulty === 'Easy' ? 'સરળ' : plant.difficulty === 'Medium' ? 'મધ્યમ' : 'મુશ્કેલ') 
              : plant.difficulty}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {language === 'gujarati' ? plant.nameGujarati : plant.name}
        </Text>
        
        <View style={styles.tagContainer}>
          <Leaf size={14} color={Colors.primary} />
          <Text style={styles.tag} numberOfLines={1}>
            {plant.tag}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.freeText}>
            {language === 'gujarati' ? 'મફત' : 'FREE'}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
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