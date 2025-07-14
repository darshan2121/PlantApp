import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { XCircle, CheckCircle, X } from 'lucide-react-native';

interface MatureToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: 'error' | 'success';
  duration?: number;
}

export default function MatureToast({ message, visible, onHide, type = 'error', duration = 3000 }: MatureToastProps) {
  const translateY = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.spring(translateY, { toValue: 100, useNativeDriver: true }).start(onHide);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }]}> 
      <View style={[styles.bar, type === 'success' ? styles.barSuccess : styles.barError]} />
      <View style={styles.iconContainer}>
        {type === 'success' ? (
          <CheckCircle size={22} color={Colors.success} />
        ) : (
          <XCircle size={22} color={Colors.error} />
        )}
      </View>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={onHide} style={styles.closeButton}>
        <X size={18} color="#888" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    zIndex: 1000,
  },
  bar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  barSuccess: {
    backgroundColor: Colors.success,
  },
  barError: {
    backgroundColor: Colors.error,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
}); 