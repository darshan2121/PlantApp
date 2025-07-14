import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textGrey} />
          </TouchableOpacity>
          <Image source={require('../assets/images/Poster.jpg')} style={styles.posterImage} resizeMode="contain" />
          {/* <Text style={styles.title}>🌱 Announcement</Text> */}
          {/* <Text style={styles.message}>
            Welcome to the AMC Plants App! Enjoy exploring and booking your favorite plants. Ahmedabad Municipal Corporation thanks you for your participation.
          </Text> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  posterImage: {
    width: 360,
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.textGrey,
    textAlign: 'center',
    marginTop: 8,
  },
}); 