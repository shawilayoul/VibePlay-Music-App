import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useAuthStore from '../store/authStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';

type RootStackParamList = {
  Login: undefined;  // The screen you are navigating to
  Register: undefined;
};
const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { signUp, error: signUpError } = useAuthStore();
  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const handleRegister = async () => {
    try {
      await signUp(username, email, password);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre nom"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#333"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleRegister}
        activeOpacity={0.8}  // Reduces opacity when the button is pressed for visual feedback
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      {signUpError && <Text style={styles.errText}>{signUpError}</Text>}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.link}>Vous avez déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  errText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#2850A0',   // Blue background for the button
    paddingVertical: 15,           // Padding inside the button for vertical spacing
    borderRadius: 5,              // Rounded corners for a modern look
    alignItems: 'center',          // Horizontally center the text
    justifyContent: 'center',      // Vertically center the text
    elevation: 5,                  // Shadow for Android
    shadowOffset: { width: 0, height: 3 }, // Shadow properties
    shadowOpacity: 0.3,            // Shadow intensity for iOS
    shadowRadius: 5,               // Shadow spread for iOS
  },
  buttonText: {
    color: '#fff',                // White text color
    fontSize: 16,                  // Text size for better readability
    fontWeight: 'bold',            // Bold font for emphasis
  },
  linkContainer: {
    height: 48,                   // Set the height to 48dp or larger
    justifyContent: 'center',     // Vertically center the text
    paddingHorizontal: 10,        // Horizontal padding for better touch area
    marginVertical: 5,            // Add some space above and below the link
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.darkModeBg,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  errText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#2850A0',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,            // Shadow intensity for iOS
    shadowRadius: 5,               // Shadow spread for iOS
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;


