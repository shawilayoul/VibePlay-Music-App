import React, { useEffect, useState } from 'react';
import TrackPlayer, { Event, useIsPlaying, useTrackPlayerEvents } from 'react-native-track-player';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Track } from '../store/trackPlayerContext';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsePlayItems from '../hooks/UsePlayItems';


type TrackPlayerListType = {
    track: Track,
    selectedTrack: (id: string, track: Track) => void;
};
const TrendingSongsListItems = ({ track, selectedTrack }: TrackPlayerListType) => {
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const { playing } = useIsPlaying();
    const [isLiked, setIsLiked] = useState(false);
    const { setFavorites } = usePlayerContext();


    useEffect(() => {
        const getUserFavoriteTracks = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setFavorites([]);
                return;
            }
            try {
                const response = await axios.get('https://musicserver-uluy.onrender.com/favorites/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the token for authentication
                    },
                });
                const likedTrackIds = response.data.favorites.trendingTrackFavorites.map((t: any) => t?.id);

                if (likedTrackIds.includes(track?.id)) {
                    setIsLiked(true);
                }
                return response.data; // Return the favorite tracks
            } catch (error) {
                console.error('Error fetching favorite tracks:', error);
            }
        };
        getUserFavoriteTracks();
    }, [setFavorites, track?.id]);

    const toggleTrackLike = async (trackId: string, action: string) => {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
            Alert.alert(
                'Bonjour !',
                'Connectez-vous pour ajouter des chansons à vos favoris, ou créez un compte si vous n’en avez pas. Nous avons hâte de voir vos choix !'
            );
            return; // Exit the function if the user is not logged in
        }

        try {
            // Make the API call to the backend for like or unlike action
            const response = await axios.post(
                `https://musicserver-uluy.onrender.com/favorites/trending-tracks/${action}`,
                { trendingTrackId: trackId },  // Make sure you are passing trendingTrackId here
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            // Handle the response based on the action
            if (action === 'like') {
                // Assuming 'trendingTrack' is returned in the response
                setFavorites((prevLikedTracks) => [...prevLikedTracks, response.data.trendingTrack]);
            } else if (action === 'unlike') {
                setFavorites((prevLikedTracks) =>
                    prevLikedTracks.filter((t) => t?.id !== trackId) // Remove the unliked track
                );
            }
        } catch (error) {
            console.error(`Error ${action} track:`, error);
            Alert.alert(
                'Erreur',
                `Une erreur est survenue lors de l'${action} de la chanson. Veuillez réessayer plus tard.`
            );
        }
    };

    const handleLikeToggle = async (trackId: string) => {
        const action = isLiked ? 'unlike' : 'like';
        try {
            await toggleTrackLike(trackId, action);
            setIsLiked(!isLiked); // Toggle the state only if the API request is successful
        } catch (error) {
            console.error('Error toggling like:', error);
            // Optionally show an alert or message if the API call fails
        }
    };

    //console.log(isliked)
    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        if (event.index != null) {
            const trackId = await TrackPlayer.getTrack(event.index);
            setCurrentTrackId(trackId?.id);
        }
    });

    return (
        <UsePlayItems selectedTrack={selectedTrack} track={track} playing={playing} handleLikeToggle={handleLikeToggle} isLiked={isLiked} currentTrackId={currentTrackId} />

    );
};

export default TrendingSongsListItems;
