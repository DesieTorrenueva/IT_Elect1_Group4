import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'user_credentials';

const Setting = ({ isVisible, onClose, navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const user = JSON.parse(stored);
          setImageUri(user.imageUri || null);
        }
      } catch (err) {
        setImageUri(null);
      }
    };
    if (isVisible) loadProfile();
  }, [isVisible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          {/* Close Button as Icon */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Profile Picture */}
          <Image
            source={imageUri ? { uri: imageUri } : require('../assets/profile.jpg')}
            style={styles.profilePicture}
          />

          {/* Title */}
          <Text style={styles.modalTitle}>Settings</Text>

          {/* Manage Account */}
          <TouchableOpacity
            style={styles.manageAccountButton}
            onPress={() => navigation.navigate('ManageAccount')}
          >
            <FontAwesome name="user-circle" size={20} color="#fff" />
            <MaterialCommunityIcons
              name="cog"
              size={16}
              color="#fff"
              style={styles.cogIcon}
            />
            <Text style={styles.manageAccountText}>Manage Account</Text>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('Home')}
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
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#34495E', marginBottom: 20 },
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
