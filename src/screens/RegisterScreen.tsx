import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import ScreenContainer from '../components/ScreenContainer';

export default function RegisterScreen() {
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
          Crear cuenta
        </Text>

        <Text style={styles.subtitle}>
          Regístrate para continuar
        </Text>

        <CustomInput
          placeholder="Nombre completo"
        />

        <CustomInput
          placeholder="Correo electrónico"
          keyboardType="email-address"
        />

        <CustomInput
          placeholder="Contraseña"
          secureTextEntry
        />

        <CustomButton
          title="Crear cuenta"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    fontSize: 16,
    color: '#2563EB',
    marginBottom: 20,
  },

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
});