import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const STORAGE_KEY = 'user_credentials';

const ManageAccount = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
          setEmail(userData.email || '');
          setImageUri(userData.imageUri || null);
        }
      }
    } catch (err) {
      console.error('Failed to load user', err);
      Alert.alert('Error', 'Failed to load user data.');
    }
    setLoading(false);
  };

  const saveUser = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }

    // Strict email validation
    const strictEmailRegex = /^[\w-.]+@([\w-]+\.)+(com|net|org|edu)\b$/i;
    if (!strictEmailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address (e.g., user@example.com).');
      return;
    }

    setSaving(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert('Error', 'User not found.');
        setSaving(false);
        return;
      }

      // Update Firestore user data
      await updateDoc(doc(db, "users", userId), {
        username: username.trim(),
        imageUri: imageUri,
      });

      // Update user credentials in AsyncStorage (important for profile photo sync)
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const userData = JSON.parse(storedData);
        userData.username = username.trim();
        userData.imageUri = imageUri;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      }

      // Also update username separately
      await AsyncStorage.setItem("username", username.trim());

      // Update password if provided
      if (newPassword.trim()) {
        if (!currentPassword.trim()) {
          Alert.alert('Error', 'Please enter your current password to change it.');
          setSaving(false);
          return;
        }

        // Check new password length (minimum 6 characters)
        if (newPassword.length < 6) {
          Alert.alert('Weak Password', 'New password must be at least 6 characters long.');
          setSaving(false);
          return;
        }

        try {
          const user = auth.currentUser;
          if (!user) {
            Alert.alert('Error', 'User not authenticated.');
            setSaving(false);
            return;
          }

          // Reauthenticate with current credentials
          const credential = EmailAuthProvider.credential(email, currentPassword);
          await reauthenticateWithCredential(user, credential);

          // Update password
          await updatePassword(user, newPassword);
          
          Alert.alert('Success', 'Your account and password have been updated!');
          setCurrentPassword('');
          setNewPassword('');
        } catch (error) {
          console.error('Password update error:', error);
          if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            Alert.alert('Error', 'Current password is incorrect.');
          } else if (error.code === 'auth/weak-password') {
            Alert.alert('Error', 'New password should be at least 6 characters.');
          } else if (error.code === 'auth/requires-recent-login') {
            Alert.alert('Error', 'For security reasons, please log out and log back in before changing your password.');
          } else {
            Alert.alert('Error', `Failed to update password: ${error.message}`);
          }
          setSaving(false);
          return;
        }
      } else {
        Alert.alert('Success', 'Your account has been updated!');
      }
    } catch (err) {
      console.error('Failed to save user', err);
      Alert.alert('Error', 'Failed to update account.');
    }
    setSaving(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
    >
      <ScrollView contentContainerStyle={styles.contAiner}>
        
        {/* Close Button */}
        <TouchableOpacity style={styles.cloSeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Manage Account</Text>

        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
          <Image 
            source={imageUri ? { uri: imageUri } : require('../assets/profile.jpg')}
            style={styles.profilePicture}
          />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder="Enter your username"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: '#f0f0f0' }]} 
          value={email} 
          editable={false}
          placeholder="Your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.helperText}>Email cannot be changed</Text>

        <Text style={styles.label}>Current Password (Required to change password)</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry={!showCurrentPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowCurrentPassword(prev => !prev)} 
            style={styles.eyeButton}
          >
            <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password (Leave blank to keep current, min. 6 characters)</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password (min. 6 characters)"
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowNewPassword(prev => !prev)} 
            style={styles.eyeButton}
          >
            <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && { opacity: 0.7 }]} 
          onPress={saveUser}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contAiner: {
    flexGrow: 1,
    padding: 25,
    alignItems: 'center',
    backgroundColor: '#F7EBDC',
  },
  cloSeButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#726c6bff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    top: 30,
    marginBottom: 50, 
    color: '#1c76d0ff' 
  },
  profilePicture: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 20 
  },
  changePhotoText: { 
    color: '#d77e46ff', 
    textAlign: 'center', 
    marginBottom: 20, 
    textDecorationLine: 'underline' 
  },
  label: { 
    alignSelf: 'flex-start', 
    marginLeft: 10, 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 20, 
    color: '#34495E' 
  },
  input: { 
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 10, 
    backgroundColor: '#fff' 
  },
  helperText: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyeButton: {
    marginLeft: -40,
    padding: 10,
    zIndex: 1,
  },
  saveButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 25, 
    marginBottom: 20,
    marginTop: 10 
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
});

export default ManageAccount;