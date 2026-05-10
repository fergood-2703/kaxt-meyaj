import { StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import ScreenContainer from '../components/ScreenContainer';

export default function LoginScreen() {
  return (
    <ScreenContainer>
      <Text
        style={styles.back}
        onPress={() => router.back()}
      >
        ← Volver
      </Text>

      <View style={styles.container}>
        <Text style={styles.title}>
          Iniciar sesión
        </Text>

        <Text style={styles.subtitle}>
          Accede a tu cuenta
        </Text>

        <CustomInput
          placeholder="Correo electrónico"
          keyboardType="email-address"
        />

        <CustomInput
          placeholder="Contraseña"
          secureTextEntry
        />

        <CustomButton
          title="Entrar"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
  back: {
    fontSize: 16,
    color: '#2563EB',
    marginBottom: 20,
  },
});