import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Leaderboard({ navigation }) {
  const [users, setUsers] = useState([]);

  // Save latest score to users list
  const syncUserScore = async () => {
    try {
      const credRaw = await AsyncStorage.getItem("user_credentials");
      if (!credRaw) return;

      const currentUser = JSON.parse(credRaw);

      const scoreRaw = await AsyncStorage.getItem("userScore");
      const updatedScore = scoreRaw ? parseInt(scoreRaw) : 0;

      const usersRaw = await AsyncStorage.getItem("users");
      let usersArr = usersRaw ? JSON.parse(usersRaw) : [];

      const index = usersArr.findIndex(u => u.email === currentUser.email);

      if (index !== -1) {
        usersArr[index].score = updatedScore;
      } else {
        usersArr.push({ ...currentUser, score: updatedScore });
      }

      await AsyncStorage.setItem("users", JSON.stringify(usersArr));
    } catch (err) {
      console.log("Error syncing user score:", err);
    }
  };

  // Load leaderboard data
  const loadUsers = async () => {
    try {
      const usersRaw = await AsyncStorage.getItem("users");
      let usersArr = usersRaw ? JSON.parse(usersRaw) : [];

      usersArr = usersArr.filter(u => u.name && u.email);

      usersArr.sort((a, b) => b.score - a.score);
      setUsers(usersArr);
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers([]);
    }
  };

  // Reload leaderboard every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      syncUserScore().then(loadUsers);
    }, [])
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("GameDashboard")}
      >
        <Ionicons name="arrow-back" size={28} color="#a0b597ff" />
      </TouchableOpacity>

      <Text style={styles.heading}>Leaderboard</Text>

      <View style={styles.trophies}>
        <FontAwesome5 name="trophy" size={50} color="#FFD700" style={styles.trophyIcon} />
        <FontAwesome5 name="trophy" size={50} color="#C0C0C0" style={styles.trophyIcon} />
        <FontAwesome5 name="trophy" size={50} color="#CD7F32" style={styles.trophyIcon} />
      </View>

      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }}>
        {users.length === 0 ? (
          <Text style={{ color: "#fff", marginTop: 20 }}>No users found.</Text>
        ) : (
          users.map((u, idx) => (
            <View style={styles.userRow} key={u.email + idx}>
              <Text style={styles.userRank}>{idx + 1}</Text>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userScore}>{u.score}</Text>
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c5364",
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
    color: "#c6cd46ff",
    marginBottom: 25,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  trophies: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#f5d9a4",
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
