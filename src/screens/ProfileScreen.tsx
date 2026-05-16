import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowRight,
  Briefcase,
  Buildings,
  CalendarBlank,
  CheckCircle,
  Clock,
  FilePdf,
  FileText,
  MapPin,
  PencilSimple,
  SignOut,
  Trash,
  UploadSimple,
  UserCircle,
  Warning,
  X,
  XCircle,
} from 'phosphor-react-native';
import { useState } from 'react';

import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';
import { Application, ApplicationStatus } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pendiente: {
    label: 'Enviada',
    color: '#92400E',
    bg: '#FEF3C7',
    icon: <Clock size={13} color="#92400E" weight="bold" />,
  },
  revisando: {
    label: 'En revisión',
    color: '#1E40AF',
    bg: '#DBEAFE',
    icon: <FileText size={13} color="#1E40AF" weight="bold" />,
  },
  aceptado: {
    label: 'Aceptada',
    color: '#166534',
    bg: '#DCFCE7',
    icon: <CheckCircle size={13} color="#166534" weight="bold" />,
  },
  rechazado: {
    label: 'No seleccionado',
    color: '#991B1B',
    bg: '#FEE2E2',
    icon: <XCircle size={13} color="#991B1B" weight="bold" />,
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function ApplicationCard({ application }: { application: Application }) {
  const job = jobs.find((j) => j.id === application.jobId);
  const status = STATUS_CONFIG[application.status];

  if (!job) return null;

  return (
    <View style={styles.applicationCard}>
      {/* Empresa + puesto */}
      <View style={styles.appCardTop}>
        <View style={styles.appCardIconBox}>
          <Buildings size={20} color={COLORS.primary} weight="bold" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.appJobTitle} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.appCompanyName} numberOfLines={1}>
            {job.company.name}
          </Text>
        </View>
        {/* Badge de estado */}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          {status.icon}
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Meta info */}
      <View style={styles.appMeta}>
        <View style={styles.appMetaItem}>
          <MapPin size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.appMetaText}>{job.location}</Text>
        </View>
        <View style={styles.appMetaItem}>
          <CalendarBlank size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.appMetaText}>
            {formatDate(application.appliedAt)}
          </Text>
        </View>
        {application.cvAttached && (
          <View style={styles.appMetaItem}>
            <FilePdf size={13} color={COLORS.accent} weight="bold" />
            <Text style={[styles.appMetaText, { color: COLORS.accent }]}>
              CV adjunto
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Modal de edición de datos ───────────────────────────────────────────────

// (Solo UI — sin backend todavía)
function EditProfileModal({
  visible,
  onClose,
  name,
  email,
}: {
  visible: boolean;
  onClose: () => void;
  name: string;
  email: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.comingSoonBox}>
            <Warning size={32} color={COLORS.secondary} weight="bold" />
            <Text style={styles.comingSoonTitle}>Próximamente</Text>
            <Text style={styles.comingSoonText}>
              La edición de datos estará disponible cuando el backend esté listo.
            </Text>
          </View>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen principal ────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { user, setCv } = useUser();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  // ── CV handlers ──────────────────────────────────────────────────────────

  const handlePickDocument = async () => {
    try {
      setUploadingCv(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setCv({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType ?? 'application/pdf',
          size: asset.size,
        });
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar el documento. Intenta de nuevo.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handlePickImage = async () => {
    try {
      setUploadingCv(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const name = asset.uri.split('/').pop() ?? 'cv-imagen.jpg';
        setCv({
          uri: asset.uri,
          name,
          type: 'image/jpeg',
        });
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la imagen. Intenta de nuevo.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleRemoveCv = () => {
    Alert.alert(
      'Eliminar CV',
      '¿Estás seguro de que deseas quitar tu CV? Aún podrás postularte a vacantes que no lo requieran.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setCv(undefined),
        },
      ]
    );
  };

  // ── Datos derivados ───────────────────────────────────────────────────────

  const applications = user.applications;
  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'aceptado').length;
  const pendingApps = applications.filter(
    (a) => a.status === 'pendiente' || a.status === 'revisando'
  ).length;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
      >
        {/* ── Encabezado de pantalla ── */}
        <Text style={styles.screenTitle}>Mi perfil</Text>

        {/* ── Tarjeta de identidad ── */}
        <View style={styles.identityCard}>
          {/* Avatar con iniciales */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Briefcase size={12} color={COLORS.primary} weight="bold" />
              <Text style={styles.roleText}>Candidato</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <PencilSimple size={18} color={COLORS.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* ── Stats de postulaciones ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: COLORS.secondary }]}>
            <Text style={styles.statNumber}>{totalApps}</Text>
            <Text style={styles.statLabel}>Postulaciones</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
            <Text style={styles.statNumber}>{acceptedApps}</Text>
            <Text style={styles.statLabel}>Aceptadas</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.accent }]}>
            <Text style={styles.statNumber}>{pendingApps}</Text>
            <Text style={styles.statLabel}>En proceso</Text>
          </View>
        </View>

        {/* ── CV ── */}
        <View style={styles.section}>
          <SectionHeader title="Mi CV" />

          {user.cv ? (
            /* CV cargado */
            <View style={styles.cvCard}>
              <View style={styles.cvCardLeft}>
                <View style={styles.cvIconBox}>
                  <FilePdf size={24} color={COLORS.accent} weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cvFileName} numberOfLines={1}>
                    {user.cv.name}
                  </Text>
                  {user.cv.size && (
                    <Text style={styles.cvFileSize}>
                      {(user.cv.size / 1024).toFixed(0)} KB
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.cvRemoveButton}
                onPress={handleRemoveCv}
              >
                <Trash size={18} color="#991B1B" weight="bold" />
              </TouchableOpacity>
            </View>
          ) : (
            /* Sin CV — opciones para subir */
            <View style={styles.cvEmptyBox}>
              <FileText size={36} color={COLORS.border} weight="bold" />
              <Text style={styles.cvEmptyTitle}>Sin CV cargado</Text>
              <Text style={styles.cvEmptySubtitle}>
                Agrega tu CV para postularte a más vacantes
              </Text>

              <View style={styles.cvUploadButtons}>
                <TouchableOpacity
                  style={styles.cvUploadButton}
                  onPress={handlePickDocument}
                  disabled={uploadingCv}
                >
                  <FilePdf size={18} color={COLORS.primary} weight="bold" />
                  <Text style={styles.cvUploadButtonText}>PDF / Word</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cvUploadButton, { borderColor: COLORS.secondary }]}
                  onPress={handlePickImage}
                  disabled={uploadingCv}
                >
                  <UploadSimple size={18} color={COLORS.secondary} weight="bold" />
                  <Text style={[styles.cvUploadButtonText, { color: COLORS.secondary }]}>
                    Imagen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Botón de cambiar CV cuando ya hay uno */}
          {user.cv && (
            <TouchableOpacity
              style={styles.cvChangeButton}
              onPress={handlePickDocument}
              disabled={uploadingCv}
            >
              <UploadSimple size={16} color={COLORS.primary} weight="bold" />
              <Text style={styles.cvChangeButtonText}>
                {uploadingCv ? 'Cargando...' : 'Cambiar CV'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Divider />

        {/* ── Historial de postulaciones ── */}
        <View style={styles.section}>
          <SectionHeader title={`Mis postulaciones (${totalApps})`} />

          {applications.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase size={44} color={COLORS.border} weight="bold" />
              <Text style={styles.emptyTitle}>Aún no te has postulado</Text>
              <Text style={styles.emptySubtitle}>
                Explora las vacantes disponibles y aplica a las que te interesen
              </Text>
            </View>
          ) : (
            <View style={styles.applicationsList}>
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </View>
          )}
        </View>

        <Divider />

        {/* ── Opciones de cuenta ── */}
        <View style={styles.section}>
          <SectionHeader title="Cuenta" />

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert('Próximamente', 'Esta función estará disponible pronto.')
              }
            >
              <UserCircle size={20} color={COLORS.primary} weight="bold" />
              <Text style={styles.menuItemText}>Información personal</Text>
              <ArrowRight size={18} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert('Próximamente', 'Esta función estará disponible pronto.')
              }
            >
              <Buildings size={20} color={COLORS.primary} weight="bold" />
              <Text style={styles.menuItemText}>Empresas seguidas</Text>
              <ArrowRight size={18} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() =>
                Alert.alert(
                  'Cerrar sesión',
                  '¿Seguro que deseas salir?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Salir', style: 'destructive', onPress: () => {} },
                  ]
                )
              }
            >
              <SignOut size={20} color="#991B1B" weight="bold" />
              <Text style={[styles.menuItemText, { color: '#991B1B' }]}>
                Cerrar sesión
              </Text>
              <ArrowRight size={18} color="#991B1B" weight="bold" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal editar perfil */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        name={user.name}
        email={user.email}
      />
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },

  // ── Identidad
  identityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },

  // ── Stats
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
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ── Secciones
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 24,
  },

  // ── CV
  cvCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cvCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cvIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cvFileSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cvRemoveButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvChangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  cvChangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cvEmptyBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    gap: 6,
  },
  cvEmptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  cvEmptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  cvUploadButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cvUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  cvUploadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Postulaciones
  applicationsList: {
    gap: 10,
  },
  applicationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  appCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appCardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appJobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  appCompanyName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  appMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  appMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // ── Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // ── Menú de cuenta
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuItemDanger: {
    // solo cambia el color del texto e icono, ya seteado inline
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 48,
  },

  // ── Modal editar perfil
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  comingSoonBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  comingSoonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  comingSoonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  modalCloseButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});