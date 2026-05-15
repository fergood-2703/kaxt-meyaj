import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  Briefcase,
  Buildings,
  ForkKnife,
  Hammer,
  MapPin,
  Sunglasses,
} from 'phosphor-react-native';
import { useState } from 'react';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';
import { Category } from '../types';

// Ciudades extraídas de los datos
const CITIES = ['Todas', 'Felipe Carrillo Puerto', 'Tulum', 'Bacalar'];

const CATEGORIES: { label: string; value: Category | 'todas'; icon: React.ReactNode }[] = [
  {
    label: 'Todas',
    value: 'todas',
    icon: <Briefcase size={20} weight="bold" />,
  },
  {
    label: 'Hoteles',
    value: 'hoteles',
    icon: <Buildings size={20} weight="bold" />,
  },
  {
    label: 'Restaurantes',
    value: 'restaurantes',
    icon: <ForkKnife size={20} weight="bold" />,
  },
  {
    label: 'Turismo',
    value: 'turismo',
    icon: <Sunglasses size={20} weight="bold" />,
  },
  {
    label: 'Oficina',
    value: 'oficina',
    icon: <Briefcase size={20} weight="bold" />,
  },
  {
    label: 'Construcción',
    value: 'construccion',
    icon: <Hammer size={20} weight="bold" />,
  },
];

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'todas'>('todas');
  const [selectedCity, setSelectedCity] = useState('Todas');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      search === '' ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todas' || job.category === selectedCategory;

    const matchesCity =
      selectedCity === 'Todas' || job.location.includes(selectedCity);

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Image
              source={require('../../assets/images/isotipo.png')}
              style={styles.logo}
            />
            <View>
              <Text style={styles.greeting}>Hola, Fernando</Text>
              <Text style={styles.subtitle}>
                Encuentra oportunidades cerca de ti
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.secondary} />
          <TextInput
            placeholder="Buscar empleos o empresas..."
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: COLORS.secondary }]}>
            <Text style={styles.statNumber}>{filteredJobs.length}</Text>
            <Text style={styles.statLabel}>Vacantes</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.accent }]}>
            <Text style={styles.statNumber}>
              {new Set(jobs.map((j) => j.company.name)).size}
            </Text>
            <Text style={styles.statLabel}>Empresas</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
            <Text style={styles.statNumber}>
              {new Set(jobs.map((j) => j.location)).size}
            </Text>
            <Text style={styles.statLabel}>Municipios</Text>
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.value)}
                    activeOpacity={0.75}
                  >
                    {/* Ícono con color dinámico */}
                    {cat.value === 'todas' && (
                      <Briefcase
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    {cat.value === 'hoteles' && (
                      <Buildings
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    {cat.value === 'restaurantes' && (
                      <ForkKnife
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    {cat.value === 'turismo' && (
                      <Sunglasses
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    {cat.value === 'oficina' && (
                      <Briefcase
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    {cat.value === 'construccion' && (
                      <Hammer
                        size={18}
                        color={isActive ? COLORS.white : COLORS.primary}
                        weight="bold"
                      />
                    )}
                    <Text
                      style={[
                        styles.categoryText,
                        isActive && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Filtro de ciudades */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <MapPin size={16} color={COLORS.primary} weight="bold" />
            <Text style={styles.sectionTitle}>Ciudad</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {CITIES.map((city) => {
                const isActive = selectedCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityChip,
                      isActive && styles.cityChipActive,
                    ]}
                    onPress={() => setSelectedCity(city)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.cityText,
                        isActive && styles.cityTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Vacantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredJobs.length > 0
              ? `Vacantes recientes (${filteredJobs.length})`
              : 'Sin resultados'}
          </Text>

          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase size={48} color={COLORS.border} />
              <Text style={styles.emptyTitle}>No encontramos vacantes</Text>
              <Text style={styles.emptySubtitle}>
                Intenta con otra categoría o ciudad
              </Text>
            </View>
          ) : (
            <View>
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Search
  searchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Sections
  section: {
    marginTop: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },

  // Category chips
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },

  // City chips
  cityChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cityChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  cityText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  cityTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});