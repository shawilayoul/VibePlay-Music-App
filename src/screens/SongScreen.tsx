import React, { useEffect, useState } from 'react';
import TrackList from '../components/TrackList';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import axios from 'axios';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import UsePlayll from '../hooks/UsePlayll';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors } from '../constants/colors';
import UserSearchList from '../hooks/UserSearchList';


const SongsScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    const { playing } = useIsPlaying();
    const [tracks, setTracks] = useState<Track[]>([]);

    const {
        isDarkMode } = usePlayerContext();

    const styles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        const getUserPlaylist = async () => {
            try {
                const response = await axios.get('https://musicserver-uluy.onrender.com/track');
                const sorteTrack = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTracks(sorteTrack);
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

    const onChangeSearch = (text: React.SetStateAction<string>) => setSearchText(text);

    useEffect(() => {
        if (!searchText) { setFilteredTracks(tracks); }
        else {
            const filtered = tracks.filter((track) => track?.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
            setFilteredTracks(filtered);
        }
    }, [searchText, tracks]);

    if (loading) {
        return <View style={styles.loading}>
            <LoadingSpinner />
        </View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Play All Button / Cart */}
            <View style={styles.topContianer}>
                {/* Search Bar */}
                <UserSearchList
                    searchText={searchText}
                    onChangeSearch={onChangeSearch}
                    placeholder="Rechercher par titre de chanson..."
                />
            </View>
            <View style={styles.bottomContainer}>
                <UsePlayll
                    playAll={playAll}
                    playing={playing}
                    songs={filteredTracks}
                />
                {/* Track List Section */}
                <TrackList tracks={filteredTracks} />
            </View>
        </SafeAreaView>

    );
};

export default SongsScreen;
const lightStyles = StyleSheet.create({
    // Safe Area Container
    safeArea: {
        flex: 1,
        backgroundColor: Colors.lightModeBg,
        width: '100%',
    },
    topContianer: {
        backgroundColor: Colors.lightModeBg,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: Colors.lightModeBg,
        paddingTop: 5,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '100%',
    },

    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 15,
    },
    // Loading State Styles
    loading: {
        flex: 1,
        backgroundColor: Colors.lightModeBg,
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
        color: '#0a2472',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    searchExpanded: {
        width: '100%', // Make search bar take full width when expanded
    },
});

const darkStyles = StyleSheet.create({
    // Safe Area Container
    safeArea: {
        flex: 1,
        backgroundColor: Colors.darkmodeBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    topContianer: {
        backgroundColor:Colors.darkModeBg,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: Colors.darkModeBg,
        paddingTop: 5,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '100%',
    },

    title: {
        fontSize: 18,
        color: '#FFFF',
        fontWeight: 'bold',
        marginLeft: 15,
    },
    // Loading State Styles
    loading: {
        flex: 1,
        backgroundColor: Colors.darkmodeBg,
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




