import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Kaxt Meyaj</Text>

        <Text style={styles.subtitle}>
          Encuentra empleos locales fácilmente
        </Text>

        <CustomButton
  title="Iniciar sesión"
  onPress={() => router.push('/login')}
/>

<CustomButton
  title="Crear cuenta"
  onPress={() => router.push('/register')}
/>

<CustomButton
  title="Ver empleos"
  onPress={() => router.push('/jobs')}
/>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
});