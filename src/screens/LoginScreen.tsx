import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayerContext } from '../store/trackPlayerContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/colors';


type RootStackParamList = {
    Home: undefined;  // The screen you are navigating to
    Register: undefined;
    ForgotPassword: undefined,
};
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { checkToken, isDarkMode } = usePlayerContext();



    const styles = isDarkMode ? darkStyles : lightStyles;
    const handleLogin = async () => {
        try {
            const response = await axios.post('https://musicserver-uluy.onrender.com/user/login', { email, password });
            // Access the token from the response
            const token = response.data.accessToken;
            const username = response.data.username;
            const userEmail = response.data.email;
            const userId = response.data.userId;

            console.log(userId);
            // Check if the token exists
            if (token || username || userId) {
                // Store the token in AsyncStorage
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('email', userEmail);
                await AsyncStorage.setItem('userId', userId);
                checkToken();
                navigation.navigate('Home');
            } else {
                Alert.alert('Oops!', 'It looks like we couldn\'t log you in. Please try again.');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid email or password. Please check your details and try again.');
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue de nouveau !</Text>

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
                onPress={handleLogin}
                activeOpacity={0.8}
                accessibilityLabel="Se connecter pour accéder à votre compte"
                accessible={true}
            >
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.linkContainer}
                onPress={() => navigation.navigate('ForgotPassword')}
                accessibilityLabel="Mot de passe oublié"
                accessible={true}>
                <Text style={styles.link}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity style={styles.linkContainer}
                onPress={() => navigation.navigate('Register')}
                accessibilityLabel="Inscrivez-vous si vous n'avez pas de compte"
                accessible={true}>
                <Text style={styles.link}>Vous n'avez pas de compte ? Inscrivez-vous.</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    loginBtn: {
        width: '100%',           // Button should take the full width of the container
        paddingHorizontal: 20,   // Padding on the sides for better spacing
        marginVertical: 10,      // Space above and below the button
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
        height: 48,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    link: {
        textAlign: 'center',
        color: '#0F2A63',
        textDecorationLine: 'underline',
        fontSize: 16,
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    loginBtn: {
        width: '100%',           // Button should take the full width of the container
        paddingHorizontal: 20,
        marginVertical: 10,
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
        color: '#007BFF',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default LoginScreen;



