import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.plantImage}
          />
          <View style={styles.amcLogoPlaceholder}>
            <Text style={styles.amcText}>AMC</Text>
          </View>
        </View>
        
        <Text style={styles.title}>હરિયાળી અમદાવાદ</Text>
        <Text style={styles.titleEnglish}>Green Ahmedabad</Text>
        <Text style={styles.tagline}>મફત છોડ વિતરણ</Text>
        <Text style={styles.taglineEnglish}>Free Plant Distribution</Text>
        
        <View style={styles.amcBranding}>
          <Text style={styles.amcBrandingText}>અમદાવાદ મહાનગરપાલિકા</Text>
          <Text style={styles.amcBrandingTextEnglish}>Ahmedabad Municipal Corporation</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  amcLogoPlaceholder: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.amcBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  amcText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  titleEnglish: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  taglineEnglish: {
    fontSize: 16,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  amcBranding: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  amcBrandingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.amcBlue,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  amcBrandingTextEnglish: {
    fontSize: 14,
    color: Colors.amcBlue,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});