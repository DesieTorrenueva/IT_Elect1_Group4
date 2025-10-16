import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const Setting = ({ isVisible, onClose, navigation }) => {
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isClickSoundOn, setIsClickSoundOn] = useState(true);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>x</Text>
          </TouchableOpacity>

          {/* Profile Picture */}
          <Image
            source={require('../assets/profile.jpg')} // adjust path if necessary
            style={styles.profilePicture}
          />

          {/* Title */}
          <Text style={styles.modalTitle}>Settings</Text>

          {/* Music and Click Sound Toggles */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, isMusicOn && styles.activeToggle]}
              onPress={() => setIsMusicOn(!isMusicOn)}
            >
              <MaterialCommunityIcons
                name={isMusicOn ? "music-note" : "music-note-off"}
                size={30}
                color={isMusicOn ? '#fff' : '#000'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, isClickSoundOn && styles.activeToggle]}
              onPress={() => setIsClickSoundOn(!isClickSoundOn)}
            >
              <MaterialCommunityIcons
                name={isClickSoundOn ? "volume-high" : "volume-off"}
                size={30}
                color={isClickSoundOn ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Manage Account */}
          <TouchableOpacity style={styles.manageAccountButton}>
            <FontAwesome name="user-circle" size={20} color="#fff" />
            <MaterialCommunityIcons name="cog" size={16} color="#fff" style={styles.cogIcon} />
            <Text style={styles.manageAccountText}>Manage Account</Text>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity onPress={() => console.log('Go to Privacy Policy')}>
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('Home')} // Now works
          >
            <MaterialCommunityIcons name="home" size={30} color="#9A562B" />
          </TouchableOpacity>

        </View>
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#C0392B',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#34495E', marginBottom: 20 },
  toggleRow: { 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    width: '100%',
  },
  toggleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A6E4F8',
    borderWidth: 4,
    borderColor: '#4CB7F5',
  },
  activeToggle: {
    backgroundColor: '#4CB7F5',
    borderColor: '#1976D2',
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
    marginLeft: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cogIcon: { position: 'absolute', left: 20, top: 8 },
  privacyPolicyText: { color: '#9A562B', fontSize: 16, textDecorationLine: 'underline', marginBottom: 30 },
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5CBA7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#D35400',
  },
});

export default Setting;
