import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Briefcase,
  Buildings,
  CalendarBlank,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  GenderFemale,
  GenderIntersex,
  GenderMale,
  GenderNeuter,
  IdentificationCard,
  LockKey,
  Phone,
  User,
} from 'phosphor-react-native';
import { useState } from 'react';

import DatePickerModal from '../components/modals/DatePickerModal';
import GenderModal from '../components/modals/GenderModal';
import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { UserGender, UserRole } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBirthDate(iso?: string) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function calcAge(iso: string): number {
  const birth = new Date(iso);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const GENDER_LABEL: Record<UserGender, string> = {
  hombre:              'Hombre',
  mujer:               'Mujer',
  'no-binario':        'No binario',
  'prefiero-no-decir': 'Prefiero no decir',
};

function GenderIcon({ gender }: { gender?: UserGender }) {
  const size = 18;
  switch (gender) {
    case 'hombre':            return <GenderMale      size={size} color={COLORS.primary}      weight="bold" />;
    case 'mujer':             return <GenderFemale    size={size} color={COLORS.accent}        weight="bold" />;
    case 'no-binario':        return <GenderNeuter    size={size} color={COLORS.success}       weight="bold" />;
    case 'prefiero-no-decir': return <GenderIntersex  size={size} color={COLORS.textSecondary} weight="bold" />;
    default:                  return <GenderIntersex  size={size} color={COLORS.textSecondary} weight="bold" />;
  }
}

// ─── Componente de campo ──────────────────────────────────────────────────────

function Field({
  label, icon, children, error,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.inputRow, error ? fieldStyles.inputError : null]}>
        <View style={fieldStyles.iconBox}>{icon}</View>
        {children}
      </View>
      {error ? <Text style={fieldStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginLeft: 2 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 14, minHeight: 52,
  },
  inputError: { borderColor: '#EF4444' },
  iconBox: { marginRight: 10 },
  errorText: { fontSize: 12, color: '#EF4444', marginLeft: 2 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: UserRole }>();
  const { register } = useUser();

  const role: UserRole  = params.role === 'empresario' ? 'empresario' : 'candidato';
  const isEmpresario    = role === 'empresario';
  const accentColor     = isEmpresario ? COLORS.secondary : COLORS.primary;

  // Campos
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [birthDate,   setBirthDate]   = useState('');
  const [gender,      setGender]      = useState<UserGender | undefined>();
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Modales
  const [dateModalVisible,   setDateModalVisible]   = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  // Errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validación ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim())        e.firstName = 'El nombre es obligatorio';
    if (!lastName.trim())         e.lastName  = 'Los apellidos son obligatorios';
    if (!email.trim())            e.email     = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Correo no válido';
    if (!phone.trim())            e.phone     = 'El teléfono es obligatorio';
    else if (phone.length < 10)   e.phone     = 'Ingresa 10 dígitos';
    if (!birthDate)               e.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!gender)                  e.gender    = 'Selecciona tu género';
    if (!password)                e.password  = 'La contraseña es obligatoria';
    else if (password.length < 8) e.password  = 'Mínimo 8 caracteres';
    if (password !== confirm)     e.confirm   = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleRegister = () => {
    if (!validate()) return;
    const age = calcAge(birthDate);
    if (age < 18) {
      Alert.alert(
        'Eres menor de edad',
        `Tienes ${age} años. Puedes continuar pero algunas vacantes requieren mayoría de edad.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => doRegister() },
        ]
      );
      return;
    }
    doRegister();
  };

  const doRegister = () => {
    register({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      password,
      phone:     phone.trim(),
      birthDate,
      gender:    gender!,
      role,
    });
    router.replace('/');
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Volver */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ArrowLeft size={20} color={accentColor} weight="bold" />
          <Text style={[styles.backText, { color: accentColor }]}>Volver</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          {/* Logo + nombre + badge de rol */}
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <Image
                source={require('../../assets/images/isotipo.png')}
                style={styles.brandLogo}
              />
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.brandKaxt}>KAXT </Text>
                <Text style={styles.brandMeyaj}>MEYAJ</Text>
              </View>
            </View>
            <View style={[
              styles.roleBadge,
              { backgroundColor: accentColor + '15', borderColor: accentColor + '40' },
            ]}>
              {isEmpresario
                ? <Buildings size={13} color={accentColor} weight="bold" />
                : <Briefcase  size={13} color={accentColor} weight="bold" />
              }
              <Text style={[styles.roleBadgeText, { color: accentColor }]}>
                {isEmpresario ? 'Empresario' : 'Candidato'}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: COLORS.primary }]}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Todos los campos son obligatorios</Text>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.gradientBar}
          />
        </View>

        {/* Formulario */}
        <View style={styles.form}>

          <Field
            label="Nombre(s)"
            icon={<User size={18} color={COLORS.primary} weight="bold" />}
            error={errors.firstName}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Tu nombre"
              placeholderTextColor={COLORS.textSecondary}
              value={firstName}
              onChangeText={(t) => { setFirstName(t); setErrors((e) => ({ ...e, firstName: '' })); }}
              autoCapitalize="words"
            />
          </Field>

          <Field
            label="Apellidos"
            icon={<IdentificationCard size={18} color={COLORS.accent} weight="bold" />}
            error={errors.lastName}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Apellido paterno y materno"
              placeholderTextColor={COLORS.textSecondary}
              value={lastName}
              onChangeText={(t) => { setLastName(t); setErrors((e) => ({ ...e, lastName: '' })); }}
              autoCapitalize="words"
            />
          </Field>

          <Field
            label="Correo electrónico"
            icon={<EnvelopeSimple size={18} color={COLORS.textSecondary} weight="bold" />}
            error={errors.email}
          >
            <TextInput
              style={styles.textInput}
              placeholder="tu@correo.com"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Field>

          <Field
            label="Teléfono"
            icon={<Phone size={18} color={COLORS.success} weight="bold" />}
            error={errors.phone}
          >
            <TextInput
              style={styles.textInput}
              placeholder="10 dígitos"
              placeholderTextColor={COLORS.textSecondary}
              value={phone}
              onChangeText={(t) => { setPhone(t.replace(/\D/g, '')); setErrors((e) => ({ ...e, phone: '' })); }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </Field>

          <Field
            label="Fecha de nacimiento"
            icon={<CalendarBlank size={18} color={COLORS.secondary} weight="bold" />}
            error={errors.birthDate}
          >
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setDateModalVisible(true)}
            >
              <Text style={[styles.selectText, !birthDate && styles.selectPlaceholder]}>
                {birthDate
                  ? `${formatBirthDate(birthDate)}  ·  ${calcAge(birthDate)} años`
                  : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </Field>

          {birthDate && calcAge(birthDate) < 18 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Eres menor de edad ({calcAge(birthDate)} años). Algunas vacantes requieren mayoría de edad.
              </Text>
            </View>
          )}

          <Field
            label="Género"
            icon={<GenderIcon gender={gender} />}
            error={errors.gender}
          >
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setGenderModalVisible(true)}
            >
              <Text style={[styles.selectText, !gender && styles.selectPlaceholder]}>
                {gender ? GENDER_LABEL[gender] : 'Seleccionar género'}
              </Text>
            </TouchableOpacity>
          </Field>

          {/* Divider seguridad */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Seguridad</Text>
            <View style={styles.dividerLine} />
          </View>

          <Field
            label="Contraseña"
            icon={<LockKey size={18} color="#B45309" weight="bold" />}
            error={errors.password}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: '' })); }}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
              {showPass
                ? <EyeSlash size={18} color={COLORS.textSecondary} weight="bold" />
                : <Eye      size={18} color={COLORS.textSecondary} weight="bold" />
              }
            </TouchableOpacity>
          </Field>

          <Field
            label="Confirmar contraseña"
            icon={<LockKey size={18} color="#B45309" weight="bold" />}
            error={errors.confirm}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Repite tu contraseña"
              placeholderTextColor={COLORS.textSecondary}
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setErrors((e) => ({ ...e, confirm: '' })); }}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn}>
              {showConfirm
                ? <EyeSlash size={18} color={COLORS.textSecondary} weight="bold" />
                : <Eye      size={18} color={COLORS.textSecondary} weight="bold" />
              }
            </TouchableOpacity>
          </Field>

          {/* Botón crear cuenta */}
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.85}
            style={styles.submitWrapper}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Crear cuenta</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{ color: accentColor, fontWeight: '700' }}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <DatePickerModal
        visible={dateModalVisible}
        value={birthDate}
        onSave={(iso) => { setBirthDate(iso); setErrors((e) => ({ ...e, birthDate: '' })); }}
        onClose={() => setDateModalVisible(false)}
      />
      <GenderModal
        visible={genderModalVisible}
        current={gender}
        onSave={(g) => { setGender(g); setErrors((e) => ({ ...e, gender: '' })); }}
        onClose={() => setGenderModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 48 },

  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  backText: { fontSize: 15, fontWeight: '600' },

  // Header
  header: { marginBottom: 28, gap: 10 },
  headerTopRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 28, height: 28, borderRadius: 6 },
  brandKaxt: { fontSize: 14, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.3 },
  brandMeyaj: { fontSize: 14, fontWeight: '800', color: COLORS.accent, letterSpacing: 0.3 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1,
  },
  roleBadgeText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 13, color: COLORS.textSecondary },
  gradientBar: { height: 3, borderRadius: 2, width: 80 },

  // Formulario
  form: { gap: 14 },
  textInput: {
    flex: 1, fontSize: 15,
    color: COLORS.textPrimary, paddingVertical: 14,
  },
  selectButton: { flex: 1, paddingVertical: 14 },
  selectText: { fontSize: 15, color: COLORS.textPrimary },
  selectPlaceholder: { color: COLORS.textSecondary },
  eyeBtn: { paddingLeft: 8 },

  warningBox: {
    backgroundColor: '#FEF3C7', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  warningText: { fontSize: 13, color: '#92400E', lineHeight: 18 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  submitWrapper: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitButton: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  submitText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

  loginLink: { alignItems: 'center', paddingVertical: 4 },
  loginLinkText: { fontSize: 14, color: COLORS.textSecondary },
});