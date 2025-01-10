import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigation';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { Colors } from '../constants/colors';
import UserSearchList from '../hooks/UserSearchList';
import { usePlayerContext } from '../store/trackPlayerContext';

type PlaylistscreenProp = StackNavigationProp<RootStackParamList, 'StackNavigation'>;
interface PlaylistType {
  id: string;
  title: string;
  description: string;
  artwork: string;
}

const podcastImage = 'https://firebasestorage.googleapis.com/v0/b/fjusongs.appspot.com/o/Reef.jpg?alt=media&token=82bbac99-0887-4003-a70c-0c6fafdb3d73';

const PodcastList: React.FC = () => {
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
        const response = await axios.get('https://musicserver-uluy.onrender.com/podcast');
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
      const filtered = playlists.filter((track) => track?.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
      setFilteredTracks(filtered);
    }
  }, [searchText, playlists]);

  const goToplaylistDetain = (podcastId: string, podcastName: string, artwork: string) => {
    navigation.navigate('PodcastsLists', {
      podcastId,
      podcastName,
      artwork,
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
        <UserSearchList
          searchText={searchText}
          onChangeSearch={onChangeSearch}
          placeholder="Rechercher par titre de podcast..."
        />
      </View>
      {/* FlatList for Displaying Playlists */}
      <FlatList
        style={styles.container}
        ListEmptyComponent={
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Aucune Playlist trouvée</Text>
          </View>
        }
        data={filteredTracks}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToplaylistDetain(item.id, item.title, item.artwork)}
            style={styles.playlistItem}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel={`Open the podcast titled ${item.title}`}
            accessibilityHint={`Tap to view the details of ${item.title} podcast`}
          >
            <View style={styles.itemContent}>
              {item?.artwork ?
                <>
                <Image
                  source={{ uri: item?.artwork || podcastImage }}
                  style={styles.playlistImage}
                  accessibilityLabel={`Artwork for ${item.title} podcast`} /></> :
                <>
                <Text style={styles.podcastNameMiddle}>{item.title}</Text>
                <Image
                  source={{ uri: item?.artwork || podcastImage}}
                  style={styles.playlistImage}
                  accessibilityLabel={`Artwork for ${item.title} podcast`} />
                  </>}

              <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};
export default PodcastList;

// Light Mode Styles
const lightStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightModeBg,
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  container: {
    marginHorizontal: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  notFoundText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 15,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  playlistImage: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 8,
    lineHeight: 18,
  },
  podcastNameMiddle: {
    position: 'absolute',
    top: 50,
    left: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loading: {
    flex: 1,
  },
});

// Dark Mode Styles
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
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  notFoundText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  playlistImage: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 8,
    lineHeight: 18,
  },
  podcastNameMiddle: {
    position: 'absolute',
    top: 50,
    left: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: 160,
    textTransform: 'capitalize',
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loading: {
    flex: 1,
  },
});



