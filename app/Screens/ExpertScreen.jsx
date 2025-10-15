import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ExpertScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#dbeafe' }]}>
      <Text style={[styles.title, { color: '#2563eb' }]}>Expert Level</Text>
      <Text>Challenge yourself!</Text>
      <Button title="Back to Menu" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
});
