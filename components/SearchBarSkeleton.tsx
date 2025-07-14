import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function SearchBarSkeleton() {
  return <View style={styles.skeleton} />;
}

const styles = StyleSheet.create({
  skeleton: {
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.lightGreen,
    marginHorizontal: 20,
    marginBottom: 20,
  },
}); 