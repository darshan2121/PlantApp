import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface ErrorToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  type?: 'error' | 'success';
}

export default function ErrorToast({ message, visible, onHide, duration = 3000, type = 'error' }: ErrorToastProps) {
  const translateY = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.spring(translateY, {
          toValue: 100,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, type === 'success' ? styles.success : styles.error, { transform: [{ translateY }] }]}> 
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 90, // above the footer
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  error: {
    backgroundColor: 'rgba(220, 53, 69, 0.95)', // softer red
  },
  success: {
    backgroundColor: 'rgba(40, 167, 69, 0.95)', // soft green
  },
  text: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 