import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';


type RootStackParamList = {
    Login: undefined
};

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Erreur', 'Veuillez entrer votre adresse e-mail.');
            return;
        }

        try {
            await axios.post(
                'https://musicserver-uluy.onrender.com/user/request-password-reset',
                { email: email },
                { headers: { 'Content-Type': 'application/json' } } // Ensure the header is set
            );

            Alert.alert(
                'Réinitialisation de mot de passe',
                'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error) {
            console.log('Error:', error);
            Alert.alert('Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réinitialiser votre mot de passe</Text>

            <TextInput
                style={styles.input}
                placeholder="Entrez votre e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#333"
            />

            <TouchableOpacity
                style={styles.buttonContainer}
                activeOpacity={0.8}
                onPress={handlePasswordReset}
            >
                <Text style={styles.buttonText}>Envoyer un lien de réinitialisation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Retour à la connexion</Text>
            </TouchableOpacity>
        </View>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'semibold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        width: '100%',           // Button should take the full width of the container
        paddingHorizontal: 20,   // Padding on the sides for better spacing
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
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: {
        height: 48,                   // Set the height to 48dp or larger
        justifyContent: 'center',     // Vertically center the text
        paddingHorizontal: 10,        // Horizontal padding for better touch area
        marginVertical: 5,            // Add some space above and below the link
    },
    link: {
        color: '#0F2A63',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 15,
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.darkModeBg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'semibold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
        color: '#ddd',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        backgroundColor: '#2850A0',
        paddingVertical: 15,
        borderRadius: 5,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,            // Shadow intensity for iOS
        shadowRadius: 5,
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
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 15,
    },
});

export default ForgotPasswordScreen;
