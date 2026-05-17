import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import {
  Briefcase,
  Buildings,
  CurrencyDollar,
  Heart,
  MapPin,
} from 'phosphor-react-native';

import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { Job } from '../types';

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useUser();
  const favorited = isFavorite(job.id);

  const workTypeLabel = {
    'tiempo-completo': 'Tiempo completo',
    'medio-tiempo': 'Medio tiempo',
    'por-horas': 'Por horas',
  }[job.workType];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/job/${job.id}`)}
      activeOpacity={0.8}
    >
      {/* ── Fila superior: empresa + corazón ── */}
      <View style={styles.topRow}>
        {/* Ícono empresa */}
        <View style={styles.companyIcon}>
          <Buildings size={18} color={COLORS.primary} weight="bold" />
        </View>

        <Text style={styles.companyName} numberOfLines={1}>
          {job.company.name}
        </Text>

        {/* Corazón — esquina superior derecha */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(job.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={favorited ? COLORS.accent : COLORS.border}
            weight={favorited ? 'fill' : 'regular'}
          />
        </TouchableOpacity>
      </View>

      {/* ── Título ── */}
      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>

      {/* ── Badges ── */}
      {(job.urgent || job.requiresCv || !job.experienceRequired) && (
        <View style={styles.badgesRow}>
          {job.urgent && (
            <View style={styles.badge}>
              <Text style={styles.badgeUrgent}>Urgente</Text>
            </View>
          )}
          {job.requiresCv && (
            <View style={[styles.badge, styles.badgeCv]}>
              <Text style={styles.badgeCvText}>CV requerido</Text>
            </View>
          )}
          {!job.experienceRequired && (
            <View style={[styles.badge, styles.badgeNoExp]}>
              <Text style={styles.badgeNoExpText}>Sin experiencia</Text>
            </View>
          )}
        </View>
      )}

      {/* ── Info rápida ── */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MapPin size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.infoText} numberOfLines={1}>
            {job.location}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Briefcase size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.infoText}>{workTypeLabel}</Text>
        </View>
      </View>

      {/* ── Salario ── */}
      <View style={styles.salaryRow}>
        <CurrencyDollar size={15} color={COLORS.primary} weight="bold" />
        <Text style={styles.salary}>{job.salary}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  // ── Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  companyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  heartButton: {
    padding: 2,
  },

  // ── Título
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },

  // ── Badges
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeUrgent: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  badgeCv: {
    backgroundColor: '#EDE9FE',
  },
  badgeCvText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B21B6',
  },
  badgeNoExp: {
    backgroundColor: '#DCFCE7',
  },
  badgeNoExpText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },

  // ── Info
  infoRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ── Salario
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  salary: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});