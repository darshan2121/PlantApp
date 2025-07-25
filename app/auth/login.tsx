import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, User, Globe } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, language, setLanguage, t } = useApp();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (!phone || !name) {
      Alert.alert(
        t('error'),
        t('fill_all_fields')
      );
      return;
    }

    if (phone.length < 10) {
      Alert.alert(
        t('error'),
        t('enter_valid_phone')
      );
      return;
    }

    // Simple validation for demo
    setUser({
      id: '1',
      fullName: name,
      phone: phone,
      address: {
        area: 'Ahmedabad',
        pincode: '380001',
        wardName: 'Ward 1',
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
              {t('welcome')}
            </Text>
            <Text style={styles.subtitle}>
              {t('login_subtitle')}
            </Text>
          </View>



          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textGrey} />
              <TextInput
                style={styles.input}
                placeholder={t('your_name')}
                placeholderTextColor={Colors.textGrey}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.textGrey} />
              <TextInput
                style={styles.input}
                placeholder={t('phone_number')}
                placeholderTextColor={Colors.textGrey}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>
                {t('login')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('no_account')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signupLink}>
                {t('signup')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amcFooter}>
            <Text style={styles.amcFooterText}>
              {t('amc_footer_login')}
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 40,
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
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textGrey,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.black,
    marginLeft: 12,
    paddingVertical: 16,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
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
  loginButtonText: {
    color: Colors.white,
    fontSize: 20,
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
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 16,
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