/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import StackNavigation, { RootStackParamList } from './StackNavigation';
import FloadPlayer from '../components/FloadPlayer';
import HomeScreen from '../screens/HomeScreen';
import SongsScreen from '../screens/SongScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon4 from 'react-native-vector-icons/Entypo';
import { enableScreens } from 'react-native-screens';
import FavoritesScreen from '../screens/FavoritesScreen';
import { Colors } from '../constants/colors';
import PlayListScreen from '../screens/PlayListScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { usePlayerContext } from '../store/trackPlayerContext';
import PodcastList from '../components/PodcastListScreen';
import ArtistsLists from '../components/ArtistsListsScreen';
import TrendingTrackScreen from '../screens/TrendingTrackScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword';


export type TabParamList = {
    Home: NavigatorScreenParams<RootStackParamList>;
    songs: undefined;
    Favorites: undefined;
    PlayList: undefined;
    StackNavigation: undefined;
    Register: undefined,
    Login: undefined,
};
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator();
const ButtomTabNavigation = () => {

    const { userToken,
        isDarkMode, setIsDarkMode,
    } = usePlayerContext();


    const colorScheme = useColorScheme();

    const styles = isDarkMode ? darkStyles : lightStyles;
    // Detect the initial system color scheme
    useEffect(() => {
        if (colorScheme === 'dark') {
            setIsDarkMode(true);
        }
    }, [colorScheme, setIsDarkMode]);
    // Toggle Dark Mode
    const toggleSwitch = () => {
        setIsDarkMode(!isDarkMode);
    };

    enableScreens();
    return (
        <View style={styles.container}>
            <Tab.Navigator screenOptions={{
            }}
                tabBar={(props) => (
                    <View>
                        <FloadPlayer />
                        <BottomTabBar {...props} />
                    </View>
                )} >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        tabBarIcon: ({ focused }) => (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50,
                                    width: 50,
                                }}
                            >
                                <Icon
                                    name={focused ? 'home' : 'home'}
                                    size={30}
                                    color={focused
                                        ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle)
                                        : (isDarkMode ? '#ffff' : '#0a2472')}
                                />
                            </View>
                        ),
                        title: 'Accueil',
                        tabBarLabel: ({ focused }) => (
                            <Text
                                style={{
                                    color: focused
                                        ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle)
                                        : (isDarkMode ? '#ffff' : 'black'),
                                    fontSize: 15,
                                    fontWeight: '500',
                                    padding: 5,
                                }}
                            >
                                Accueil
                            </Text>
                        ),
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff',  // Background color based on dark mode
                            borderTopWidth: 0,
                            height: 65,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',  // Header background color
                            height: 65, // Adjust the header height
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerRight: () => (
                            <View style={styles.iconContainer}>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleSwitch}
                                    style={[styles.switch, { height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }]}  // Ensuring 48dp touch target
                                    trackColor={{
                                        false: '#0a2472',  // Light mode track color (dark blue for better contrast)
                                        true: '#2E5B8F',   // Dark mode track color
                                    }}
                                    thumbColor={isDarkMode ? '#f4f3f4' : '#2E5B8F'}
                                />
                                {userToken ? (
                                    <>
                                        <Icon3
                                            name="settings"
                                            size={25}
                                            color={isDarkMode ? '#fff' : '#0a2472'}  // Darker color for better contrast in light mode
                                            onPress={() => navigation.navigate('UserProfileScreen')}
                                            style={{ padding: 12 }}  // Ensure proper padding to meet touch target size
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            onPress={() => navigation.navigate('Login')}
                                            style={[styles.iconText, { color: isDarkMode ? '#fff' : '#0a2472' }]}>  {/* Darker color for text in light mode */}
                                            Se connecter
                                        </Text>
                                    </>
                                )}
                            </View>
                        ),
                    })}
                />
                < Tab.Screen name="songs" component={SongsScreen}
                    options={() => ({
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                justifyContent: 'center', alignItems: 'center', height: 50,
                                width: 50,
                            }}>
                                <Icon3 name="music" size={30} color={focused ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle) : (isDarkMode ? '#ffff' : '#0a2472')}
                                />
                            </View>
                        ),
                        title: 'Adoration',
                        tabBarLabel: ({ focused }) => (
                            <Text style={{
                                color: focused ? (isDarkMode ? Colors.ElectricBlue
                                    : Colors.activeTitle) : (isDarkMode ? '#fff' : 'black'), fontSize: 15, fontWeight: '500', padding: 5,
                            }}>
                                Adoration
                            </Text>
                        ),
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                    })} />
                < Tab.Screen name="Favorites" component={FavoritesScreen}
                    options={() => ({
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                justifyContent: 'center', alignItems: 'center', height: 50,
                                width: 50,
                            }}>
                                <Icon name="heart" size={30} color={focused ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle) : (isDarkMode ? '#ffff' : '#0a2472')}
                                />
                            </View>
                        ),
                        title: 'Favoris',
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ color: focused ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle) : (isDarkMode ? '#ffff' : 'black'), fontSize: 15, fontWeight: '500', padding: 5 }}>
                                Favoris
                            </Text>
                        ),
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',  // Set the background color of the top bar (header) to black
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerShown: false,
                    })} />
                <Tab.Screen
                    name="PlayList"
                    component={PlayListScreen}
                    options={({ navigation }) => ({
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                justifyContent: 'center', alignItems: 'center', height: 50,
                                width: 50,
                            }}>
                                <Icon2
                                    name="playlist-music-outline"
                                    size={30}
                                    color={focused ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle) : (isDarkMode ? '#ffff' : '#0a2472')} // Change color based on active/focused state
                                /></View>
                        ),
                        title: 'PlayLists',
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ color: focused ? (isDarkMode ? Colors.ElectricBlue : Colors.activeTitle) : (isDarkMode ? '#ffff' : 'black'), fontSize: 15, fontWeight: '500', padding: 5 }}>
                                PlayLists
                            </Text>
                        ),
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',  // Set the background color of the top bar (header) to black
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerRight: () => (
                            <View style={styles.iconContainer}>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleSwitch}
                                    style={[styles.switch, { height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }]}  // Ensuring 48dp touch target
                                    trackColor={{
                                        false: '#0a2472',  // Light mode track color (dark blue for better contrast)
                                        true: '#2E5B8F',   // Dark mode track color
                                    }}
                                    thumbColor={isDarkMode ? '#f4f3f4' : '#2E5B8F'}
                                />
                                {userToken ? (
                                    <>
                                        <Icon3
                                            name="settings"
                                            size={25}
                                            color={isDarkMode ? '#fff' : '#0a2472'}  // Darker color for better contrast in light mode
                                            onPress={() => navigation.navigate('UserProfileScreen')}
                                            style={{ padding: 12 }}  // Ensure proper padding to meet touch target size
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            onPress={() => navigation.navigate('Login')}
                                            style={[styles.iconText, { color: isDarkMode ? '#fff' : '#0a2472' }]}>  {/* Darker color for text in light mode */}
                                            Se connecter
                                        </Text>
                                    </>
                                )}
                            </View>

                        ),
                    })}
                />
                <Stack.Screen
                    name="Podcasts"
                    component={PodcastList}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Podcasts',
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff',
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ height: 52, width: 52, justifyContent: 'center', alignItems: 'center', marginRight: -20 }}>
                                <Icon4 name="chevron-left" size={35} color={isDarkMode ? 'white' : '#000'} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View style={styles.iconContainer}>
                                <Switch
                                    value={isDarkMode}
                                    style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
                                    onValueChange={toggleSwitch}
                                    trackColor={{
                                        false: '#0a2472',
                                        true: '#2E5B8F',
                                    }}
                                    thumbColor={isDarkMode ? '#f4f3f4' : '#2E5B8F'}
                                />
                            </View>
                        ),
                    })} />

                <Stack.Screen
                    name="ArtistsLists"
                    component={ArtistsLists}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Artists',
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[styles.arrowLeftIcon, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]} // Ensures the touch target is large enough
                            >
                                <Icon4 name="chevron-left" size={35} color={isDarkMode ? 'white' : '#000'} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View style={styles.iconContainer}>
                                <Switch
                                    style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}  // Make the touch target 48dp
                                    value={isDarkMode}
                                    onValueChange={toggleSwitch}
                                    trackColor={{
                                        false: '#0a2472',  // Color of the track in light mode
                                        true: '#2E5B8F',   // Color of the track in dark mode
                                    }}
                                    thumbColor={isDarkMode ? '#f4f3f4' : '#2E5B8F'}
                                />
                            </View>
                        ),
                    })} />

                <Stack.Screen
                    name="TrendingTrack"
                    component={TrendingTrackScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Musique tendance',
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ height: 52, width: 52, justifyContent: 'center', alignItems: 'center', marginRight: -20 }}>
                                <Icon4 name="chevron-left" size={35} color={isDarkMode ? 'white' : '#000'} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <View style={styles.iconContainer}>
                                <Switch
                                    style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}  // Make the touch target 48dp
                                    value={isDarkMode}
                                    onValueChange={toggleSwitch}
                                    trackColor={{
                                        false: '#0a2472',  // Color of the track in light mode
                                        true: '#2E5B8F',   // Color of the track in dark mode
                                    }}
                                    thumbColor={isDarkMode ? '#f4f3f4' : '#2E5B8F'}
                                />
                            </View>
                        ),
                    })} />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Se connecter',
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',  // Set the background color of the top bar (header) to black
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerRight: () => (

                            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.loginIcon, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                <Icon name="person-add" size={25} color={isDarkMode ? '#ffff' : '#0a2472'}
                                />
                            </TouchableOpacity>
                        ),
                    })} />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: "S'inscrire",
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                            paddingBottom: 2,
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',  // Set the background color of the top bar (header) to black
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerRight: () => (
                            <View style={[styles.loginIcon, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                <Icon
                                    name="log-in"
                                    size={30}
                                    color={isDarkMode ? '#ffff' : '#0a2472'}
                                    onPress={() => navigation.navigate('Login')}
                                />
                            </View>
                        ),
                    })}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Mot de passe oublié',
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerRight: () => (
                            <View style={[styles.loginIcon, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                <Icon
                                    name="log-in"
                                    size={30}
                                    color={isDarkMode ? '#ffff' : '#0a2472'}
                                    onPress={() => navigation.navigate('Login')}
                                />
                            </View>
                        ),
                    })}
                />
                <Stack.Screen
                    name="UserProfileScreen"
                    component={UserProfileScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => null,
                        title: 'Profile',
                        tabBarLabelStyle: {
                            fontSize: 15,  // Set your desired font size here
                            fontWeight: '500',
                            color: isDarkMode ? '#ffff' : 'black',
                            paddingBottom: 2,
                        },
                        tabBarStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#fff', // Change based on dark mode
                            borderTopWidth: 0,
                            height: 65, // Ensure the tab bar has sufficient height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        headerStyle: {
                            backgroundColor: isDarkMode ? '#333' : '#ffff',
                            height: 65,
                        },
                        headerTintColor: isDarkMode ? 'white' : '#000',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[styles.arrowLeftIcon, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                <Icon4 name="chevron-left" size={35} color={isDarkMode ? 'white' : '#000'} />
                            </TouchableOpacity>
                        ),
                    })}
                />
                < Tab.Screen name="StackNavigation" options={{
                    headerShown: false, tabBarButton: () => null,
                    tabBarStyle: {
                        backgroundColor: isDarkMode ? '#333' : 'white',
                        borderTopWidth: 0,
                        height: 65, // Ensure the tab bar has sufficient height
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }}>
                    {() => <StackNavigation />}
                </Tab.Screen >
            </Tab.Navigator >
        </View >
    );
};

export default ButtomTabNavigation;

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    loginIcon: {
        marginRight: 10,
    },
    arrowLeftIcon: {
        marginRight: -20,
        height: 50,
        width: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#0a2472',
        marginRight: 5,
        cursor: 'pointer',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    switch: {
        marginRight: 15,
    },
    iconText: {
        marginRight: 5,
        color: '#0a2472',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    loginIcon: {
        marginRight: 10,
    },
    arrowLeftIcon: {
        marginLeft: 10,
        marginRight: -10,
    },
    logoutText: {
        color: '#ffff',
        marginRight: 5,
        cursor: 'pointer',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    switch: {
        marginRight: 15,
    },
    iconText: {
        marginRight: 5,
        color: '#ffff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});

