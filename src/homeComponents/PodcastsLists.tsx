import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import LoadingSpinner from '../components/LoadingSpinner';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigation';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { format } from 'date-fns';
import Icon4 from 'react-native-vector-icons/Entypo';
import { usePlayerContext } from '../store/trackPlayerContext';

import { Dimensions } from 'react-native';

// Get screen dimensions
const { height } = Dimensions.get('window');

const podcastImage = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Reef.jpg?alt=media&token=82bbac99-0887-4003-a70c-0c6fafdb3d73';

// Define breakpoints (you can adjust the value based on your needs)
const isSmallScreen = height < 750;
interface Episode {
  url: string;
  id: string;
  artist: string;
  title: string;
  description: string;
  duration: string;
  artwork: string;
  createdAt: Date,
}
interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PodcastsLists'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'PodcastsLists'>;

type RootStackParamListNav = {
  Podcasts: undefined;  // The screen you are navigating to
};
const PodcastsLists: React.FC<Props> = ({ route }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null);
  const { podcastId,
    podcastName, artwork } = route.params;

  const navigation = useNavigation<StackNavigationProp<RootStackParamListNav>>();

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const getPodcastEpisodes = async () => {
      try {
        const response = await axios.get(`https://musicserver-uluy.onrender.com/podcast/podcastEpisode/${podcastId}`);

        const sortedEpisodes = response.data.episodes.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setEpisodes(sortedEpisodes);
      } catch (error) {
        console.log('error getting user platlist', error);
      } finally {
        setLoading(false);
      }
    };
    getPodcastEpisodes();
  }, [podcastId]);

  const playEpisode = async (episode: Episode) => {
    if (playingEpisodeId === episode.id) {
      // Pause if the same episode is clicked
      await TrackPlayer.pause();
      setPlayingEpisodeId(null);
    } else {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: episode.id.toString(),
        url: episode.url,
        title: episode.title,
        artist: episode.artist,
        artwork: episode.artwork,
      });
      await TrackPlayer.play();
      setPlayingEpisodeId(episode.id);
    }
  };

  if (loading) {
    return <View style={styles.loading}>
      <LoadingSpinner />
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.playlistNameContainer}>
        <Icon4 name="chevron-left" size={35} style={styles.backIcon} onPress={() => navigation.navigate('Podcasts')} />
        <Text style={styles.header}>{podcastName}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.podcastImageCard}>
          <Image source={{ uri: artwork || podcastImage }} style={styles.podcastImage} />
        </View>
        <FlatList
          ListEmptyComponent={
            <View style={styles.notFound}>
              <Text style={styles.notFoundText}>Aucune Episode trouvée</Text>
            </View>
          }
          data={episodes}
          keyExtractor={episode => episode.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.episodeCard}>
              <Image source={{ uri: item.artwork || podcastImage }} style={styles.episodeImage} />
              <View style={styles.episodeDetails}>
                <Text style={styles.episodeTitle}>{item.title}</Text>
                <Text style={styles.episodeDuration}>{item.duration} minutes</Text>
                <Text style={styles.episodeDate}>{format(item.createdAt, 'MMMM d, yyyy h:mm a')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.playButton, playingEpisodeId === item.id && styles.activeButton]}
                onPress={() => playEpisode(item)}
                accessibilityLabel={playingEpisodeId === item.id ? `Pause ${item.title}` : `Play ${item.title}`}
                accessibilityHint={playingEpisodeId === item.id ? `Tap to pause the episode ${item.title}` : `Tap to play the episode ${item.title}`}
              >
                <Text style={styles.buttonText}>
                  {playingEpisodeId === item.id ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View >
  );
};

export default PodcastsLists;

// Light Mode Styles
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    color: Colors.black,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  notFoundText: {
    fontSize: 18,
    color: '#F02C1C', // Light gray color for text
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  backIcon: {
    color: Colors.icon,
  },
  playlistNameContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 5,
  },
  bottomContainer: {
    padding: 10,
  },
  podcastImageCard: {
    width: '100%',
    height: isSmallScreen ? 170 : 250,
    marginBottom: 16,
  },
  podcastImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderColor: '#dee2e6',
    borderWidth: 1,
    shadowColor: '#000',
    resizeMode: 'cover',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  podcastNameMiddle: {
    position: 'absolute',
    top: 50,
    left: 120,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex: 10,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  episodeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeDetails: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  episodeDuration: {
    fontSize: 14,
    color: '#6c757d',
  },
  episodeDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  playButton: {
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    backgroundColor: Colors.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: Colors.activeTitle,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  loading: {
    flex: 1,
  },
});

// Dark Mode Styles
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkModeBg, // Dark background color for dark mode
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  notFoundText: {
    fontSize: 18,
    color: '#FFFFF',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  backIcon: {
    color: Colors.white,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  playlistNameContainer: {
    backgroundColor: Colors.darkCardBg,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 5,
  },
  bottomContainer: {
    padding: 10,
  },
  podcastImageCard: {
    width: '100%',
    height: isSmallScreen ? 170 : 250,
    marginBottom: 16,
  },
  podcastImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderColor: '#1c1c1c',
    borderWidth: 1,
    shadowColor: '#000',
    resizeMode: 'cover',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },

  podcastNameMiddle: {
    position: 'absolute',
    top: 50,
    left: 120,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex: 10,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  episodeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeDetails: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  episodeDuration: {
    fontSize: 14,
    color: '#bbb',
  },
  episodeDate: {
    fontSize: 12,
    color: '#bbb',
  },
  playButton: {
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: Colors.icon,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  activeButton: {
    backgroundColor: Colors.activeTitle,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  loading: {
    flex: 1,
  },
});






