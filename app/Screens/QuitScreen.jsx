import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function QuitScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#fee2e2' }]}>
      <Text style={[styles.title, { color: '#dc2626' }]}>Goodbye!</Text>
      <Text>Thanks for playing!</Text>
      <Button title="Return to Menu" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
});
