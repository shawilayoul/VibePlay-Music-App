import React, { useEffect, useState } from 'react';
import TrackPlayer, { Event, useIsPlaying, useTrackPlayerEvents } from 'react-native-track-player';
import { Alert } from 'react-native';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Track } from '../store/trackPlayerContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import UsePlayItems from '../hooks/UsePlayItems';

type TrackPlayerListType = {
    track: Track,
    selectedTrack: (id: string, track: Track) => void;
};

const ArtistTrackslistItems = ({ track, selectedTrack }: TrackPlayerListType) => {
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const { playing } = useIsPlaying();

    const { setFavorites } = usePlayerContext();
    const [isLiked, setIsLiked] = useState(false);

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

                const likedTrackIds = response.data.favorites.artistTrackFavorites.map((t: any) => t?.id);

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
            const response = await axios.post(
                `https://musicserver-uluy.onrender.com/favorites/artist-tracks/${action}`,
                { trackId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            // Update the favorites list based on the action
            if (action === 'like') {
                // Assuming 'track' is defined or passed into this function
                setFavorites((prevLikedTracks: Track[]) => [...prevLikedTracks, response.data.track]); // Add the liked track
            } else if (action === 'unlike') {
                setFavorites((prevLikedTracks: Track[]) => prevLikedTracks.filter((t: { id: string; }) => t?.id !== trackId) // Remove the unliked track
                );
            }
        } catch (error) {
            console.error(`Error ${action} track:`, error);
        }
    };

    const handleLikeToggle = async (trackId: string) => {
        const action = isLiked ? 'unlike' : 'like';
        await toggleTrackLike(trackId, action);
        setIsLiked(!isLiked); // Toggle the state
    };

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        if (event.index != null) {
            const trackId = await TrackPlayer.getTrack(event.index);
            setCurrentTrackId(trackId?.id);
        }
    });

    TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
        console.error('An error occurred while trying to play the track', error);
    });

    return (
        <UsePlayItems selectedTrack={selectedTrack} track={track} playing={playing} handleLikeToggle={handleLikeToggle} isLiked={isLiked} currentTrackId={currentTrackId} />
    );
};

export default ArtistTrackslistItems;


