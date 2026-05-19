import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Briefcase, Buildings } from 'phosphor-react-native';

import { COLORS } from '../styles/colors';
import { UserRole } from '../types';

export default function RoleSelectScreen() {
  const router = useRouter();

  const handleSelect = (role: UserRole) => {
    router.push({ pathname: '/register', params: { role } } as any);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Logo + nombre */}
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

        <Text style={styles.title}>¿Cómo usarás{'\n'}la app?</Text>
        <Text style={styles.subtitle}>Elige tu perfil para continuar</Text>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.gradientBar}
        />
      </View>

      {/* ── Opciones ── */}
      <View style={styles.options}>

        {/* Candidato */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelect('candidato')}
          activeOpacity={0.85}
        >
          <View style={[styles.optionIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Briefcase size={28} color={COLORS.primary} weight="duotone" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Busco empleo</Text>
            <View style={[styles.optionTag, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.optionTagText, { color: COLORS.primary }]}>Candidato</Text>
            </View>
            <Text style={styles.optionSubtitle}>
              Encuentra oportunidades cerca de ti en Quintana Roo
            </Text>
          </View>
          <ArrowRight size={20} color={COLORS.primary} weight="bold" />
        </TouchableOpacity>

        {/* Empresario */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelect('empresario')}
          activeOpacity={0.85}
        >
          <View style={[styles.optionIconBox, { backgroundColor: '#FFF7ED' }]}>
            <Buildings size={28} color={COLORS.secondary} weight="duotone" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Tengo un negocio</Text>
            <View style={[styles.optionTag, { backgroundColor: '#FFF7ED' }]}>
              <Text style={[styles.optionTagText, { color: COLORS.secondary }]}>Empresario</Text>
            </View>
            <Text style={styles.optionSubtitle}>
              Publica vacantes y encuentra el talento que necesitas
            </Text>
          </View>
          <ArrowRight size={20} color={COLORS.secondary} weight="bold" />
        </TouchableOpacity>

      </View>

      {/* ── Nota privacidad ── */}
      <View style={styles.noteRow}>
        <View style={styles.noteDot} />
        <Text style={styles.noteText}>
          Tu información está protegida y no será compartida sin tu permiso
        </Text>
      </View>

      {/* ── Ya tengo cuenta ── */}
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.loginLinkText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.loginLinkBold}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 48 },

  // Header
  header: { marginBottom: 32, gap: 12 },
  brandRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 8,
  },
  brandLogo: { width: 32, height: 32, borderRadius: 8 },
  brandKaxt: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.3 },
  brandMeyaj: { fontSize: 15, fontWeight: '800', color: COLORS.accent, letterSpacing: 0.3 },
  title: {
    fontSize: 34, fontWeight: '800',
    color: COLORS.primary, lineHeight: 40,
  },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  gradientBar: { height: 3, borderRadius: 2, width: 80 },

  // Opciones
  options: { gap: 14 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.white,
    borderRadius: 18, padding: 18,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  optionIconBox: {
    width: 54, height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  optionContent: { flex: 1, gap: 4 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  optionTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  optionTagText: { fontSize: 11, fontWeight: '700' },
  optionSubtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  // Nota
  noteRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 8, marginTop: 28, paddingHorizontal: 4,
  },
  noteDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: COLORS.success, marginTop: 5,
  },
  noteText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },

  // Login link
  loginLink: { alignItems: 'center', marginTop: 24 },
  loginLinkText: { fontSize: 14, color: COLORS.textSecondary },
  loginLinkBold: { color: COLORS.primary, fontWeight: '700' },
});