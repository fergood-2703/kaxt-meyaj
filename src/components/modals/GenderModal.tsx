import {
    GenderFemale, GenderIntersex, GenderMale, GenderNeuter, X,
} from 'phosphor-react-native';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import { UserGender } from '../../types';

const GENDER_OPTIONS = [
  { value: 'hombre'            as UserGender, label: 'Hombre',            color: COLORS.primary       },
  { value: 'mujer'             as UserGender, label: 'Mujer',             color: COLORS.accent         },
  { value: 'no-binario'        as UserGender, label: 'No binario',        color: COLORS.success        },
  { value: 'prefiero-no-decir' as UserGender, label: 'Prefiero no decir', color: COLORS.textSecondary  },
];

function GenderIcon({ gender, size = 18 }: { gender?: UserGender; size?: number }) {
  switch (gender) {
    case 'hombre':            return <GenderMale     size={size} color={COLORS.primary}      weight="bold" />;
    case 'mujer':             return <GenderFemale   size={size} color={COLORS.accent}        weight="bold" />;
    case 'no-binario':        return <GenderNeuter   size={size} color={COLORS.success}       weight="bold" />;
    case 'prefiero-no-decir': return <GenderIntersex size={size} color={COLORS.textSecondary} weight="bold" />;
    default:                  return <GenderIntersex size={size} color={COLORS.success}       weight="bold" />;
  }
}

function iconBg(gender?: UserGender): string {
  switch (gender) {
    case 'hombre':            return '#EFF6FF';
    case 'mujer':             return '#FDE8F0';
    case 'no-binario':        return '#F0FDF4';
    case 'prefiero-no-decir': return '#F3F4F6';
    default:                  return '#F0FDF4';
  }
}

type Props = {
  visible: boolean;
  current?: UserGender;
  onSave: (g: UserGender) => void;
  onClose: () => void;
};

export default function GenderModal({ visible, current, onSave, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: iconBg(current) }]}>
                <GenderIcon gender={current} size={20} />
              </View>
              <Text style={[styles.title, { color: COLORS.success }]}>Género</Text>
            </View>
            <TouchableOpacity onPress={onClose} >
              <X size={22} color={COLORS.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Esta información es opcional y se usa solo para estadísticas internas.
          </Text>

          <View style={styles.list}>
            {GENDER_OPTIONS.map((opt) => {
              const selected = current === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.option,
                    selected && { borderColor: opt.color, backgroundColor: opt.color + '14' },
                  ]}
                  onPress={() => { onSave(opt.value); onClose(); }}
                  activeOpacity={0.75}
                >
                  <View style={[styles.optionIcon, { backgroundColor: iconBg(opt.value) }]}>
                    <GenderIcon gender={opt.value} size={18} />
                  </View>
                  <Text style={[
                    styles.optionText,
                    selected && { color: opt.color, fontWeight: '700' },
                  ]}>
                    {opt.label}
                  </Text>
                  {selected && <View style={[styles.dot, { backgroundColor: opt.color }]} />}
                </TouchableOpacity>
              );
            })}
          </View>
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
    alignItems: 'center', marginBottom: 12,
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
  hint: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18, marginBottom: 16 },
  list: { gap: 8 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  optionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  dot: { width: 10, height: 10, borderRadius: 5 },
});