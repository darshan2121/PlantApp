import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';

export default function OrderSkeleton() {
  // You can add shimmer/animation later if desired
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.skeletonId} />
        <View style={styles.skeletonBadge} />
      </View>
      <View style={styles.skeletonDate} />
      <View style={styles.skeletonPlantRow} />
      <View style={styles.skeletonPlantRow} />
      <View style={styles.skeletonFooter} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonId: {
    width: 120,
    height: 18,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
  },
  skeletonBadge: {
    width: 60,
    height: 18,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
  },
  skeletonDate: {
    width: 180,
    height: 14,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    marginBottom: 12,
  },
  skeletonPlantRow: {
    width: '100%',
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    marginBottom: 8,
  },
  skeletonFooter: {
    width: 100,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    marginTop: 12,
    alignSelf: 'flex-end',
  },
}); 