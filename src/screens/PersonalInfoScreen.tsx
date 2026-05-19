import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CalendarBlank, Camera, CaretRight, EnvelopeSimple, GenderFemale, GenderIntersex, GenderMale, GenderNeuter, IdentificationCard, LockKey, PencilSimple, Phone, User, X, FilePdf } from 'phosphor-react-native';
import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CvUploadModal from '../components/modals/CvUploadModal';
import ScreenContainer from '../components/ScreenContainer';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import DatePickerModal from '../components/modals/DatePickerModal';
import FieldEditModal from '../components/modals/FieldEditModal';
import GenderModal from '../components/modals/GenderModal';
import PhotoOptionsModal from '../components/modals/PhotoOptionsModal';
import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { UserGender, fullName } from '../types';

// ─── helpers locales que siguen siendo necesarios ─────────────────────────────

const FIELD_COLORS = {
  nombre:    { bg: '#EFF6FF', icon: COLORS.primary },
  apellidos: { bg: '#FDF2F8', icon: COLORS.accent   },
  fecha:     { bg: '#FFF7ED', icon: COLORS.secondary },
  genero:    { bg: '#F0FDF4', icon: COLORS.success   },
  telefono:  { bg: '#F0FDF4', icon: COLORS.success   },
  email:     { bg: '#F3F4F6', icon: COLORS.textSecondary },
};

function genderIconBg(gender?: UserGender): string {
  switch (gender) {
    case 'hombre':            return '#EFF6FF';
    case 'mujer':             return '#FDE8F0';
    case 'no-binario':        return '#F0FDF4';
    case 'prefiero-no-decir': return '#F3F4F6';
    default:                  return '#F0FDF4';
  }
}

function GenderIcon({ gender, size = 18 }: { gender?: UserGender; size?: number }) {
  switch (gender) {
    case 'hombre':            return <GenderMale      size={size} color={COLORS.primary}       weight="bold" />;
    case 'mujer':             return <GenderFemale    size={size} color={COLORS.accent}         weight="bold" />;
    case 'no-binario':        return <GenderNeuter    size={size} color={COLORS.success}        weight="bold" />;
    case 'prefiero-no-decir': return <GenderIntersex  size={size} color={COLORS.textSecondary}  weight="bold" />;
    default:                  return <GenderIntersex  size={size} color={COLORS.success}        weight="bold" />;
  }
}

const GENDER_LABELS: Record<UserGender, string> = {
  hombre: 'Hombre', mujer: 'Mujer',
  'no-binario': 'No binario', 'prefiero-no-decir': 'Prefiero no decir',
};

