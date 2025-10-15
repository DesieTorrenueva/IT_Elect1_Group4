import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LeaderboardScreen({ navigation }) {
  const players = [
    { name: 'John', score: 1550 },
    { name: 'Jane', score: 1300 },
    { name: 'Mark', score: 980 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#cffafe' }]}>
      <Text style={[styles.title, { color: '#0891b2' }]}>Leaderboard</Text>
      {players.map((p, i) => (
        <Text key={i} style={styles.player}>{`${p.name}: ${p.score}`}</Text>
      ))}
      <Button title="Back to Menu" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  player: { fontSize: 18, marginBottom: 6 },
});
