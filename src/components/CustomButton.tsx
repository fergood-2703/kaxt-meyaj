import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { COLORS } from '../styles/colors';

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;

  small?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  small = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        small && styles.smallButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
  backgroundColor: COLORS.primary,
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  width: '100%',
},

  smallButton: {
    paddingVertical: 10,
  },

  text: {
    color: COLORS.white
,
    fontSize: 16,
    fontWeight: '600',
  },
});