import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigation';
import axios from 'axios';
import { playlistImage } from '../assests/data/track';
import LoadingSpinner from './LoadingSpinner';
import { Colors } from '../constants/colors';
import UserSearchList from '../hooks/UserSearchList';
import { usePlayerContext } from '../store/trackPlayerContext';

type PlaylistscreenProp = StackNavigationProp<RootStackParamList, 'StackNavigation'>;
interface PlaylistType {
  id: string;
  name: string;
  description: string;
  bio: string;
}
const ArtistsLists: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<PlaylistType[]>([]);
  const navigation = useNavigation<PlaylistscreenProp>();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylist] = useState<PlaylistType[]>([]);

  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;
  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const response = await axios.get('https://musicserver-uluy.onrender.com/artists');
        setPlaylist(response.data);
      } catch (error) {
        console.log('error getting user platlist', error);
      } finally {
        setLoading(false);
      }
    };
    getUserPlaylist();
  }, []);

  const onChangeSearch = (text: React.SetStateAction<string>) => setSearchText(text);

  useEffect(() => {
    if (!searchText) { setFilteredTracks(playlists); }
    else {
      const filtered = playlists.filter((track) => track?.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
      setFilteredTracks(filtered);
    }
  }, [searchText, playlists]);

  const goToplaylistDetain = (playlistId: string, playlistName: string) => {
    navigation.navigate('StackNavigation', {
      screen: 'ArtistTracksList',
      params: {
        playlistId,
        playlistName,
      },
    });
  };
  if (loading) {
    return <View style={styles.loading}>
      <LoadingSpinner />
    </View>;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <UserSearchList searchText={searchText} onChangeSearch={onChangeSearch} placeholder="Recherche par nom d'artiste ...." />
      </View>
      <FlatList
        style={styles.container}
        ListEmptyComponent={
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>No Artist Found</Text>
          </View>
        }
        data={filteredTracks}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToplaylistDetain(item.id, item.name)}
            style={styles.playlistItem}
            activeOpacity={0.7}
          >
            {item?.bio ?
              <View style={styles.itemContent}>
                <Image source={{ uri: item?.bio }} style={styles.playlistImage} />
                <Text style={styles.playlistTitle}>{item.name}</Text>
              </View> :
              <View style={styles.itemContent}>
                <Text style={styles.artistFirstLetter}>{item.name.charAt(0)}</Text>
                <Image source={{ uri: playlistImage }} style={styles.playlistImage} />
                <Text style={styles.playlistTitle}>{item.name}</Text>
              </View>}

          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};
export default ArtistsLists;


const lightStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,  // Light background for the app
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 10,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    marginBottom: 5,
  },

  itemContent: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  artistFirstLetter: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    maxWidth: 130,
    zIndex: 10,
  },

  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
  },

  contentContainer: {
    paddingBottom: 16,
  },

  loading: {
    flex: 1,
  },
});

const darkStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkModeBg,
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 10,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notFoundText: {
    fontSize: 18,
    color: '#bbb',  // Light gray text for dark mode empty state
    fontWeight: 'bold',
  },

  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    marginBottom: 5,
  },

  itemContent: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',  // Center items vertically
    alignItems: 'center',
  },

  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  artistFirstLetter: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    maxWidth: 130,
    zIndex: 10,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  contentContainer: {
    paddingBottom: 16,
  },
  loading: {
    flex: 1,
  },
});




