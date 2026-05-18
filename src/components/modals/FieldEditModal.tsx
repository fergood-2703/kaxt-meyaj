import { X } from 'phosphor-react-native';
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
  title: string;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  maxLength?: number;
  hint?: string;
  accentColor?: string;
  iconBg?: string;
  icon?: React.ReactNode;
};

export default function FieldEditModal({
  visible, title, value, onSave, onClose,
  placeholder, keyboardType = 'default',
  maxLength, hint,
  accentColor = COLORS.primary,
  iconBg, icon,
}: Props) {
  const [text, setText] = useState(value);

  const handleSave = () => {
    if (!text.trim()) {
      Alert.alert('Error', `El campo "${title}" no puede estar vacío.`);
      return;
    }
    onSave(text.trim());
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
                {icon && iconBg && (
                  <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                    {icon}
                  </View>
                )}
                <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={22} color={COLORS.textSecondary} weight="bold" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { borderColor: accentColor }]}
              value={text}
              onChangeText={setText}
              placeholder={placeholder ?? title}
              placeholderTextColor={COLORS.textSecondary}
              keyboardType={keyboardType}
              maxLength={maxLength}
            />

            {hint && <Text style={styles.hint}>{hint}</Text>}

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: accentColor }]}
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
  input: {
    backgroundColor: COLORS.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: COLORS.textPrimary, borderWidth: 2,
  },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 10, fontStyle: 'italic', lineHeight: 18 },
  saveBtn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});