import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CalendarBlank,
  Camera,
  CaretRight,
  EnvelopeSimple,
  GenderFemale,
  GenderIntersex,
  GenderMale,
  GenderNeuter,
  IdentificationCard,
  LockKey,
  PencilSimple,
  Phone,
  User,
  X,
} from 'phosphor-react-native';
import { useState } from 'react';

import ScreenContainer from '../components/ScreenContainer';
import PhotoOptionsModal from '../components/modals/PhotoOptionsModal';
import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { UserGender, fullName } from '../types';

// ─── Colores por campo ────────────────────────────────────────────────────────

const FIELD_COLORS = {
  nombre:    { bg: '#EFF6FF', icon: COLORS.primary },
  apellidos: { bg: '#FDF2F8', icon: COLORS.accent   },
  fecha:     { bg: '#FFF7ED', icon: COLORS.secondary },
  genero:    { bg: '#F0FDF4', icon: COLORS.success   },
  telefono:  { bg: '#EFF6FF', icon: COLORS.primary   },
  email:     { bg: '#F3F4F6', icon: COLORS.textSecondary },
  password:  { bg: '#FEF3C7', icon: '#B45309'         },
};

// ─── Género config ────────────────────────────────────────────────────────────

type GenderOption = { value: UserGender; label: string; icon: React.ReactNode; color: string };

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'hombre',            label: 'Hombre',           icon: null, color: COLORS.primary   },
  { value: 'mujer',             label: 'Mujer',            icon: null, color: COLORS.accent     },
  { value: 'no-binario',        label: 'No binario',       icon: null, color: COLORS.success    },
  { value: 'prefiero-no-decir', label: 'Prefiero no decir', icon: null, color: COLORS.textSecondary },
];

// Ícono dinámico según género seleccionado
function GenderIcon({ gender, size = 18 }: { gender?: UserGender; size?: number }) {
  switch (gender) {
    case 'hombre':            return <GenderMale      size={size} color={COLORS.primary}       weight="bold" />;
    case 'mujer':             return <GenderFemale    size={size} color={COLORS.accent}         weight="bold" />;
    case 'no-binario':        return <GenderNeuter    size={size} color={COLORS.success}        weight="bold" />;
    case 'prefiero-no-decir': return <GenderIntersex  size={size} color={COLORS.textSecondary}  weight="bold" />;
    default:                  return <GenderIntersex  size={size} color={COLORS.success}        weight="bold" />;
  }
}

function genderIconBg(gender?: UserGender): string {
  switch (gender) {
    case 'hombre':            return '#EFF6FF';
    case 'mujer':             return '#FDE8F0';
    case 'no-binario':        return '#F0FDF4';
    case 'prefiero-no-decir': return '#F3F4F6';
    default:                  return '#F0FDF4';
  }
}

// ─── Modal de texto ───────────────────────────────────────────────────────────

type FieldModalProps = {
  visible: boolean;
  title: string;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  maxLength?: number;
  hint?: string;
  secureTextEntry?: boolean;
  accentColor?: string;
};

