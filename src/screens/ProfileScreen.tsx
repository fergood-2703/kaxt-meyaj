import {
  Alert,
  Image,
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
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Briefcase,
  Buildings,
  CalendarBlank,
  Camera,
  CheckCircle,
  Clock,
  FilePdf,
  FileText,
  Image as ImageIcon,
  LockKey,
  MapPin,
  PencilSimple,
  SignOut,
  Trash,
  UserCircle,
  X,
  XCircle,
} from 'phosphor-react-native';
import { useState } from 'react';

import ApplicationDetailModal from '../components/modals/ApplicationDetailModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import PhotoOptionsModal from '../components/modals/PhotoOptionsModal';
import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';
import { Application, ApplicationStatus, fullName } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function CvIcon({ type }: { type: string }) {
  return type.startsWith('image/')
    ? <ImageIcon size={24} color={COLORS.accent} weight="bold" />
    : <FilePdf size={24} color={COLORS.accent} weight="bold" />;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pendiente: { label: 'Enviada', color: '#92400E', bg: '#FEF3C7', icon: <Clock size={13} color="#92400E" weight="bold" /> },
  revisando: { label: 'En revisión', color: '#1E40AF', bg: '#DBEAFE', icon: <FileText size={13} color="#1E40AF" weight="bold" /> },
  aceptado: { label: 'Aceptada', color: '#166534', bg: '#DCFCE7', icon: <CheckCircle size={13} color="#166534" weight="bold" /> },
  rechazado: { label: 'No seleccionado', color: '#991B1B', bg: '#FEE2E2', icon: <XCircle size={13} color="#991B1B" weight="bold" /> },
};

// ─── Foto pantalla completa ───────────────────────────────────────────────────

