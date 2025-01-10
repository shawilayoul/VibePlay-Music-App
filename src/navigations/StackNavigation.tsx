import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FloadPlayer from '../components/FloadPlayer';
import PlaylistsDetailsScreen from '../components/PlaylistsTracksList';
import PodcastsLists from '../homeComponents/PodcastsLists';
import ArtistTracksList from '../homeComponents/ArtistTracksList';

export type RootStackParamList = {
    FloadPlayer: undefined;
    MusicPlayer: undefined;
    StackNavigation: {
        screen: string;
        params: {
            playlistId: string;
            playlistName: string;
        };
    }
    PlaylistsDetailsScreen: { playlistId: string, playlistName: string };
    PodcastsLists: {
        podcastId: string;
        podcastName: string;
        artwork: string;
    };
    ArtistTracksList: { artistId: string, artistName: string }
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
                animation: 'fade', // Fade in/out between screens
                animationTypeForReplace: 'push',
            }} >
            <Stack.Screen name="PlaylistsDetailsScreen" component={PlaylistsDetailsScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="FloadPlayer" component={FloadPlayer} options={{ headerShown: false }} />
            <Stack.Screen name="PodcastsLists" component={PodcastsLists} options={{ headerShown: false }} />
            <Stack.Screen name="ArtistTracksList" component={ArtistTracksList} options={{ headerShown: false }} />
        </Stack.Navigator >
    );
};

export default StackNavigation;
