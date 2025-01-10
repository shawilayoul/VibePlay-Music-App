import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import axios from 'axios';
import { Colors } from '../constants/colors';

const trendImage = 'https://firebasestorage.googleapis.com/v0/b/sleekstyle-98723.appspot.com/o/Logo_FJU.jpg?alt=media&token=b498e1fc-56e4-440a-92ea-ed6f39d2f859';
const TrendingSongs = () => {

  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const getTrendingSongs = async () => {
      try {
        const response = await axios.get('https://musicserver-uluy.onrender.com/trending-track');
        const sorteTrendingTrack = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTrendingSongs(sorteTrendingTrack);
      } catch (error) {
        console.log('error getting trending tracks', error);
      }
    };
    getTrendingSongs();
  }, []);

  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueuedId } = usePlayerContext();
  const { playing } = useIsPlaying();

  type TrackHandler = (id: string, track: Track) => Promise<void>;
  const handleTrack: TrackHandler = async (id, selectedTrack) => {
    const trackIndex = trendingSongs.findIndex((track) => track.url === selectedTrack.url);
    if (trackIndex === -1) { return; }

    const isChangingQueue = id !== activeQueueId;

    if (isChangingQueue) {
      const beforeTrack = trendingSongs.slice(0, trackIndex);
      const afterTrack = trendingSongs.slice(trackIndex + 1);

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

      const nextTrackIndex = trackIndex - queueOffset.current < 0 ? trendingSongs.length + trackIndex - queueOffset.current
        : trackIndex - queueOffset.current;
      await TrackPlayer.skip(nextTrackIndex);
      if (playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {Array.isArray(trendingSongs) && trendingSongs.length > 0 ? (
          trendingSongs.map((song) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songCard}
              onPress={() => handleTrack(song?.id, song)}
            >
              <View style={styles.songImageWrapper}>
                <Image
                  source={{ uri: song.artwork || trendImage }}
                  style={styles.songImage}
                />
              </View>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songArtist}>{song.artist}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noSongsText}>No trending songs available.</Text>
        )}
      </ScrollView>
    </View>

  );
};

export default TrendingSongs;


const lightStyles = StyleSheet.create({
  container: {
    marginBottom: 25,
    paddingHorizontal: 15,
    backgroundColor:Colors.lightModeBg,
  },
  trendingScroll: {
    paddingBottom: 10,
  },
  songCard: {
    marginRight: 5,
    borderRadius: 12,
    width: 120,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  songImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  songImage: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    resizeMode: 'cover',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.cardTitle,
    textAlign: 'center',
    marginTop: 10, // Spacing between image and title
    maxWidth: 120,
  },
  songArtist: {
    fontSize: 12,
    color: Colors.cardSubTitle,
    textAlign: 'center',
  },
  noSongsText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});



const darkStyles = StyleSheet.create({
  container: {
    marginBottom: 25,
    paddingHorizontal: 15,
    backgroundColor:Colors.darkModeBg,
  },
  trendingScroll: {
    paddingBottom: 10,
  },
  songCard: {
    marginRight: 5,
    borderRadius: 12,
    width: 120,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  songImageWrapper: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 90,
    height: 90,
    borderRadius: 60,
    overflow: 'hidden',
  },
  songImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 120,
  },
  songArtist: {
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
  },
  noSongsText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    backgroundColor:Colors.darkModeBg,
  },
});





