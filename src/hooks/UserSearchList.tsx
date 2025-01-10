import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { usePlayerContext } from '../store/trackPlayerContext';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../constants/colors';

interface Props {
  searchText: string;
  placeholder: string;
  onChangeSearch: (text: string) => void;
}

const UserSearchList: React.FC<Props> = ({ searchText, onChangeSearch, placeholder }) => {
  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.searchContainer}>
      <Icon name="search1" size={24} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#fff' : '#000'}
        value={searchText}
        onChangeText={onChangeSearch}
      />
    </View>
  );
};

export default UserSearchList;

const lightStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12, // Increased padding for larger touch area
    backgroundColor: Colors.white,
    height: 65,
  },
  icon: {
    marginRight: 12,
    color: Colors.black,
    padding: 8,
  },
  input: {
    flex: 1,
    height: 50,
    padding: 8,
    color: Colors.black,
  },
});

const darkStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12, // Increased padding for larger touch area
    height: 65,
    backgroundColor: '#333',
  },
  icon: {
    marginRight: 12,
    color: Colors.white,
    padding: 8,
  },
  input: {
    flex: 1,
    color: Colors.white,
    height: 50,
    padding: 8,
  },
});
