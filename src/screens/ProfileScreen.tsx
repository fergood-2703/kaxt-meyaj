import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  Eye,
  FilePdf,
  FileText,
  Image as ImageIcon,
  LockKey,
  MapPin,
  PencilSimple,
  Phone,
  SignOut,
  Trash,
  User,
  UserCircle,
  X,
  XCircle,
} from 'phosphor-react-native';
import { useState } from 'react';

import ScreenContainer from '../components/ScreenContainer';
import { useUser } from '../context/UserContext';
import { jobs } from '../data/jobs';
import { COLORS } from '../styles/colors';
import { Application, ApplicationStatus } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function CvIcon({ type }: { type: string }) {
  return type.startsWith('image/')
    ? <ImageIcon size={24} color={COLORS.accent} weight="bold" />
    : <FilePdf   size={24} color={COLORS.accent} weight="bold" />;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pendiente: { label: 'Enviada',         color: '#92400E', bg: '#FEF3C7', icon: <Clock       size={13} color="#92400E" weight="bold" /> },
  revisando: { label: 'En revisión',     color: '#1E40AF', bg: '#DBEAFE', icon: <FileText    size={13} color="#1E40AF" weight="bold" /> },
  aceptado:  { label: 'Aceptada',        color: '#166534', bg: '#DCFCE7', icon: <CheckCircle size={13} color="#166534" weight="bold" /> },
  rechazado: { label: 'No seleccionado', color: '#991B1B', bg: '#FEE2E2', icon: <XCircle     size={13} color="#991B1B" weight="bold" /> },
};

// ─── Selector de foto: cámara o galería con recorte ──────────────────────────
// Muestra un Action Sheet nativo con "Tomar foto" y "Elegir de galería".
// allowsEditing: true + aspect [1,1] activa el recorte cuadrado/circular de iOS.
// Abre la cámara con editor de recorte cuadrado
async function takePhoto(
  setProfilePhoto: (uri: string) => void,
  onDone?: () => void
) {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso de cámara', 'Activa el acceso a la cámara en Configuración.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
      onDone?.();
    }
  } catch {
    Alert.alert('Error', 'No se pudo acceder a la cámara.');
  }
}

// Abre la galería SIN editor primero (para que cargue rápido),
// el editor aparece después de seleccionar la foto
async function pickFromGallery(
  setProfilePhoto: (uri: string) => void,
  onDone?: () => void
) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,  // editor aparece después de elegir — no bloquea la galería
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
      onDone?.();
    }
  } catch {
    Alert.alert('Error', 'No se pudo cargar la foto.');
  }
}

// Para el botón del menú — muestra Action Sheet nativo
function selectProfilePhoto(
  setProfilePhoto: (uri: string) => void,
  onDone?: () => void
) {
  Alert.alert(
    'Foto de perfil',
    'Elige cómo quieres agregar tu foto',
    [
      { text: 'Tomar foto',       onPress: () => takePhoto(setProfilePhoto, onDone) },
      { text: 'Elegir de galería', onPress: () => pickFromGallery(setProfilePhoto, onDone) },
      { text: 'Cancelar',         style: 'cancel' },
    ],
    { cancelable: true }
  );
}

// ─── Modal: opciones de foto (desde el avatar) ────────────────────────────────

