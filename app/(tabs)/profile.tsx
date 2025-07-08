import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { User, MapPin, Phone, LogOut, Package, Globe, Heart } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, setUser, orders, language, setLanguage, t } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logout_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'),
          style: 'destructive',
          onPress: () => {
            setUser(null);
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const handleViewOrders = () => {
    router.push('/(tabs)/orders');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'gujarati' : 'english');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('login_to_view_profile')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('profile')}
        </Text>
        {/* <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Globe size={20} color={Colors.primary} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color={Colors.primary} />
          </View>
          <Text style={styles.userName}>{user.fullName}</Text>
          <View style={styles.amcBadge}>
            <Heart size={16} color={Colors.white} />
            <Text style={styles.amcBadgeText}>
              {t('amc_member')}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Phone size={20} color={Colors.textGrey} />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color={Colors.textGrey} />
            <Text style={styles.infoText}>
              {user.address.area}, {user.address.wardName} - {user.address.pincode}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Package size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>
            {t('total_orders')}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Heart size={24} color={Colors.success} />
          <Text style={styles.statNumber}>
            {orders.reduce((total, order) => 
              total + order.plants.reduce((plantTotal, plant) => plantTotal + plant.quantity, 0), 0
            )}
          </Text>
          <Text style={styles.statLabel}>
            {t('total_plants_label')}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewOrders}>
          <Package size={20} color={Colors.primary} />
          <Text style={styles.actionText}>
            {t('view_order_history')}
          </Text>
          {orders.length > 0 && (
            <View style={styles.orderBadge}>
              <Text style={styles.orderBadgeText}>{orders.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amcFooter}>
        <Text style={styles.amcFooterText}>
          {t('amc_footer')}
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
  header: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  languageButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  amcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.amcBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amcBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  infoContainer: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textGrey,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionText: {
    fontSize: 16,
    color: Colors.black,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  orderBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  orderBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  amcFooter: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  amcFooterText: {
    fontSize: 14,
    color: Colors.amcBlue,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});