import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 20,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Image
              source={require('../../assets/images/isotipo.png')}
              style={styles.logo}
            />
            <View>
              <Text style={styles.greeting}>
                Hola, Fernando
              </Text>
              <Text style={styles.subtitle}>
                Encuentra oportunidades cerca de ti
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textSecondary}
          />
          <TextInput
            placeholder="Buscar empleos"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {['Hoteles', 'Restaurantes', 'Turismo', 'Oficina', 'Construcción'].map((cat) => (
                <View key={cat} style={styles.categoryChip}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Jobs */}
        <View style={styles.jobsSection}>
          <Text style={styles.sectionTitle}>Vacantes recientes</Text>
          <View style={styles.jobsContainer}>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                salary={job.salary}
                location={job.location}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// styles sin cambios...
const styles = StyleSheet.create({
  greeting: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  categoriesSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 18,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  jobsSection: {
    marginTop: 35,
  },
  jobsContainer: {
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
});