function PhotoFullscreenModal({ visible, photoUri, onClose }: {
  visible: boolean; photoUri?: string; onClose: () => void;
}) {
  if (!photoUri) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.fullscreenOverlay}>
        <TouchableOpacity style={styles.fullscreenClose} onPress={onClose}>
          <X size={26} color={COLORS.white} weight="bold" />
        </TouchableOpacity>
        <Image source={{ uri: photoUri }} style={styles.fullscreenImage} resizeMode="contain" />
      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { user, setCv, setProfilePhoto, logout } = useUser();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [photoFullscreen, setPhotoFullscreen] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  // ── Foto ──────────────────────────────────────────────────────────────────

  const handleRemovePhoto = () => {
    Alert.alert(
      'Eliminar foto',
      '¿Seguro que deseas quitar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setProfilePhoto('') },
      ]
    );
  };

  // ── CV ────────────────────────────────────────────────────────────────────

  const handlePickPdf = async () => {
    try {
      setUploadingCv(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'], copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setCv({ uri: asset.uri, name: asset.name, type: 'application/pdf', size: asset.size });
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar el PDF.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handlePickImageCv = async () => {
    try {
      setUploadingCv(true);
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const name = asset.uri.split('/').pop() ?? 'cv-imagen.jpg';
        setCv({ uri: asset.uri, name, type: 'image/jpeg' });
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleRemoveCv = () => {
    Alert.alert(
      'Eliminar CV',
      '¿Estás seguro? Aún podrás postularte a vacantes que no lo requieran.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setCv(undefined) },
      ]
    );
  };

  // ── Sesión ────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: () => { logout(); router.replace('/login'); },
      },
    ]);
  };

  // ── Datos derivados ───────────────────────────────────────────────────────

  const applications = user.applications;
  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'aceptado').length;
  const pendingApps = applications.filter(
    (a) => a.status === 'pendiente' || a.status === 'revisando'
  ).length;

  const name = fullName(user);
  const initials = [user.firstName[0], user.lastName[0]]
    .filter(Boolean).join('').toUpperCase() || '?';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
      >
        <Text style={styles.screenTitle}>Mi perfil</Text>

        {/* ── Identidad ── */}
        <View style={styles.identityCard}>
          <TouchableOpacity
            onPress={() => setPhotoOptionsVisible(true)}
            style={styles.avatarWrapper}
            activeOpacity={0.8}
          >
            {user.profilePhoto
              ? <Image source={{ uri: user.profilePhoto }} style={styles.avatarPhoto} />
              : <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            }
            <View style={styles.cameraOverlay}>
              <Camera size={14} color={COLORS.white} weight="bold" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{name || 'Sin nombre'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
            <View style={styles.roleBadge}>
              <Briefcase size={12} color={COLORS.primary} weight="bold" />
              <Text style={styles.roleText}>Candidato</Text>
            </View>
          </View>

          {/* Botón editar → va a PersonalInfoScreen */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/personal-info' as any)}
          >
            <PencilSimple size={18} color={COLORS.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        {!user.profilePhoto && (
          <View style={styles.photoTip}>
            <Camera size={13} color={COLORS.secondary} weight="bold" />
            <Text style={styles.photoTipText}>
              Toca tu avatar para agregar una foto real
            </Text>
          </View>
        )}

        {/* ── Stats ── */}
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
          <Text style={styles.sectionTitle}>Mi CV</Text>
          {user.cv ? (
            <>
              <View style={styles.cvCard}>
                <View style={styles.cvCardLeft}>
                  <View style={styles.cvIconBox}><CvIcon type={user.cv.type} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cvFileName} numberOfLines={1}>{user.cv.name}</Text>
                    {user.cv.size && (
                      <Text style={styles.cvFileSize}>{(user.cv.size / 1024).toFixed(0)} KB</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={styles.cvRemoveButton} onPress={handleRemoveCv}>
                  <Trash size={18} color="#991B1B" weight="bold" />
                </TouchableOpacity>
              </View>
              <View style={styles.cvChangeRow}>
                <TouchableOpacity style={styles.cvChangeButton} onPress={handlePickPdf} disabled={uploadingCv}>
                  <FilePdf size={16} color={COLORS.primary} weight="bold" />
                  <Text style={styles.cvChangeButtonText}>{uploadingCv ? 'Cargando...' : 'Cambiar PDF'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cvChangeButton, { borderColor: COLORS.secondary }]}
                  onPress={handlePickImageCv}
                  disabled={uploadingCv}
                >
                  <ImageIcon size={16} color={COLORS.secondary} weight="bold" />
                  <Text style={[styles.cvChangeButtonText, { color: COLORS.secondary }]}>Cambiar imagen</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.cvEmptyBox}>
              <FileText size={36} color={COLORS.border} weight="bold" />
              <Text style={styles.cvEmptyTitle}>Sin CV cargado</Text>
              <Text style={styles.cvEmptySubtitle}>Solo se aceptan PDF e imágenes (JPG/PNG)</Text>
              <View style={styles.cvUploadButtons}>
                <TouchableOpacity style={styles.cvUploadButton} onPress={handlePickPdf} disabled={uploadingCv}>
                  <FilePdf size={18} color={COLORS.primary} weight="bold" />
                  <Text style={styles.cvUploadButtonText}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cvUploadButton, { borderColor: COLORS.secondary }]}
                  onPress={handlePickImageCv}
                  disabled={uploadingCv}
                >
                  <ImageIcon size={18} color={COLORS.secondary} weight="bold" />
                  <Text style={[styles.cvUploadButtonText, { color: COLORS.secondary }]}>Imagen</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── Postulaciones ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis postulaciones ({totalApps})</Text>
          {applications.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase size={44} color={COLORS.border} weight="bold" />
              <Text style={styles.emptyTitle}>Aún no te has postulado</Text>
              <Text style={styles.emptySubtitle}>
                Explora las vacantes y aplica a las que te interesen
              </Text>
            </View>
          ) : (
            <View style={styles.applicationsList}>
              {applications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const status = STATUS_CONFIG[app.status];
                if (!job) return null;
                return (
                  <TouchableOpacity
                    key={app.id}
                    style={styles.applicationCard}
                    onPress={() => setSelectedApp(app)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.appCardTop}>
                      <View style={styles.appCardIconBox}>
                        <Buildings size={20} color={COLORS.primary} weight="bold" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.appJobTitle} numberOfLines={1}>{job.title}</Text>
                        <Text style={styles.appCompanyName} numberOfLines={1}>{job.company.name}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        {status.icon}
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                      </View>
                    </View>
                    <View style={styles.appMeta}>
                      <View style={styles.appMetaItem}>
                        <MapPin size={13} color={COLORS.textSecondary} weight="bold" />
                        <Text style={styles.appMetaText}>{job.location}</Text>
                      </View>
                      <View style={styles.appMetaItem}>
                        <CalendarBlank size={13} color={COLORS.textSecondary} weight="bold" />
                        <Text style={styles.appMetaText}>{formatDate(app.appliedAt)}</Text>
                      </View>
                      {app.cvAttached && (
                        <View style={styles.appMetaItem}>
                          <FilePdf size={13} color={COLORS.accent} weight="bold" />
                          <Text style={[styles.appMetaText, { color: COLORS.accent }]}>CV adjunto</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.appCardFooter}>
                      <Text style={styles.appCardFooterText}>Ver detalles</Text>
                      <ArrowRight size={13} color={COLORS.primary} weight="bold" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── Cuenta ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.menuCard}>
            {/* → navega a PersonalInfoScreen */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/personal-info' as any)}
            >
              <UserCircle size={20} color={COLORS.primary} weight="bold" />
              <Text style={styles.menuItemText}>Información personal</Text>
              <ArrowRight size={18} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setPhotoOptionsVisible(true)}
            >
              <Camera size={20} color={COLORS.primary} weight="bold" />
              <Text style={styles.menuItemText}>
                {user.profilePhoto ? 'Ver / cambiar foto de perfil' : 'Agregar foto de perfil'}
              </Text>
              <ArrowRight size={18} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setChangePasswordVisible(true)}
            >
              <LockKey size={20} color={COLORS.primary} weight="bold" />
              <Text style={styles.menuItemText}>Cambiar contraseña</Text>
              <ArrowRight size={18} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <SignOut size={20} color="#991B1B" weight="bold" />
              <Text style={[styles.menuItemText, { color: '#991B1B' }]}>Cerrar sesión</Text>
              <ArrowRight size={18} color="#991B1B" weight="bold" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Modales ── */}
      <PhotoOptionsModal
        visible={photoOptionsVisible}
        photoUri={user.profilePhoto}
        setProfilePhoto={setProfilePhoto}
        onRemovePhoto={handleRemovePhoto}
        onViewFullscreen={() => { setPhotoOptionsVisible(false); setPhotoFullscreen(true); }}
        onClose={() => setPhotoOptionsVisible(false)}
      />

      <PhotoFullscreenModal
        visible={photoFullscreen}
        photoUri={user.profilePhoto}
        onClose={() => setPhotoFullscreen(false)}
      />

      <ApplicationDetailModal
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />

      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />

    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenTitle: { fontSize: 26, fontWeight: '700', color: COLORS.primary, marginBottom: 20 },
  identityCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarPhoto: { width: 60, height: 60, borderRadius: 30 },
  avatarText: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  userName: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  userEmail: { fontSize: 12, color: COLORS.textSecondary },
  userPhone: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 6,
  },
  roleText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  editButton: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border,
  },
  photoTip: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingHorizontal: 4 },
  photoTipText: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', flex: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, borderLeftWidth: 3,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  statNumber: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  divider: { height: 1, backgroundColor: COLORS.border, marginTop: 24 },
  cvCard: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border,
  },
  cvCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cvIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#FDF2F8', alignItems: 'center', justifyContent: 'center' },
  cvFileName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  cvFileSize: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cvRemoveButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  cvChangeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  cvChangeButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.white,
  },
  cvChangeButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  cvEmptyBox: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 24, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', gap: 6,
  },
  cvEmptyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginTop: 4 },
  cvEmptySubtitle: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  cvUploadButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cvUploadButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.white,
  },
  cvUploadButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  applicationsList: { gap: 10 },
  applicationCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 8 },
  appCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appCardIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  appJobTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  appCompanyName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  appMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  appMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appMetaText: { fontSize: 12, color: COLORS.textSecondary },
  appCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: COLORS.border },
  appCardFooterText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  emptySubtitle: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  menuCard: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 15 },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 48 },
  fullscreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  fullscreenClose: { position: 'absolute', top: 56, right: 20, padding: 8, zIndex: 10 },
  fullscreenImage: { width: '90%', height: '70%', borderRadius: 16 },
});