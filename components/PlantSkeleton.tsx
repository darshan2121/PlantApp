import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 12) / 2; // match PlantCard sizing

export default function PlantSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.textRow} />
      <View style={styles.textRowShort} />
      <View style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.7,
    borderRadius: 12,
    backgroundColor: Colors.lightGreen,
    marginBottom: 12,
  },
  textRow: {
    width: '80%',
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    marginBottom: 8,
  },
  textRowShort: {
    width: '50%',
    height: 14,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    marginBottom: 12,
  },
  button: {
    width: '60%',
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    alignSelf: 'center',
  },
}); 