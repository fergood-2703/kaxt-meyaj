import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Briefcase,
  Camera,
  CheckCircle,
  FilePdf,
  UserCircle,
} from 'phosphor-react-native';
import { useState } from 'react';

import CvUploadModal from '../components/modals/CvUploadModal';
import PhotoOptionsModal from '../components/modals/PhotoOptionsModal';
import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, setProfilePhoto } = useUser();

  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [cvModalVisible,    setCvModalVisible]    = useState(false);

  const hasPhoto = !!user.profilePhoto;
  const hasCv    = !!user.cv;
  const completedCount = (hasPhoto ? 1 : 0) + (hasCv ? 1 : 0);
  const allDone  = completedCount === 2;

  // Botón principal dinámico
  const primaryLabel = allDone
    ? '¡Listo! Explorar vacantes'
    : completedCount === 0
      ? 'Completar mi perfil'
      : 'Continuar a mi perfil';

  const primaryIcon = allDone ? ArrowRight : UserCircle;

  const handlePrimary = () => {
    if (allDone) {
      router.replace('/');
    } else {
      router.replace({ pathname: '/personal-info', params: { from: 'welcome' } } as any);
    }
  };

  const steps = [
    {
      key:      'foto',
      icon:     <Camera size={24} color={COLORS.secondary} weight="bold" />,
      iconBg:   '#FFF7ED',
      title:    'Agrega tu foto de perfil',
      subtitle: 'Las empresas confían más en candidatos con foto',
      done:     hasPhoto,
      onPress:  () => setPhotoModalVisible(true),
    },
    {
      key:      'cv',
      icon:     <FilePdf size={24} color={COLORS.accent} weight="bold" />,
      iconBg:   '#FDF2F8',
      title:    'Sube tu CV',
      subtitle: 'PDF o imagen — te abrirá más puertas',
      done:     hasCv,
      onPress:  () => setCvModalVisible(true),
    },
  ];

  const PrimaryIcon = primaryIcon;

  return (
    <>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.successRing}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.successGradient}
            >
              <CheckCircle size={52} color={COLORS.white} weight="fill" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>
            ¡Bienvenido,{'\n'}{user.firstName}! 🎉
          </Text>
          <Text style={styles.heroSubtitle}>
            Tu cuenta fue creada exitosamente.{'\n'}
            Completa tu perfil para destacar ante las empresas.
          </Text>
        </View>

        {/* ── Progreso ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Completa tu perfil</Text>
            <Text style={styles.progressCount}>{completedCount}/2 pasos</Text>
          </View>

          <View style={styles.progressBar}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                { width: `${(completedCount / 2) * 100}%` as any },
              ]}
            />
          </View>

          <View style={styles.steps}>
            {steps.map((step, index) => (
              <View key={step.key}>
                {index > 0 && <View style={styles.stepDivider} />}
                <TouchableOpacity
                  style={styles.stepRow}
                  onPress={step.onPress}
                  activeOpacity={0.75}
                >
                  <View style={[styles.stepIconBox, { backgroundColor: step.done ? '#F0FDF4' : step.iconBg }]}>
                    {step.done
                      ? <CheckCircle size={24} color={COLORS.success} weight="fill" />
                      : step.icon
                    }
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, step.done && styles.stepTitleDone]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                  </View>
                  {step.done
                    ? <CheckCircle size={18} color={COLORS.success} weight="fill" />
                    : <View style={styles.emptyCircle} />
                  }
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ── Tip ── */}
        <View style={styles.tip}>
          <Briefcase size={14} color={COLORS.secondary} weight="bold" />
          <Text style={styles.tipText}>
            Los candidatos con perfil completo reciben{' '}
            <Text style={{ fontWeight: '700', color: COLORS.secondary }}>3x más</Text>
            {' '}visitas de empresas
          </Text>
        </View>

        {/* ── Botones ── */}
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handlePrimary}
            activeOpacity={0.85}
            style={styles.primaryWrapper}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <PrimaryIcon size={20} color={COLORS.white} weight="bold" />
              <Text style={styles.primaryText}>{primaryLabel}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryText}>Omitir por ahora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modales */}
      <PhotoOptionsModal
        visible={photoModalVisible}
        photoUri={user.profilePhoto}
        setProfilePhoto={setProfilePhoto}
        onRemovePhoto={() => setProfilePhoto('')}
        onViewFullscreen={() => {}}
        onClose={() => setPhotoModalVisible(false)}
      />
      <CvUploadModal
        visible={cvModalVisible}
        onClose={() => setCvModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 48 },

  hero: { alignItems: 'center', marginBottom: 36, gap: 16 },
  successRing: {
    shadowColor: COLORS.secondary, shadowOpacity: 0.3,
    shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  successGradient: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 30, fontWeight: '800',
    color: COLORS.primary, textAlign: 'center', lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 15, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },

  progressCard: {
    backgroundColor: COLORS.white, borderRadius: 20,
    padding: 20, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  progressTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  progressCount: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  progressBar: {
    height: 6, borderRadius: 3,
    backgroundColor: COLORS.border, overflow: 'hidden', marginBottom: 20,
  },
  progressFill: { height: '100%', borderRadius: 3 },

  steps: { gap: 0 },
  stepDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  stepContent: { flex: 1, gap: 2 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  stepTitleDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  stepSubtitle: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  emptyCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: COLORS.border,
  },

  tip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FFF7ED', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#FED7AA', marginBottom: 28,
  },
  tipText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18 },

  buttons: { gap: 12 },
  primaryWrapper: { borderRadius: 14, overflow: 'hidden' },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingVertical: 16,
  },
  primaryText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  secondaryButton: {
    paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  secondaryText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
});