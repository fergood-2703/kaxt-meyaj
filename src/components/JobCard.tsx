import { useRouter } from 'expo-router';
import {
    Briefcase,
    CurrencyDollar,
    MapPin,
} from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../styles/colors';
import { Job } from '../types';
import CustomButton from './CustomButton';

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/job/${job.id}`);
  };

  const workTypeLabel = {
    'tiempo-completo': 'Tiempo completo',
    'medio-tiempo': 'Medio tiempo',
    'por-horas': 'Por horas',
  }[job.workType];

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>

      {/* Badges superiores */}
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

      {/* Título y empresa */}
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company.name}</Text>

      {/* Info con iconos */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <CurrencyDollar size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{job.salary}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{job.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Briefcase size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{workTypeLabel}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton title="Ver detalle" onPress={handlePress} small />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  // Badges
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

  // Contenido
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  company: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  // Info
  infoContainer: {
    marginTop: 14,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  buttonContainer: {
    marginTop: 16,
  },
});