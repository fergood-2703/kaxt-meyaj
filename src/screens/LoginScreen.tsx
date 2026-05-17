import {
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
import { ArrowRight, Eye, EyeSlash, LockKey, UserCircle } from 'phosphor-react-native';
import { useState } from 'react';

import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';

// ─── Cuenta demo ──────────────────────────────────────────────────────────────
// Eliminar cuando el backend esté listo y reemplazar handleLogin
// con: await api.post('/auth/login', { email, password })
const DEMO_ACCOUNT = {
  name:     'Fernando',
  email:    'demo@kaxtmeyaj.com',
  password: 'kaxt2024',
};

export default function LoginScreen() {
  const router  = useRouter();
  const params  = useLocalSearchParams();
  const { login, continueAsGuest } = useUser();

  const isPrompted = params.prompt === 'true';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    // Backend TODO: reemplazar con await api.post('/auth/login', { email, password })
    if (
      email.trim().toLowerCase() === DEMO_ACCOUNT.email &&
      password === DEMO_ACCOUNT.password
    ) {
      setError('');
      login(DEMO_ACCOUNT.name, DEMO_ACCOUNT.email);
      router.replace('/');
      return;
    }
    setError('Correo o contraseña incorrectos.');
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/');
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError('');
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
          <Image
            source={require('../../assets/images/isotipo.png')}
            style={styles.logo}
          />
          <View style={styles.appNameRow}>
            <Text style={styles.appNameKaxt}>KAXT </Text>
            <Text style={styles.appNameMeyaj}>MEYAJ</Text>
          </View>
          <LinearGradient
            colors={['#FF7A1A', '#E91E8F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBar}
          />
          <Text style={styles.tagline}>Tu talento, tu lugar</Text>
        </View>

        {/* ── Banner prompt ── */}
        {isPrompted && (
          <View style={styles.promptBanner}>
            <LockKey size={16} color="#92400E" weight="bold" />
            <Text style={styles.promptText}>
              Inicia sesión para acceder a esta sección
            </Text>
          </View>
        )}

        {/* ── Cuenta demo ── */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Cuenta de prueba</Text>
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Correo</Text>
            <Text style={styles.demoValue}>{DEMO_ACCOUNT.email}</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Contraseña</Text>
            <Text style={styles.demoValue}>{DEMO_ACCOUNT.password}</Text>
          </View>
          <TouchableOpacity style={styles.demoFillButton} onPress={fillDemo}>
            <Text style={styles.demoFillButtonText}>Usar esta cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* ── Formulario ── */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Iniciar sesión</Text>

          {/* Correo */}
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          {/* Contraseña — row con ojo dentro */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry={!showPass}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPass((v) => !v)}
              style={styles.eyeButton}
            >
              {showPass
                ? <EyeSlash size={20} color={COLORS.textSecondary} />
                : <Eye      size={20} color={COLORS.textSecondary} />
              }
            </TouchableOpacity>
          </View>

          {error !== '' && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Botón entrar con degradado */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.85}
            style={styles.loginButtonWrapper}
          >
            <LinearGradient
              colors={['#FF7A1A', '#E91E8F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
              <ArrowRight size={18} color={COLORS.white} weight="bold" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Crear cuenta */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
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

        {/* ── Invitado ── */}
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
    paddingTop: 64,
    paddingBottom: 40,
  },

  // ── Hero
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
    marginBottom: 16,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  appNameKaxt: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  appNameMeyaj: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E91E8F',
    letterSpacing: 1,
  },
  gradientBar: {
    height: 3,
    borderRadius: 2,
    width: 200,
    marginTop: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    letterSpacing: 0.3,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  promptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },

  // ── Demo card
  demoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 72,
  },
  demoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  demoFillButton: {
    marginTop: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  demoFillButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
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

  // Input base — igual que CustomInput
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },

  // Input contraseña con ojo — todo en un row, sin position absolute
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 14,
  },

  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 8,
    marginLeft: 4,
  },

  // Botón entrar
  loginButtonWrapper: {
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Crear cuenta
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

  // Divider
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

  // Invitado
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