function PhotoOptionsModal({
  visible,
  photoUri,
  setProfilePhoto,
  onRemovePhoto,
  onViewFullscreen,
  onClose,
}: {
  visible: boolean;
  photoUri?: string;
  setProfilePhoto: (uri: string) => void;
  onRemovePhoto: () => void;
  onViewFullscreen: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Foto de perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Preview si ya hay foto */}
          {photoUri && (
            <View style={styles.photoPreviewWrapper}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </View>
          )}

          <View style={styles.photoOptions}>
            {/* Ver en pantalla completa — solo si ya hay foto */}
            {photoUri && (
              <TouchableOpacity
                style={styles.photoOption}
                onPress={() => { onClose(); onViewFullscreen(); }}
                activeOpacity={0.75}
              >
                <View style={[styles.photoOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Eye size={22} color={COLORS.primary} weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.photoOptionTitle}>Ver foto de perfil</Text>
                  <Text style={styles.photoOptionSubtitle}>Ver en pantalla completa</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Tomar foto con cámara */}
            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => takePhoto(setProfilePhoto, onClose)}
              activeOpacity={0.75}
            >
              <View style={[styles.photoOptionIcon, { backgroundColor: '#FFF7ED' }]}>
                <Camera size={22} color={COLORS.secondary} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.photoOptionTitle}>Tomar foto</Text>
                <Text style={styles.photoOptionSubtitle}>Usa la cámara ahora mismo</Text>
              </View>
            </TouchableOpacity>

            {/* Elegir de galería */}
            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => pickFromGallery(setProfilePhoto, onClose)}
              activeOpacity={0.75}
            >
              <View style={[styles.photoOptionIcon, { backgroundColor: '#F0FDF4' }]}>
                <ImageIcon size={22} color={COLORS.success} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.photoOptionTitle}>Elegir de galería</Text>
                <Text style={styles.photoOptionSubtitle}>Selecciona desde tus fotos</Text>
              </View>
            </TouchableOpacity>

            {/* Eliminar foto — solo si ya hay foto */}
            {photoUri && (
              <TouchableOpacity
                style={[styles.photoOption, styles.photoOptionDanger]}
                onPress={() => {
                  onClose();
                  onRemovePhoto();
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.photoOptionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Trash size={22} color="#991B1B" weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.photoOptionTitle, { color: '#991B1B' }]}>
                    Eliminar foto
                  </Text>
                  <Text style={styles.photoOptionSubtitle}>Volver a las iniciales</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {!photoUri && (
            <View style={styles.photoTipBox}>
              <Camera size={14} color={COLORS.secondary} weight="bold" />
              <Text style={styles.photoTipBoxText}>
                Usa una foto real tuya para que las empresas puedan reconocerte
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Modal: pantalla completa ─────────────────────────────────────────────────

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

// ─── Modal: detalle de postulación ───────────────────────────────────────────

function ApplicationDetailModal({ application, onClose }: {
  application: Application | null; onClose: () => void;
}) {
  const router = useRouter();
  if (!application) return null;
  const job    = jobs.find((j) => j.id === application.jobId);
  const status = STATUS_CONFIG[application.status];
  if (!job) return null;

  return (
    <Modal visible={!!application} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de postulación</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.appDetailTop}>
            <View style={styles.appDetailIconBox}>
              <Buildings size={24} color={COLORS.primary} weight="bold" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appDetailTitle}>{job.title}</Text>
              <Text style={styles.appDetailCompany}>{job.company.name}</Text>
            </View>
          </View>

          <View style={[styles.appDetailStatusRow, { backgroundColor: status.bg }]}>
            {status.icon}
            <Text style={[styles.appDetailStatusText, { color: status.color }]}>{status.label}</Text>
          </View>

          <View style={styles.appDetailInfo}>
            <View style={styles.appDetailInfoRow}>
              <MapPin size={15} color={COLORS.textSecondary} weight="bold" />
              <Text style={styles.appDetailInfoText}>{job.location}</Text>
            </View>
            <View style={styles.appDetailInfoRow}>
              <CalendarBlank size={15} color={COLORS.textSecondary} weight="bold" />
              <Text style={styles.appDetailInfoText}>Aplicaste el {formatDate(application.appliedAt)}</Text>
            </View>
            {application.cvAttached && (
              <View style={styles.appDetailInfoRow}>
                <FilePdf size={15} color={COLORS.accent} weight="bold" />
                <Text style={[styles.appDetailInfoText, { color: COLORS.accent }]}>CV adjunto</Text>
              </View>
            )}
          </View>

          <View style={styles.appDetailMessage}>
            <Text style={styles.appDetailMessageText}>
              {application.status === 'pendiente' && 'Tu postulación fue enviada. La empresa la revisará pronto.'}
              {application.status === 'revisando' && 'La empresa está revisando tu perfil. Te notificaremos cualquier novedad.'}
              {application.status === 'aceptado'  && '¡Felicidades! La empresa aceptó tu postulación. Espera su contacto.'}
              {application.status === 'rechazado' && 'En esta ocasión no fuiste seleccionado. ¡Sigue intentando!'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.appDetailButton}
            onPress={() => { onClose(); router.push(`/job/${job.id}`); }}
            activeOpacity={0.85}
          >
            <Briefcase size={16} color={COLORS.white} weight="bold" />
            <Text style={styles.appDetailButtonText}>Ver vacante completa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Modal: información personal ─────────────────────────────────────────────

function EditProfileModal({ visible, onClose, initialName, initialPhone }: {
  visible: boolean; onClose: () => void; initialName: string; initialPhone: string;
}) {
  const { updateProfile } = useUser();
  const [name,  setName]  = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Error', 'El nombre no puede estar vacío.'); return; }
    updateProfile(name.trim(), phone.trim() || undefined);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Información personal</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Nombre completo</Text>
          <View style={styles.inputRow}>
            <User size={18} color={COLORS.textSecondary} weight="bold" />
            <TextInput style={styles.inputField} value={name} onChangeText={setName}
              placeholder="Tu nombre" placeholderTextColor={COLORS.textSecondary} autoCapitalize="words" />
          </View>

          <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
          <View style={styles.inputRow}>
            <Phone size={18} color={COLORS.textSecondary} weight="bold" />
            <TextInput style={styles.inputField} value={phone} onChangeText={setPhone}
              placeholder="10 dígitos" placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad" maxLength={10} />
          </View>

          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <LockKey size={18} color={COLORS.border} weight="bold" />
            <Text style={styles.inputFieldDisabled}>El correo se edita desde el backend</Text>
          </View>

          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <LockKey size={18} color={COLORS.border} weight="bold" />
            <Text style={styles.inputFieldDisabled}>Cambio de contraseña próximamente</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const router       = useRouter();
  const { user, setCv, setProfilePhoto, logout } = useUser();

  const [selectedApp,         setSelectedApp]         = useState<Application | null>(null);
  const [editModalVisible,    setEditModalVisible]    = useState(false);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [photoFullscreen,     setPhotoFullscreen]     = useState(false);
  const [uploadingCv,         setUploadingCv]         = useState(false);

  // ── Eliminar foto de perfil ───────────────────────────────────────────────

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
        type: ['application/pdf'],
        copyToCacheDirectory: true,
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
        const name  = asset.uri.split('/').pop() ?? 'cv-imagen.jpg';
        setCv({ uri: asset.uri, name, type: 'image/jpeg' });
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleRemoveCv = () => {
    Alert.alert('Eliminar CV', '¿Estás seguro? Aún podrás postularte a vacantes que no lo requieran.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setCv(undefined) },
    ]);
  };

  // ── Cerrar sesión ─────────────────────────────────────────────────────────

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  // ── Datos derivados ───────────────────────────────────────────────────────

  const applications = user.applications;
  const totalApps    = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'aceptado').length;
  const pendingApps  = applications.filter((a) => a.status === 'pendiente' || a.status === 'revisando').length;
  const initials     = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
      >
        <Text style={styles.screenTitle}>Mi perfil</Text>

        {/* ── Tarjeta de identidad ── */}
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
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
            <View style={styles.roleBadge}>
              <Briefcase size={12} color={COLORS.primary} weight="bold" />
              <Text style={styles.roleText}>Candidato</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
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
                    {user.cv.size && <Text style={styles.cvFileSize}>{(user.cv.size / 1024).toFixed(0)} KB</Text>}
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
                <TouchableOpacity style={[styles.cvChangeButton, { borderColor: COLORS.secondary }]} onPress={handlePickImageCv} disabled={uploadingCv}>
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
                <TouchableOpacity style={[styles.cvUploadButton, { borderColor: COLORS.secondary }]} onPress={handlePickImageCv} disabled={uploadingCv}>
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
              <Text style={styles.emptySubtitle}>Explora las vacantes y aplica a las que te interesen</Text>
            </View>
          ) : (
            <View style={styles.applicationsList}>
              {applications.map((app) => {
                const job    = jobs.find((j) => j.id === app.jobId);
                const status = STATUS_CONFIG[app.status];
                if (!job) return null;
                return (
                  <TouchableOpacity key={app.id} style={styles.applicationCard} onPress={() => setSelectedApp(app)} activeOpacity={0.75}>
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
            <TouchableOpacity style={styles.menuItem} onPress={() => setEditModalVisible(true)}>
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
              onPress={() => Alert.alert('Próximamente', 'El cambio de contraseña estará disponible cuando el backend esté listo.')}
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

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        initialName={user.name}
        initialPhone={user.phone ?? ''}
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
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  photoPreviewWrapper: { alignItems: 'center', marginBottom: 20 },
  photoPreview: { width: 120, height: 120, borderRadius: 60 },
  photoOptions: { gap: 10 },
  photoOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.background, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  photoOptionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  photoOptionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  photoOptionSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  photoOptionDanger: { borderColor: '#FEE2E2' },
  photoTipBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#FED7AA',
  },
  photoTipBoxText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },
  fullscreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  fullscreenClose: { position: 'absolute', top: 56, right: 20, padding: 8, zIndex: 10 },
  fullscreenImage: { width: '90%', height: '70%', borderRadius: 16 },
  appDetailTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  appDetailIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  appDetailTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  appDetailCompany: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  appDetailStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 16 },
  appDetailStatusText: { fontSize: 14, fontWeight: '700' },
  appDetailInfo: { gap: 8, marginBottom: 16 },
  appDetailInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appDetailInfoText: { fontSize: 13, color: COLORS.textSecondary },
  appDetailMessage: { backgroundColor: COLORS.background, borderRadius: 12, padding: 14, marginBottom: 20 },
  appDetailMessageText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  appDetailButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 14 },
  appDetailButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
  inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginTop: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border },
  inputField: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 13 },
  inputRowDisabled: { opacity: 0.6 },
  inputFieldDisabled: { flex: 1, fontSize: 14, color: COLORS.textSecondary, paddingVertical: 13, fontStyle: 'italic' },
  saveButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  saveButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
});