import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';

import { jobs } from '../data/jobs';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hola, Fernando 
            </Text>

            <Text style={styles.subtitle}>
              Encuentra oportunidades cerca de ti
            </Text>
          </View>

          <View style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#111827"
            />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
          />

          <TextInput
            placeholder="Buscar empleos"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>
            Categorías
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.categoriesContainer}>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>
                  Hoteles
                </Text>
              </View>

              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>
                  Restaurantes
                </Text>
              </View>

              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>
                  Turismo
                </Text>
              </View>

              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>
                  Oficina
                </Text>
              </View>

              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>
                  Construcción
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Jobs */}
        <View style={styles.jobsSection}>
          <Text style={styles.sectionTitle}>
            Vacantes recientes
          </Text>

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

const styles = StyleSheet.create({
  header: {
    marginTop: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
  },

  notificationButton: {
    width: 48,
    height: 48,

    borderRadius: 24,
    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  searchContainer: {
    marginTop: 30,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,

    fontSize: 16,
    color: '#111827',
  },

  categoriesSection: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  categoriesContainer: {
    flexDirection: 'row',
  },

  categoryChip: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 14,

    marginRight: 12,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  jobsSection: {
    marginTop: 35,
    paddingBottom: 40,
  },

  jobsContainer: {
    marginTop: 5,
  },
});