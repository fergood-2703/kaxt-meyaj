import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import {
    Camera,
    Eye,
    Image as ImageIcon,
    Trash,
    X,
} from 'phosphor-react-native';

import { COLORS } from '../../styles/colors';

// ─── Helpers de galería / cámara ─────────────────────────────────────────────
// Exportados para que ProfileScreen pueda usarlos también si los necesita

export async function takePhoto(
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

export async function pickFromGallery(
  setProfilePhoto: (uri: string) => void,
  onDone?: () => void
) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
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

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  photoUri?: string;
  setProfilePhoto: (uri: string) => void;
  onRemovePhoto: () => void;
  onViewFullscreen: () => void;
  onClose: () => void;
};

export default function PhotoOptionsModal({
  visible,
  photoUri,
  setProfilePhoto,
  onRemovePhoto,
  onViewFullscreen,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Foto de perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {photoUri && (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: photoUri }} style={styles.preview} />
            </View>
          )}

          <View style={styles.options}>
            {/* Ver en pantalla completa */}
            {photoUri && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => { onClose(); onViewFullscreen(); }}
                activeOpacity={0.75}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Eye size={22} color={COLORS.primary} weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Ver foto de perfil</Text>
                  <Text style={styles.optionSubtitle}>Ver en pantalla completa</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Tomar foto */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => takePhoto(setProfilePhoto, onClose)}
              activeOpacity={0.75}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FFF7ED' }]}>
                <Camera size={22} color={COLORS.secondary} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Tomar foto</Text>
                <Text style={styles.optionSubtitle}>Usa la cámara ahora mismo</Text>
              </View>
            </TouchableOpacity>

            {/* Elegir de galería */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => pickFromGallery(setProfilePhoto, onClose)}
              activeOpacity={0.75}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F0FDF4' }]}>
                <ImageIcon size={22} color={COLORS.success} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Elegir de galería</Text>
                <Text style={styles.optionSubtitle}>Selecciona desde tus fotos</Text>
              </View>
            </TouchableOpacity>

            {/* Eliminar foto */}
            {photoUri && (
              <TouchableOpacity
                style={[styles.option, styles.optionDanger]}
                onPress={() => { onClose(); onRemovePhoto(); }}
                activeOpacity={0.75}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Trash size={22} color="#991B1B" weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: '#991B1B' }]}>
                    Eliminar foto
                  </Text>
                  <Text style={styles.optionSubtitle}>Volver a las iniciales</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {!photoUri && (
            <View style={styles.tip}>
              <Camera size={14} color={COLORS.secondary} weight="bold" />
              <Text style={styles.tipText}>
                Usa una foto real tuya para que las empresas puedan reconocerte
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 44,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  previewWrapper: { alignItems: 'center', marginBottom: 20 },
  preview: { width: 120, height: 120, borderRadius: 60 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.background, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  optionDanger: { borderColor: '#FEE2E2' },
  optionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  optionSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  tip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#FED7AA',
  },
  tipText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },
});