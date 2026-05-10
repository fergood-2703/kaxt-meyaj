import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

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
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  smallButton: {
    paddingVertical: 10,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});