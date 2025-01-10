import React, { useRef} from 'react';
import { FlatList, FlatListProps, Text, StyleSheet } from 'react-native';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import { Track, usePlayerContext } from '../store/trackPlayerContext';
import { View } from 'react-native';
import FavoritesTrackListItems from './FavoritesTrackListItems';

export type TrackListType = Partial<FlatListProps<Track>> & {
    tracks: Track[],
}

const FavoritesTrackList = ({ tracks }: TrackListType) => {
    const queueOffset = useRef(0);
    const { activeQueueId, setActiveQueuedId } = usePlayerContext();
    const { playing } = useIsPlaying();


    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;

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

    if (!tracks || !Array.isArray(tracks)) {
        return <Text style={styles.notFountText}>No favorite tracks available</Text>;
    }

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={tracks}
            keyExtractor={item => item?.id ? item?.id.toString() : Math.random().toString()}
            renderItem={({ item }) => (
                item && item?.id ? (
                    <FavoritesTrackListItems
                        track={item}
                        selectedTrack={handleTrack}
                    />
                ) : null
            )}
            ListEmptyComponent={
                <View style={styles.notFount}>
                    <Text style={styles.notFountText}>Aucune chanson trouvée</Text>
                </View>
            }
        />
    );
};

const lightStyles = StyleSheet.create({
    notFount: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginHorizontal: 12,
    },
    notFountText: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
    },
});

const darkStyles = StyleSheet.create({
    notFount: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginHorizontal: 12,
    },
    notFountText: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
    },
});
export default FavoritesTrackList;

