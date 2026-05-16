import { useState } from 'react';
import {
    ActivityIndicator,
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
    CheckCircle,
    FilePdf,
    Image,
    PaperPlaneTilt,
    Upload,
    X,
} from 'phosphor-react-native';

import { useUser } from '../context/UserContext';
import { COLORS } from '../styles/colors';
import { Job } from '../types';

type Props = {
  job: Job;
};

export default function ApplyButton({ job }: Props) {
  const { user, setCv, addApplication, hasApplied } = useUser();

  const [showCvModal, setShowCvModal]       = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploading, setUploading]           = useState(false);

  const alreadyApplied = hasApplied(job.id);

  // ── Aplicar ──────────────────────────────────────────────────
  const handleApply = () => {
    if (alreadyApplied) return;

    // Si requiere CV y no tiene → mostrar modal
    if (job.requiresCv && !user.cv) {
      setShowCvModal(true);
      return;
    }

    // Aplicar directamente
    submitApplication();
  };

  const submitApplication = () => {
    addApplication({
      id: Date.now().toString(),
      jobId: job.id,
      userId: user.id,
      status: 'pendiente',
      appliedAt: new Date().toISOString(),
      cvAttached: !!user.cv,
    });
    setShowSuccessModal(true);
  };

  // ── Subir CV ─────────────────────────────────────────────────
  const pickDocument = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setCv({
          uri: file.uri,
          name: file.name,
          type: file.mimeType ?? 'application/pdf',
          size: file.size,
        });
        setShowCvModal(false);
        submitApplication();
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      setUploading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const name = file.uri.split('/').pop() ?? 'cv.jpg';
        setCv({
          uri: file.uri,
          name,
          type: 'image/jpeg',
          size: file.fileSize,
        });
        setShowCvModal(false);
        submitApplication();
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    } finally {
      setUploading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      {/* Botón principal */}
      <TouchableOpacity
        style={[
          styles.applyButton,
          alreadyApplied && styles.applyButtonDone,
        ]}
        onPress={handleApply}
        activeOpacity={0.85}
        disabled={alreadyApplied}
      >
        {alreadyApplied ? (
          <>
            <CheckCircle size={20} color={COLORS.white} weight="fill" />
            <Text style={styles.applyButtonText}>Postulación enviada</Text>
          </>
        ) : (
          <>
            <PaperPlaneTilt size={20} color={COLORS.white} weight="fill" />
            <Text style={styles.applyButtonText}>Aplicar a esta vacante</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modal — CV requerido */}
      <Modal
        visible={showCvModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCvModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            {/* Cerrar */}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCvModal(false)}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {/* Ícono */}
            <View style={styles.modalIcon}>
              <Upload size={32} color={COLORS.primary} weight="bold" />
            </View>

            <Text style={styles.modalTitle}>Esta vacante requiere CV</Text>
            <Text style={styles.modalSubtitle}>
              Sube tu CV para completar tu postulación a{' '}
              <Text style={{ fontWeight: '700', color: COLORS.primary }}>
                {job.title}
              </Text>{' '}
              en {job.company.name}.
            </Text>

            {uploading ? (
              <ActivityIndicator
                color={COLORS.primary}
                size="large"
                style={{ marginTop: 24 }}
              />
            ) : (
              <View style={styles.modalActions}>
                {/* PDF / Word */}
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={pickDocument}
                  activeOpacity={0.8}
                >
                  <View style={[styles.uploadIcon, { backgroundColor: '#FEF3C7' }]}>
                    <FilePdf size={24} color="#92400E" weight="bold" />
                  </View>
                  <View style={styles.uploadInfo}>
                    <Text style={styles.uploadTitle}>Subir PDF o Word</Text>
                    <Text style={styles.uploadSubtitle}>
                      Formatos: .pdf, .doc, .docx
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Imagen */}
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <View style={[styles.uploadIcon, { backgroundColor: '#EDE9FE' }]}>
                    <Image size={24} color="#5B21B6" weight="bold" />
                  </View>
                  <View style={styles.uploadInfo}>
                    <Text style={styles.uploadTitle}>Subir imagen</Text>
                    <Text style={styles.uploadSubtitle}>
                      Foto de tu CV en JPG o PNG
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal — Éxito */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIcon, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle size={36} color={COLORS.success} weight="fill" />
            </View>

            <Text style={styles.modalTitle}>¡Postulación enviada!</Text>
            <Text style={styles.modalSubtitle}>
              Tu solicitud para{' '}
              <Text style={{ fontWeight: '700', color: COLORS.primary }}>
                {job.title}
              </Text>{' '}
              en {job.company.name} fue enviada correctamente.{'\n\n'}
              Te notificaremos cuando la empresa revise tu perfil.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Botón
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
  },
  applyButtonDone: {
    backgroundColor: COLORS.success,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Modal base
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 44,
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },

  // Opciones de subida
  modalActions: {
    marginTop: 16,
    gap: 12,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Éxito
  successButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});