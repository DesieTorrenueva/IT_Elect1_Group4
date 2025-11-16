import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
  ScrollView, Platform, KeyboardAvoidingView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageAccount = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const STORAGE_KEY = 'user_credentials';

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        setName(user.name || '');
        setEmail(user.email || '');
        setPassword(user.password || '');
        setImageUri(user.imageUri || null);
      }
    } catch (err) {
      console.error('Failed to load user', err);
    }
  };

  const saveUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, password, imageUri }));

      let users = [];
      const usersRaw = await AsyncStorage.getItem('users');
      if (usersRaw) users = Array.isArray(JSON.parse(usersRaw)) ? JSON.parse(usersRaw) : [];

      const idx = users.findIndex(u => u.email === email);
      let scoreRaw = await AsyncStorage.getItem('userScore');
      let score = scoreRaw ? parseInt(scoreRaw) : 0;

      if (!score && idx !== -1 && users[idx].score) score = users[idx].score;

      const userObj = { name, email, password, imageUri, score };

      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userObj };
      } else {
        users.push(userObj);
      }

      await AsyncStorage.setItem('users', JSON.stringify(users));
      Alert.alert('Success', 'Your credentials have been updated!');
    } catch (err) {
      console.error('Failed to save user', err);
    }
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
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
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

        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(prev => !prev)} 
            style={{ marginLeft: -40, padding: 10 }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveUser}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 80,
    backgroundColor: '#F7EBDC',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60,
    right: 20,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 50, 
    color: '#34495E' 
  },
  profilePicture: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#C0392B', 
    marginBottom: 20 
  },
  changePhotoText: { 
    color: '#9A562B', 
    textAlign: 'center', 
    marginBottom: 20, 
    textDecorationLine: 'underline' 
  },
  label: { 
    alignSelf: 'flex-start', 
    marginLeft: 10, 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 30, 
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
  saveButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 25, 
    marginTop: 20 
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
});

export default ManageAccount;