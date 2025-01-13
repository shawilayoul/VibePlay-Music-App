/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, SafeAreaView, Animated } from 'react-native';
import TrackPlayer, { Event, State, useActiveTrack, useIsPlaying, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { imageUrl } from '../assests/data/track';
import { Colors } from '../constants/colors';
import CircularProgress from './CircularProgress';
import Slider from '@react-native-community/slider';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { usePlayerContext } from '../store/trackPlayerContext';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

import { Dimensions } from 'react-native';

// Get screen dimensions
const { height } = Dimensions.get('window');

// Define breakpoints (you can adjust the value based on your needs)
const isSmallScreen = height < 750;
const FloadPlayer: React.FC = () => {
  // const [progress, setProgress] = useState(0);
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  const [isOpen, setIsOpen] = useState(true);
  // const navigation = useNavigation<FloadPlayerProp>();
  const { position, duration } = useProgress();
  const progressCircle = duration ? (position / duration) * 100 : 0; // Avoid division by zero
  const progress = useProgress();

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const { isDarkMode } = usePlayerContext();
  const styles = isDarkMode ? darkStyles : lightStyles;


  const [presse, setPressed] = useState(false); // State to handle button press effect

  const handlePressIn = () => {
    setPressed(true); // Set pressed state to true on button press
  };

  const handlePressOut = () => {
    setPressed(false); // Reset pressed state on button release
  };
  useEffect(() => {
    if (isOpen) {
      // Fade in and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out and slide down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, isOpen, slideAnim]);

  //formatime to display the progress par
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const [lastAdTime, setLastAdTime] = useState<number | null>(null); // Track time of last ad
  const [manualSkip, setManualSkip] = useState(false); // Track if the skip is manual
  const [manualSkipCount, setManualSkipCount] = useState(0);
  const [songCount, setSongCount] = useState(0);
  const [isAdReady, setIsAdReady] = useState(false);
  const [adShownAt, setAdShownAt] = useState<number | null>(null); // Track last song count when ad was shown
  const interstitial = React.useMemo(() => InterstitialAd.createForAdRequest('ca-app-pub-7786160325545043/5905583358'), []); //ca-app-pub-7786160325545043/5905583358

  // Load the interstitial ad and set up listeners
  useEffect(() => {
    if (!isAdReady) {
      interstitial.load(); // Load the ad if it's not ready
    }

    const loadAdListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial Ad Loaded');
      setIsAdReady(true);
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial Ad Load Error:', error);
      setIsAdReady(false); // Reset ad state on error
    });

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, async () => {
      console.log('Interstitial Ad Closed');
      setIsAdReady(false);
      interstitial.load(); // Load a new ad for the next time
      await TrackPlayer.play();  // Resume music when the ad is closed
    });


    return () => {
      loadAdListener();
      errorListener();
      closedListener();
    };
  }, [isAdReady, interstitial]);

  // Toggle playback between play and pause
  const togglePlayback = async () => {
    const currentState = (await TrackPlayer.getPlaybackState()).state;
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }

  };


  // Show the interstitial ad
  const showInterstitialAd = async () => {
    if (isAdReady) {
      await TrackPlayer.pause(); // Pause the music when the ad is shown
      await interstitial.show();
      console.log('Showing interstitial ad...');
      setAdShownAt(songCount); // Mark the ad shown for automatic tracking
      setLastAdTime(Date.now()); // Track the time when the ad is shown
    } else {
      console.log('Interstitial ad is not ready yet');
    }
  };


  // Function to check and show ad based on 15-minute logic
  const checkAdAfter15Minutes = () => {
    if (lastAdTime) {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - lastAdTime) / 1000 / 60; // Elapsed time in minutes
      console.log(`Elapsed time: ${elapsedTime} minutes`);

      if (elapsedTime >= 10 && isAdReady) {
        console.log('10 minutes elapsed, showing ad');
        showInterstitialAd();
      }
    }
  };

  const incrementSongCountAndShowAd = (isAutomatic: boolean) => {
    console.log(`Increment song count. Is automatic? ${isAutomatic}`);

    if (isAutomatic && isAdReady) {
      // Automatic track change: Increment song count and show ads for automatic track changes
      setSongCount((prevCount) => {
        const newCount = prevCount + 1; // Increment song count for automatic change
        console.log(`Song count updated to: ${newCount}`);

        // Show ad every 5 automatic track changes (if not shown already at this count)
        if (newCount % 4 === 0 && newCount !== adShownAt) {
          console.log('Ad should be shown after 4 automatic changes');
          showInterstitialAd(); // Show the ad
        }

        return newCount; // Update song count
      });
    } else if (!isAutomatic) {
      // Manual skip logic
      setManualSkipCount((prevCount) => {
        let newManualSkipCount = prevCount + 1; // Increment manual skip count

        console.log(`Manual skip count updated to: ${newManualSkipCount}`);

        // If user skips 15 tracks manually, show the ad
        if (newManualSkipCount >= 8) {
          console.log('Manual skip limit reached, showing ad', manualSkipCount);
          showInterstitialAd(); // Show ad after 15 manual skips
          setManualSkipCount(0); // Reset manual skip count after showing ad
        }

        // Do not increment song count for manual skips
        return newManualSkipCount;
      });
    }
  };

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.log('PlaybackActiveTrackChanged event triggered');

      // Check if this is a manual skip or automatic
      if (manualSkip) {
        console.log('Manual skip detected. Skipping song count increment and ad logic.');
        setManualSkip(false); // Reset the manual skip flag
      } else {
        console.log('Automatic track change');
        incrementSongCountAndShowAd(true); // Automatic track change
      }
      checkAdAfter15Minutes();
    }
  });


  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext(); // Skip to next track
      console.log('Manual skip to next track');
      setManualSkip(true); // Set flag to indicate manual skip
      incrementSongCountAndShowAd(false); // Increment count and check for manual skip logic
    } catch (error) {
      console.log('No next track available', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious(); // Skip to previous track
      console.log('Manual skip to previous track');
      setManualSkip(true); // Set flag to indicate manual skip
      incrementSongCountAndShowAd(false); // Increment count and check for manual skip logic
    } catch (error) {
      console.log('No previous track available', error);
    }
  };


  // Default duration and position values
  const currentDuration = progress.duration > 0 ? progress.duration : 1; // Avoids division by zero
  const currentPosition = progress.position > 0 ? progress.position : 0;
  // Use Math.max to avoid negative values
  const remainingTime = Math.max(0, currentDuration - currentPosition);
  if (!activeTrack) {
    return null; // Ensure you return null if there is no active track
  }
  return (
    <View>
      {
        isOpen ? (
          <Animated.View
            style={[
              styles.fullScreenContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Icon4
              name="keyboard-arrow-down"
              size={50}
              onPress={() => setIsOpen(!isOpen)}
              style={[styles.closeIconContainer, { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }]}  // Increase touch target size
              accessibilityLabel="Close details"  // Clear label for the close icon
              accessibilityHint="Tap to close the details view" // Optional hint to explain the action
            />
            <SafeAreaView style={styles.playerContainer}>
              <View style={styles.imageCard}>
                <Image
                  source={{ uri: activeTrack?.artwork ?? imageUrl }}
                  style={styles.artwork}
                  accessibilityLabel={`Artwork for ${activeTrack?.title ?? 'this track'}`}  // Descriptive label for the image
                />
              </View>
              {isDarkMode ? (
                <Text
                  style={[styles.title, { color: playing ? Colors.white : Colors.white }]}
                  accessibilityLabel={`Track title: ${activeTrack?.title ?? 'Untitled'}`}
                >
                  {activeTrack?.title ?? ''}
                </Text>
              ) : (
                <Text
                  style={[styles.title, { color: playing ? Colors.activeTitle : Colors.title }]}
                  accessibilityLabel={`Track title: ${activeTrack?.title ?? 'Untitled'}`}
                >
                  {activeTrack?.title ?? ''}
                </Text>
              )}
              <Text style={styles.artist} accessibilityLabel={`Artist: ${activeTrack?.artist ?? 'Unknown Artist'}`}>
                {activeTrack?.artist ?? 'Unknown Artist'}
              </Text>
              <Slider
                style={styles.progress}
                value={currentPosition}
                minimumValue={0}
                maximumValue={currentDuration}
                onSlidingComplete={async (value) => {
                  await TrackPlayer.seekTo(value);
                }}
                accessibilityLabel="Playback progress slider"  // Descriptive label for the slider
                accessibilityHint="Swipe to change playback position" // Optional hint
                minimumTrackTintColor={isDarkMode ? Colors.white : Colors.activeTitle}
                maximumTrackTintColor={isDarkMode ? Colors.lightCardBg : Colors.gray}  // Custom color for the track that is not filled (e.g., light gray)
                thumbTintColor="blue"  // Custom color for the slider thumb (e.g., green)
              />

              <View style={styles.progressTime}>
                <Text style={styles.timeText} accessibilityLabel={`Current position: ${formatTime(currentPosition)}`}>{formatTime(currentPosition)}</Text>
                <Text style={styles.timeText} accessibilityLabel={`Remaining time: ${formatTime(remainingTime)}`}>{formatTime(remainingTime)}</Text>
              </View>

              <View style={[styles.controls, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                {/* Skip to Previous */}
                <TouchableOpacity
                  onPress={skipToPrevious}
                  style={[styles.touchable, { width: 60, height: 60 }]}  // Increased size for better touch target
                  accessibilityLabel="Skip to previous track"
                  accessibilityHint="Double tap to skip to the previous track"
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  {isDarkMode ? (
                    <Icon name="play-skip-back" size={40} color={presse ? '#B0B0B0' : '#FFFFFF'} />
                  ) : (
                    <Icon name="play-skip-back" size={40} color={presse ? '#B0B0B0' : '#333333'} />
                  )}
                </TouchableOpacity>

                {/* Play/Pause Button */}
                <TouchableOpacity
                  onPress={togglePlayback}
                  style={[styles.playButton, { width: 70, height: 90 }]}  // Larger size for play/pause
                  accessibilityLabel={playing ? 'Pause track' : 'Play track'}
                  accessibilityHint="Double tap to play or pause the track"
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  {isDarkMode ? (
                    <Icon
                      name={playing ? 'pause-circle' : 'play-circle'}
                      size={70}
                      color={presse ? '#B0B0B0' : '#FFFFFF'}
                    />
                  ) : (
                    <Icon
                      name={playing ? 'pause-circle' : 'play-circle'}
                      size={70}
                      color={presse ? '#B0B0B0' : '#333333'}
                    />
                  )}
                </TouchableOpacity>

                {/* Skip to Next */}
                <TouchableOpacity
                  onPress={skipToNext}
                  style={[styles.touchable, { width: 60, height: 60 }]}  // Increased size for better touch target
                  accessibilityLabel="Skip to next track"
                  accessibilityHint="Double tap to skip to the next track"
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  {isDarkMode ? (
                    <Icon name="play-skip-forward" size={40} color={presse ? '#B0B0B0' : '#FFFFFF'} />
                  ) : (
                    <Icon name="play-skip-forward" size={40} color={presse ? '#B0B0B0' : '#333333'} />
                  )}
                </TouchableOpacity>
              </View>

            </SafeAreaView>

          </Animated.View>
        )
          : (
            <Pressable
              style={({ pressed }) => [
                styles.container,
                pressed ? styles.pressed : null,
              ]}
              onPress={() => setIsOpen(!isOpen)}
              accessibilityLabel={`${activeTrack?.title ?? ''} by ${activeTrack?.artist ?? ''}`} // Unique label for screen readers
              accessibilityHint="Double tap to play or pause the track"
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: activeTrack?.artwork ?? imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.trackInfo}>
                <Text style={[styles.titleFloat, playing && { color: isDarkMode ? Colors.ElectricBlue : Colors.activeTitle }]}>
                  {activeTrack?.title ?? ''}
                </Text>
                <Text style={styles.artistFload}>
                  {activeTrack?.artist ?? ''}
                </Text>
              </View>
              <View style={styles.playIconContainer}>
                <View style={styles.iconButton}>
                  <TouchableOpacity onPress={() => playing ? TrackPlayer.pause() : TrackPlayer.play()}
                    accessibilityLabel={playing ? 'Pause the track' : 'Play the track'}>
                    <View style={styles.progressContainer}>
                      <CircularProgress
                        progress={progressCircle}
                        size={60} // Size of the circular progress
                      />
                      {
                        isDarkMode ? <Icon
                          name={playing ? 'pause-circle' : 'play-circle'}
                          size={50}
                          color={Colors.white}
                          style={styles.playIcon} // Ensure icon is centered
                        /> : <Icon
                          name={playing ? 'pause-circle' : 'play-circle'}
                          size={50}
                          color={Colors.icon}
                          style={styles.playIcon} // Ensure icon is centered
                        />
                      }
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={skipToNext} style={styles.iconButton}>

                  {
                    isDarkMode ? <Icon name="play-skip-forward" size={30} color={Colors.white} />
                      : <Icon name="play-skip-forward" size={30} color={Colors.icon} />
                  }
                </TouchableOpacity>
              </View>
            </Pressable>
          )
      }
    </View>
  );
};
export default FloadPlayer;

const lightStyles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    height: '100%',
  },
  playerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 10,
    flex: 1,
    shadowColor: '#000', // Subtle shadow to add depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  closeIconContainer: {
    color: Colors.white,
    backgroundColor: Colors.icon,
    borderRadius: 40,
  },
  imageCard: {
    width: isSmallScreen ? 250 : '100%',
    height: isSmallScreen ? 250 : 340,
    marginBottom: 20,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000', // Dark color for text
  },
  artist: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000', // Lighter color for subtitle text
    marginBottom: 16,
  },
  progress: {
    width: '100%',
    height: 4,
    borderRadius: 5,
  },
  progressTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  timeText: {
    color: '#000', // Dark text for time
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  playButton: {
    marginHorizontal: 20,
    height: 80,
    width: 80,
  },
  touchable: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: isSmallScreen ? 6 : 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#000000',
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleFloat: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  artistFload: {
    fontSize: 14,
    color: '#000',
  },
  playIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },

  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});
const darkStyles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: '#333', // Dark background for the player
    padding: 20,
    height: '100%',
  },
  playerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    shadowColor: '#000', // Dark shadow for a more dramatic effect
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  closeIconContainer: {
    color: Colors.white,
    backgroundColor: Colors.icon,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  imageCard: {
    width: isSmallScreen ? 250 : '100%',
    height: isSmallScreen ? 250 : 340,
    marginBottom: 20,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  artist: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 16,
  },
  progress: {
    width: '100%',
    height: 4,
    borderRadius: 5,
  },
  progressTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  timeText: {
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  touchable: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    marginHorizontal: 20,
    height: 80,
    width: 80,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: isSmallScreen ? 6 : 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.white,
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#fff',

  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleFloat: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  artistFload: {
    fontSize: 14,
    color: '#fff',
  },
  playIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});





