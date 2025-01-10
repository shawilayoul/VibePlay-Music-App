import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/StackNavigation';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import { Colors } from '../constants/colors';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import PlaylistTracklistItem from './PlaylistTracklistItem';
import axios from 'axios';
import UsePlayll from '../hooks/UsePlayll';
import LoadingSpinner from './LoadingSpinner';
import Icon4 from 'react-native-vector-icons/Entypo';

type PlaylistsDetailsScreenProps = StackScreenProps<RootStackParamList, 'PlaylistsDetailsScreen'>;
type RootStackParamListNav = {
  Home: undefined;  // The screen you are navigating to
};

const PlaylistsDetailsScreen: React.FC<PlaylistsDetailsScreenProps> = ({ route }) => {
  const { playing } = useIsPlaying();
  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueuedId } = usePlayerContext();
  const [tracks, setAllSongs] = useState<Track[]>([]);
  const { playlistId, playlistName } = route.params;

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamListNav>>();

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;


  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const response = await axios.get(`https://musicserver-uluy.onrender.com/playlist/listTracks/${playlistId}`);
        const sortplaylistTracks = response.data.playlistTracks.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllSongs(sortplaylistTracks);
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
  const handleTrack: TrackHandler = async (id, selectedTrack) => {
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
  if (!tracks || !Array.isArray(tracks)) {
    return <Text> no tracks available</Text>; // Handle empty or undefined data
  }
  return (
    <View style={styles.container}>
      <View style={styles.playlistNameContainer}>
        <Icon4 name="chevron-left" size={35} style={styles.backIcon} onPress={() => navigation.navigate('Home')} />
        <Text style={styles.playlistName}>{playlistName}</Text>
      </View>
      <View style={styles.playlistItemsContainer}>
        <UsePlayll playAll={playAll} playing={playing} songs={tracks} />
        <FlatList
          ListEmptyComponent={
            <View style={styles.notFound}>
              <Text style={styles.notFoundText}>No songs found</Text>
            </View>
          }
          data={tracks || []}
          keyExtractor={item => item?.id ? item?.id.toString() : Math.random().toString()}
          renderItem={({ item: track }) =>
            track ? <PlaylistTracklistItem track={track} selectedTrack={handleTrack} /> : null
          }
        />
      </View>
    </View>
  );
};

export default PlaylistsDetailsScreen;

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
  },
  playlistNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: Colors.white,
    height:65,
  },
  backIcon: {
    color: Colors.black,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 8,
  },
  playlistItemsContainer: {
    paddingHorizontal: 10,
  },
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#000',
  },
  loading: {
    flex: 1,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkModeBg, // Dark background color
  },
  playlistNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: Colors.darkCardBg,
    height:65,
  },
  backIcon: {
    color: Colors.white,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 8,
  },
  playlistItemsContainer: {
    paddingHorizontal: 10,
  },
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#fff',
  },
  loading: {
    flex: 1,
  },
});



