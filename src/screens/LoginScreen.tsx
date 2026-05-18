import { router } from 'expo-router';

import React, { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  createUserWithEmailAndPassword
} from 'firebase/auth';

import {
  doc,
  setDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../config/firebase';

import { COLORS } from '../styles/colors';

import ScreenContainer from '../components/ScreenContainer';

export default function RegisterScreen() {

  const [nombre, setNombre] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  // REGISTRAR USUARIO

  const registrar = async () => {

    try {

      // VALIDAR CAMPOS

      if (
        !nombre ||
        !email ||
        !password
      ) {

        Alert.alert(
          'Error',
          'Completa todos los campos'
        );

        return;
      }

      console.log('BOTON FUNCIONA');

      // CREAR USUARIO FIREBASE

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // GUARDAR DATOS EN FIRESTORE

      await setDoc(
        doc(db, 'usuarios', user.uid),
        {
          nombre: nombre,
          email: email,
          creado: new Date()
        }
      );

      Alert.alert(
        'Correcto',
        'Usuario registrado'
      );

      // IR AL LOGIN

      router.replace('/login');

    } catch (error: any) {

      console.log(error);

      Alert.alert(
        'ERROR FIREBASE',
        error.message
      );

    }
  };

  return (

    <ScreenContainer>

      {/* VOLVER */}

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

        {/* INPUT NOMBRE */}

        <TextInput
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        {/* INPUT EMAIL */}

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* INPUT PASSWOR */}

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* BOTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={registrar}
        >

          <Text style={styles.buttonText}>
            CREAR CUENTA
          </Text>

        </TouchableOpacity>

      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({

  back: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 20,
  },

  container: {
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  button: {
    backgroundColor: '#003DA5',
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});