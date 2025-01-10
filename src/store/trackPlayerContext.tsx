import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react'; // Add this if your setup expects it

export interface Track {
    track: any;
    some(arg0: (fav: any) => boolean): unknown;
    id: string;
    title: string;
    artist: string;
    artwork: string;
    url: string;
    createdAt: string; // Ensure this matches the type that TypeScript expects
    duration: number;
}
type PlayerProiderType = {
    checkToken: () => void
    isDarkMode: boolean;
    setIsDarkMode: (m: boolean) => void;

    activeQueueId: string | null;
    setActiveQueuedId: React.Dispatch<React.SetStateAction<string>>;
    favorites: Track[];
    setFavorites: React.Dispatch<React.SetStateAction<Track[]>>;
    userToken: string | null;  // Allow null in the type
    setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
    userEmail: string | null;
    setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
    userId: string | null;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};
const playerContext = createContext<PlayerProiderType>({
    setActiveQueuedId: () => { },
    setFavorites: () => { },
    favorites: [],
    setUserToken: () => { },
    userToken: '',
    setUserName: () => { },
    userName: '',
    checkToken: () => { },
    isDarkMode: false,
    setIsDarkMode: () => { },
    userEmail: '',
    activeQueueId: '',
    setUserEmail: function (): void {
        throw new Error('Function not implemented.');
    },
    userId: '',
    setUserId: () => { },
});

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [activeQueueId, setActiveQueuedId] = useState('');
    const [totalTracks, setTotalTracks] = useState(0);
    const [favorites, setFavorites] = useState<Track[]>([]);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const [userToken, setUserToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const usernameToken = await AsyncStorage.getItem('username');
        const Email = await AsyncStorage.getItem('email');
        const userIdToken = await AsyncStorage.getItem('userId');

        if (token || userToken || userIdToken) {
            setUserToken(token);
            setUserName(usernameToken);
            setUserEmail(Email);
            setUserId(userIdToken);
        } else {
            setUserToken('');
            setUserName('');
            setUserEmail('');
            setUserId('');
        }
    };

    useEffect(() => {
        checkToken(); // Check the token when the provider is mounted
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const value = {
        activeQueueId,
        setActiveQueuedId,
        favorites,
        setFavorites,
        totalTracks,
        setTotalTracks,
        userToken,
        setUserToken,
        checkToken,
        userName,
        setUserName,
        setIsDarkMode,
        isDarkMode,
        userEmail,
        setUserEmail,
        userId,
        setUserId,
    };
    return (
        <playerContext.Provider value={value}>
            {children}
        </playerContext.Provider>
    );

}


export const usePlayerContext = () => useContext(playerContext);
