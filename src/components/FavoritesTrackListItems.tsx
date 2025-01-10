import React, { useEffect, useState } from 'react';
import TrackPlayer, { Event, useIsPlaying, useTrackPlayerEvents } from 'react-native-track-player';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import axios from 'axios';
import { Colors } from '../constants/colors';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { imageUrl } from '../assests/data/track';

type TrackPlayerListType = {
    track: Track,
    selectedTrack: (id: string, track: Track) => void;

};

const FavoritesTrackListItems = ({ track, selectedTrack }: TrackPlayerListType) => {
    const { setFavorites } = usePlayerContext();
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const { playing } = useIsPlaying();
    const isLiked = true;
    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        if (event.index != null) {
            const trackId = await TrackPlayer.getTrack(event.index);
            if (trackId) {
                setCurrentTrackId(trackId?.id);
            } else {
                console.error('Track not found at index:', event.index);
            }
        }
    });

    const removeFavorite = async (trackId: string) => {
        const token = await AsyncStorage.getItem('userToken');
        try {
             await axios.delete('https://musicserver-uluy.onrender.com/favorites/remove', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    trackId,
                },
            });

            setFavorites((prevLikedTracks) => prevLikedTracks.filter((t) => t?.id !== trackId));  // Remove the unliked track
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            setCurrentTrackId(null); // Clean up state on unmount
        };
    }, []);

    const isPlaying = currentTrackId === track.id;

    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;
    return (
        <Pressable style={styles.container} onPress={() => selectedTrack(track.id, track)}>
            <View style={styles.left}>
                {/* Track Image */}
                <Image source={{ uri: track?.artwork || imageUrl }} style={styles.image} />
                {/* Track Information */}
                <View style={styles.trackInfo}>
                    <Text style={[styles.title, isPlaying && playing ? styles.activeIcon : null]}>
                        {track?.title ?? ''}
                    </Text>
                    <Text style={styles.artist}>{track?.artist ?? ''}</Text>
                </View>
            </View>
            {/* Play/Pause & Like Icons */}
            <View style={styles.playIcon}>
                {/* Like Button */}
                <TouchableOpacity
                    accessibilityLabel={isLiked ? `Unfavorite ${track?.title}` : `Favorite ${track?.title}`}
                    accessibilityRole="button"
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        padding: 14,
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} onPress={() => removeFavorite(track?.id)}>
                    <Icon
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isLiked ? styles.activeIcon.color : styles.likeIcon.color}
                    />
                </TouchableOpacity>

                {/* Play/Pause Button */}
                <Icon
                    name={(isPlaying && playing) ? 'pause' : 'play'}
                    size={24}
                    color={(isPlaying && playing) ? styles.activeIcon.color : styles.playIcon.color}
                />
            </View>
        </Pressable>
    );
};


const lightStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#EEE',
    },

    trackInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.title,
    },

    artist: {
        fontSize: 14,
        color: Colors.title,
    },
    playIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.icon,
        gap: 30,
    },

    likeIcon: {
        color: Colors.icon,
    },
    activeIcon: {
        color: Colors.activeTitle,
    },
});


const darkStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#333',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Light shadow
        shadowRadius: 6,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#555',
    },

    trackInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.white,
    },
    artist: {
        fontSize: 14,
        color: Colors.white,
    },
    playIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        color: Colors.white,

    },

    likeIcon: {
        color: Colors.white,
    },

    activeIcon: {
        color: Colors.ElectricBlue,
    },
});
export default FavoritesTrackListItems;


