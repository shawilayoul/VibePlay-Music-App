import React, { useRef } from 'react';
import { FlatList, FlatListProps, Text, StyleSheet } from 'react-native';
import TrackListItems from './TrackListItems';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';
import { usePlayerContext } from '../store/trackPlayerContext';
import { View } from 'react-native';
import { Track } from '../store/trackPlayerContext';

export type TrackListType = Partial<FlatListProps<Track>> & {
    tracks: Track[],
}
type TrackHandler = (id: string, track: Track) => Promise<void>;

const TrackList = ({ tracks }: TrackListType) => {
    const queueOffset = useRef(0);  // Track queue offset
    const { activeQueueId, setActiveQueuedId } = usePlayerContext();
    const { playing } = useIsPlaying();

    const { isDarkMode } = usePlayerContext();
    const styles = isDarkMode ? darkStyles : lightStyles;
    // Handle track change logic
    const handleTrack: TrackHandler = async (id: string, selectedTrack: Track) => {
        const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url);
        if (trackIndex === -1) { return; }

        const isChangingQueue = id !== activeQueueId;

        if (isChangingQueue) {
            // Automatic queue change
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
            // Manual track skip
            const nextTrackIndex = trackIndex - queueOffset.current < 0
                ? tracks.length + trackIndex - queueOffset.current
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
        return <Text style={styles.notFountText}>No  tracks available</Text>; // Handle empty or undefined data
    }
    return (
        <FlatList ListEmptyComponent={
            <View style={styles.notFount}>
                <Text style={styles.notFountText}>No Songs Found</Text>
            </View>
        }
            showsVerticalScrollIndicator={false}
            data={tracks || []} // Fallback to an empty array
            keyExtractor={item => item?.id ? item?.id.toString() : Math.random().toString()}
            renderItem={({ item: track }) => (track ? <TrackListItems track={track} selectedTrack={handleTrack} /> : null)} />
    );
};

const lightStyles = StyleSheet.create({
    notFount: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFountText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',

    },
});
const darkStyles = StyleSheet.create({
    notFount: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFountText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TrackList;
