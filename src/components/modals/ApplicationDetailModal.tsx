import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';
import {
    Briefcase,
    Buildings,
    CalendarBlank,
    CheckCircle,
    Clock,
    FilePdf,
    FileText,
    MapPin,
    X,
    XCircle,
} from 'phosphor-react-native';

import { jobs } from '../../data/jobs';
import { COLORS } from '../../styles/colors';
import { Application, ApplicationStatus } from '../../types';

// ─── Config de estados ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pendiente: { label: 'Enviada',         color: '#92400E', bg: '#FEF3C7', icon: <Clock       size={13} color="#92400E" weight="bold" /> },
  revisando: { label: 'En revisión',     color: '#1E40AF', bg: '#DBEAFE', icon: <FileText    size={13} color="#1E40AF" weight="bold" /> },
  aceptado:  { label: 'Aceptada',        color: '#166534', bg: '#DCFCE7', icon: <CheckCircle size={13} color="#166534" weight="bold" /> },
  rechazado: { label: 'No seleccionado', color: '#991B1B', bg: '#FEE2E2', icon: <XCircle     size={13} color="#991B1B" weight="bold" /> },
};

const STATUS_MESSAGE: Record<ApplicationStatus, string> = {
  pendiente: 'Tu postulación fue enviada. La empresa la revisará pronto.',
  revisando: 'La empresa está revisando tu perfil. Te notificaremos cualquier novedad.',
  aceptado:  '¡Felicidades! La empresa aceptó tu postulación. Espera su contacto.',
  rechazado: 'En esta ocasión no fuiste seleccionado. ¡Sigue intentando!',
};

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = {
  application: Application | null;
  onClose: () => void;
};

export default function ApplicationDetailModal({ application, onClose }: Props) {
  const router = useRouter();

  if (!application) return null;

  const job    = jobs.find((j) => j.id === application.jobId);
  const status = STATUS_CONFIG[application.status];

  if (!job) return null;

  return (
    <Modal visible={!!application} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Detalle de postulación</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Empresa y puesto */}
          <View style={styles.jobRow}>
            <View style={styles.jobIconBox}>
              <Buildings size={24} color={COLORS.primary} weight="bold" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company.name}</Text>
            </View>
          </View>

          {/* Badge de estado */}
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>

          {/* Metadatos */}
          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <MapPin size={15} color={COLORS.textSecondary} weight="bold" />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <CalendarBlank size={15} color={COLORS.textSecondary} weight="bold" />
              <Text style={styles.metaText}>
                Aplicaste el {formatDate(application.appliedAt)}
              </Text>
            </View>
            {application.cvAttached && (
              <View style={styles.metaRow}>
                <FilePdf size={15} color={COLORS.accent} weight="bold" />
                <Text style={[styles.metaText, { color: COLORS.accent }]}>
                  CV adjunto
                </Text>
              </View>
            )}
          </View>

          {/* Mensaje según estado */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {STATUS_MESSAGE[application.status]}
            </Text>
          </View>

          {/* Botón ver vacante */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => { onClose(); router.push(`/job/${job.id}`); }}
            activeOpacity={0.85}
          >
            <Briefcase size={16} color={COLORS.white} weight="bold" />
            <Text style={styles.buttonText}>Ver vacante completa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 44,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  jobIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
  },
  jobTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  jobCompany: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, marginBottom: 16,
  },
  statusText: { fontSize: 14, fontWeight: '700' },
  meta: { gap: 8, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, color: COLORS.textSecondary },
  messageBox: {
    backgroundColor: COLORS.background, borderRadius: 12,
    padding: 14, marginBottom: 20,
  },
  messageText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 14,
  },
  buttonText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
});