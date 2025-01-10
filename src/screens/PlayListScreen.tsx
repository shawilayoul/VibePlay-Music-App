import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, FlatList, TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/StackNavigation';
import { playlistImage } from '../assests/data/track';
import LoadingSpinner from '../components/LoadingSpinner';
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
const PlayListScreen: React.FC = () => {
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
        const response = await axios.get('https://musicserver-uluy.onrender.com/playlist');
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

  const goToplaylistDetain = (playlistId: string, playlistName: string) => {
    navigation.navigate('StackNavigation', {
      screen: 'PlaylistsDetailsScreen',
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
        <UserSearchList
          searchText={searchText}
          onChangeSearch={onChangeSearch}
          placeholder="Rechercher par titre de playlist..."
        />
      </View>
      {/* FlatList for Displaying Playlists */}
      <FlatList
        ListEmptyComponent={
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Aucune Playlist trouvée</Text>
          </View>
        }
        data={filteredTracks}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
        numColumns={2} // Display items in two columns
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToplaylistDetain(item.id, item.title)}
            style={styles.playlistItem}
            activeOpacity={0.8} // Increased touch feedback
          >
            {item?.artwork ?
            <View style={styles.itemContent}>
              <Image
                source={{ uri: item?.artwork }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View> : <View style={styles.itemContent}>
              <Text style={styles.cardTitleColor}>{item.title}</Text>
              <Image
                source={{ uri: playlistImage }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};
export default PlayListScreen;

const lightStyles = StyleSheet.create({
  // Safe Area Container for light mode
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightModeBg, // Light mode background
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  // Empty State for No Data
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  notFoundText: {
    fontSize: 18,
    color: '#000', // Light gray color for empty state
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  // Playlist Item Styling
  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000', // Shadow for light mode
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 15,
  },

  // Item Content Styling
  itemContent: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },

  cardTitleColor: {
    position: 'absolute',
    top: 50,
    left: 35,
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    zIndex: 20,
  },
  // Playlist Image Styling
  playlistImage: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    resizeMode: 'cover',
  },

  // Playlist Title Styling
  playlistTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333', // Dark text for title in light mode
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 8,
    lineHeight: 18,
  },

  // Content Container Styling
  contentContainer: {
    paddingBottom: 20,
  },

  loading: {
    flex: 1,
  },
});

const darkStyles = StyleSheet.create({
  // Safe Area Container for dark mode
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkmodeBg, // Dark background
  },

  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },

  // Playlist Item Styling
  playlistItem: {
    flex: 1,
    margin: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 15,
  },

  // Item Content Styling
  itemContent: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardTitleColor: {
    position: 'absolute',
    top: 50,
    left: 30,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    maxWidth: 140,
    lineHeight: 18,
    padding: 10,
    zIndex: 20,
  },

  // Playlist Image Styling
  playlistImage: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: Colors.ElectricBlue,
  },

  // Playlist Title Styling
  playlistTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 8,
    lineHeight: 18,
  },
  // Empty State for No Data
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

  // Content Container Styling
  contentContainer: {
    paddingBottom: 20,
  },

  loading: {
    flex: 1,
  },
});


