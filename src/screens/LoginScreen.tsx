import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Eye, EyeSlash, LockKey, UserCircle } from 'phosphor-react-native';
import { useState } from 'react';

import CustomInput from '../components/CustomInput';
import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, continueAsGuest } = useUser();

  // Si viene con ?prompt=true es porque intentó entrar a una tab protegida
  const isPrompted = params.prompt === 'true';

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
      setError('Por favor ingresa tu nombre y correo.');
      return;
    }
    setError('');
    // Backend TODO: await api.post('/auth/login', { email, password })
    // Por ahora mock: cualquier nombre/email pasa
    login(name.trim(), email.trim());
    router.replace('/');
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Logo placeholder — reemplazar con <Image source={...} /> cuando haya asset */}
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>K</Text>
          </View>
          <Text style={styles.appName}>Kaxt Meyaj</Text>
          <Text style={styles.tagline}>
            Conectamos talento local con oportunidades reales en Quintana Roo
          </Text>
        </View>

        {/* ── Banner si viene de tab protegida ── */}
        {isPrompted && (
          <View style={styles.promptBanner}>
            <LockKey size={16} color="#92400E" weight="bold" />
            <Text style={styles.promptText}>
              Inicia sesión para acceder a esta sección
            </Text>
          </View>
        )}

        {/* ── Formulario ── */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Iniciar sesión</Text>

          <CustomInput
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <CustomInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          {/* Input contraseña con ojo */}
          <View style={styles.passwordWrapper}>
            <CustomInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPass((v) => !v)}
            >
              {showPass
                ? <EyeSlash size={20} color={COLORS.textSecondary} />
                : <Eye size={20} color={COLORS.textSecondary} />
              }
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error !== '' && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Botón entrar */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
            <ArrowRight size={18} color={COLORS.white} weight="bold" />
          </TouchableOpacity>

          {/* Ir a registro */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <UserCircle size={18} color={COLORS.primary} weight="bold" />
            <Text style={styles.registerButtonText}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Continuar como invitado ── */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuest}
          activeOpacity={0.75}
        >
          <Text style={styles.guestButtonText}>Continuar como invitado</Text>
        </TouchableOpacity>

        <Text style={styles.guestWarning}>
          Como invitado verás información limitada.{'\n'}
          Regístrate para acceder a todos los detalles.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 40,
  },

  // ── Hero
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logoLetter: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.white,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 16,
  },

  // ── Banner prompt
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  promptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },

  // ── Formulario
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },

  // ── Password
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },

  // ── Error
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 8,
    marginLeft: 4,
  },

  // ── Botones del form
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // ── Invitado
  guestButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  guestWarning: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
});