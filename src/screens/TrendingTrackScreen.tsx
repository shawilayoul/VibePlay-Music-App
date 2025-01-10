import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import axios from 'axios';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import UsePlayll from '../hooks/UsePlayll';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors } from '../constants/colors';
import TrendingSongsList from '../homeComponents/TrendingSongsList';

const TrendingTrackScreen = () => {
    const [loading, setLoading] = useState(true);

    const { playing } = useIsPlaying();
    const [tracks, setTracks] = useState<Track[]>([]);

    const { isDarkMode } = usePlayerContext();

    const styles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        const getUserPlaylist = async () => {
            try {
                const response = await axios.get('https://musicserver-uluy.onrender.com/trending-track');
                const sorteTrendingTrack = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTracks(sorteTrendingTrack);
            } catch (error) {
                console.log('error getting tracks', error);
            } finally {
                setLoading(false);
            }
        };
        getUserPlaylist();
    }, []);

    // play all
    const playAll = async () => {

        await TrackPlayer.reset();

        await TrackPlayer.add(tracks);
        if (playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };



    if (loading) {
        return <View style={styles.loading}>
            <LoadingSpinner />
        </View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <UsePlayll playAll={playAll} playing={playing} songs={tracks} />
            <View style={styles.playAllCart}>
                <TrendingSongsList tracks={tracks} />
            </View>
        </SafeAreaView>
    );
};

export default TrendingTrackScreen;
// Assuming your color constants are in a Colors.js file

const lightStyles = StyleSheet.create({
  // Safe Area Container
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
    paddingTop: 5,
    paddingHorizontal: 10,
  },

  playAllCart: {
    marginBottom: 40,
  },

  loading: {
    flex: 1,
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkModeBg,
    paddingTop: 5,
    paddingHorizontal: 10,
  },

  playAllCart: {
    marginBottom: 40,
  },

  playAll: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: Colors.darkCardBg,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loading: {
    flex: 1,
  },
});


