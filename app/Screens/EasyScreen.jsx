import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EasyScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#ffedd5' }]}>
      <Text style={[styles.title, { color: '#ea580c' }]}>Easy Level</Text>
      <Text>Welcome to the Easy Category!</Text>
      <Button title="Back to Menu" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
});
