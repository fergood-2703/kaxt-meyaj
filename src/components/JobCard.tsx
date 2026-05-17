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
  LockSimple,
  MapPin,
} from 'phosphor-react-native';

import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { Job } from '../types';

type Props = {
  job: Job;
};

// ─── Componente de campo bloqueado ────────────────────────────────────────────
// Simula el efecto "blur" con un rectángulo semitransparente superpuesto.
// React Native no tiene blur nativo sin expo-blur, así que usamos
// una caja con opacidad reducida + overlay que oculta el texto real.
function LockedField({ children }: { children: React.ReactNode }) {
  return (
    <View style={lockedStyles.wrapper}>
      <View style={lockedStyles.content}>{children}</View>
      <View style={lockedStyles.overlay}>
        <LockSimple size={12} color={COLORS.textSecondary} weight="bold" />
      </View>
    </View>
  );
}

const lockedStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  content: {
    opacity: 0.18,  // el texto existe pero casi invisible
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
  },
});

// ─── JobCard ──────────────────────────────────────────────────────────────────

export default function JobCard({ job }: Props) {
  const router = useRouter();
  const { isLoggedIn, isFavorite, toggleFavorite } = useUser();
  const favorited = isFavorite(job.id);
  const isGuest   = !isLoggedIn;

  const workTypeLabel = {
    'tiempo-completo': 'Tiempo completo',
    'medio-tiempo': 'Medio tiempo',
    'por-horas': 'Por horas',
  }[job.workType];

  const handlePress = () => {
    if (isGuest) {
      // Invitado: no navegar al detalle, mandar al login con prompt
      router.push('/login?prompt=true');
      return;
    }
    router.push(`/job/${job.id}`);
  };

  const handleHeart = () => {
    if (isGuest) {
      router.push('/login?prompt=true');
      return;
    }
    toggleFavorite(job.id, job.title, job.company.name);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* ── Fila superior: empresa + corazón ── */}
      <View style={styles.topRow}>
        <View style={styles.companyIcon}>
          <Buildings size={18} color={COLORS.primary} weight="bold" />
        </View>

        {/* Empresa — bloqueada para invitados */}
        {isGuest ? (
          <View style={{ flex: 1 }}>
            <LockedField>
              <Text style={styles.companyName} numberOfLines={1}>
                {job.company.name}
              </Text>
            </LockedField>
          </View>
        ) : (
          <Text style={[styles.companyName, { flex: 1 }]} numberOfLines={1}>
            {job.company.name}
          </Text>
        )}

        {/* Corazón */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleHeart}
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

      {/* ── Título — siempre visible ── */}
      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>

      {/* ── Badges — bloqueados para invitados ── */}
      {(job.urgent || job.requiresCv || !job.experienceRequired) && (
        isGuest ? (
          <View style={styles.badgesRow}>
            <LockedField>
              <View style={styles.badgePlaceholder}>
                <Text style={styles.badgePlaceholderText}>••••••••</Text>
              </View>
            </LockedField>
          </View>
        ) : (
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
        )
      )}

      {/* ── Info rápida — ciudad visible, tipo de trabajo visible ── */}
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

      {/* ── Salario — bloqueado para invitados ── */}
      {isGuest ? (
        <View style={styles.salaryRow}>
          <CurrencyDollar size={15} color={COLORS.border} weight="bold" />
          <LockedField>
            <Text style={styles.salary}>$00,000 MXN</Text>
          </LockedField>
        </View>
      ) : (
        <View style={styles.salaryRow}>
          <CurrencyDollar size={15} color={COLORS.primary} weight="bold" />
          <Text style={styles.salary}>{job.salary}</Text>
        </View>
      )}

      {/* ── Banner invitado — al fondo de la card ── */}
      {isGuest && (
        <TouchableOpacity
          style={styles.guestBanner}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <LockSimple size={13} color={COLORS.primary} weight="bold" />
          <Text style={styles.guestBannerText}>
            Inicia sesión para ver todos los detalles
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  badgePlaceholder: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePlaceholderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
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

  // ── Banner invitado
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guestBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});