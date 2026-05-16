import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  Briefcase,
  Buildings,
  ForkKnife,
  Hammer,
  MagnifyingGlass,
  MapPin,
  Sliders,
  X,
  XCircle
} from 'phosphor-react-native';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';
import { Category } from '../types';

// ── Datos de filtros ──────────────────────────────────────────
const CATEGORIES: { label: string; value: Category | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Hoteles', value: 'hoteles' },
  { label: 'Restaurantes', value: 'restaurantes' },
  { label: 'Turismo', value: 'turismo' },
  { label: 'Oficina', value: 'oficina' },
  { label: 'Construcción', value: 'construccion' },
];

const CITIES = [
  'Todas',
  'Felipe Carrillo Puerto',
  'Tulum',
  'Bacalar',
  'Cancún',
  'Playa del Carmen',
];

const WORK_TYPES = [
  { label: 'Todos', value: 'todos' },
  { label: 'Tiempo completo', value: 'tiempo-completo' },
  { label: 'Medio tiempo', value: 'medio-tiempo' },
  { label: 'Por horas', value: 'por-horas' },
];

// ── Ícono por categoría ───────────────────────────────────────
function CategoryIcon({
  value,
  color,
  size = 16,
}: {
  value: string;
  color: string;
  size?: number;
}) {
  const props = { size, color, weight: 'bold' as const };
  switch (value) {
    case 'hoteles':      return <Buildings {...props} />;
    case 'restaurantes': return <ForkKnife {...props} />;
    case 'turismo':      return <MapPin {...props} />;
    case 'oficina':      return <Briefcase {...props} />;
    case 'construccion': return <Hammer {...props} />;
    default:             return <Briefcase {...props} />;
  }
}

// ── Componente principal ──────────────────────────────────────
export default function JobsScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [search, setSearch]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'todas'>('todas');
  const [selectedCity, setSelectedCity]       = useState('Todas');
  const [selectedWorkType, setSelectedWorkType] = useState('todos');
  const [onlyNoExp, setOnlyNoExp]             = useState(false);
  const [showFilters, setShowFilters]         = useState(false);

  // ── Filtrado ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase();
      const matchSearch =
        q === '' ||
        job.title.toLowerCase().includes(q) ||
        job.company.name.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === 'todas' || job.category === selectedCategory;

      const matchCity =
        selectedCity === 'Todas' || job.location.includes(selectedCity);

      const matchWorkType =
        selectedWorkType === 'todos' || job.workType === selectedWorkType;

      const matchExp = !onlyNoExp || !job.experienceRequired;

      return matchSearch && matchCategory && matchCity && matchWorkType && matchExp;
    });
  }, [search, selectedCategory, selectedCity, selectedWorkType, onlyNoExp]);

  // ── Limpiar filtros ──────────────────────────────────────────
  const hasActiveFilters =
    selectedCategory !== 'todas' ||
    selectedCity !== 'Todas' ||
    selectedWorkType !== 'todos' ||
    onlyNoExp;

  const clearFilters = () => {
    setSelectedCategory('todas');
    setSelectedCity('Todas');
    setSelectedWorkType('todos');
    setOnlyNoExp(false);
  };

  // ── Header del FlatList ──────────────────────────────────────
  const ListHeader = (
    <View>
      {/* Título */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Buscar empleos</Text>
        <Text style={styles.subtitle}>Encuentra tu oportunidad ideal</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MagnifyingGlass size={18} color={COLORS.secondary} weight="bold" />
          <TextInput
            placeholder="Puesto, empresa o ciudad..."
            placeholderTextColor={COLORS.textSecondary}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <XCircle size={18} color={COLORS.textSecondary} weight="fill" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botón filtros */}
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters((v) => !v)}
          activeOpacity={0.8}
        >
          <Sliders
            size={20}
            color={showFilters ? COLORS.white : COLORS.primary}
            weight="bold"
          />
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Panel de filtros */}
      {showFilters && (
        <View style={styles.filtersPanel}>

          {/* Categoría */}
          <Text style={styles.filterLabel}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedCategory(cat.value)}
                    activeOpacity={0.75}
                  >
                    <CategoryIcon
                      value={cat.value}
                      color={active ? COLORS.white : COLORS.primary}
                    />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Ciudad */}
          <Text style={[styles.filterLabel, { marginTop: 14 }]}>Ciudad</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              {CITIES.map((city) => {
                const active = selectedCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.chip, active && styles.chipCityActive]}
                    onPress={() => setSelectedCity(city)}
                    activeOpacity={0.75}
                  >
                    <MapPin
                      size={14}
                      color={active ? COLORS.white : COLORS.textSecondary}
                      weight="bold"
                    />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Tipo de trabajo */}
          <Text style={[styles.filterLabel, { marginTop: 14 }]}>Tipo de trabajo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              {WORK_TYPES.map((wt) => {
                const active = selectedWorkType === wt.value;
                return (
                  <TouchableOpacity
                    key={wt.value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedWorkType(wt.value)}
                    activeOpacity={0.75}
                  >
                    <Briefcase
                      size={14}
                      color={active ? COLORS.white : COLORS.primary}
                      weight="bold"
                    />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {wt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Toggle sin experiencia */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setOnlyNoExp((v) => !v)}
            activeOpacity={0.8}
          >
            <View style={[styles.toggle, onlyNoExp && styles.toggleActive]}>
              {onlyNoExp && <View style={styles.toggleThumb} />}
              {!onlyNoExp && <View style={styles.toggleThumbOff} />}
            </View>
            <Text style={styles.toggleLabel}>Solo vacantes sin experiencia</Text>
          </TouchableOpacity>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <X size={14} color={COLORS.accent} weight="bold" />
              <Text style={styles.clearText}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Resultado */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length === 0
            ? 'Sin resultados'
            : `${filtered.length} vacante${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearInline}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // ── Empty state ──────────────────────────────────────────────
  const EmptyState = (
    <View style={styles.emptyState}>
      <MagnifyingGlass size={52} color={COLORS.border} weight="thin" />
      <Text style={styles.emptyTitle}>No encontramos vacantes</Text>
      <Text style={styles.emptySubtitle}>
        Intenta ajustar los filtros o buscar con otras palabras
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
        <Text style={styles.emptyButtonText}>Limpiar filtros</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 20,
        }}
        renderItem={({ item }) => <JobCard job={item} />}
      />
    </ScreenContainer>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Título
  titleRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // Búsqueda
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
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
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },

  // Panel de filtros
  filtersPanel: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipCityActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: COLORS.success,
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  toggleThumbOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  toggleLabel: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  // Limpiar
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  clearText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // Resultado count
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  clearInline: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emptyButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});