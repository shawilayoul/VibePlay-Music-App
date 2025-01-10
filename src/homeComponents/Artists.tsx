import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigations/StackNavigation';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';

type PlaylistscreenProp = StackNavigationProp<RootStackParamList, 'StackNavigation'>;

const artistbio = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Reef.jpg?alt=media&token=82bbac99-0887-4003-a70c-0c6fafdb3d73';
const Artists = () => {
  const navigation = useNavigation<PlaylistscreenProp>();
  const [artists, setArtists] = useState([]);

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const getPodcasts = async () => {
      try {
        const response = await axios.get('https://musicserver-uluy.onrender.com/artists');
        setArtists(response.data);
      } catch (error) {
        console.log('error getting podcasts', error);
      }
    };
    getPodcasts();
  }, []);

  const goToArtistsLists = (playlistId: string, playlistName: string) => {
    navigation.navigate('StackNavigation', {
      screen: 'ArtistTracksList',
      params: {
        playlistId,
        playlistName,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {artists.map(({ id, name, bio }) => (
          <TouchableOpacity
            key={id}
            style={styles.artistCard}
            onPress={() => goToArtistsLists(id, name)}
          >
            {bio ? <View style={styles.cardImageWrapper}>
              <Image source={{ uri: bio }} style={styles.artistImage} />
            </View> : <View style={styles.cardImageWrapper}>
              <Text style={styles.artistFirstLetter}>{name.charAt(0)}</Text>
              <Image source={{ uri: artistbio }} style={styles.artistImage} />
            </View>}
            <Text style={styles.artistName}>{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Artists;


const lightStyles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 25,
    backgroundColor: Colors.lightModeBg,
  },
  trendingScroll: {
    paddingHorizontal: 16,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
    width: 140,
    padding: 12,
    backgroundColor:Colors.white,
  },
  cardImageWrapper: {
    overflow: 'hidden',
    width: 130,
    height: 130,
    borderRadius: 65,
    elevation: 3,
    shadowColor: '#000',
    backgroundColor: Colors.activeTitle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  artistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
    resizeMode: 'cover',
    backgroundColor: Colors.activeTitle,
  },
  artistFirstLetter: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    maxWidth: 130,
    zIndex: 10,
  },
  artistName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    maxWidth: 130,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 25,
    backgroundColor: Colors.darkModeBg,
  },
  trendingScroll: {
    paddingHorizontal: 16,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 16,  // Spacing between artist cards
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
    width: 140,
    padding: 12,
    backgroundColor: '#333333',
  },
  cardImageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    width: 130,
    height: 130,
    borderRadius: 65,
    elevation: 5,  // Light shadow for the image container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    backgroundColor: Colors.ElectricBlue,
  },

  artistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65,  // Keeps image round inside the card
    resizeMode: 'cover',
    backgroundColor: Colors.ElectricBlue,
  },
  artistFirstLetter: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    maxWidth: 130,
    zIndex: 10,
  }
  ,
  artistName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    maxWidth: 130,
  },
});





