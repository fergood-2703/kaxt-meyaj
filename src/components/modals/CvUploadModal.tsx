import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  FilePdf,
  Image as ImageIcon,
  Trash,
  X,
} from 'phosphor-react-native';
import { useState } from 'react';

import { useUser } from '../../context/UserContext';
import { COLORS } from '../../styles/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CvUploadModal({ visible, onClose }: Props) {
  const { user, setCv } = useUser();
  const [uploading, setUploading] = useState(false);

  const handlePickPdf = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'], copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setCv({ uri: asset.uri, name: asset.name, type: 'application/pdf', size: asset.size });
        onClose();
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar el PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const name = asset.uri.split('/').pop() ?? 'cv-imagen.jpg';
        setCv({ uri: asset.uri, name, type: 'image/jpeg' });
        onClose();
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Eliminar CV',
      '¿Estás seguro? Aún podrás postularte a vacantes que no lo requieran.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { setCv(undefined); onClose(); } },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <FilePdf size={20} color={COLORS.accent} weight="bold" />
              </View>
              <Text style={styles.title}>Mi CV</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Si ya tiene CV */}
          {user.cv && (
            <View style={styles.currentCv}>
              <View style={styles.currentCvIcon}>
                <FilePdf size={20} color={COLORS.accent} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.currentCvName} numberOfLines={1}>{user.cv.name}</Text>
                {user.cv.size && (
                  <Text style={styles.currentCvSize}>{(user.cv.size / 1024).toFixed(0)} KB</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.options}>
            {/* PDF */}
            <TouchableOpacity
              style={styles.option}
              onPress={handlePickPdf}
              activeOpacity={0.75}
              disabled={uploading}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#EFF6FF' }]}>
                <FilePdf size={22} color={COLORS.primary} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>
                  {user.cv ? 'Cambiar PDF' : 'Subir PDF'}
                </Text>
                <Text style={styles.optionSubtitle}>Formato recomendado</Text>
              </View>
            </TouchableOpacity>

            {/* Imagen */}
            <TouchableOpacity
              style={styles.option}
              onPress={handlePickImage}
              activeOpacity={0.75}
              disabled={uploading}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FFF7ED' }]}>
                <ImageIcon size={22} color={COLORS.secondary} weight="bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>
                  {user.cv ? 'Cambiar imagen' : 'Subir imagen'}
                </Text>
                <Text style={styles.optionSubtitle}>JPG o PNG</Text>
              </View>
            </TouchableOpacity>

            {/* Eliminar — solo si ya tiene CV */}
            {user.cv && (
              <TouchableOpacity
                style={[styles.option, styles.optionDanger]}
                onPress={handleRemove}
                activeOpacity={0.75}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Trash size={22} color="#991B1B" weight="bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: '#991B1B' }]}>Eliminar CV</Text>
                  <Text style={styles.optionSubtitle}>Podrás subir uno nuevo después</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {!user.cv && (
            <View style={styles.tip}>
              <FilePdf size={14} color={COLORS.accent} weight="bold" />
              <Text style={styles.tipText}>
                Un CV completo aumenta tus chances de ser contactado por empresas
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FDF2F8',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.accent },

  // CV actual
  currentCv: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FDF2F8', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#FBCFE8', marginBottom: 16,
  },
  currentCvIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
  },
  currentCvName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  currentCvSize: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Opciones
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

  // Tip
  tip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FDF2F8', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#FBCFE8', marginTop: 16,
  },
  tipText: { flex: 1, fontSize: 12, color: '#9D174D', lineHeight: 18 },
});