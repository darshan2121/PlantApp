import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { CircleCheck as CheckCircle, Heart } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  const { language } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/orders');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <CheckCircle size={60} color={Colors.success} />
          </View>
          <View style={styles.heartContainer}>
            <Heart size={24} color={Colors.error} fill={Colors.error} />
          </View>
        </View>
        
        <Text style={styles.title}>
          {language === 'gujarati' 
            ? 'તમારા છોડ બુક થઈ ગયા!' 
            : 'Your Plants are Booked!'}
        </Text>
        
        <Text style={styles.message}>
          {language === 'gujarati' 
            ? 'અમદાવાદ મહાનગરપાલિકા તરફથી આભાર. તમારા છોડ જલ્દીથી તૈયાર કરવામાં આવશે.' 
            : 'Thank you from Ahmedabad Municipal Corporation. Your plants will be prepared soon.'}
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {language === 'gujarati' ? 'આગળ શું?' : 'What\'s Next?'}
          </Text>
          <Text style={styles.infoText}>
            {language === 'gujarati' 
              ? '• AMC ટીમ તમારી વિનંતી સમીક્ષા કરશે\n• તૈયાર થયા પછી તમને સૂચના મળશે\n• નવરંગપુરા AMC નર્સરીથી લો' 
              : '• AMC team will review your request\n• You\'ll be notified when ready\n• Pickup from AMC Nursery, Navrangpura'}
          </Text>
        </View>
        
        <Text style={styles.subtitle}>
          {language === 'gujarati' 
            ? 'ઓર્ડર પર રીડાયરેક્ટ કરી રહ્યા છીએ...' 
            : 'Redirecting to orders...'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  successCircle: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  heartContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
    lineHeight: 34,
  },
  message: {
    fontSize: 16,
    color: Colors.textGrey,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  infoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textGrey,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textGrey,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});