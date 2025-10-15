import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IntermediateScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: '#dcfce7' }]}>
      <Text style={[styles.title, { color: '#16a34a' }]}>Intermediate Level</Text>
      <Text>You're getting better!</Text>
      <Button title="Back to Menu" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
});
