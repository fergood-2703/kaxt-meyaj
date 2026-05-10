import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
});