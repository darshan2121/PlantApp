import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, MapPin, Globe } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';

export default function SignupScreen() {
  const router = useRouter();
  const { setUser, language, setLanguage, t } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    area: '',
    pincode: '',
    wardName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    // Basic validation
    if (Object.values(formData).some(value => !value)) {
      Alert.alert(
        t('error'),
        t('fill_all_fields')
      );
      return;
    }

    if (formData.phone.length < 10) {
      Alert.alert(
        t('error'),
        t('enter_valid_phone')
      );
      return;
    }

    // Create user
    setUser({
      id: '1',
      fullName: formData.fullName,
      phone: formData.phone,
      address: {
        area: formData.area,
        pincode: formData.pincode,
        wardName: formData.wardName,
      },
      language: language,
    });

    router.replace('/(tabs)');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'gujarati' : 'english');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                <Globe size={20} color={Colors.primary} />
                <Text style={styles.languageText}>
                  {t('toggle_language')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {t('signup_title')}
              </Text>
              <Text style={styles.subtitle}>
                {t('signup_subtitle')}
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textGrey} />
                <TextInput
                  style={styles.input}
                  placeholder={t('full_name')}
                  placeholderTextColor={Colors.textGrey}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color={Colors.textGrey} />
                <TextInput
                  style={styles.input}
                  placeholder={t('phone_number')}
                  placeholderTextColor={Colors.textGrey}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.sectionTitle}>
                {t('address_info')}
              </Text>

              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.textGrey} />
                <TextInput
                  style={styles.input}
                  placeholder={t('area')}
                  placeholderTextColor={Colors.textGrey}
                  value={formData.area}
                  onChangeText={(value) => handleInputChange('area', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.textGrey} />
                <TextInput
                  style={styles.input}
                  placeholder={t('pincode')}
                  placeholderTextColor={Colors.textGrey}
                  value={formData.pincode}
                  onChangeText={(value) => handleInputChange('pincode', value)}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.textGrey} />
                <TextInput
                  style={styles.input}
                  placeholder={t('ward_name')}
                  placeholderTextColor={Colors.textGrey}
                  value={formData.wardName}
                  onChangeText={(value) => handleInputChange('wardName', value)}
                />
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>
                  {t('signup_button')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('already_have_account')}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginLink}>
                  {t('login')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.amcFooter}>
              <Text style={styles.amcFooterText}>
                {t('amc_footer')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGrey,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    marginLeft: 12,
    paddingVertical: 16,
    fontFamily: 'Poppins-Regular',
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: Colors.textGrey,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  amcFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  amcFooterText: {
    fontSize: 14,
    color: Colors.amcBlue,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});