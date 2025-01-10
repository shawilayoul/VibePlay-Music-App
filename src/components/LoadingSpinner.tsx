import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';

const LoadingSpinner = () => {
    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={isDarkMode ? '#FFFFFF' : '#000'} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightModeBg,
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkModeBg,
    },
    text: {
        fontSize: 18,
        color: '#ffff',
    },
});
export default LoadingSpinner;
