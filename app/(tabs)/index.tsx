import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Search, Filter, Globe } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { fetchItems } from '../../store/itemSlice';
import { fetchCategories } from '../../store/categorySlice';
import { RootState, AppDispatch } from '../../store';
import { PlantCard } from '../../components/PlantCard';
import { PlantDetailsModal } from '../../components/PlantDetailsModal';
import { Plant } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import PlantSkeleton from '../../components/PlantSkeleton';

const { width, height } = Dimensions.get('window');

// Add typed hooks
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function HomeScreen() {
  const { addToCart, language, setLanguage, t } = useApp();
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redux state
  const { items, loading: itemsLoading, error: itemsError } = useAppSelector((state) => state.items);
  const { categories, loading: categoriesLoading, error: categoriesError } = useAppSelector((state) => state.categories);
  // Fallback type for categories
  const safeCategories: Array<{ key: string; english: string }> = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!itemsLoading && !categoriesLoading) {
      const timer = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [itemsLoading, categoriesLoading]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchItems()),
      dispatch(fetchCategories()),
    ]);
    setRefreshing(false);
  };

  // Filter plants from Redux state
  const filteredPlants = items.filter(plant => {
    // Debug: Log plant category and selectedCategory
    // (You can remove this debug after confirming the fix)
    // if (plant.name === 'YOUR_NEW_PLANT_NAME') {
    //   console.log('Filtering:', { plantCategory: plant.category, selectedCategory });
    // }
    const searchText = language === 'gujarati'
      ? (plant.nameGujarati || '')
      : (plant.name || '');
    const matchesSearch =
      searchText.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (plant.tag || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (typeof plant.category === 'object'
        ? (plant.category.key === selectedCategory || plant.category._id === selectedCategory)
        : plant.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handlePlantPress = (plant: Plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
  };

  const handleAddToCart = (plant: Plant) => {
    addToCart(plant);
  };

  const handleBookNow = () => {
    setModalVisible(false);
    router.push('/success');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'gujarati' : 'english');
  };

  // Optionally, show loading/error for plants and categories
  if (showSkeleton) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{t('greeting', { name: user?.name })}</Text>
              <Text style={styles.subtitle}>{t('find_plant')}</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={Array(6).fill(0)}
          renderItem={({ index }) => <PlantSkeleton key={index} />}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={styles.plantsContainer}
          columnWrapperStyle={styles.row}
        />
      </SafeAreaView>
    );
  }
  if (itemsError || categoriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{t('error_loading_data')}</Text>
        <Text>{itemsError || categoriesError}</Text>
      </SafeAreaView>
    );
  }

  // Debug: Log categories to check their structure and names
  console.log('Categories:', categories);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Top Section */}
      <View>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{t('greeting', { name: user?.name })}</Text>
              <Text style={styles.subtitle}>{t('find_plant')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { paddingVertical: width < 350 ? 6 : 8, borderRadius: width < 350 ? 10 : 14 }]}>
            <Search size={18} color={Colors.textGrey} />
            <TextInput
              style={[styles.searchInput, { fontSize: width < 350 ? 13 : 16 }]}
              placeholder={t('search_placeholder')}
              placeholderTextColor={Colors.textGrey}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {safeCategories.map((category) => (
              <AnimatedPressable
                key={category.key}
                onPress={() => setSelectedCategory(category.key)}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.categoryChip,
                  selectedCategory === category.key && styles.selectedCategoryChip,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.key && styles.selectedCategoryText,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {category.english}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText} accessibilityLabel="Results Count">
            {t('plants_found', { count: showSkeleton ? 0 : filteredPlants.length })}
          </Text>
        </View>
      </View>
      {/* Plant Grid Section */}
      {showSkeleton ? (
        <FlatList
          data={Array(6).fill(0)}
          renderItem={({ index }) => <PlantSkeleton key={index} />}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={styles.plantsContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.lightGreen}
              tintColor={Colors.primary}
              title="Pull to refresh"
              titleColor={Colors.primary}
            />
          }
        />
      ) : (
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => handlePlantPress(item)}
              onAddToCart={() => handleAddToCart(item)}
              testID={`plant-card-${item.id}`}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.plantsContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Plant List"
          testID="plant-list"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.lightGreen}
              tintColor={Colors.primary}
              title="Pull to refresh"
              titleColor={Colors.primary}
            />
          }
        />
      )}
      <PlantDetailsModal
        visible={modalVisible}
        plant={selectedPlant}
        onClose={() => setModalVisible(false)}
        onBook={handleBookNow}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
categoryChip: {
  backgroundColor: Colors.white,
  borderRadius: 20,
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginRight: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textGrey,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.white,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textGrey,
    fontFamily: 'Poppins-SemiBold',
  },
  plantsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});