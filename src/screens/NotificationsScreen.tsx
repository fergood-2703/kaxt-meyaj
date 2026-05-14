import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ScreenContainer from '../components/ScreenContainer';

import { COLORS } from '../styles/colors';

export default function NotificationsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>
          Notificaciones
        </Text>

        <Text style={styles.subtitle}>
          Aquí aparecerán las ofertas de trabajo,
          mensajes y actualizaciones.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 28,
  },
});