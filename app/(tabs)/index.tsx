import React, { useState } from 'react';
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
} from 'react-native';
import { Search, Filter, Globe } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { plants } from '../../data/plants';
import { PlantCard } from '../../components/PlantCard';
import { PlantDetailsModal } from '../../components/PlantDetailsModal';
import { Plant } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const categories = [
  { key: 'All', english: 'All', gujarati: 'બધા' },
  { key: 'Medicinal', english: 'Medicinal', gujarati: 'ઔષધીય' },
  { key: 'Flowering', english: 'Flowering', gujarati: 'ફૂલવાળા' },
  { key: 'Herbs', english: 'Herbs', gujarati: 'વનસ્પતિ' },
];

export default function HomeScreen() {
  const { user, addToCart, language, setLanguage } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredPlants = plants.filter(plant => {
    const searchText = language === 'gujarati' ? plant.nameGujarati : plant.name;
    const matchesSearch = searchText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {language === 'gujarati' 
                ? `નમસ્તે, ${user?.fullName || 'મિત્ર'}!` 
                : `Hello, ${user?.fullName || 'Friend'}!`}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'gujarati' 
                ? 'તમારા માટે યોગ્ય છોડ શોધો' 
                : 'Find the perfect plant for you'}
            </Text>
          </View>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Globe size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'gujarati' ? 'છોડ શોધો...' : 'Search plants...'}
            placeholderTextColor={Colors.textGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                selectedCategory === category.key && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.selectedCategoryText,
                ]}
              >
                {language === 'gujarati' ? category.gujarati : category.english}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {language === 'gujarati' 
            ? `${filteredPlants.length} છોડ મળ્યા` 
            : `${filteredPlants.length} plants found`}
        </Text>
      </View>

      <FlatList
        data={filteredPlants}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            onPress={() => handlePlantPress(item)}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.plantsContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />

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
    paddingTop: 10,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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