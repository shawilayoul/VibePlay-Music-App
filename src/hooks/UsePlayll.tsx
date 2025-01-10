/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { Colors } from '../constants/colors';
import { Track, usePlayerContext } from '../store/trackPlayerContext';

interface Props {
  playing?: boolean;
  playAll: () => Promise<void>;
  songs: Track[]
}
const UsePlayll: React.FC<Props> = ({ playAll, playing = false, songs }) => {
  const total = songs ? songs.length : 0;

  const { isDarkMode } = usePlayerContext();

  const styles = isDarkMode ? darkStyles : lightStyles;
  return (
    <View style={styles.playAllContainer}>
      <Text style={styles.total}>{total} Tracks</Text>
      <TouchableOpacity style={[styles.playAllIcons, { padding: 8 }]}
        onPress={playAll}>
        {
          isDarkMode ? <>
            <Icon2
              name="random"
              size={30}
              color={playing ? Colors.ElectricBlue : Colors.white} />
            <Icon
              name={playing ? 'pause-circle' : 'play-circle'}
              size={40}
              color={playing ? Colors.ElectricBlue : Colors.white} /></> : <>
            <Icon2
              name="random"
              size={30}
              color={playing ? Colors.activeTitle : Colors.icon} />
            <Icon
              name={playing ? 'pause-circle' : 'play-circle'}
              size={40}
              color={playing ? Colors.activeTitle : Colors.icon} /></>
        }
      </TouchableOpacity>
    </View>
  );
};

export default UsePlayll;
const lightStyles = StyleSheet.create({
  playAllContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  total: {
    color: '#333',
    fontWeight: 'bold',
  }, iconsColor: {
    color: Colors.icon,
  },
  playAllIcons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

});

const darkStyles = StyleSheet.create({
  playAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  total: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  iconsColor: {
    color: Colors.white,
  },
  playAllIcons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

});
