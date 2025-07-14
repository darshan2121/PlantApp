import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../constants/Colors';

interface Address {
  area: string;
  ward: string;
  pinCode: string;
  city: string;
  state: string;
  country: string;
  contactPhone: string;
  contactName: string;
}

interface ConfirmAddressModalProps {
  visible: boolean;
  initialAddress: Address;
  onConfirm: (address: Address, notes: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmAddressModal: React.FC<ConfirmAddressModalProps> = ({
  visible,
  initialAddress,
  onConfirm,
  onCancel,
  loading,
}) => {
  const [address, setAddress] = useState<Address>(initialAddress);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible) {
      setAddress(initialAddress);
      setNotes('');
    }
  }, [visible, initialAddress]);

  const handleChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    // Check for empty required fields
    if (
      !address.area.trim() ||
      !address.ward.trim() ||
      !address.pinCode.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.country.trim() ||
      !address.contactName.trim() ||
      !address.contactPhone.trim()
    ) {
      Alert.alert('Missing Information', 'Please fill in all address fields.');
      return;
    }
    onConfirm(address, notes);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Confirm Delivery Address</Text>
          <ScrollView style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Area"
              value={address.area}
              onChangeText={v => handleChange('area', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ward"
              value={address.ward}
              onChangeText={v => handleChange('ward', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Pin Code"
              value={address.pinCode}
              onChangeText={v => handleChange('pinCode', v)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={address.city}
              onChangeText={v => handleChange('city', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={address.state}
              onChangeText={v => handleChange('state', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={address.country}
              onChangeText={v => handleChange('country', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={address.contactName}
              onChangeText={v => handleChange('contactName', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Phone"
              value={address.contactPhone}
              onChangeText={v => handleChange('contactPhone', v)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} disabled={loading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Placing Order...' : 'Confirm Order'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: Colors.lightGreen,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
}); 