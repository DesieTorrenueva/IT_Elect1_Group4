import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();
const STORAGE_KEY = 'user_settings';

export const SettingsProvider = ({ children }) => {
  const [musicPlaying, setMusicPlayingState] = useState(true);
  const [vibrationEnabled, setVibrationEnabledState] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('Home');
  const soundRef = useRef(null);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          if (typeof settings.musicPlaying === 'boolean') setMusicPlayingState(settings.musicPlaying);
          if (typeof settings.vibrationEnabled === 'boolean') setVibrationEnabledState(settings.vibrationEnabled);
        }
      } catch {}
    };
    loadSettings();
  }, []);

  // Save settings to AsyncStorage when changed
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ musicPlaying, vibrationEnabled }));
      } catch {}
    };
    saveSettings();
  }, [musicPlaying, vibrationEnabled]);

  // Only one music track plays at a time
  useEffect(() => {
    let isMounted = true;
    const menuScreens = [
      'Home', 'SignIn', 'SignUp', 'Help', 'GameDashboard', 'ManageAccount', 'PrivacyPolicy', 'AdminDashboard', 'Addwordtolevel', 'AdminLeaderboard', 'Leaderboard'
    ];
    const gameScreens = ['Easy', 'Intermediate', 'Expert', 'ForGuest'];
    let musicFile, musicType;
    // Force music ON when returning to HomeScreen
    if (currentScreen === 'Home' && !musicPlaying) {
      setMusicPlayingState(true);
    }
    if (menuScreens.includes(currentScreen)) {
      musicFile = require('../assets/menu.mp3');
      musicType = 'menu';
    } else if (gameScreens.includes(currentScreen)) {
      musicFile = require('../assets/game.mp3');
      musicType = 'game';
    } else {
      musicFile = null;
      musicType = null;
    }
    const playMusic = async () => {
      if (musicFile) {
        if (!soundRef.current || soundRef.current._type !== musicType) {
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
          const { sound } = await Audio.Sound.createAsync(musicFile, { isLooping: true });
          soundRef.current = sound;
          soundRef.current._type = musicType;
          if (musicPlaying && isMounted) await sound.playAsync();
        } else {
          const status = await soundRef.current.getStatusAsync();
          if (musicPlaying && isMounted) {
            if (!status.isPlaying) await soundRef.current.playAsync();
          } else {
            await soundRef.current.pauseAsync();
          }
        }
      } else {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      }
    };
    playMusic();
    return () => {
      isMounted = false;
      // Do not unload sound here to prevent restart on modal close or navigation
    };
  }, [currentScreen, musicPlaying]);

  // Wrappers to update state
  const setMusicPlaying = (val) => {
    setMusicPlayingState(val);
  };
  const setVibrationEnabled = (val) => {
    setVibrationEnabledState(val);
  };

  return (
    <SettingsContext.Provider value={{
      musicPlaying,
      setMusicPlaying,
      vibrationEnabled,
      setVibrationEnabled,
      currentScreen,
      setCurrentScreen
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
