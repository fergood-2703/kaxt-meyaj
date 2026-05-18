import { CheckCircle, Eye, EyeSlash, LockKey, Warning, X, XCircle } from 'phosphor-react-native';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../styles/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function getStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: 'transparent', width: '0%' };
  if (password.length < 6)   return { label: 'Débil',  color: '#EF4444', width: '33%' };
  if (password.length < 10)  return { label: 'Media',  color: '#F59E0B', width: '66%' };
  return                            { label: 'Fuerte', color: '#22C55E', width: '100%' };
}

export default function ChangePasswordModal({ visible, onClose }: Props) {
  const [current,     setCurrent]     = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength   = getStrength(newPass);
  const passMatch  = confirm.length > 0 && newPass === confirm;
  const passMismatch = confirm.length > 0 && newPass !== confirm;

  const handleClose = () => {
    setCurrent(''); setNewPass(''); setConfirm('');
    setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    onClose();
  };

  const handleSave = () => {
    if (!current.trim()) {
      Alert.alert('Falta información', 'Ingresa tu contraseña actual.');
      return;
    }
    if (newPass.length < 8) {
      Alert.alert('Contraseña muy corta', 'La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPass === current) {
      Alert.alert('Sin cambios', 'La nueva contraseña debe ser diferente a la actual.');
      return;
    }
    if (newPass !== confirm) {
      Alert.alert('No coinciden', 'La nueva contraseña y su confirmación no son iguales.');
      return;
    }
    // TODO: llamar al backend aquí
    Alert.alert('Próximamente', 'El cambio de contraseña estará disponible cuando el backend esté listo.');
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />
          <View style={styles.sheet}>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconBox}>
                  <LockKey size={20} color="#B45309" weight="bold" />
                </View>
                <Text style={styles.title}>Cambiar contraseña</Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <X size={22} color={COLORS.textSecondary} weight="bold" />
              </TouchableOpacity>
            </View>

            {/* Contraseña actual */}
            <Text style={styles.fieldLabel}>Contraseña actual</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={current}
                onChangeText={setCurrent}
                placeholder="Tu contraseña actual"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showCurrent}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(!showCurrent)}>
                {showCurrent
                  ? <EyeSlash size={20} color={COLORS.textSecondary} weight="bold" />
                  : <Eye      size={20} color={COLORS.textSecondary} weight="bold" />
                }
              </TouchableOpacity>
            </View>

            {/* Nueva contraseña */}
            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Nueva contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={newPass}
                onChangeText={setNewPass}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showNew}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(!showNew)}>
                {showNew
                  ? <EyeSlash size={20} color={COLORS.textSecondary} weight="bold" />
                  : <Eye      size={20} color={COLORS.textSecondary} weight="bold" />
                }
              </TouchableOpacity>
            </View>

            {/* Indicador de fortaleza */}
            {newPass.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}

            {/* Confirmar contraseña */}
            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  passMatch    && { borderColor: '#22C55E' },
                  passMismatch && { borderColor: '#EF4444' },
                ]}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
                {showConfirm
                  ? <EyeSlash size={20} color={COLORS.textSecondary} weight="bold" />
                  : <Eye      size={20} color={COLORS.textSecondary} weight="bold" />
                }
              </TouchableOpacity>
              {/* Ícono de validación */}
              {passMatch    && <CheckCircle size={20} color="#22C55E" weight="fill" style={styles.validIcon} />}
              {passMismatch && <XCircle     size={20} color="#EF4444" weight="fill" style={styles.validIcon} />}
            </View>

            {passMismatch && (
              <View style={styles.errorRow}>
                <Warning size={13} color="#EF4444" weight="bold" />
                <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
              </View>
            )}
            {passMatch && (
              <View style={styles.successRow}>
                <CheckCircle size={13} color="#22C55E" weight="bold" />
                <Text style={styles.successText}>Las contraseñas coinciden</Text>
              </View>
            )}

            {/* Botón */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Guardar contraseña</Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FEF3C7',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#B45309' },
  fieldLabel: {
    fontSize: 12, fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6, marginLeft: 2,
  },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: COLORS.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, paddingRight: 80,
    fontSize: 15, color: COLORS.textPrimary,
    borderWidth: 2, borderColor: COLORS.border,
  },
  eyeBtn: { position: 'absolute', right: 14 },
  validIcon: { position: 'absolute', right: 44 },

  // Fortaleza
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  strengthBar: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border, overflow: 'hidden',
  },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', width: 48, textAlign: 'right' },

  // Mensajes
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errorText: { fontSize: 12, color: '#EF4444' },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  successText: { fontSize: 12, color: '#22C55E' },

  // Botón
  saveBtn: {
    backgroundColor: '#B45309', paddingVertical: 15,
    borderRadius: 14, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});