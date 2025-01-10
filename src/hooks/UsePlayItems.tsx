/* eslint-disable react-native/no-inline-styles */
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Colors } from '../constants/colors';
import { Track, usePlayerContext } from '../store/trackPlayerContext';

interface Props {
    track: Track,
    selectedTrack: (id: string, track: Track) => void;
    playing?: boolean;
    handleLikeToggle: (trackId: string) => Promise<void>;
    isLiked?: boolean,
    currentTrackId: string | null;
}

const trackImg = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Logo_FJU.jpg?alt=media&token=5ab9414c-ad03-4527-aac4-983775e57b87';

const UsePlayItems: React.FC<Props> = ({ selectedTrack, track, playing = false, handleLikeToggle, isLiked, currentTrackId }) => {

    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const isPlaying = currentTrackId === track.id;

    return (
        <Pressable
            style={styles.container}
            onPress={() => selectedTrack(track?.id, track)}
            accessibilityLabel={`Track: ${track?.title ?? 'Unknown Title'}, Artist: ${track?.artist ?? 'Unknown Artist'}`}
            accessibilityRole="button"
        >
            <View style={styles.left}>
                {/* Track Image */}
                <Image
                    source={{ uri: track?.artwork || trackImg }}
                    style={styles.image}
                    accessibilityLabel={`Album artwork for ${track?.title ?? 'Unknown Title'}`}
                />
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
                    accessibilityHint={isLiked ? `Remove ${track?.title} from favorites` : `Add ${track?.title} to favorites`}
                    style={{
                        padding: 10,
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => handleLikeToggle(track?.id)}
                >
                    <Icon
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isLiked ? styles.activeIcon.color : styles.likeIcon.color}
                    />
                </TouchableOpacity>

                {/* Play/Pause Button */}
                <TouchableOpacity
                    accessibilityLabel={isPlaying ? `Pause ${track?.title}` : `Play ${track?.title}`}
                    accessibilityRole="button"
                    accessibilityHint={isPlaying ? `Pauses ${track?.title}` : `Plays ${track?.title}`}
                    style={{
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                <Icon
                    name={(isPlaying && playing) ? 'pause' : 'play'}
                    size={24}
                    color={(isPlaying && playing) ? styles.activeIcon.color : styles.playIcon.color}

                />
           </TouchableOpacity>

            </View>
        </Pressable>
    );
};

export default UsePlayItems;
const lightStyles = StyleSheet.create({
    // Container for the entire Pressable item
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF', // Light background
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    // Left Section: Image and Text for Track Info
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Image of the Track
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },

    // Track Information: Title and Artist
    trackInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
    },

    // Title Text Styling
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.title,
        flexWrap:'wrap',
    },

    // Artist Text Styling
    artist: {
        fontSize: 14,
        color: Colors.title,
    },

    // Play/Pause & Like Icons Section
    playIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.icon,
        gap: 30,
    },

    // Like Button Icon Color
    likeIcon: {
        color: Colors.icon,
    },

    // Active state for play icon
    activeIcon: {
        color: Colors.activeTitle,
    },
});


const darkStyles = StyleSheet.create({
    // Container for the entire Pressable item
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

    // Image of the Track
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },

    // Track Information: Title and Artist
    trackInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
    },

    // Title Text Styling
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.white, // Lighter text for the title in dark mode
    },

    // Artist Text Styling
    artist: {
        fontSize: 14,
        color: Colors.white, // Lighter text for artist in dark mode
    },
    // Play/Pause & Like Icons Section
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

