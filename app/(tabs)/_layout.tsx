import { Tabs } from 'expo-router';
import { Chrome as Home, ShoppingCart, Package, User, HomeIcon } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../contexts/AppContext';
import { SafeAreaView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { AnnouncementModal } from '../../components/AnnouncementModal';
import { AnimatedPressable } from '../../components/AnimatedPressable';

export default function TabLayout() {
  const { getCartItemCount, language, user } = useApp();
  const cartItemCount = getCartItemCount();
  const insets = useSafeAreaInsets();
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (user) setShowAnnouncement(true);
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <AnnouncementModal visible={showAnnouncement} onClose={() => setShowAnnouncement(false)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 24 : 16),
            paddingTop: 8,
            height: 70 + (insets.bottom > 0 ? insets.bottom : 0),
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textGrey,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: language === 'gujarati' ? 'હોમ' : 'Home',
            tabBarIcon: ({ size, color }) => (
              <HomeIcon size={size} color={color} />
            ),
            tabBarButton: (props) => (
              <AnimatedPressable {...props} style={({ pressed }: { pressed: boolean }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: language === 'gujarati' ? 'કાર્ટ' : 'Cart',
            tabBarIcon: ({ size, color }) => (
              <ShoppingCart size={size} color={color} />
            ),
            tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: Colors.error,
              color: Colors.white,
              fontSize: 10,
              fontWeight: '600',
            },
            tabBarButton: (props) => (
              <AnimatedPressable {...props} style={({ pressed }: { pressed: boolean }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: language === 'gujarati' ? 'ઓર્ડર' : 'Orders',
            tabBarIcon: ({ size, color }) => (
              <Package size={size} color={color} />
            ),
            tabBarButton: (props) => (
              <AnimatedPressable {...props} style={({ pressed }: { pressed: boolean }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: language === 'gujarati' ? 'પ્રોફાઇલ' : 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
            tabBarButton: (props) => (
              <AnimatedPressable {...props} style={({ pressed }: { pressed: boolean }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}