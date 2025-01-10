import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigations/StackNavigation';
import axios from 'axios';
import { usePlayerContext } from '../store/trackPlayerContext';
import { Colors } from '../constants/colors';

const podcastImage = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Reef.jpg?alt=media&token=82bbac99-0887-4003-a70c-0c6fafdb3d73';

type PlaylistscreenProp = StackNavigationProp<RootStackParamList, 'StackNavigation'>;


const Podcasts = () => {
  const navigation = useNavigation<PlaylistscreenProp>();
  const [podcasts, setPodcasts] = useState([]);

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const getPodcasts = async () => {
      try {
        const response = await axios.get('https://musicserver-uluy.onrender.com/podcast');
        setPodcasts(response.data);
      } catch (error) {
        console.log('error getting podcasts', error);
      }
    };
    getPodcasts();
  }, []);

  const goToplaylistDetain = (podcastId: string, podcastName: string, artwork: string) => {
    navigation.navigate('StackNavigation', {
      screen: 'PodcastsLists',
      params: {
        podcastId,
        podcastName,
        artwork,
      },
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        accessibilityLabel="Your podcast gallery" // Describes the whole scrollable area

      >
        {Array.isArray(podcasts) && podcasts.length > 0 ? (
          podcasts.map(({ title, artwork, id }) => (
            <TouchableOpacity
              key={id}
              onPress={() => goToplaylistDetain(id, title, artwork)}
              style={styles.cardWrapper}
              accessible={true}
              accessibilityLabel={`Open the podcast titled ${title}`}
              accessibilityHint={`Tap to view the details of ${title} podcast`}
            >
              {artwork ?
                <View style={styles.playlistCard}>
                  <Image source={{ uri: artwork }} style={styles.playlistImage} />
                </View> :
                <View style={styles.playlistCard}>
                  <Text style={styles.podcastNameMiddle}>{title}</Text>
                  <Image source={{ uri: podcastImage }} style={styles.playlistImage} />
                </View>
              }

              <Text style={styles.playlistName}>{title}</Text>
              <Text style={styles.cardSubTitle}>podcast</Text>

            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noPodcastsText}>No podcasts available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Podcasts;

const darkStyles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 25,
    backgroundColor: Colors.darkModeBg,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginRight: 16,
    flex: 1,
    justifyContent: 'center',
  },
  playlistCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 140,
    height: 160,
    elevation: 5,
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8, // Subtle shadow radius for smooth depth
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  playlistName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    maxWidth: 160,
    textTransform: 'capitalize',
  },
  podcastNameMiddle: {
    position:'absolute',
    top:50,
    left:30,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex:10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  noPodcastsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },

});

const lightStyles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 25,
    backgroundColor: Colors.lightModeBg,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginRight: 16,
    flex: 1,
    justifyContent: 'center',
  },
  playlistCard: {
    backgroundColor: '#000',
    borderRadius: 5,
    width: 140,
    height: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
    backgroundColor: '#000',
  },
  playlistName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
  },
  podcastNameMiddle: {
    position:'absolute',
    top:50,
    left:30,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex:10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  noPodcastsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
});


