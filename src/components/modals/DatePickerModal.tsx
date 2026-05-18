import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarBlank, X } from 'phosphor-react-native';
import { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../styles/colors';

type Props = {
  visible: boolean;
  value?: string;
  onSave: (date: string) => void;
  onClose: () => void;
};

export default function DatePickerModal({ visible, value, onSave, onClose }: Props) {
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 18);
  const initialDate = value ? new Date(value) : defaultDate;
  const [selected, setSelected] = useState<Date>(initialDate);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                <CalendarBlank size={20} color={COLORS.secondary} weight="bold" />
              </View>
              <Text style={[styles.title, { color: COLORS.secondary }]}>
                Fecha de nacimiento
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} >
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={selected}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => { if (date) setSelected(date); }}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              locale="es-MX"
              style={{ width: '100%' }}
              textColor={COLORS.textPrimary}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: COLORS.secondary }]}
            onPress={() => { onSave(selected.toISOString().split('T')[0]); onClose(); }}
          >
            <Text style={styles.saveBtnText}>Guardar</Text>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  pickerWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border,
    overflow: 'hidden', marginVertical: 4,
  },
  saveBtn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});