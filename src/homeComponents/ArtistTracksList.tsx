import React, { useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/StackNavigation';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import { Colors } from '../constants/colors';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import axios from 'axios';
import UsePlayll from '../hooks/UsePlayll';
import LoadingSpinner from '../components/LoadingSpinner';
import ArtistTrackslistItems from './ArtistTrackslistItems';
import Icon4 from 'react-native-vector-icons/Entypo';


type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistsDetailsScreen'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlaylistsDetailsScreen'>;

type DetailsScreenProps = {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
};
type RootStackParamListNav = {
  ArtistsLists: undefined;  // The screen you are navigating to
};

const ArtistTracksList: React.FC<DetailsScreenProps> = ({ route }) => {
  const { playing } = useIsPlaying();

  const navigation = useNavigation<StackNavigationProp<RootStackParamListNav>>();

  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueuedId } = usePlayerContext();
  const [tracks, setAllSongs] = useState<Track[]>([]);
  const { playlistId, playlistName } = route.params;

  const { isDarkMode } = usePlayerContext();

  const styles = isDarkMode ? darkStyles : lightStyles;
  const [loading, setLoading] = useState(true);
  //search functionality

  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const response = await axios.get(`https://musicserver-uluy.onrender.com/artists/artistTracks/${playlistId}`);
        setAllSongs(response.data.artistTracks);
      } catch (error) {
        console.log('error getting user platlist', error);
      } finally {
        setLoading(false);
      }
    };
    getUserPlaylist();

  }, [playlistId]);

  //play lll
  const playAll = async () => {

    await TrackPlayer.reset();

    await TrackPlayer.add(tracks);
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  type TrackHandler = (id: string, track: Track) => Promise<void>;
  const handleTrack: TrackHandler = async (id: string, selectedTrack: Track) => {
    const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url);
    if (trackIndex === -1) { return; }

    const isChangingQueue = id !== activeQueueId;

    if (isChangingQueue) {
      const beforeTrack = tracks.slice(0, trackIndex);
      const afterTrack = tracks.slice(trackIndex + 1);

      await TrackPlayer.reset();

      await TrackPlayer.add(selectedTrack);
      await TrackPlayer.add(afterTrack);
      await TrackPlayer.add(beforeTrack);
      if (playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }

      queueOffset.current = trackIndex;
      setActiveQueuedId(id);

    } else {

      const nextTrackIndex = trackIndex - queueOffset.current < 0 ? tracks.length + trackIndex - queueOffset.current
        : trackIndex - queueOffset.current;
      await TrackPlayer.skip(nextTrackIndex);
      if (playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }

    }
  };

  if (loading) {
    return <View style={styles.loading}>
      <LoadingSpinner />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playlistNameContainer}>
        <Icon4 name="chevron-left" size={35} style={styles.backIcon} onPress={() => navigation.navigate('ArtistsLists')} />
        <Text style={styles.playlistName}>{playlistName}</Text>
      </View>

      <View style={styles.playlistItemsContainer}>
        <UsePlayll playAll={playAll} playing={playing} songs={tracks} />

        <FlatList
          ListEmptyComponent={
            <View style={styles.notFound}>
              <Text style={styles.emptyStateText}>No songs Found</Text>
            </View>
          }
          data={tracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: track }) => (<ArtistTrackslistItems track={track} selectedTrack={handleTrack} />)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ArtistTracksList;

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
  },
  backIcon: {
    color: '#0a2472',
  },

  playlistNameContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    height:65,
  },

  playlistName: {
    color: Colors.icon,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    paddingVertical: 5,
    textTransform: 'capitalize',
  },

  playlistItemsContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },

  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  emptyStateText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  loading: {
    flex: 1,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkModeBg,
  },

  backIcon: {
    color: Colors.white,
  },
  playlistNameContainer: {
    backgroundColor: '#333',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 5,
    height:65,
  },

  playlistName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
    padding: 10,
    textTransform: 'capitalize',
  },

  playlistItemsContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },

  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  emptyStateText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  loading: {
    flex: 1,
  },
});

