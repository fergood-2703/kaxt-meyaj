import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import {
  Heart,
  Lightning,
  MagnifyingGlass,
  TrendUp
} from 'phosphor-react-native';

import JobCard from '../components/JobCard';
import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';

// Vacantes "populares" para el estado vacío:
// criterio: urgentes primero, luego sin experiencia requerida, máximo 4
const POPULAR_JOBS = [...jobs]
  .sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    if (!a.experienceRequired && b.experienceRequired) return -1;
    if (a.experienceRequired && !b.experienceRequired) return 1;
    return 0;
  })
  .slice(0, 4);

export default function FavoritesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { user } = useUser();

  const favoriteJobs = jobs.filter((j) => user.favorites.includes(j.id));
  const hasFavorites = favoriteJobs.length > 0;

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>Favoritos</Text>
            <Text style={styles.screenSubtitle}>
              {hasFavorites
                ? `${favoriteJobs.length} vacante${favoriteJobs.length !== 1 ? 's' : ''} guardada${favoriteJobs.length !== 1 ? 's' : ''}`
                : 'Guarda las vacantes que más te interesen'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Heart
              size={22}
              color={hasFavorites ? COLORS.accent : COLORS.border}
              weight={hasFavorites ? 'fill' : 'regular'}
            />
          </View>
        </View>

        {hasFavorites ? (
          /* ── Lista de favoritos ── */
          <View style={styles.section}>
            {favoriteJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        ) : (
          /* ── Estado vacío + sugerencias ── */
          <>
            {/* Caja vacía */}
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconRing}>
                <Heart size={32} color={COLORS.accent} weight="thin" />
              </View>
              <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
              <Text style={styles.emptyBody}>
                Presiona el{' '}
                <Text style={{ color: COLORS.accent, fontWeight: '700' }}>
                  corazón
                </Text>{' '}
                en cualquier vacante para guardarla aquí y revisarla cuando quieras.
              </Text>

              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/')}
                activeOpacity={0.85}
              >
                <MagnifyingGlass size={16} color={COLORS.white} weight="bold" />
                <Text style={styles.exploreButtonText}>Explorar vacantes</Text>
              </TouchableOpacity>
            </View>

            {/* Tip rápido */}
            <View style={styles.tipRow}>
              <Lightning size={14} color={COLORS.secondary} weight="fill" />
              <Text style={styles.tipText}>
                Guarda vacantes para comparar antes de postularte
              </Text>
            </View>

            {/* Sugerencias populares */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendUp size={16} color={COLORS.primary} weight="bold" />
                <Text style={styles.sectionTitle}>Vacantes populares</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Las más buscadas en Quintana Roo ahora mismo
              </Text>

              {POPULAR_JOBS.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Lista
  section: {
    marginTop: 4,
  },

  // ── Estado vacío
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  emptyIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDF2F8',
    borderWidth: 1.5,
    borderColor: '#F9A8D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },

  // ── Tip
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  // ── Sección popular
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
});