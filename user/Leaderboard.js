import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Leaderboard({ navigation }) {
  const [user, setUser] = useState({ name: "", score: 0 });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const name = await AsyncStorage.getItem("username");
        const score = await AsyncStorage.getItem("userScore");
        setUser({
          name: name || "Player",
          score: score ? parseInt(score) : 0,
        });
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("GameDashboard")}
      >
        <Ionicons name="arrow-back" size={28} color="#FFD700" />
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.heading}>Leaderboard</Text>

      {/* Trophies */}
      <View style={styles.trophies}>
        <FontAwesome5 name="trophy" size={50} color="#FFD700" style={styles.trophyIcon} />
        <FontAwesome5 name="trophy" size={50} color="#C0C0C0" style={styles.trophyIcon} />
        <FontAwesome5 name="trophy" size={50} color="#CD7F32" style={styles.trophyIcon} />
      </View>

      {/* Top User */}
      <View style={styles.userRow}>
        <Text style={styles.userRank}>1</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userScore}>{user.score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c5364", // deep gradient-like blue
    alignItems: "center",
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700", // golden heading
    marginBottom: 25,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  trophies: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginBottom: 40,
  },
  trophyIcon: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5d9a4", // soft cream color
    padding: 18,
    width: "85%",
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  userRank: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34495E",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#34495E",
  },
  userScore: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34495E",
  },
});
