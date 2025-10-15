import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Ionicons name="person-circle-outline" size={30} color="#000" />
          <Text style={styles.welcomeText}>Welcome, John!</Text>
        </View>
        <Text style={styles.scoreText}>Score: 1550 Points</Text>
      </View>

      {/* Logo and Title */}
      <View style={styles.logoSection}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>GUESS THE WORD</Text>
      </View>

      {/* Category Buttons */}
      <Text style={styles.categoryLabel}>Category Selection</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#FFA726" }]}>
        <Ionicons name="musical-notes-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>EASY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#66BB6A" }]}>
        <Ionicons name="trophy-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>INTERMEDIATE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#42A5F5" }]}>
        <Ionicons name="flame-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>EXPERT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#1E88E5" }]}>
        <Ionicons name="podium-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>LEADERBOARD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#EF5350" }]}>
        <Ionicons name="exit-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>QUIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9EC8E0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 5,
  },
  scoreText: {
    fontSize: 14,
    color: "#000",
  },
  logoSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  categoryLabel: {
    fontSize: 16,
    color: "#000",
    marginVertical: 10,
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 6,
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
