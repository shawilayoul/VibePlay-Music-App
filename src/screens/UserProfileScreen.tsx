import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, TextInput, Button, Alert, ScrollView } from 'react-native';
import { usePlayerContext } from '../store/trackPlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userIcon1, userIcon2 } from '../assests/data/track';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/colors';
import axios from 'axios';

type RootStackParamList = {
    Home: undefined;
    ForgotPassword: undefined,
};
const UserProfileScreen = () => {

    const [email, setEmail] = useState('');
    const [changePasswordModel, setChangePasswordModel] = useState(false);

    // Toggle Dark/Light Mode
    const { isDarkMode, setIsDarkMode, userToken, userId, setUserName, setUserToken, userName, userEmail } = usePlayerContext();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const styles = isDarkMode ? darkStyles : lightStyles;
    // Toggle Dark Mode
    const toggleSwitch = () => {
        setIsDarkMode(!isDarkMode);
    };

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
                        onPress: () => setChangePasswordModel(!changePasswordModel),
                    },
                ]
            );

            setEmail('');
            Alert.alert(
                'Réinitialisation de mot de passe',
                'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.',
                [
                    {
                        text: 'OK',
                        onPress: () => setChangePasswordModel(!changePasswordModel),
                    },
                ]
            );
        } catch (error) {
            console.log('Error:', error);
            Alert.alert('Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        setUserToken('');
        setUserName('');
        navigation.navigate('Home');

    };


    const deleteAccount = async () => {

        if (!userId) {
            console.error('User ID could not be extracted from token');
            return;
        }

        try {
            Alert.alert(
                'Confirmer la suppression du compte',
                'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
                [
                    {
                        text: 'Annuler',
                        onPress: () => console.log('Suppression annulée'),
                        style: 'cancel', // This makes "Annuler" the default cancel button
                    },
                    {
                        text: 'Supprimer',
                        onPress: async () => {
                            try {
                                await axios.delete(`https://musicserver-uluy.onrender.com/user/delete/${userId}`, {
                                    headers: {
                                        'Authorization': `Bearer ${userToken}`, // Send token in the Authorization header
                                        'Content-Type': 'application/json',
                                    },
                                });
                                Alert.alert(
                                    'Compte supprimé',
                                    'Votre compte a été supprimé avec succès.',
                                    [{ text: 'OK', onPress: () => handleLogout() }]
                                );
                            } catch (error) {
                                Alert.alert(
                                    'Erreur',
                                    'Une erreur est survenue lors de la suppression de votre compte.',
                                    [{ text: 'OK' }]
                                );
                            }
                        },
                    },
                ]
            );
        } catch (error: any) {
            // Handling errors from the request
            if (error.response) {
                // The request was made, but the server responded with an error status
                console.error('Error deleting user account:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response from the server:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <ScrollView style={[isDarkMode ? darkStyles.container : lightStyles.container]}>
            {/* Profile Section */}
            <View style={isDarkMode ? darkStyles.profileSection : lightStyles.profileSection}>
                <Image
                    source={{ uri: userIcon1 || userIcon2 }} // Placeholder for profile picture
                    style={isDarkMode ? darkStyles.profileImage : lightStyles.profileImage}
                />
                <Text style={[isDarkMode ? darkStyles.username : lightStyles.username]}>
                    {userName}
                </Text>
                <Text style={[isDarkMode ? darkStyles.email : lightStyles.email]}>
                    {userEmail}
                </Text>
            </View>

            {/* Settings Section */}
            <View style={isDarkMode ? darkStyles.settingsSection : lightStyles.settingsSection}>
                {/* Theme Toggle */}
                <View style={isDarkMode ? darkStyles.switchContainer : lightStyles.switchContainer}>

                    {
                        isDarkMode ? <Text style={[isDarkMode ? darkStyles.switchLabel : lightStyles.switchLabel]}>
                            Mode Sombre
                        </Text> : <Text style={[isDarkMode ? darkStyles.switchLabel : lightStyles.switchLabel]}>
                            Mode Clair
                        </Text>
                    }
                    <Switch value={isDarkMode} onValueChange={toggleSwitch} trackColor={{
                        false: '#0a2472',  // Color of the track in light mode
                        true: '#81b0ff',   // Color of the track in dark mode
                    }}
                        thumbColor={isDarkMode ? '#f4f3f4' : '#81b0ff'} />
                </View>

                {/* Logout Button */}
                <TouchableOpacity onPress={handleLogout} style={isDarkMode ? darkStyles.logoutButton : lightStyles.logoutButton}>
                    <Text style={isDarkMode ? darkStyles.logoutText : lightStyles.logoutText}>Se Déconnecter</Text>
                </TouchableOpacity>

                {/* Additional Settings */}
                {!changePasswordModel &&
                    <TouchableOpacity onPress={() => setChangePasswordModel(!changePasswordModel)} style={isDarkMode ? darkStyles.settingOption : lightStyles.settingOption}>
                        <Text style={[isDarkMode ? darkStyles.settingText : lightStyles.settingText]}>
                            Changer le mot de passe
                        </Text>
                    </TouchableOpacity>}
                {changePasswordModel &&

                    < View >
                        <Text style={styles.title}>Entrez votre e-mail pour changer le mot de passe.</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Entrez votre e-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#888"
                        />

                        <Button title="Envoyer un lien de réinitialisation" onPress={handlePasswordReset} color="#007BFF" />
                    </View>}
                <TouchableOpacity style={isDarkMode ? darkStyles.settingOption : lightStyles.settingOption}>
                    <Text style={[isDarkMode ? darkStyles.settingText : lightStyles.settingText]}>
                        Gérer les notifications
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={deleteAccount} style={isDarkMode ? darkStyles.deleteButton : lightStyles.deleteButton}>
                    <Text style={isDarkMode ? darkStyles.logoutText : lightStyles.logoutText}>Supprimer le compte</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );
};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.lightModeBg,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 50,
        marginBottom: 15,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000', // Dark text color for light mode
    },
    email: {
        fontSize: 16,
        color: '#000',
    },
    settingsSection: {
        marginTop: 32,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 18,
        marginRight: 10,
        flex: 1,
        color: '#000', // Dark text for switch label in light mode
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButton: {
        marginTop: 50,
        paddingVertical: 12,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    logoutText: {
        fontSize: 18,
        color: '#fff',
    },
    settingOption: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
    },
    settingText: {
        fontSize: 16,
        color: '#000',
    },

    ///forgotpassword
    title: {
        marginVertical: 10,
        color: '#333',
        paddingLeft: 10,
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
    link: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 15,
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.darkModeBg,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor:'#FFFF',
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff', // White text for dark mode
    },
    email: {
        fontSize: 16,
        color: '#ccc', // Lighter color for email in dark mode
    },
    settingsSection: {
        marginTop: 32,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 18,
        marginRight: 10,
        flex: 1,
        color: '#fff', // Light text for switch label in dark mode
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButton: {
        marginTop: 50,
        paddingVertical: 12,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    logoutText: {
        fontSize: 18,
        color: '#fff',
    },
    settingOption: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#444', // Darker border color for dark mode
        borderRadius: 8,
    },
    settingText: {
        fontSize: 16,
        color: '#fff', // Light text color for settings in dark mode
    },

    //forgot password
    title: {
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#fff',
        marginLeft: 10,
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
    link: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 15,
    },
});


export default UserProfileScreen;
