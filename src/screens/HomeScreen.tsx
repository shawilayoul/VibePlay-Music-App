import React, { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import MusicPlaylists from '../homeComponents/MusicPlaylists';
import TrendingSongs from '../homeComponents/TrendingSongs';
import Podcasts from '../homeComponents/Podcasts';
import Artists from '../homeComponents/Artists';
import Icon from 'react-native-vector-icons/Entypo';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { usePlayerContext } from '../store/trackPlayerContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/colors';

type RootStackParamList = {
  PlayList: undefined;  // The screen you are navigating to
  ArtistsLists: undefined;
  Podcasts: undefined;
  TrendingTrack: undefined;
};

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        await axios.get('https://musicserver-uluy.onrender.com/artists');

      } catch (error) {
        console.log('this is coming from home page', error);
      } finally {
        setLoading(false);
      }
    };
    getUserPlaylist();
  }, []);

  if (loading) {
    return <View style={styles.loading}>
      <LoadingSpinner />
    </View>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Playlists Section */}
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.headerIcon, { paddingVertical: 12, paddingHorizontal: 5 }]}  // Adds padding to increase touch target size
          onPress={() => navigation.navigate('PlayList')}
          aria-label="Voir plus de playlists"
        >
          <Text style={styles.seeMoreText}>Voir plus</Text>
          <Icon name="chevron-right" size={25} style={styles.seeMoreIcon} />
        </TouchableOpacity>
      </View>
      <MusicPlaylists />

      {/* Artists Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Artistes</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.headerIcon, { paddingVertical: 12, paddingHorizontal: 5 }]}  // Adds padding to increase touch target size
          onPress={() => navigation.navigate('ArtistsLists')}
          aria-label="Voir plus d'artistes"
        >
          <Text style={styles.seeMoreText}>Voir plus</Text>
          <Icon name="chevron-right" size={25} style={styles.seeMoreIcon} />
        </TouchableOpacity>
      </View>
      <Artists />

      {/* Podcasts Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Podcasts</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.headerIcon, { paddingVertical: 12, paddingHorizontal: 5 }]}  // Adds padding to increase touch target size
          onPress={() => navigation.navigate('Podcasts')}
          aria-label="Voir plus de podcasts"
        >
          <Text style={styles.seeMoreText}>Voir plus</Text>
          <Icon name="chevron-right" size={25} style={styles.seeMoreIcon} />
        </TouchableOpacity>
      </View>
      <Podcasts />

      {/* Trending Music Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Musique tendance</Text>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.headerIcon, { paddingVertical: 12, paddingHorizontal: 5 }]}  // Adds padding to increase touch target size
          onPress={() => navigation.navigate('TrendingTrack')}
          aria-label="Voir plus de musique tendance"
        >
          <Text style={styles.seeMoreText}>Voir plus</Text>
          <Icon name="chevron-right" size={25} style={styles.seeMoreIcon} />
        </TouchableOpacity>
      </View>
      <TrendingSongs />
    </ScrollView>

  );
};

export default HomeScreen;

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
    paddingTop: 15,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1D',
    letterSpacing: 0.5,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom:10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1D',
    letterSpacing: 0.5,
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '500',
    marginRight: 5,
  },
  seeMoreIcon: {
    color: '#003366',
  },
  loading: {
    flex: 1,
  },
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkModeBg,
    paddingTop: 15,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    paddingBottom: 10,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E0E0E0',
    letterSpacing: 0.5,
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  seeMoreText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
    marginRight: 10,
  },
  seeMoreIcon: {
    color: '#B0B0B0',
  },
  loading: {
    flex: 1,
  },

  activeText: {
    color: '#FF4081',
  },
  activeIcon: {
    color: '#FF4081',
  },
});


