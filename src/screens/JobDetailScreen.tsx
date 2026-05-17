import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CurrencyDollar,
  GenderIntersex,
  LockSimple,
  MapPin,
  Star,
  UserCircle,
} from 'phosphor-react-native';

import ApplyButton from '../components/ApplyButton';
import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';

export default function JobDetailScreen() {
  const { id }   = useLocalSearchParams();
  const router   = useRouter();
  const { isLoggedIn } = useUser();
  const isGuest  = !isLoggedIn;

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <ScreenContainer>
        <Text style={styles.notFound}>Vacante no encontrada.</Text>
      </ScreenContainer>
    );
  }

  // ── Gate para invitados ───────────────────────────────────────────────────
  // Si llegan directamente a esta URL sin sesión, mostramos
  // una pantalla de bloqueo en lugar del contenido.
  if (isGuest) {
    return (
      <ScreenContainer>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={COLORS.primary} weight="bold" />
          <Text style={styles.backText}>Regresar</Text>
        </TouchableOpacity>

        {/* Encabezado con título visible */}
        <View style={styles.gateHeader}>
          <Text style={styles.gateJobTitle}>{job.title}</Text>
          <Text style={styles.gateLocation}>{job.location}</Text>
        </View>

        {/* Card de bloqueo */}
        <View style={styles.gateCard}>
          <View style={styles.gateLockCircle}>
            <LockSimple size={36} color={COLORS.primary} weight="bold" />
          </View>

          <Text style={styles.gateTitle}>
            Inicia sesión para ver los detalles
          </Text>
          <Text style={styles.gateBody}>
            El salario, horario, requisitos y datos de contacto de esta
            vacante solo están disponibles para usuarios registrados.
          </Text>

          <TouchableOpacity
            style={styles.gateLoginButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.gateLoginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gateRegisterButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.85}
          >
            <Text style={styles.gateRegisterButtonText}>Crear cuenta gratis</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.gateBackLink}>
            <Text style={styles.gateBackLinkText}>Volver a las vacantes</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // ── Vista completa (usuario con sesión) ───────────────────────────────────

  const workTypeLabel = {
    'tiempo-completo': 'Tiempo completo',
    'medio-tiempo': 'Medio tiempo',
    'por-horas': 'Por horas',
  }[job.workType];

  const genderLabel = {
    indistinto: 'Indistinto',
    hombre: 'Hombre',
    mujer: 'Mujer',
  }[job.gender];

  return (
    <ScreenContainer>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={COLORS.primary} weight="bold" />
        <Text style={styles.backText}>Regresar</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          {(job.urgent || job.requiresCv || !job.experienceRequired) && (
            <View style={styles.badgesRow}>
              {job.urgent && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>Urgente</Text>
                </View>
              )}
              {job.requiresCv && (
                <View style={styles.cvBadge}>
                  <Text style={styles.cvText}>CV requerido</Text>
                </View>
              )}
              {!job.experienceRequired && (
                <View style={styles.noExpBadge}>
                  <Text style={styles.noExpText}>Sin experiencia</Text>
                </View>
              )}
            </View>
          )}
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company.name}</Text>
        </View>

        {/* Info rápida */}
        <View style={styles.infoCard}>
          <InfoRow
            icon={<CurrencyDollar size={18} color={COLORS.primary} weight="bold" />}
            label="Salario"
            value={job.salary}
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<MapPin size={18} color={COLORS.primary} weight="bold" />}
            label="Ubicación"
            value={job.location}
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<Calendar size={18} color={COLORS.primary} weight="bold" />}
            label="Horario"
            value={job.schedule}
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<Briefcase size={18} color={COLORS.primary} weight="bold" />}
            label="Tipo"
            value={workTypeLabel}
          />
          <View style={styles.divider} />
          <InfoRow
            icon={<GenderIntersex size={18} color={COLORS.primary} weight="bold" />}
            label="Género"
            value={genderLabel}
          />
          {job.ageRange && (
            <>
              <View style={styles.divider} />
              <InfoRow
                icon={<UserCircle size={18} color={COLORS.primary} weight="bold" />}
                label="Edad"
                value={`${job.ageRange.min} - ${job.ageRange.max} años`}
              />
            </>
          )}
          <View style={styles.divider} />
          <InfoRow
            icon={<Star size={18} color={COLORS.primary} weight="bold" />}
            label="Experiencia"
            value={job.experienceRequired ? 'Requerida' : 'No requerida'}
          />
        </View>

        {/* Descripción */}
        <Section title="Descripción del puesto">
          <Text style={styles.description}>{job.description}</Text>
        </Section>

        {/* Requisitos */}
        <Section title="Requisitos">
          {job.requirements.map((req, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}
        </Section>

        {/* Beneficios */}
        <Section title="Beneficios">
          <View style={styles.chipsContainer}>
            {job.benefits.map((b, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{b}</Text>
              </View>
            ))}
          </View>
        </Section>

        <View style={styles.actions}>
          <ApplyButton job={job} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>{icon}</View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    marginTop: 4,
  },
  backText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ── Gate
  gateHeader: {
    marginBottom: 20,
  },
  gateJobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  gateLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  gateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 10,
  },
  gateLockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  gateBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  gateLoginButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginTop: 8,
  },
  gateLoginButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  gateRegisterButton: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  gateRegisterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  gateBackLink: {
    paddingVertical: 8,
  },
  gateBackLinkText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textDecoration: 'underline',
  } as any,

  // ── Header
  header: {
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  urgentBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  cvBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cvText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B21B6',
  },
  noExpBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  noExpText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },

  // ── Info card
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 10,
  },
  infoIconBox: {
    width: 28,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 86,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 6,
  },

  // ── Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginTop: 7,
  },
  bulletText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  actions: {
    gap: 10,
    marginBottom: 10,
  },
  notFound: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});