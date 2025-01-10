import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigation';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';

type PlaylistscreenProp = StackNavigationProp<RootStackParamList, 'StackNavigation'>;

interface PlaylistType {
  id: string;
  title: string;
  description: string;
  artwork: string;
}

const MusicPlaylists = () => {
  const [userPlaylist, setUserPlaylist] = useState<PlaylistType[]>([]);
  const navigation = useNavigation<PlaylistscreenProp>();
  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  const playlistImage = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Reef.jpg?alt=media&token=82bbac99-0887-4003-a70c-0c6fafdb3d73';
  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const response = await axios.get('https://musicserver-uluy.onrender.com/playlist');
        setUserPlaylist(response.data);
      } catch (error) {
        console.log('error getting user platlist', error);
      }
    };
    getUserPlaylist();
  }, []);

  const goToplaylistDetain = (playlistId: string, playlistName: string) => {
    navigation.navigate('StackNavigation', {
      screen: 'PlaylistsDetailsScreen',
      params: {
        playlistId,
        playlistName,
      },
    });
  };
  return (
    <View style={styles.cardContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        accessibilityLabel="Your playlist gallery" // Describes the whole scrollable area
      >
        {userPlaylist.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            onPress={() => goToplaylistDetain(playlist.id, playlist.title)}
            style={styles.playlistCard}
            accessible={true} // Ensures the TouchableOpacity is accessible
            accessibilityLabel={`Open the playlist titled ${playlist.title}`} // More action-specific label
            accessibilityHint={`Tap to view the details of ${playlist.title} playlist`} // Extra information
          >
            {playlist.artwork ?
              <View style={styles.card}>
                <Image source={{ uri: playlist.artwork}} style={styles.cardImage}
                  accessible={true}
                  accessibilityLabel={`Artwork for ${playlist.title} playlist`} // Describes the image
                />
              </View> :
              <View style={styles.card}>
                <Text style={styles.cardTitleColor}>{playlist.title}</Text>
                <Image source={{ uri: playlistImage }} style={styles.cardImage}
                  accessible={true}
                  accessibilityLabel={`Artwork for ${playlist.title} playlist`} // Describes the image
                />
              </View>
            }
            <Text style={styles.cardTitle}>{playlist.title}</Text>
            <Text style={styles.cardSubTitle}>playlist</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MusicPlaylists;

const lightStyles = StyleSheet.create({
  cardContainer: {
    marginBottom: 25,
    paddingHorizontal: 15,
    backgroundColor: Colors.lightModeBg,
  },
  horizontalScroll: {
    paddingBottom: 10,
  },
  playlistCard: {
    marginRight: 16,
    borderRadius: 5,
  },
  card: {
    position: 'relative',
    width: 140,
    borderRadius: 5,
    height: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  cardImage: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTitleColor: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    padding: 10,
    zIndex: 20,
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.cardTitle,
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    padding: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: Colors.cardSubTitle,
    fontWeight: '500',
    padding: 10,
    marginTop: -16,
  },
});


const darkStyles = StyleSheet.create({
  cardContainer: {
    marginBottom: 25,
    paddingHorizontal: 15,
    backgroundColor: Colors.darkModeBg,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  playlistCard: {
    marginRight: 15,
    borderRadius: 5,
  },
  card: {
    width: 140,
    height: 160,
    position: 'relative',
    backgroundColor: Colors.ElectricBlue,  // Light blue background for better contrast, '#b0c4de',
    borderRadius: 5,
  },
  cardImage: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTitleColor: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    padding: 10,
    zIndex: 20,
  },
  cardTitle: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    padding: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    padding: 10,
    marginTop: -16,
  },
});


