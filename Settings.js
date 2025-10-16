import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// --- Placeholder for the Main Game Screen (Blurred Background) ---
const BlurredBackground = () => (
  <View style={styles.backgroundContainer}>
    {/* This is a simple placeholder for the blurred background effect */}
    <Text style={styles.gameTitle}>GUESS THE WORD</Text>
    <View style={styles.blurredButton} />
    <View style={[styles.blurredButton, { backgroundColor: '#4CAF50' }]} />
    <View style={[styles.blurredButton, { backgroundColor: '#2196F3' }]} />
  </View>
);

// --- The Settings Modal Component ---
const SettingsModal = ({ isVisible, onClose }) => {
  const [isSoundOn, setIsSoundOn] = useState(true);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Semi-transparent overlay and blurred background */}
      <View style={styles.centeredView}>
        <View style={styles.overlay}>
          <BlurredBackground />
        </View>

        {/* The actual Settings Box */}
        <View style={styles.modalView}>
          
          {/* Close Button (X) */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>x</Text>
          </TouchableOpacity>

          {/* Settings Header */}
          <Icon name="comment-question" size={24} color="#C0392B" style={styles.headerIcon} />
          <Text style={styles.modalTitle}>Settings</Text>

          {/* Sound/Music Toggles */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, isSoundOn && styles.activeToggle]}
              onPress={() => setIsSoundOn(true)}
            >
              <Icon 
                name="volume-high" 
                size={30} 
                color={isSoundOn ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isSoundOn && styles.activeToggle]}
              onPress={() => setIsSoundOn(false)}
            >
              <Icon 
                name="volume-off" 
                size={30} 
                color={!isSoundOn ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          </View>

          {/* Manage Account Button */}
          <TouchableOpacity style={styles.manageAccountButton}>
            <FontAwesomeIcon name="user-circle" size={20} color="#fff" />
            <Icon name="cog" size={16} color="#fff" style={styles.cogIcon} />
            <Text style={styles.manageAccountText}>Manage Account</Text>
          </TouchableOpacity>

          {/* Privacy Policy Link */}
          <TouchableOpacity onPress={() => console.log('Go to Privacy Policy')}>
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity style={styles.homeButton} onPress={onClose}>
            <Icon name="home" size={30} color="#9A562B" />
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

// --- Stylesheet for the Visuals ---
const styles = StyleSheet.create({
  // Background Styling for the Game Screen Placeholder
  backgroundContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#87CEEB', // Sky Blue base
    opacity: 0.15, // Simulate blur by reducing contrast
  },
  gameTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  blurredButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#FF9800',
    borderRadius: 30,
    marginTop: 20,
    opacity: 0.5,
  },
  // Modal Container Styling
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Note: To achieve a true *visual blur* like the image, you'd need
    // to use a dedicated blur library or an actual blurred image background.
  },
  modalView: {
    width: '80%',
    backgroundColor: '#F7EBDC', // Light cream color
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // Custom border to match the image's "bubbly" look
    borderWidth: 6,
    borderColor: '#E6A778', // Light orange/brown border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  // Header and Close Button
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E74C3C', // Reddish-orange
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerIcon: {
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 20,
  },
  // Sound Toggles
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  toggleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#A6E4F8', // Lighter blue
    // Visual effect for a bubbly button
    borderWidth: 4,
    borderColor: '#4CB7F5', // Darker blue border
  },
  activeToggle: {
    backgroundColor: '#4CB7F5', // Darker blue when active
    borderColor: '#1976D2', // Even darker blue border for active state
  },
  // Manage Account Button
  manageAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Green
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 20,
    // Bubbly effect
    borderWidth: 4,
    borderColor: '#388E3C', // Darker green border
  },
  manageAccountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cogIcon: {
    position: 'absolute',
    left: 20,
    top: 8,
  },
  // Privacy Policy
  privacyPolicyText: {
    color: '#9A562B', // Brown/Dark Orange
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 30,
  },
  // Home Button
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5CBA7', // Light orange
    justifyContent: 'center',
    alignItems: 'center',
    // Bubbly effect
    borderWidth: 4,
    borderColor: '#D35400', // Darker orange border
  },
});

// --- How to use it in your main App component ---
const Settings = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <BlurredBackground />
      <TouchableOpacity 
        style={{ position: 'absolute', top: 50, right: 20, padding: 10 }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: '#fff' }}>Open Settings</Text>
      </TouchableOpacity>
      
      <SettingsModal 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

export default Settings; 
