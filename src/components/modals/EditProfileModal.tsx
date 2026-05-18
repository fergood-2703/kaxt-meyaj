import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { LockKey, Phone, User, X } from 'phosphor-react-native';
import { useState } from 'react';

import { useUser } from '../../context/UserContext';
import { COLORS } from '../../styles/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialPhone: string;
};

export default function EditProfileModal({
  visible,
  onClose,
  initialName,
  initialPhone,
}: Props) {
  const { updateProfile } = useUser();
  const [name,  setName]  = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    updateProfile({ firstName: name.trim(), phone: phone.trim() || undefined });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Información personal</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Nombre */}
          <Text style={styles.label}>Nombre completo</Text>
          <View style={styles.inputRow}>
            <User size={18} color={COLORS.textSecondary} weight="bold" />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="words"
            />
          </View>

          {/* Teléfono */}
          <Text style={styles.label}>Teléfono (opcional)</Text>
          <View style={styles.inputRow}>
            <Phone size={18} color={COLORS.textSecondary} weight="bold" />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="10 dígitos"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Correo — solo lectura */}
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <LockKey size={18} color={COLORS.border} weight="bold" />
            <Text style={styles.inputDisabled}>El correo se edita desde el backend</Text>
          </View>

          {/* Contraseña — solo lectura */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <LockKey size={18} color={COLORS.border} weight="bold" />
            <Text style={styles.inputDisabled}>Cambio de contraseña próximamente</Text>
          </View>

          {/* Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
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
  label: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    marginTop: 16, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.background, borderRadius: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 13 },
  inputRowDisabled: { opacity: 0.6 },
  inputDisabled: {
    flex: 1, fontSize: 14, color: COLORS.textSecondary,
    paddingVertical: 13, fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: COLORS.primary, paddingVertical: 14,
    borderRadius: 14, alignItems: 'center', marginTop: 24,
  },
  saveButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
});