/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/**/
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import PlayerProvider from './src/store/trackPlayerContext';
import TrackPlayer, { Capability, RatingType, RepeatMode } from 'react-native-track-player';
import ButtomTabNavigation from './src/navigations/ButtomTabNavigation';
//import AdsMob from './src/components/AdsMob';


enableScreens();

const App = () => {

  React.useEffect(() => {
    const setupPlayer = async () => {
      try {
        // Setup the player
        await TrackPlayer.setupPlayer({
          maxCacheSize: 1024 * 10,
        });
        // Update options for the player (e.g., notifications, capabilities)
        await TrackPlayer.updateOptions({
          ratingType: RatingType.Heart,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
        });

        //await TrackPlayer.setVolume(0.5);
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };

    setupPlayer();
  }, []);

  return (
    <NavigationContainer>
      <PlayerProvider>
        <ButtomTabNavigation />
      </PlayerProvider >
    </NavigationContainer >
  );
};

export default App;

