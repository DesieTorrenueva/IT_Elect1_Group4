// user/Leaderboard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const sampleData = [
  { id: "1", name: "Alex", score: 150 },
  { id: "2", name: "Jamie", score: 120 },
  { id: "3", name: "Taylor", score: 110 },
  { id: "4", name: "Riley", score: 100 },
  { id: "5", name: "Jordan", score: 90 },
];

export default function Leaderboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("GameDashboard")}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>🏆 Leaderboard</Text>

      <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b4c85",
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f5d9a4",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eadcdcff",
    width: "85%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  rank: { fontSize: 20, fontWeight: "700", color: "#1d3557" },
  name: { fontSize: 18, color: "#1d3557", flex: 1, textAlign: "center" },
  score: { fontSize: 20, fontWeight: "700", color: "#1d3557" },
});
