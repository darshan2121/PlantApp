import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function CategoryChipsSkeleton() {
  return (
    <View style={styles.row}>
      {[...Array(4)].map((_, i) => (
        <View key={i} style={styles.chip} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chip: {
    width: 80,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGreen,
    marginRight: 12,
  },
}); 