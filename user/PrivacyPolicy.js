import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';

const PrivacyPolicy = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.content}>
        Welcome! Your privacy is very important to us. Please read the following rules and assurances carefully.
        {'\n\n'}
        1. We collect only the minimal information required to provide the app's functionality.
        {'\n\n'}
        2. Your credentials (username, email, password) are securely stored locally and are never shared with third parties.
        {'\n\n'}
        3. You have full control over your data and can update or delete your information anytime through the Manage Account section.
        {'\n\n'}
        4. We implement best practices to ensure the security of your data and protect it from unauthorized access.
        {'\n\n'}
        By using this app, you agree to follow these rules and trust that we maintain your information securely.
        {'\n\n'}
        Thank you for trusting us with your data!
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Got it</Text>
      </TouchableOpacity>
    </ScrollView>
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
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 50, color: '#34495E' },
  content: { fontSize: 16, color: '#555', lineHeight: 24 },
  button: { marginTop: 50, backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default PrivacyPolicy;