function FieldEditModal({
  visible, title, value, onSave, onClose,
  placeholder, keyboardType = 'default',
  maxLength, hint, secureTextEntry = false,
  accentColor = COLORS.primary,
}: FieldModalProps) {
  const [text, setText] = useState(value);

  const handleSave = () => {
    if (!text.trim() && !secureTextEntry) {
      Alert.alert('Error', `El campo "${title}" no puede estar vacío.`);
      return;
    }
    onSave(text.trim());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Pill decorativo */}
          <View style={styles.sheetPill} />

          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: accentColor }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.sheetInput, { borderColor: accentColor }]}
            value={text}
            onChangeText={setText}
            placeholder={placeholder ?? title}
            placeholderTextColor={COLORS.textSecondary}
            keyboardType={keyboardType}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            autoFocus
          />

          {hint && <Text style={styles.sheetHint}>{hint}</Text>}

          <TouchableOpacity
            style={[styles.sheetSaveBtn, { backgroundColor: accentColor }]}
            onPress={handleSave}
          >
            <Text style={styles.sheetSaveBtnText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Modal de fecha ───────────────────────────────────────────────────────────

function DatePickerModal({
  visible, value, onSave, onClose,
}: {
  visible: boolean; value?: string;
  onSave: (date: string) => void; onClose: () => void;
}) {
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 18);
  const initialDate = value ? new Date(value) : defaultDate;
  const [selected, setSelected] = useState<Date>(initialDate);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetPill} />

        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <View style={[styles.sheetHeaderIcon, { backgroundColor: '#FFF7ED' }]}>
              <CalendarBlank size={20} color={COLORS.secondary} weight="bold" />
            </View>
            <Text style={[styles.sheetTitle, { color: COLORS.secondary }]}>
              Fecha de nacimiento
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={COLORS.textSecondary} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Contenedor con fondo para que el spinner sea visible */}
        <View style={styles.datePickerWrapper}>
          <DateTimePicker
            value={selected}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => { if (date) setSelected(date); }}
            maximumDate={new Date()}
            minimumDate={new Date(1920, 0, 1)}
            locale="es-MX"
            style={{ width: '100%' }}
            textColor={COLORS.textPrimary}   // iOS: color del texto del spinner
          />
        </View>

        <TouchableOpacity
          style={[styles.sheetSaveBtn, { backgroundColor: COLORS.secondary }]}
          onPress={() => {
            onSave(selected.toISOString().split('T')[0]);
            onClose();
          }}
        >
          <Text style={styles.sheetSaveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Modal de género ──────────────────────────────────────────────────────────

function GenderModal({
  visible, current, onSave, onClose,
}: {
  visible: boolean; current?: UserGender;
  onSave: (g: UserGender) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetPill} />

        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <View style={[styles.sheetHeaderIcon, { backgroundColor: '#F0FDF4' }]}>
              <GenderIcon gender={current} size={20} />
            </View>
            <Text style={[styles.sheetTitle, { color: COLORS.success }]}>Género</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={COLORS.textSecondary} weight="bold" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sheetHint}>
          Esta información es opcional y se usa solo para estadísticas internas.
        </Text>

        <View style={styles.genderList}>
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = current === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.genderRow,
                  isSelected && { borderColor: opt.color, backgroundColor: opt.color + '14' },
                ]}
                onPress={() => { onSave(opt.value); onClose(); }}
                activeOpacity={0.75}
              >
                <View style={[styles.genderRowIcon, { backgroundColor: genderIconBg(opt.value) }]}>
                  <GenderIcon gender={opt.value} size={18} />
                </View>
                <Text style={[
                  styles.genderRowText,
                  isSelected && { color: opt.color, fontWeight: '700' },
                ]}>
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={[styles.genderDot, { backgroundColor: opt.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

// ─── Fila de información ──────────────────────────────────────────────────────

function InfoRow({
  icon, iconBg, label, value, onEdit, readonly,
}: {
  icon: React.ReactNode; iconBg: string;
  label: string; value: string;
  onEdit?: () => void; readonly?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onEdit}
      disabled={readonly || !onEdit}
      activeOpacity={0.7}
    >
      <View style={[styles.infoRowIconBox, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.infoRowContent}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={[styles.infoRowValue, !value && styles.infoRowEmpty]}>
          {value || 'Sin información'}
        </Text>
      </View>
      {!readonly && onEdit && (
        <CaretRight size={16} color={COLORS.border} weight="bold" />
      )}
      {readonly && (
        <LockKey size={14} color={COLORS.border} weight="bold" />
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type EditingField = 'firstName' | 'lastName' | 'phone' | 'password' | 'date' | 'gender' | null;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateProfile, setProfilePhoto } = useUser();

  const [editing,             setEditing]             = useState<EditingField>(null);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [photoFullscreen,     setPhotoFullscreen]     = useState(false);

  const initials = [user.firstName[0], user.lastName[0]]
    .filter(Boolean).join('').toUpperCase() || '?';

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

  const genderLabel = GENDER_OPTIONS.find((o) => o.value === user.gender)?.label ?? '';

  return (
    <ScreenContainer>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={COLORS.primary} weight="bold" />
        <Text style={styles.backText}>Mi perfil</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Foto ── */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setPhotoOptionsVisible(true)}
            activeOpacity={0.8}
          >
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

        {/* ── Información personal ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información personal</Text>

          <InfoRow
            iconBg={FIELD_COLORS.nombre.bg}
            icon={<User size={18} color={FIELD_COLORS.nombre.icon} weight="bold" />}
            label="Nombre"
            value={user.firstName}
            onEdit={() => setEditing('firstName')}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            iconBg={FIELD_COLORS.apellidos.bg}
            icon={<IdentificationCard size={18} color={FIELD_COLORS.apellidos.icon} weight="bold" />}
            label="Apellidos"
            value={user.lastName}
            onEdit={() => setEditing('lastName')}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            iconBg={FIELD_COLORS.fecha.bg}
            icon={<CalendarBlank size={18} color={FIELD_COLORS.fecha.icon} weight="bold" />}
            label="Fecha de nacimiento"
            value={formatBirthDate(user.birthDate)}
            onEdit={() => setEditing('date')}
          />
          <View style={styles.rowDivider} />

          {/* Género — ícono y color dinámico */}
          <InfoRow
            iconBg={genderIconBg(user.gender)}
            icon={<GenderIcon gender={user.gender} size={18} />}
            label="Género"
            value={genderLabel}
            onEdit={() => setEditing('gender')}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            iconBg={FIELD_COLORS.telefono.bg}
            icon={<Phone size={18} color={FIELD_COLORS.telefono.icon} weight="bold" />}
            label="Teléfono"
            value={user.phone ?? ''}
            onEdit={() => setEditing('phone')}
          />
        </View>

        {/* ── Cuenta ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta</Text>

          <InfoRow
            iconBg={FIELD_COLORS.email.bg}
            icon={<EnvelopeSimple size={18} color={FIELD_COLORS.email.icon} weight="bold" />}
            label="Correo electrónico"
            value={user.email}
            readonly
          />
          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => setEditing('password')}
            activeOpacity={0.7}
          >
            <View style={[styles.infoRowIconBox, { backgroundColor: FIELD_COLORS.password.bg }]}>
              <LockKey size={18} color={FIELD_COLORS.password.icon} weight="bold" />
            </View>
            <View style={styles.infoRowContent}>
              <Text style={styles.infoRowLabel}>Contraseña</Text>
              <Text style={styles.infoRowValue}>••••••••</Text>
            </View>
            <PencilSimple size={16} color={COLORS.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        <View style={styles.backendNote}>
          <LockKey size={13} color={COLORS.textSecondary} weight="bold" />
          <Text style={styles.backendNoteText}>
            Los cambios se sincronizan cuando el backend esté listo
          </Text>
        </View>
      </ScrollView>

      {/* ── Modales ── */}
      <FieldEditModal
        visible={editing === 'firstName'}
        title="Nombre"
        value={user.firstName}
        placeholder="Tu nombre"
        accentColor={FIELD_COLORS.nombre.icon}
        onSave={(v) => updateProfile({ firstName: v })}
        onClose={() => setEditing(null)}
      />

      <FieldEditModal
        visible={editing === 'lastName'}
        title="Apellidos"
        value={user.lastName}
        placeholder="Tus apellidos"
        accentColor={FIELD_COLORS.apellidos.icon}
        onSave={(v) => updateProfile({ lastName: v })}
        onClose={() => setEditing(null)}
      />

      <FieldEditModal
        visible={editing === 'phone'}
        title="Teléfono"
        value={user.phone ?? ''}
        placeholder="10 dígitos"
        keyboardType="phone-pad"
        maxLength={10}
        accentColor={FIELD_COLORS.telefono.icon}
        hint="Opcional — las empresas podrán contactarte por este número"
        onSave={(v) => updateProfile({ phone: v || undefined })}
        onClose={() => setEditing(null)}
      />

      <FieldEditModal
        visible={editing === 'password'}
        title="Nueva contraseña"
        value=""
        placeholder="Mínimo 8 caracteres"
        secureTextEntry
        accentColor={FIELD_COLORS.password.icon}
        hint="Disponible cuando el backend esté listo"
        onSave={() => Alert.alert('Próximamente', 'El cambio de contraseña estará disponible cuando el backend esté listo.')}
        onClose={() => setEditing(null)}
      />

      <DatePickerModal
        visible={editing === 'date'}
        value={user.birthDate}
        onSave={(iso) => updateProfile({ birthDate: iso })}
        onClose={() => setEditing(null)}
      />

      <GenderModal
        visible={editing === 'gender'}
        current={user.gender}
        onSave={(g) => updateProfile({ gender: g })}
        onClose={() => setEditing(null)}
      />

      <PhotoOptionsModal
        visible={photoOptionsVisible}
        photoUri={user.profilePhoto}
        setProfilePhoto={setProfilePhoto}
        onRemovePhoto={handleRemovePhoto}
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
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, marginTop: 4 },
  backText: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },

  // Foto
  photoSection: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  avatarPhoto: { width: 96, height: 96, borderRadius: 48 },
  avatarText: { fontSize: 36, fontWeight: '700', color: COLORS.white },
  cameraOverlay: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.secondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.white,
  },
  photoName: { fontSize: 22, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  photoEditText: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: COLORS.white, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
  },

  // Filas
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  infoRowIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoRowContent: { flex: 1 },
  infoRowLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  infoRowValue: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  infoRowEmpty: { color: COLORS.border, fontStyle: 'italic', fontSize: 14 },
  rowDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 64 },

  // Nota
  backendNote: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, marginTop: 4, marginBottom: 8 },
  backendNoteText: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', flex: 1 },

  // Sheet base
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 44,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
  },
  sheetPill: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  sheetHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetHeaderIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  sheetInput: {
    backgroundColor: COLORS.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: COLORS.textPrimary,
    borderWidth: 2,
  },
  sheetHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  sheetSaveBtn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  sheetSaveBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },

  // DatePicker wrapper con fondo visible
  datePickerWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginVertical: 4,
  },

  // Género
  genderList: { gap: 8, marginTop: 8 },
  genderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  genderRowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  genderRowText: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  genderDot: { width: 10, height: 10, borderRadius: 5 },

  // Fullscreen
  fullscreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  fullscreenClose: { position: 'absolute', top: 56, right: 20, padding: 8, zIndex: 10 },
  fullscreenImage: { width: '90%', height: '70%', borderRadius: 16 },
});