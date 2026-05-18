import { Eye, EyeSlash, LockKey, X } from 'phosphor-react-native';
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

export default function ChangePasswordModal({ visible, onClose }: Props) {
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);

  const handleSave = () => {
    Alert.alert(
      'Próximamente',
      'El cambio de contraseña estará disponible cuando el backend esté listo.',
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                  <LockKey size={20} color="#B45309" weight="bold" />
                </View>
                <Text style={[styles.title, { color: '#B45309' }]}>Cambiar contraseña</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={22} color={COLORS.textSecondary} weight="bold" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nueva contraseña"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPass(!showPass)}
              >
                {showPass
                  ? <EyeSlash size={20} color={COLORS.textSecondary} weight="bold" />
                  : <Eye      size={20} color={COLORS.textSecondary} weight="bold" />
                }
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>
              Disponible cuando el backend esté listo.
            </Text>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: '#B45309' }]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Guardar</Text>
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
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  inputWrapper: { position: 'relative' },
  input: {
    backgroundColor: COLORS.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, paddingRight: 50,
    fontSize: 16, color: COLORS.textPrimary,
    borderWidth: 2, borderColor: '#B45309',
  },
  eyeBtn: { position: 'absolute', right: 14, top: 14 },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  saveBtn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});