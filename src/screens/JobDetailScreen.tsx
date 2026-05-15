import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';

import CustomButton from '../components/CustomButton';
import ScreenContainer from '../components/ScreenContainer';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <ScreenContainer>
        <Text style={styles.notFound}>Vacante no encontrada.</Text>
      </ScreenContainer>
    );
  }

  const handleWhatsApp = () => {
    const message = `Hola, vi la vacante de *${job.title}* en Kaxt Meyaj y me interesa. ¿Podría darme más información?`;
    const url = `https://wa.me/52${job.whatsapp}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${job.contactPhone}`);
  };

  return (
    <ScreenContainer>
      {/* Header con botón atrás */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={COLORS.primary} weight="bold" />
        <Text style={styles.backText}>Regresar</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>🔥 Urgente</Text>
            </View>
          )}
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company.name}</Text>
        </View>

        {/* Info rápida */}
        <View style={styles.infoCard}>
          <InfoRow icon="💰" label="Salario" value={job.salary} />
          <InfoRow icon="📍" label="Ubicación" value={job.location} />
          <InfoRow icon="🕐" label="Horario" value={job.schedule} />
          <InfoRow
            icon="💼"
            label="Tipo"
            value={
              job.workType === 'tiempo-completo'
                ? 'Tiempo completo'
                : job.workType === 'medio-tiempo'
                ? 'Medio tiempo'
                : 'Por horas'
            }
          />
          <InfoRow
            icon="👤"
            label="Género"
            value={
              job.gender === 'indistinto'
                ? 'Indistinto'
                : job.gender === 'hombre'
                ? 'Hombre'
                : 'Mujer'
            }
          />
          {job.ageRange && (
            <InfoRow
              icon="🎂"
              label="Edad"
              value={`${job.ageRange.min} - ${job.ageRange.max} años`}
            />
          )}
          <InfoRow
            icon="⭐"
            label="Experiencia"
            value={job.experienceRequired ? 'Requerida' : 'No requerida'}
          />
          {job.requiresCv && (
            <InfoRow icon="📄" label="CV" value="Solicitado" />
          )}
        </View>

        {/* Descripción */}
        <Section title="Descripción del puesto">
          <Text style={styles.description}>{job.description}</Text>
        </Section>

        {/* Requisitos */}
        <Section title="Requisitos">
          {job.requirements.map((req, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
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

        {/* Botones de contacto */}
        <View style={styles.actions}>
          {job.whatsapp && (
            <CustomButton title="💬 Contactar por WhatsApp" onPress={handleWhatsApp} />
          )}
          {job.contactPhone && (
            <CustomButton title="📞 Llamar" onPress={handleCall} />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Componentes auxiliares
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    marginTop: 4,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  company: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
    width: 24,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 15,
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
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actions: {
    gap: 4,
    marginBottom: 10,
  },
  notFound: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});