function InfoRow({ icon, iconBg, label, value, onEdit, readonly }: {
  icon: React.ReactNode; iconBg: string;
  label: string; value: string;
  onEdit?: () => void; readonly?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.infoRow, readonly && styles.infoRowReadonly]}
      onPress={onEdit} disabled={readonly || !onEdit} activeOpacity={0.75}
    >
      <View style={[styles.infoRowIconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.infoRowContent}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={[styles.infoRowValue, !value && styles.infoRowEmpty]}>
          {value || 'Sin información'}
        </Text>
      </View>
      {!readonly && onEdit && <CaretRight size={16} color={COLORS.border} weight="bold" />}
      {readonly && <LockKey size={14} color={COLORS.border} weight="bold" />}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type EditingField = 'firstName' | 'lastName' | 'phone' | 'password' | 'date' | 'gender' | null;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateProfile, setProfilePhoto } = useUser();
  const params = useLocalSearchParams<{ from?: string }>();
  const fromWelcome = params.from === 'welcome';

  const [editing,             setEditing]             = useState<EditingField>(null);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [photoFullscreen,     setPhotoFullscreen]     = useState(false);
  const [cvModalVisible, setCvModalVisible] = useState(false);

  const initials = [user.firstName[0], user.lastName[0]].filter(Boolean).join('').toUpperCase() || '?';

  const handleRemovePhoto = () => {
    Alert.alert('Eliminar foto', '¿Seguro que deseas quitar tu foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setProfilePhoto('') },
    ]);
  };

  const formatBirthDate = (iso?: string) => {
    if (!iso) return '';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <ScreenContainer>
      <TouchableOpacity style={styles.backButton} onPress={() => fromWelcome ? router.replace('/') : router.back()}
>
        <ArrowLeft size={20} color={COLORS.primary} weight="bold" />
        <Text style={styles.backText}>Mi perfil</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Foto */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={() => setPhotoOptionsVisible(true)} activeOpacity={0.8}>
            {user.profilePhoto
              ? <Image source={{ uri: user.profilePhoto }} style={styles.avatarPhoto} />
              : <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            }
            <View style={styles.cameraOverlay}>
              <Camera size={16} color={COLORS.white} weight="bold" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoName}>{fullName(user) || 'Sin nombre'}</Text>
          <TouchableOpacity onPress={() => setPhotoOptionsVisible(true)}>
            <Text style={styles.photoEditText}>
              {user.profilePhoto ? 'Cambiar foto' : 'Agregar foto de perfil'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información personal</Text>
          <View style={styles.rowsGroup}>
            <InfoRow iconBg={FIELD_COLORS.nombre.bg} icon={<User size={18} color={FIELD_COLORS.nombre.icon} weight="bold" />} label="Nombre" value={user.firstName} onEdit={() => setEditing('firstName')} />
            <InfoRow iconBg={FIELD_COLORS.apellidos.bg} icon={<IdentificationCard size={18} color={FIELD_COLORS.apellidos.icon} weight="bold" />} label="Apellidos" value={user.lastName} onEdit={() => setEditing('lastName')} />
            <InfoRow iconBg={FIELD_COLORS.fecha.bg} icon={<CalendarBlank size={18} color={FIELD_COLORS.fecha.icon} weight="bold" />} label="Fecha de nacimiento" value={formatBirthDate(user.birthDate)} onEdit={() => setEditing('date')} />
            <InfoRow iconBg={genderIconBg(user.gender)} icon={<GenderIcon gender={user.gender} size={18} />} label="Género" value={user.gender ? GENDER_LABELS[user.gender] : ''} onEdit={() => setEditing('gender')} />
            <InfoRow iconBg={FIELD_COLORS.telefono.bg} icon={<Phone size={18} color={FIELD_COLORS.telefono.icon} weight="bold" />} label="Teléfono" value={user.phone ?? ''} onEdit={() => setEditing('phone')} />
          </View>
        </View>

        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Mi CV</Text>
  <TouchableOpacity
    style={styles.infoRow}
    onPress={() => setCvModalVisible(true)}
    activeOpacity={0.75}
  >
    <View style={[styles.infoRowIconBox, { backgroundColor: '#FDF2F8' }]}>
      <FilePdf size={18} color={COLORS.accent} weight="bold" />
    </View>
    <View style={styles.infoRowContent}>
      <Text style={styles.infoRowLabel}>Currículum Vitae</Text>
      <Text style={[styles.infoRowValue, !user.cv && styles.infoRowEmpty]}>
        {user.cv ? user.cv.name : 'Sin CV cargado'}
      </Text>
    </View>
    <CaretRight size={16} color={COLORS.border} weight="bold" />
  </TouchableOpacity>
</View>

        {/* Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.rowsGroup}>
            <InfoRow iconBg={FIELD_COLORS.email.bg} icon={<EnvelopeSimple size={18} color={FIELD_COLORS.email.icon} weight="bold" />} label="Correo electrónico" value={user.email} readonly />
            <TouchableOpacity style={styles.infoRow} onPress={() => setEditing('password')} activeOpacity={0.75}>
              <View style={[styles.infoRowIconBox, { backgroundColor: '#FEF3C7' }]}>
                <LockKey size={18} color="#B45309" weight="bold" />
              </View>
              <View style={styles.infoRowContent}>
                <Text style={styles.infoRowLabel}>Contraseña</Text>
                <Text style={styles.infoRowValue}>••••••••</Text>
              </View>
              <PencilSimple size={16} color={COLORS.primary} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.backendNote}>
          <LockKey size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.backendNoteText}>Los cambios se sincronizan cuando el backend esté listo</Text>
        </View>
      </ScrollView>

      {/* Modales — todos importados, ninguno inline */}
      <FieldEditModal
        visible={editing === 'firstName'}
        title="Nombre" value={user.firstName} placeholder="Tu nombre"
        accentColor={FIELD_COLORS.nombre.icon} iconBg={FIELD_COLORS.nombre.bg}
        icon={<User size={18} color={FIELD_COLORS.nombre.icon} weight="bold" />}
        onSave={(v) => updateProfile({ firstName: v })}
        onClose={() => setEditing(null)}
      />
      <FieldEditModal
        visible={editing === 'lastName'}
        title="Apellidos" value={user.lastName} placeholder="Tus apellidos"
        accentColor={FIELD_COLORS.apellidos.icon} iconBg={FIELD_COLORS.apellidos.bg}
        icon={<IdentificationCard size={18} color={FIELD_COLORS.apellidos.icon} weight="bold" />}
        onSave={(v) => updateProfile({ lastName: v })}
        onClose={() => setEditing(null)}
      />
      <FieldEditModal
        visible={editing === 'phone'}
        title="Teléfono" value={user.phone ?? ''} placeholder="10 dígitos"
        keyboardType="phone-pad" maxLength={10}
        accentColor={FIELD_COLORS.telefono.icon} iconBg={FIELD_COLORS.telefono.bg}
        icon={<Phone size={18} color={FIELD_COLORS.telefono.icon} weight="bold" />}
        hint="Opcional — las empresas podrán contactarte por este número"
        onSave={(v) => updateProfile({ phone: v || undefined })}
        onClose={() => setEditing(null)}
      />
      <DatePickerModal visible={editing === 'date'} value={user.birthDate} onSave={(iso) => updateProfile({ birthDate: iso })} onClose={() => setEditing(null)} />
      <GenderModal visible={editing === 'gender'} current={user.gender} onSave={(g) => updateProfile({ gender: g })} onClose={() => setEditing(null)} />
      <ChangePasswordModal visible={editing === 'password'} onClose={() => setEditing(null)} />

      <PhotoOptionsModal
        visible={photoOptionsVisible} photoUri={user.profilePhoto}
        setProfilePhoto={setProfilePhoto} onRemovePhoto={handleRemovePhoto}
        onViewFullscreen={() => { setPhotoOptionsVisible(false); setPhotoFullscreen(true); }}
        onClose={() => setPhotoOptionsVisible(false)}
      />

      <Modal visible={photoFullscreen} transparent animationType="fade">
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setPhotoFullscreen(false)}>
            <X size={26} color={COLORS.white} weight="bold" />
          </TouchableOpacity>
          {user.profilePhoto && (
            <Image source={{ uri: user.profilePhoto }} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <CvUploadModal
  visible={cvModalVisible}
  onClose={() => setCvModalVisible(false)}
/>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, marginTop: 4 },
  backText: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  photoSection: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  avatarPhoto: { width: 96, height: 96, borderRadius: 48 },
  avatarText: { fontSize: 36, fontWeight: '700', color: COLORS.white },
  cameraOverlay: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: COLORS.white },
  photoName: { fontSize: 22, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  photoEditText: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4 },
  rowsGroup: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.background, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  infoRowReadonly: { opacity: 0.75 },
  infoRowIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoRowContent: { flex: 1 },
  infoRowLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  infoRowValue: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  infoRowEmpty: { color: COLORS.border, fontStyle: 'italic', fontSize: 14 },
  backendNote: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, marginTop: 4, marginBottom: 8 },
  backendNoteText: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', flex: 1 },
  fullscreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  fullscreenClose: { position: 'absolute', top: 56, right: 20, padding: 8, zIndex: 10 },
  fullscreenImage: { width: '90%', height: '70%', borderRadius: 16 },
});