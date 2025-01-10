import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import FavoritesTrackList from '../components/FavoritesTrackList';
import axios from 'axios';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import UsePlayll from '../hooks/UsePlayll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import UserSearchList from '../hooks/UserSearchList';

const FavoritesScreen = () => {
  const { playing } = useIsPlaying();
  const { favorites: favorite, setFavorites, isDarkMode } = usePlayerContext();
  const [searchText, setSearchText] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);

  const styles = isDarkMode ? darkStyles : lightStyles;
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
            'Authorization': `Bearer ${token}`,
          },
        });

        // Log the full response as JSON
        if (response.data && response.data.favorites) {
          const favorites = response.data.favorites;
          // Combine all track favorites into a single array
          const combinedTracks = [
            ...favorites.trackFavorites,
            ...favorites.playlistTrackFavorites,
            ...favorites.artistTrackFavorites,
            ...favorites.trendingTrackFavorites,
          ];

          // Log combined tracks
          setFavorites(combinedTracks);
          return combinedTracks;
        } else {
          console.error('No favorites data found:', response.data);
        }
      } catch (error) {
        console.error('Error fetching favorite tracks:', error);
        return []; // Return an empty array on error
      }
    };
    getUserFavoriteTracks();
  }, [favorite, setFavorites]);


  // play all
  const playAll = async () => {

    await TrackPlayer.reset();

    await TrackPlayer.add(favorite);
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  //search functionality
  const onChangeSearch = (text: React.SetStateAction<string>) => setSearchText(text);

  useEffect(() => {
    if (!searchText) { setFilteredTracks(favorite); }
    else {
      const filtered = favorite.filter((track) => track?.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
      setFilteredTracks(filtered);
    }
  }, [searchText, favorite]);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Play All Button and Info Section */}
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
        {/* Favorites Track List Section */}
        <FavoritesTrackList tracks={filteredTracks} />
      </View>
    </SafeAreaView>

  );
};

export default FavoritesScreen;

const lightStyles = StyleSheet.create({
  // Safe Area Container
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
  // Loading State Styles
  loading: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
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
    backgroundColor: Colors.darkModeBg,
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
  },
  // Loading State Styles
  loading: {
    flex: 1,
    backgroundColor: Colors.darkmodeBg,
  },
});

