import React, { useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';
import { View, TouchableOpacity, StyleSheet, Modal, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const STORAGE_KEY = 'user_credentials';

const Setting = ({ isVisible, onClose, navigation, currentScreen }) => {
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');
  const [sound, setSound] = useState(null);
  const { musicPlaying, setMusicPlaying, vibrationEnabled, setVibrationEnabled } = useSettings();
  const menuScreens = [
    'Home', 'SignIn', 'SignUp', 'Help', 'GameDashboard', 'AdminDashboard', 'Addwordtolevel', 'AdminLeaderboard', 'ManageAccount', 'PrivacyPolicy', 'Leaderboard'
  ];
  const gameScreens = ['Easy', 'Intermediate', 'ForGuest', 'Expert'];

  // Load profile picture from Firestore (most up-to-date source)
  const loadProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // Load from Firestore first (most reliable)
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setImageUri(userData.imageUri || null);
          setUsername(userData.username || '');
          
          // Also update AsyncStorage to keep it in sync
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const storedData = JSON.parse(stored);
            storedData.imageUri = userData.imageUri;
            storedData.username = userData.username;
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setImageUri(null);
    }
  };

  // Load when modal opens
  useEffect(() => {
    if (isVisible) {
      loadProfile();
    }
  }, [isVisible]);

  // Reload when screen comes into focus (after returning from ManageAccount)
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  // Handle music for dashboard vs gameplay
  useEffect(() => {
    let isMounted = true;
    const playMusic = async () => {
      let musicFile;
      if (menuScreens.includes(currentScreen)) {
        musicFile = require('../assets/menu.mp3');
      } else if (gameScreens.includes(currentScreen)) {
        musicFile = require('../assets/game.mp3');
      }

      if (musicFile) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
        const { sound: newSound } = await Audio.Sound.createAsync(musicFile, { isLooping: true });
        if (musicPlaying && isMounted) await newSound.playAsync();
        setSound(newSound);
      } else {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
      }
    };

    playMusic();

    return () => {
      isMounted = false;
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
        setSound(null);
      }
    };
  }, [currentScreen, musicPlaying]);

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const toggleVibration = () => {
    setVibrationEnabled(!vibrationEnabled);
    if (!vibrationEnabled) Haptics.selectionAsync();
  };

  const handleButtonPress = (screen) => {
    if (vibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(screen);
    onClose();
  };

  const handleManageAccount = () => {
    if (vibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    // Small delay to ensure modal closes smoothly before navigation
    setTimeout(() => {
      navigation.navigate('ManageAccount');
    }, 100);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.modalView}>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Profile Picture */}
            <Image 
              key={imageUri} // Force re-render when imageUri changes
              source={imageUri ? { uri: imageUri } : require('../assets/profile.jpg')} 
              style={styles.profilePicture} 
            />
            
            {/* Username Display */}
            {username ? (
              <Text style={styles.usernameText}>{username}</Text>
            ) : null}

            {/* Music & Vibration Icon Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleMusic}>
                <MaterialCommunityIcons
                  name={musicPlaying ? "music" : "music-off"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={toggleVibration}>
                <MaterialCommunityIcons 
                  name={vibrationEnabled ? "vibrate" : "vibrate-off"} 
                  size={28} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            {/* Manage Account */}
            <TouchableOpacity style={styles.manageAccountButton} onPress={handleManageAccount}>
              <FontAwesome name="user-circle" size={20} color="#fff" />
              <MaterialCommunityIcons name="cog" size={16} color="#fff" style={styles.cogIcon} />
              <Text style={styles.manageAccountText}>Manage Account</Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity onPress={() => {
              if (vibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate('PrivacyPolicy');
              onClose();
            }}>
              <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            </TouchableOpacity>

            {/* Home Button */}
            <TouchableOpacity style={styles.homeButton} onPress={() => handleButtonPress('Home')}>
              <MaterialCommunityIcons name="home" size={30} color="#fff" />
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%', 
    backgroundColor: '#F7EBDC', 
    borderRadius: 20, 
    padding: 20,
    alignItems: 'center', 
    borderWidth: 6, 
    borderColor: '#E6A778',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3,
    shadowRadius: 5, 
    elevation: 8,
  },
  profilePicture: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginBottom: 10, 
    borderWidth: 2, 
    borderColor: '#C0392B', 
    marginTop: -50
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34495E',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute', 
    top: -15, 
    right: -15, 
    width: 35, 
    height: 35,
    borderRadius: 18, 
    backgroundColor: '#E74C3C', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#fff', 
    zIndex: 1,
  },
  buttonRow: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  iconButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  manageAccountButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#4CAF50',
    borderRadius: 30, 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    marginBottom: 20,
    borderWidth: 4, 
    borderColor: '#388E3C',
  },
  manageAccountText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  cogIcon: { 
    position: 'absolute', 
    left: 20, 
    top: 8 
  },
  privacyPolicyText: { 
    color: '#9A562B', 
    fontSize: 16, 
    textDecorationLine: 'underline', 
    marginBottom: 30 
  },
  homeButton: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#E67E22', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default Setting;